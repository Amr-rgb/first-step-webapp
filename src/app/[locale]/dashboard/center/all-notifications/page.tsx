"use client";

import React from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2, Bell } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const t = useTranslations("notifications");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="size-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-500">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCheck className="size-4" />
            {t("markAllRead")}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="size-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("noNotifications")}
          </h3>
          <p className="text-gray-500">
            You'll see notifications here when they arrive.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
