"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, FileText, Info, UserPlus, Zap } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { showNotificationToast } from "@/lib/notification-toast";
import { pusherService } from "@/services/pusherService";

export function NotificationTest() {
  const { notifications, unreadCount, handleNewNotification } =
    useNotifications();

  // Test direct Pusher connection
  const testPusherConnection = () => {
    console.log("🧪 Testing Pusher connection...");
    console.log("🔧 Pusher Key:", process.env.NEXT_PUBLIC_PUSHER_KEY);
    console.log("🔧 Pusher Cluster:", process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

    // Initialize pusher if not already done
    const pusher = pusherService.initialize();
    console.log("🔍 Pusher instance:", pusher);

    // Check connection state
    if (pusher) {
      console.log("🔍 Pusher connection state:", pusher.connection.state);

      pusher.connection.bind("connected", () => {
        console.log("✅ Pusher connected successfully");
      });

      pusher.connection.bind("error", (error: any) => {
        console.error("❌ Pusher connection error:", error);
      });
    }

    // Check channel info
    const channelInfo = (pusherService as any).getChannelInfo(
      "universal-notifications"
    );
    console.log("🔍 Channel info:", channelInfo);

    // Try to subscribe to the channel manually
    const testChannel = pusherService.subscribeToUniversalNotifications({
      onNewNotification: (notification) => {
        console.log("🎯 Test notification received:", notification);
        // Also trigger the real handler to test the full flow
        handleNewNotification(notification);
      },
    });

    console.log("🔍 Test channel:", testChannel);
  };

  // Test manual event triggering
  const testManualTrigger = () => {
    const testNotification = {
      id: `manual-${Date.now()}`,
      type: "App\\Notifications\\AdminNotification",
      notifiable_type: "App\\Models\\User",
      notifiable_id: 11,
      read_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: "Manual Test",
      description: "This is a manually triggered test notification.",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
    };

    console.log("🧪 Triggering manual notification...");
    (pusherService as any).triggerTestNotification(testNotification);
  };

  // Test binding to a custom event name
  const testCustomEventBinding = () => {
    const eventName = prompt(
      "Enter the exact event name you see in the console:"
    );
    if (eventName) {
      console.log(`🧪 Binding to custom event: ${eventName}`);
      (pusherService as any).forceBindToEvent(eventName, (data: any) => {
        console.log(`🎯 Custom event received: ${eventName}`, data);
        handleNewNotification(data);
      });
    }
  };

  // Simulate a real notification that updates the bell icon and shows toast
  const simulateRealNotification = (
    type: "daily_report" | "info" | "enrollment"
  ) => {
    const mockNotifications = {
      daily_report: {
        id: `real-${Date.now()}`,
        type: "App\\Notifications\\DailyReportNotification",
        notifiable_type: "App\\Models\\User",
        notifiable_id: 30,
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message: "Your child has a new daily report",
        report_id: Math.floor(Math.random() * 1000) + 1,
      },
      info: {
        id: `real-${Date.now()}`,
        type: "App\\Notifications\\AdminNotification",
        notifiable_type: "App\\Models\\User",
        notifiable_id: 11,
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: "Reminder",
        description: "This is a reminder for upcoming activity.",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      },
      enrollment: {
        id: `real-${Date.now()}`,
        type: "App\\Notifications\\AdminNotification",
        notifiable_type: "App\\Models\\User",
        notifiable_id: 25,
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: "New Enrollment Request",
        description: "A new enrollment request has been submitted.",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      },
    };

    const notification = mockNotifications[type];
    console.log(
      "🚀 Simulating REAL notification (will update bell icon):",
      notification
    );

    // Call the actual notification handler - this will update the bell icon AND show toast
    handleNewNotification(notification as any);
  };

  // Simulate receiving a notification (for testing purposes)
  const simulateNotification = (
    type: "daily_report" | "info" | "enrollment"
  ) => {
    const mockNotifications = {
      daily_report: {
        id: `test-${Date.now()}`,
        type: "App\\Notifications\\DailyReportNotification",
        notifiable_type: "App\\Models\\User",
        notifiable_id: 30,
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        message: "Your child has a new daily report",
        report_id: Math.floor(Math.random() * 1000) + 1,
      },
      info: {
        id: `test-${Date.now()}`,
        type: "App\\Notifications\\AdminNotification",
        notifiable_type: "App\\Models\\User",
        notifiable_id: 11,
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: "Reminder",
        description: "This is a reminder for upcoming activity.",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      },
      enrollment: {
        id: `test-${Date.now()}`,
        type: "App\\Notifications\\AdminNotification",
        notifiable_type: "App\\Models\\User",
        notifiable_id: 25,
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: "New Enrollment Request",
        description: "A new enrollment request has been submitted.",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      },
    };

    const notification = mockNotifications[type];

    // Simulate the toast notification directly
    let title = "Notification";
    let body = "You have a new notification";
    let icon = "🔔";

    if (notification.type === "App\\Notifications\\DailyReportNotification") {
      title = "Daily Report";
      body = (notification as any).message || "You have a new daily report";
      icon = "📄";
    } else if (notification.type === "App\\Notifications\\AdminNotification") {
      title = (notification as any).title || "Notification";
      body = (notification as any).description || "You have a new notification";

      const titleLower = title.toLowerCase();
      if (titleLower.includes("meeting")) {
        icon = "👥";
      } else if (titleLower.includes("reminder")) {
        icon = "⏰";
      } else if (titleLower.includes("enrollment")) {
        icon = "👤";
      } else {
        icon = "ℹ️";
      }
    }

    // Show custom toast
    let toastType:
      | "daily_report"
      | "admin"
      | "meeting"
      | "reminder"
      | "enrollment"
      | "default" = "default";

    if (notification.type === "App\\Notifications\\DailyReportNotification") {
      toastType = "daily_report";
    } else if (notification.type === "App\\Notifications\\AdminNotification") {
      const titleLower = title.toLowerCase();
      if (titleLower.includes("meeting")) {
        toastType = "meeting";
      } else if (titleLower.includes("reminder")) {
        toastType = "reminder";
      } else if (titleLower.includes("enrollment")) {
        toastType = "enrollment";
      } else {
        toastType = "admin";
      }
    }

    showNotificationToast({
      title,
      description: body,
      type: toastType,
      onView: () => {
        console.log("Toast action clicked for:", notification.id);
      },
    });

    console.log("🧪 Simulated notification toast:", { title, body, icon });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell className="size-5" />
        Notification Test Panel
      </h3>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          Current notifications: {notifications.length}
        </p>
        <p className="text-sm text-gray-600">Unread count: {unreadCount}</p>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-2">
            Toast Only (No Bell Update)
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => simulateNotification("daily_report")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              Daily Report Toast
            </Button>

            <Button
              onClick={() => simulateNotification("info")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Info className="size-4" />
              Reminder Toast
            </Button>

            <Button
              onClick={() => simulateNotification("enrollment")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <UserPlus className="size-4" />
              Enrollment Toast
            </Button>
          </div>
        </div>

        <div className="border-t pt-3">
          <h4 className="text-sm font-medium mb-2">
            Real Notification (Updates Bell + Toast)
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => simulateRealNotification("daily_report")}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              Real Daily Report
            </Button>

            <Button
              onClick={() => simulateRealNotification("info")}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Info className="size-4" />
              Real Reminder
            </Button>

            <Button
              onClick={() => simulateRealNotification("enrollment")}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <UserPlus className="size-4" />
              Real Enrollment
            </Button>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={testPusherConnection}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Bell className="size-4" />
              Test Pusher Connection
            </Button>

            <Button
              onClick={testManualTrigger}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Zap className="size-4" />
              Manual Trigger Test
            </Button>

            <Button
              onClick={testCustomEventBinding}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-orange-500 text-orange-600"
            >
              <Zap className="size-4" />
              Bind Custom Event
            </Button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        These buttons show custom toast notifications with different styles and
        actions.
      </p>
    </div>
  );
}
