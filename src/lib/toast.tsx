import React from "react";
import { toast } from "sonner";
import {
  FileText,
  Info,
  UserPlus,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "daily_report"
  | "meeting"
  | "reminder"
  | "enrollment"
  | "admin";

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
}

// Get icon JSX element based on toast type
const getToastIcon = (type: ToastType) => {
  const iconProps = { className: "size-5" };

  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} />;
    case "error":
      return <XCircle {...iconProps} />;
    case "warning":
      return <AlertTriangle {...iconProps} />;
    case "info":
      return <Info {...iconProps} />;
    case "daily_report":
      return <FileText {...iconProps} />;
    case "meeting":
      return <UserPlus {...iconProps} />;
    case "reminder":
      return <Clock {...iconProps} />;
    case "enrollment":
      return <UserPlus {...iconProps} />;
    case "admin":
      return <Info {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
};

// Enhanced toast function with consistent styling
export function showToast({
  title,
  description,
  type = "info",
  duration = 5000,
  action,
  cancel,
}: ToastOptions) {
  const iconElement = getToastIcon(type);

  // Map custom types to Sonner types
  const sonnerType = (() => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "loading":
        return "loading";
      case "daily_report":
      case "meeting":
      case "reminder":
      case "enrollment":
      case "admin":
      case "info":
      default:
        return "info";
    }
  })();

  return toast[sonnerType](title, {
    description,
    duration,
    icon: iconElement,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
    cancel: cancel
      ? {
          label: cancel.label,
          onClick: cancel.onClick || (() => {}),
        }
      : undefined,
  });
}

// Convenience functions for common toast types
export const toastSuccess = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "success", ...options });

export const toastError = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "error", ...options });

export const toastWarning = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "warning", ...options });

export const toastInfo = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "info", ...options });

export const toastLoading = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) =>
  showToast({
    title,
    description,
    type: "loading",
    duration: Infinity,
    ...options,
  });

// Notification-specific toast functions
export const toastDailyReport = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "daily_report", ...options });

export const toastMeeting = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "meeting", ...options });

export const toastReminder = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "reminder", ...options });

export const toastEnrollment = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "enrollment", ...options });

export const toastAdmin = (
  title: string,
  description?: string,
  options?: Partial<ToastOptions>
) => showToast({ title, description, type: "admin", ...options });
