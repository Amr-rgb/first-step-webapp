"use client";

import { useState, useEffect, useCallback } from "react";
import { notificationService } from "@/services/dashboardApi";
import { pusherService } from "@/services/pusherService";
import { UniversalNotification, NotificationsResponse } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { showNotificationFromData } from "@/lib/notification-toast";

export function useNotifications() {
  const [notifications, setNotifications] = useState<UniversalNotification[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

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
      console.log("🎯 NOTIFICATION HANDLER CALLED!");
      console.log("📨 New notification received:", notification);
      console.log("📊 Current notifications count:", notifications.length);
      console.log("📊 Current unread count:", unreadCount);

      setNotifications((prev) => {
        console.log(
          "📝 Updating notifications array, previous length:",
          prev.length
        );
        const newArray = [notification, ...prev];
        console.log("📝 New notifications array length:", newArray.length);
        return newArray;
      });

      setUnreadCount((prev) => {
        console.log("📝 Updating unread count, previous:", prev);
        const newCount = prev + 1;
        console.log("📝 New unread count:", newCount);
        return newCount;
      });

      // Show custom toast notification
      console.log("🍞 Showing toast notification...");
      showNotificationFromData(notification);

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        const notificationData = notification as any;
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

        console.log("🔔 Showing browser notification:", { title, body });
        new Notification(title, {
          body: body,
          icon: "/web-app-manifest-192x192.png",
        });
      } else {
        console.log(
          "🔔 Browser notification permission not granted:",
          Notification.permission
        );
      }
    },
    []
  );

  // Initialize Pusher subscription
  useEffect(() => {
    if (!user?.id) {
      console.log("❌ No user ID, skipping Pusher subscription");
      return;
    }

    console.log("🚀 Initializing Pusher subscription for user:", user.id);

    // Subscribe to universal notifications
    const channel = pusherService.subscribeToUniversalNotifications({
      onNewNotification: handleNewNotification,
      onNotificationUpdated: (data) => {
        console.log("📋 Notification updated:", data);
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

    console.log("✅ Pusher subscription initialized, channel:", channel);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up Pusher subscription");
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
