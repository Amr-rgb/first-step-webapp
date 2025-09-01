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
}

export const pusherService = new PusherService();
