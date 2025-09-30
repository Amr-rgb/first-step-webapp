import Pusher from "pusher-js";

class PusherService {
  private pusher: Pusher | null = null;
  private channels: Map<string, any> = new Map();

  initialize() {
    if (this.pusher) return this.pusher;

    if (process.env.NODE_ENV === "development") {
      Pusher.logToConsole = true;
    }

    this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    return this.pusher;
  }

  subscribeToChat(
    receiverId: string,
    callbacks: {
      onNewMessage?: (message: any) => void;
      onTyping?: (data: { userId: string; isTyping: boolean }) => void;
      onUserOnline?: (userId: string) => void;
      onUserOffline?: (userId: string) => void;
    }
  ) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = `chat.${receiverId}`;
    console.log("🔔 Subscribing to chat channel:", channelName);

    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
      console.log("✅ Chat channel subscribed:", channelName);
    }

    // Bind events
    if (callbacks.onNewMessage) {
      console.log("🔧 Binding new-message event to channel:", channelName);
      channel.bind("new-message", (message: any) => {
        console.log("📨 New message callback triggered:", message);
        callbacks.onNewMessage!(message);
      });
    }

    if (callbacks.onTyping) {
      channel.bind(
        "user.typing",
        (data: { userId: string; isTyping: boolean }) => {
          callbacks.onTyping!(data);
        }
      );
    }

    if (callbacks.onUserOnline) {
      channel.bind("user.online", callbacks.onUserOnline);
    }

    if (callbacks.onUserOffline) {
      channel.bind("user.offline", callbacks.onUserOffline);
    }

    return channel;
  }

  subscribeToChatList(
    userId: string,
    callbacks: {
      onChatUpdate?: (chatData: any) => void;
      onNewChatCreated?: (chatData: any) => void;
    }
  ) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = `chat-list.${userId}`;
    console.log("🔔 Subscribing to chat list channel:", channelName);

    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
      console.log("✅ Chat list channel subscribed:", channelName);
    }

    // Bind events
    if (callbacks.onChatUpdate) {
      channel.bind("chat-list-updated", (chatData: any) => {
        console.log("📋 Chat list updated callback triggered:", chatData);
        callbacks.onChatUpdate!(chatData);
      });
    }

    if (callbacks.onNewChatCreated) {
      channel.bind("chat.created", (chatData: any) => {
        callbacks.onNewChatCreated!(chatData);
      });
    }

    return channel;
  }

  subscribeToUserStatus(callbacks: {
    onUserOnline?: (userId: string) => void;
    onUserOffline?: (userId: string) => void;
  }) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = "user-status";
    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
    }

    if (callbacks.onUserOnline) {
      channel.bind("user.online", callbacks.onUserOnline);
    }

    if (callbacks.onUserOffline) {
      channel.bind("user.offline", callbacks.onUserOffline);
    }

    return channel;
  }

  subscribeToAdminChatList(callbacks: {
    onChatUpdate?: (chatData: any) => void;
    onNewChatCreated?: (chatData: any) => void;
  }) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = "chat-list.admin";
    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
    }

    if (callbacks.onChatUpdate) {
      channel.bind("chat-list-updated", (chatData: any) => {
        console.log("📋 Admin chat list updated callback triggered:", chatData);
        callbacks.onChatUpdate!(chatData);
      });
    }

    if (callbacks.onNewChatCreated) {
      channel.bind("chat.created", callbacks.onNewChatCreated);
    }

    return channel;
  }

  subscribeToAdminChat(callbacks: { onNewMessage?: (message: any) => void }) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = "chat.admin";
    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
    }

    if (callbacks.onNewMessage) {
      channel.bind("new-message", (message: any) => {
        console.log("📨 Admin new message callback triggered:", message);
        callbacks.onNewMessage!(message);
      });
    }

    return channel;
  }

  subscribeToAdminConversations(callbacks: {
    onNewMessage?: (message: any) => void;
    onConversationUpdate?: (conversationData: any) => void;
  }) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = "admin.conversations";
    console.log("🔔 Subscribing to admin conversations channel:", channelName);

    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
      console.log("✅ Admin conversations channel subscribed:", channelName);
    }

    if (callbacks.onNewMessage) {
      channel.bind("new-message", (message: any) => {
        console.log(
          "📨 Admin conversations new message callback triggered:",
          message
        );
        callbacks.onNewMessage!(message);
      });
    }

    if (callbacks.onConversationUpdate) {
      channel.bind("conversation-updated", (conversationData: any) => {
        console.log(
          "📋 Admin conversations update callback triggered:",
          conversationData
        );
        callbacks.onConversationUpdate!(conversationData);
      });
    }

    return channel;
  }

  unsubscribeFromChat(receiverId: string) {
    const channelName = `chat.${receiverId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  unsubscribeFromChatList(userId: string) {
    const channelName = `chat-list.${userId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  unsubscribeFromUserStatus() {
    const channelName = "user-status";
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  unsubscribeFromAdminChatList() {
    const channelName = "chat-list.admin";
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  unsubscribeFromAdminChat() {
    const channelName = "chat.admin";
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  unsubscribeFromAdminConversations() {
    const channelName = "admin.conversations";
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
      console.log("🔧 Unsubscribed from admin conversations channel");
    }
  }

  subscribeToUniversalNotifications(callbacks: {
    onNewNotification?: (notification: any) => void;
    onNotificationUpdated?: (data: {
      notification_id: string;
      read_at: string;
    }) => void;
  }) {
    if (!this.pusher) {
      console.log("🔧 Initializing Pusher...");
      this.initialize();
    }

    const channelName = "universal-notifications";
    console.log(
      "🔔 Subscribing to universal notifications channel:",
      channelName
    );
    console.log("🔧 Pusher instance:", this.pusher);
    console.log("🔧 Pusher key:", process.env.NEXT_PUBLIC_PUSHER_KEY);
    console.log("🔧 Pusher cluster:", process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
      console.log(
        "✅ Universal notifications channel subscribed:",
        channelName
      );

      // Add connection state logging
      channel.bind("pusher:subscription_succeeded", () => {
        console.log(
          "🎉 Successfully subscribed to universal-notifications channel"
        );
      });

      channel.bind("pusher:subscription_error", (error: any) => {
        console.error(
          "❌ Failed to subscribe to universal-notifications channel:",
          error
        );
      });

      // Add a global event listener to see ALL events coming through
      channel.bind_global((eventName: string, data: any) => {
        console.log(
          `🔍 Universal notifications channel received event: ${eventName}`,
          data
        );

        // If we receive any notification-related event, try to handle it
        if (
          eventName.includes("notification") ||
          eventName.includes("Notification")
        ) {
          console.log(`🚨 POTENTIAL NOTIFICATION EVENT DETECTED: ${eventName}`);
          console.log(`🚨 Event data:`, data);

          // Try to call the callback if it exists
          if (callbacks.onNewNotification) {
            console.log(`🚨 Attempting to call onNewNotification callback...`);
            callbacks.onNewNotification(data);
          }
        }
      });
    } else {
      console.log("🔄 Channel already exists, unbinding previous events");
      // Unbind previous events to avoid duplicates
      const possibleEventNames = [
        "new-notification",
        "notification",
        "NotificationSent",
        "notification.sent",
        "App\\Events\\NotificationSent",
        "universal-notification",
        "admin-notification",
        "daily-report-notification",
        "notification-updated",
        "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
      ];

      possibleEventNames.forEach((eventName) => {
        channel.unbind(eventName);
      });
    }

    // Always bind events (even if channel already exists)
    if (callbacks.onNewNotification) {
      console.log("🔧 Binding notification events to channel:", channelName);
      const eventHandler = (notification: any) => {
        console.log("📨 New notification callback triggered:", notification);
        callbacks.onNewNotification!(notification);
      };

      // Bind to multiple possible event names that the backend might use
      const possibleEventNames = [
        "new-notification",
        "notification",
        "NotificationSent",
        "notification.sent",
        "App\\Events\\NotificationSent",
        "universal-notification",
        "admin-notification",
        "daily-report-notification",
        "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
      ];

      possibleEventNames.forEach((eventName) => {
        console.log(`🔧 Binding to event: ${eventName}`);
        channel.bind(eventName, eventHandler);
      });

      // Store the handler reference for debugging
      (channel as any)._newNotificationHandler = eventHandler;
    }

    if (callbacks.onNotificationUpdated) {
      console.log(
        "🔧 Binding notification-updated event to channel:",
        channelName
      );
      const updateHandler = (data: {
        notification_id: string;
        read_at: string;
      }) => {
        console.log("📋 Notification updated callback triggered:", data);
        callbacks.onNotificationUpdated!(data);
      };
      channel.bind("notification-updated", updateHandler);

      // Store the handler reference for debugging
      (channel as any)._notificationUpdatedHandler = updateHandler;
    }

    // Log current bindings for debugging
    console.log("🔍 Channel bindings:", (channel as any).callbacks);

    return channel;
  }

  unsubscribeFromUniversalNotifications() {
    const channelName = "universal-notifications";
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
      console.log("🔧 Unsubscribed from universal notifications channel");
    }
  }

  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
      this.channels.clear();
      this.pusher = null;
    }
  }

  // Send typing indicator
  triggerTyping(chatId: string, userId: string, isTyping: boolean) {
    const channelName = `chat.${chatId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      channel.trigger("client-typing", {
        userId,
        isTyping,
      });
    }
  }

  // Debug method to manually trigger a notification event
  triggerTestNotification(notification: any) {
    const channelName = "universal-notifications";
    const channel = this.channels.get(channelName);

    if (channel) {
      console.log("🧪 Manually triggering test notification:", notification);

      // Get the bound callbacks and call them directly
      const callbacks = (channel as any).callbacks;
      if (callbacks && callbacks["new-notification"]) {
        console.log(
          "🔧 Found new-notification callbacks:",
          callbacks["new-notification"].length
        );
        callbacks["new-notification"].forEach((callbackObj: any) => {
          console.log("🚀 Calling callback:", callbackObj);
          callbackObj.fn(notification);
        });
      } else {
        console.log("❌ No new-notification callbacks found");
      }
    } else {
      console.log("❌ No universal-notifications channel found");
    }
  }

  // Debug method to check channel status
  getChannelInfo(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      return {
        subscribed: channel.subscribed,
        callbacks: Object.keys((channel as any).callbacks || {}),
        state: (channel as any).state,
        allCallbacks: (channel as any).callbacks,
      };
    }
    return null;
  }

  // Debug method to force bind to any event name
  forceBindToEvent(eventName: string, callback: (data: any) => void) {
    const channelName = "universal-notifications";
    const channel = this.channels.get(channelName);

    if (channel) {
      console.log(`🔧 Force binding to event: ${eventName}`);
      channel.bind(eventName, (data: any) => {
        console.log(`🎯 Force bound event triggered: ${eventName}`, data);
        callback(data);
      });
    } else {
      console.log(
        "❌ No universal-notifications channel found for force binding"
      );
    }
  }
}

export const pusherService = new PusherService();
