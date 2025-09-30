"use client";

import React from "react";
import { FileText, Info, UserPlus, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationToastProps {
  title: string;
  description: string;
  type:
    | "daily_report"
    | "admin"
    | "meeting"
    | "reminder"
    | "enrollment"
    | "default";
  onView?: () => void;
  onDismiss?: () => void;
}

export function NotificationToast({
  title,
  description,
  type,
  onView,
  onDismiss,
}: NotificationToastProps) {
  // Get icon and colors based on notification type
  const getNotificationStyle = () => {
    switch (type) {
      case "daily_report":
        return {
          icon: <FileText className="size-5" />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-l-blue-500",
        };
      case "meeting":
        return {
          icon: <UserPlus className="size-5" />,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          borderColor: "border-l-purple-500",
        };
      case "reminder":
        return {
          icon: <Clock className="size-5" />,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          borderColor: "border-l-yellow-500",
        };
      case "enrollment":
        return {
          icon: <UserPlus className="size-5" />,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          borderColor: "border-l-green-500",
        };
      case "admin":
      default:
        return {
          icon: <Info className="size-5" />,
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
          borderColor: "border-l-orange-500",
        };
    }
  };

  const style = getNotificationStyle();

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border-l-4 min-w-80 max-w-md",
        style.borderColor
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 p-2 rounded-full",
          style.iconBg,
          style.iconColor
        )}
      >
        {style.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {onView && (
            <Button
              size="sm"
              variant="outline"
              onClick={onView}
              className="h-7 px-3 text-xs"
            >
              View
            </Button>
          )}
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="h-7 px-3 text-xs text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
