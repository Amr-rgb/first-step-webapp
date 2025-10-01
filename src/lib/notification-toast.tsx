import React from "react";
import { toast } from "sonner";
import { NotificationToast } from "@/components/notifications/NotificationToast";
import { EnrollmentNotificationToast } from "@/components/notifications/EnrollmentNotificationToast";
import { UniversalNotification } from "@/types";
import { showToast } from "@/lib/toast";

type NotificationType =
  | "daily_report"
  | "admin"
  | "meeting"
  | "reminder"
  | "enrollment"
  | "default";

interface ShowNotificationToastOptions {
  title: string;
  description: string;
  type: NotificationType;
  onView?: () => void;
  duration?: number;
}

export function showNotificationToast({
  title,
  description,
  type,
  onView,
  duration = 5000,
}: ShowNotificationToastOptions) {
  return toast.custom(
    (t) => (
      <NotificationToast
        title={title}
        description={description}
        type={type}
        onView={onView}
        onDismiss={() => toast.dismiss(t)}
      />
    ),
    {
      duration,
      position: "bottom-right",
      unstyled: true, // This removes Sonner's default styling
    }
  );
}

export function showNotificationFromData(notification: UniversalNotification) {
  const notificationData = notification as any;
  let title = "Notification";
  let description = "You have a new notification";
  let type: NotificationType = "default";

  // Handle new Universal Notification format
  if (
    notificationData.title &&
    notificationData.description &&
    notificationData.notification_type
  ) {
    title = notificationData.title;
    description = notificationData.description;

    // Special handling for enrollment notifications
    if (
      notificationData.notification_type === "enrollment" &&
      notificationData.enrollment
    ) {
      return toast.custom(
        (t) => (
          <EnrollmentNotificationToast
            title={title}
            description={description}
            enrollment={notificationData.enrollment}
            onDismiss={() => toast.dismiss(t)}
          />
        ),
        {
          duration: 15000, // Longer duration for enrollment notifications
          position: "bottom-right",
          unstyled: true, // This removes Sonner's default styling
        }
      );
    }

    // Use notification_type to determine toast type
    switch (notificationData.notification_type) {
      case "daily_report":
        type = "daily_report";
        break;
      case "enrollment":
        type = "enrollment";
        break;
      case "info":
      default:
        // Determine type based on title content for info notifications
        const titleLower = title.toLowerCase();
        if (titleLower.includes("meeting")) {
          type = "meeting";
        } else if (titleLower.includes("reminder")) {
          type = "reminder";
        } else if (titleLower.includes("enrollment")) {
          type = "enrollment";
        } else {
          type = "admin";
        }
        break;
    }
  }
  // Handle legacy formats
  else if (
    notification.type === "App\\Notifications\\DailyReportNotification"
  ) {
    title = "Daily Report";
    description = notificationData.message || "You have a new daily report";
    type = "daily_report";
  } else if (notification.type === "App\\Notifications\\AdminNotification") {
    title = notificationData.title || "Notification";
    description = notificationData.description || "You have a new notification";

    // Determine type based on title content
    const titleLower = title.toLowerCase();
    if (titleLower.includes("meeting")) {
      type = "meeting";
    } else if (titleLower.includes("reminder")) {
      type = "reminder";
    } else if (titleLower.includes("enrollment")) {
      type = "enrollment";
    } else {
      type = "admin";
    }
  }

  return showNotificationToast({
    title,
    description,
    type,
    onView: () => {
      // Navigate to notifications page
      window.location.href = "/dashboard/notifications";
    },
  });
}

// Simple toast function that matches notification styling
export function showSimpleToast(
  title: string,
  description?: string,
  type: "success" | "error" | "warning" | "info" = "info",
  options?: {
    duration?: number;
    action?: { label: string; onClick: () => void };
  }
) {
  return showToast({
    title,
    description,
    type,
    duration: options?.duration,
    action: options?.action,
  });
}
