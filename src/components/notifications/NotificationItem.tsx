"use client";

import React, { useState } from "react";
import { UniversalNotification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { FileText, Info, UserPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useAuthUser } from "@/store/authStore";

interface NotificationItemProps {
  notification: UniversalNotification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const locale = useLocale();
  const isRead = !!notification.read_at;
  const user = useAuthUser();
  const role = user?.role;

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
      return <FileText className="size-6 text-blue-600" />;
    }
    if (content.notificationType === "enrollment") {
      return <UserPlus className="size-6 text-blue-600" />;
    }

    // Fallback to title-based detection
    const title = content.title.toLowerCase();
    if (title.includes("daily report") || title.includes("report")) {
      return <FileText className="size-6 text-blue-600" />;
    }
    if (
      title.includes("enrollment") ||
      title.includes("enroll") ||
      title.includes("حجز")
    ) {
      return <UserPlus className="size-6 text-blue-600" />;
    }
    if (title.includes("meeting")) {
      return <UserPlus className="size-6 text-purple-600" />;
    }
    if (title.includes("reminder")) {
      return <Clock className="size-6 text-yellow-600" />;
    }

    // Default to info icon
    return <Info className="size-6 text-blue-600" />;
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

  // Handle click to toggle expansion
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (!isRead) {
      onMarkAsRead(notification.id);
    }
  };

  // Get notification link based on type
  const getNotificationLink = () => {
    const content = getNotificationContent();
    const notificationData = notification as any;

    // For daily report notifications (parent receiving new reports)
    if (
      content.notificationType === "daily_report" ||
      notification.type === "App\\Notifications\\DailyReportNotification"
    ) {
      const reportId =
        notificationData.report?.id ||
        notificationData.report_id ||
        notificationData.id;

      if (reportId && role === "parent") {
        return `/dashboard/parent/daily-reports/${reportId}`;
      }
    }

    // For enrollment notifications (center/admin receiving new enrollments)
    if (
      content.notificationType === "enrollment" &&
      notificationData.enrollment?.id
    ) {
      return `/dashboard/${role}/bookings?enrollmentId=${notificationData.enrollment.id}`;
    }

    // For parent enrollment status notifications (expired, rejected, accepted, etc.)
    // Check if notification has enrollment_id field (parent notifications)
    if (notificationData.enrollment_id && role === "parent") {
      return `/dashboard/parent/bookings?enrollmentId=${notificationData.enrollment_id}`;
    }

    // Also check for enrollment object with id (alternative structure)
    if (notificationData.enrollment?.enrollment_id && role === "parent") {
      return `/dashboard/parent/bookings?enrollmentId=${notificationData.enrollment.enrollment_id}`;
    }

    // Check title/description for enrollment-related keywords for parents
    const titleLower = content.title.toLowerCase();
    const descLower = content.description.toLowerCase();
    if (
      role === "parent" &&
      (titleLower.includes("enrollment") ||
        titleLower.includes("حجز") ||
        titleLower.includes("تسجيل") ||
        descLower.includes("enrollment") ||
        descLower.includes("حجز") ||
        descLower.includes("تسجيل"))
    ) {
      // Try to extract enrollment ID from the notification data
      const enrollmentId =
        notificationData.enrollment_id ||
        notificationData.enrollment?.id ||
        notificationData.enrollment?.enrollment_id ||
        notificationData.id;

      if (enrollmentId) {
        return `/dashboard/parent/bookings?enrollmentId=${enrollmentId}`;
      }
    }

    // Add other notification type links here as needed
    return null;
  };

  const notificationLink = getNotificationLink();
  const content = getNotificationContent();
  const adminNotification = notification as any;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer",
        !isRead && "border-blue-200 bg-blue-50/30"
      )}
      onClick={handleClick}
    >
      {/* Collapsed View - Always visible */}
      <div className="flex items-center justify-between gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">{getNotificationIcon()}</div>

        {/* Title and Time */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-base font-semibold text-gray-900 truncate",
              locale === "ar" && "text-right"
            )}
          >
            {content.title}
          </h4>
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "text-xs text-green-500 whitespace-nowrap",
            locale === "ar" && "text-left"
          )}
        >
          {getTimeDisplay()}
        </span>
      </div>

      {/* Expanded View - Shown when clicked */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* Description */}
          <p className="text-sm text-gray-600">{content.description}</p>

          {/* Enrollment notification details */}
          {content.notificationType === "enrollment" &&
            adminNotification.enrollment && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {locale === "ar" ? "اسم الفرع" : "Branch Name"}:
                  </span>
                  <span className="font-medium text-gray-900">
                    {adminNotification.enrollment.branch?.nursery_name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {locale === "ar" ? "البرنامج" : "Program"}:
                  </span>
                  <span className="font-medium text-gray-900 capitalize">
                    {adminNotification.enrollment.enrollment_type || "N/A"}
                  </span>
                </div>
                {adminNotification.enrollment.enrollment_type === "hour" &&
                  adminNotification.enrollment.starting_time && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {locale === "ar" ? "بداية من الساعة" : "Starting Time"}:
                      </span>
                      <span className="font-medium text-gray-900">
                        {adminNotification.enrollment.starting_time}
                      </span>
                    </div>
                  )}
                {(adminNotification.enrollment.day_string ||
                  adminNotification.enrollment.starting_date) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {locale === "ar" ? "بداية من يوم" : "Starting Date"}:
                    </span>
                    <span className="font-medium text-gray-900">
                      {adminNotification.enrollment.day_string ||
                        adminNotification.enrollment.starting_date}
                    </span>
                  </div>
                )}
              </div>
            )}

          {/* Date and Time for other notifications */}
          {adminNotification.date &&
            adminNotification.time &&
            content.notificationType !== "enrollment" && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="size-4" />
                <span>
                  {adminNotification.date} at {adminNotification.time}
                </span>
              </div>
            )}

          {/* Action Button */}
          {notificationLink && (
            <div className="pt-2">
              <Link
                href={notificationLink}
                className="block"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="default" size="sm" className="w-full">
                  {locale === "ar" ? "عرض" : "View"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
