"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { notificationService } from "@/services/dashboardApi";
import { pusherService } from "@/services/pusherService";
import { UniversalNotification, NotificationsResponse } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { showNotificationFromData } from "@/lib/notification-toast";

export function useNotifications() {
  const [notifications, setNotifications] = useState<UniversalNotification[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedNotificationIds, setProcessedNotificationIds] = useState<
    Set<string>
  >(new Set());
  const isSubscribedRef = useRef(false);

  const { user } = useAuthStore();
  const { preferences } = useUserPreferencesStore();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: NotificationsResponse =
        await notificationService.getNotifications();

      console.log("📥 Fetched notifications:", response);
      const notificationArray = Array.isArray(response) ? response : [];
      setNotifications(notificationArray);

      // Calculate unread count from the notifications
      const unreadCount = notificationArray.filter((n) => !n.read_at).length;
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.readNotification(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.readAllNotifications();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read_at: notification.read_at || new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  }, []);

  // Handle new notification from Pusher
  const handleNewNotification = useCallback(
    (notification: UniversalNotification) => {
      // Check if we've already processed this notification
      if (processedNotificationIds.has(notification.id)) {
        return;
      }

      const notificationData = notification as any;

      // Filter out notifications that the current user shouldn't see
      // 1. Don't show notifications intended for other users
      if (
        notificationData.notifiable_id &&
        user?.id &&
        notificationData.notifiable_id !== user.id
      ) {
        return;
      }

      // 2. Filter out notifications for enrollment creators (parents shouldn't see their own enrollment notifications)
      if (
        notificationData.notification_type === "enrollment" &&
        notificationData.enrollment
      ) {
        // If the current user is the one who created the enrollment, skip this notification
        if (
          user?.role === "parent" &&
          notificationData.enrollment.user_id === user.id
        ) {
          return;
        }
      }

      // 3. Additional filtering based on user role and notification context
      // Centers shouldn't see notifications they sent to parents
      if (
        user?.role === "center" &&
        notificationData.notification_type === "info"
      ) {
        // Skip if this is a notification sent by this center to a parent
        // You might need to add more specific logic here based on your notification structure
      }

      // Add to processed set
      setProcessedNotificationIds(
        (prev) => new Set([...prev, notification.id])
      );

      setNotifications((prev) => {
        // Double-check for duplicates in the array
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          return prev;
        }
        return [
          { ...notification, created_at: new Date().toISOString() },
          ...prev,
        ];
      });

      setUnreadCount((prev) => prev + 1);

      // Show custom toast notification only if enabled in user preferences
      // This respects the toggle setting in the dashboard header
      if (preferences.notificationToastsEnabled) {
        showNotificationFromData(notification);
      }

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        let title = "Notification";
        let body = "You have a new notification";

        // Handle new Universal Notification format
        if (notificationData.title && notificationData.description) {
          title = notificationData.title;
          body = notificationData.description;
        }
        // Handle legacy formats
        else if (
          notification.type === "App\\Notifications\\DailyReportNotification"
        ) {
          title = "Daily Report";
          body = notificationData.message || "You have a new daily report";
        } else if (
          notification.type === "App\\Notifications\\AdminNotification"
        ) {
          title = notificationData.title || "Notification";
          body = notificationData.description || "You have a new notification";
        }

        new Notification(title, {
          body: body,
          icon: "/web-app-manifest-192x192.png",
        });
      }
    },
    [processedNotificationIds, notifications.length, unreadCount]
  );

  // Initialize Pusher subscription
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    if (isSubscribedRef.current) {
      return;
    }

    isSubscribedRef.current = true;

    // Subscribe to universal notifications
    const channel = pusherService.subscribeToUniversalNotifications({
      onNewNotification: handleNewNotification,
      onNotificationUpdated: (data) => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === data.notification_id
              ? { ...notification, read_at: data.read_at }
              : notification
          )
        );

        if (data.read_at) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      },
    });

    // Cleanup function
    return () => {
      isSubscribedRef.current = false;
      pusherService.unsubscribeFromUniversalNotifications();
    };
  }, [user?.id, handleNewNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    // Expose for testing
    handleNewNotification,
  };
}
