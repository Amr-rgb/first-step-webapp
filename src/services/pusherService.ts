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
    },
  ) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = `chatnew.${receiverId}`;
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
        },
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
    },
  ) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = `chat-list-new.${userId}`;
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

    const channelName = "chat-list-new.admin";
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

    const channelName = "chatnew.admin";
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
          message,
        );
        callbacks.onNewMessage!(message);
      });
    }

    if (callbacks.onConversationUpdate) {
      channel.bind("conversation-updated", (conversationData: any) => {
        console.log(
          "📋 Admin conversations update callback triggered:",
          conversationData,
        );
        callbacks.onConversationUpdate!(conversationData);
      });
    }

    return channel;
  }

  // Subscribe to a specific chat channel for admin participation
  subscribeToSpecificChat(
    receiverId: string,
    callbacks: {
      onNewMessage?: (message: any) => void;
      onTyping?: (data: { userId: string; isTyping: boolean }) => void;
    },
  ) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = `chat.${receiverId}`;
    console.log("🔔 Admin subscribing to specific chat channel:", channelName);

    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
      console.log("✅ Admin subscribed to specific chat channel:", channelName);
    }

    if (callbacks.onNewMessage) {
      channel.bind("new-message", (message: any) => {
        console.log("📨 Admin specific chat new message:", message);
        callbacks.onNewMessage!(message);
      });
    }

    if (callbacks.onTyping) {
      channel.bind(
        "user.typing",
        (data: { userId: string; isTyping: boolean }) => {
          callbacks.onTyping!(data);
        },
      );
    }

    return channel;
  }

  unsubscribeFromChat(receiverId: string) {
    const channelName = `chatnew.${receiverId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  unsubscribeFromChatList(userId: string) {
    const channelName = `chat-list-new.${userId}`;
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
    const channelName = "chat-list-new.admin";
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  unsubscribeFromAdminChat() {
    const channelName = "chatnew.admin";
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

  unsubscribeFromSpecificChat(receiverId: string) {
    const channelName = `chat.${receiverId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
      console.log(
        "🔧 Admin unsubscribed from specific chat channel:",
        channelName,
      );
    }
  }

  // notification channel

  subscribeToUniversalNotifications(
    currentUserId: number,
    callbacks: {
      onNewNotification?: (notification: any) => void;
      onNotificationUpdated?: (data: {
        notification_id: string;
        read_at: string;
      }) => void;
    },
  ) {
    if (!this.pusher) {
      this.initialize();
    }

    const channelName = "universal-notifications";
    console.log(
      "🔔 Subscribing to universal notifications for user:",
      currentUserId,
    );

    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = this.pusher!.subscribe(channelName);
      this.channels.set(channelName, channel);
      console.log("✅ Universal notifications channel subscribed");
    } else {
      // Unbind previous events to avoid duplicates
      channel.unbind(
        "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
      );
      channel.unbind("notification-updated");
      console.log("🔄 Re-binding universal notifications events");
    }

    // Bind to Laravel notification events with user ID filtering
    if (callbacks.onNewNotification) {
      channel.bind(
        "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
        (notification: any) => {
          console.log("📬 Notification received:", {
            notifiableId: notification.notifiable_id,
            currentUserId: currentUserId,
            notificationType: notification.type,
            title: notification.title,
          });

          // CRITICAL: Only process notifications intended for this user
          if (notification.notifiable_id === currentUserId) {
            console.log(
              "✅ Notification is for current user, processing...",
              notification,
            );
            callbacks.onNewNotification!(notification);
          } else {
            console.log("⚠️ Notification is NOT for current user, ignoring.", {
              expected: currentUserId,
              received: notification.notifiable_id,
            });
          }
        },
      );
    }

    if (callbacks.onNotificationUpdated) {
      channel.bind("notification-updated", (data: any) => {
        console.log("🔄 Notification update received:", data);
        callbacks.onNotificationUpdated!(data);
      });
    }

    return channel;
  }

  unsubscribeFromUniversalNotifications() {
    const channelName = "universal-notifications";
    const channel = this.channels.get(channelName);

    if (channel) {
      this.pusher?.unsubscribe(channelName);
      this.channels.delete(channelName);
    }
  }

  // ========================
  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect();
      this.channels.clear();
      this.pusher = null;
    }
  }

  // Send typing indicator
  triggerTyping(chatId: string, userId: string, isTyping: boolean) {
    const channelName = `chatnew.${chatId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      channel.trigger("client-typing", {
        userId,
        isTyping,
      });
    }
  }

  // notification channel
}

export const pusherService = new PusherService();
