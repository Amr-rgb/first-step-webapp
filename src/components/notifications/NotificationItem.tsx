"use client";

import React from "react";
import { UniversalNotification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { FileText, Info, UserPlus, Clock, Check, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: UniversalNotification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const locale = useLocale();
  const isRead = !!notification.read_at;

  // Get notification title and description based on type
  const getNotificationContent = () => {
    const notificationData = notification as any;

    // Handle new Universal Notification format (has title, description, and notification_type)
    if (
      notificationData.title &&
      notificationData.description &&
      notificationData.notification_type
    ) {
      return {
        title: notificationData.title,
        description: notificationData.description,
        notificationType: notificationData.notification_type,
      };
    }

    // Handle legacy DailyReportNotification
    if (notification.type === "App\\Notifications\\DailyReportNotification") {
      return {
        title: "Daily Report",
        description: notificationData.message || "You have a new daily report",
        notificationType: "daily_report",
      };
    }

    // Handle legacy AdminNotification
    if (notification.type === "App\\Notifications\\AdminNotification") {
      return {
        title: notificationData.title || "Notification",
        description:
          notificationData.description || "You have a new notification",
        notificationType: "info",
      };
    }

    // Fallback for unknown types
    return {
      title:
        notificationData.title || notificationData.message || "Notification",
      description:
        notificationData.description ||
        notificationData.message ||
        "You have a new notification",
      notificationType: "info",
    };
  };

  // Get appropriate icon based on notification type and content
  const getNotificationIcon = () => {
    const content = getNotificationContent();

    // Use notification_type if available
    if (content.notificationType === "daily_report") {
      return <FileText className="size-5 text-blue-500" />;
    }
    if (content.notificationType === "enrollment") {
      return <UserPlus className="size-5 text-green-500" />;
    }

    // Fallback to title-based detection
    const title = content.title.toLowerCase();
    if (title.includes("daily report") || title.includes("report")) {
      return <FileText className="size-5 text-blue-500" />;
    }
    if (title.includes("enrollment") || title.includes("enroll")) {
      return <UserPlus className="size-5 text-green-500" />;
    }
    if (title.includes("meeting")) {
      return <UserPlus className="size-5 text-purple-500" />;
    }
    if (title.includes("reminder")) {
      return <Clock className="size-5 text-yellow-500" />;
    }

    // Default to info icon
    return <Info className="size-5 text-orange-500" />;
  };

  // Format the notification time
  const getTimeDisplay = () => {
    const createdAt = new Date(notification.created_at);
    const dateLocale = locale === "ar" ? ar : enUS;

    return formatDistanceToNow(createdAt, {
      addSuffix: true,
      locale: dateLocale,
    });
  };

  // Handle click to mark as read
  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "p-4 hover:bg-gray-50 transition-colors cursor-pointer relative",
        !isRead && "bg-blue-50/50"
      )}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!isRead && (
        <Dot className="absolute top-2 right-2 size-6 text-blue-500" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{getNotificationIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {(() => {
            const content = getNotificationContent();
            const adminNotification = notification as any;

            return (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={cn(
                      "text-sm font-medium text-gray-900 truncate",
                      !isRead && "font-semibold"
                    )}
                  >
                    {content.title}
                  </h4>

                  {!isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      className="h-auto p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check className="size-3" />
                    </Button>
                  )}
                </div>

                <p
                  className="text-sm text-gray-600 mt-1 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {content.description}
                </p>

                {/* Additional info for specific notification types */}
                {notification.type ===
                  "App\\Notifications\\DailyReportNotification" && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="size-3" />
                      Report ID: {(notification as any).report_id}
                    </span>
                  </div>
                )}

                {adminNotification.date && adminNotification.time && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {adminNotification.date} at {adminNotification.time}
                    </span>
                  </div>
                )}
              </>
            );
          })()}

          {/* Timestamp */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{getTimeDisplay()}</span>

            {isRead && <Check className="size-3 text-gray-400" />}
          </div>
        </div>
      </div>
    </div>
  );
}
