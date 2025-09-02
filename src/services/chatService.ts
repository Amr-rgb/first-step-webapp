import { ChatListItem, Message } from "@/components/dashboard/chat/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://development.firststep-app.com/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ApiMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  image: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  is_read_admin: boolean;
  image_url: string | null;
  video_url_path: string | null;
}

interface ApiContact {
  contact_id: number;
  unread_count: number;
  is_online: number;
  contact: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface ApiParent {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  is_online: number;
  children: Array<{
    id: number;
    child_name: string;
    parent_name: string;
    mother_name: string;
  }>;
}

interface ApiCenterParent {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  is_online?: number;
}

interface ApiAdminConversation {
  users: {
    user1: {
      id: number;
      name: string;
    };
    user2: {
      id: number;
      name: string;
    };
  };
  messages: Array<{
    id: number;
    sender_id: number;
    receiver_id: number;
    sender_name: string;
    receiver_name: string;
    message: string;
    image: string | null;
    video_url: string | null;
    created_at: string;
  }>;
}

const mapApiMessageToMessage = (
  apiMessage: ApiMessage,
  currentUserId: string,
  currentUserType: "center" | "parent" | "admin"
): Message => ({
  id: apiMessage.id.toString(),
  content: apiMessage.message,
  senderId: apiMessage.sender_id.toString(),
  senderName: "User", // This will be set from the contact info
  senderType:
    apiMessage.sender_id.toString() === currentUserId
      ? currentUserType
      : currentUserType === "center"
      ? "parent"
      : "center",
  timestamp: new Date(apiMessage.created_at),
  chatId: apiMessage.receiver_id.toString(),
  imageUrl: apiMessage.image_url,
  videoUrl: apiMessage.video_url_path,
});

const mapApiContactToChatListItem = (
  apiContact: ApiContact,
  currentUserId: string,
  currentUserType: "center" | "parent" | "admin"
): ChatListItem => ({
  id: apiContact.contact.id.toString(),
  name: apiContact.contact.name,
  type:
    apiContact.contact.id.toString() === currentUserId
      ? currentUserType
      : currentUserType === "center"
      ? "parent"
      : "center",
  lastMessage: "", // Will be updated when messages are loaded
  timestamp: new Date(),
  unreadCount: apiContact.unread_count,
  isOnline: apiContact.is_online === 1,
  avatar: apiContact.contact.avatar,
  email: apiContact.contact.email,
});

export const chatService = {
  // Get all center parents (contacts for centers to chat with)
  async getCenterParents(authToken: string): Promise<ApiParent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/center/parents`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch center parents");
      }

      const data: ApiParent[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching center parents:", error);
      throw error;
    }
  },

  // Get center parent for specific parent (for parent dashboard)
  async getCentersForParent(authToken: string): Promise<ApiCenterParent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/get-centers-parent`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch centers for parent");
      }

      const data: ApiCenterParent[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching centers for parent:", error);
      throw error;
    }
  },

  async getChatContacts(
    authToken: string,
    currentUserId: string,
    currentUserType: "center" | "parent" | "admin"
  ): Promise<ChatListItem[]> {
    try {
      console.log("🔍 [chatService] Fetching chat contacts...");
      console.log("🔗 [chatService] URL:", `${API_BASE_URL}/chat-contacts`);
      console.log("👤 [chatService] User:", {
        id: currentUserId,
        type: currentUserType,
      });

      const response = await fetch(`${API_BASE_URL}/chat-contacts`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
      });

      console.log("📡 [chatService] Response status:", response.status);
      console.log("📡 [chatService] Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Response error:", errorText);
        throw new Error("Failed to fetch chat contacts");
      }

      const data: ApiContact[] = await response.json();
      console.log("📄 [chatService] Raw API response:", data);

      const mappedContacts = data.map((contact) =>
        mapApiContactToChatListItem(contact, currentUserId, currentUserType)
      );

      console.log("🔄 [chatService] Mapped contacts:", mappedContacts);
      return mappedContacts;
    } catch (error) {
      console.error("❌ [chatService] Error fetching chat contacts:", error);
      throw error;
    }
  },

  async getMessages(
    contactId: string,
    authToken: string,
    currentUserId: string,
    currentUserType: "center" | "parent" | "admin"
  ): Promise<Message[]> {
    try {
      // For admin users, we need to call the messages endpoint differently
      // For parent and center users, we only need the receiver_id (contactId)
      let url = `${API_BASE_URL}/messages/${contactId}`;

      // For admin users, we need to use the correct participant ID
      // Based on Postman data, messages are stored with receiver_id = 11 and sender_id = 2
      // So we need to use the receiver_id (11) as contactId and add sender_id (2) as parameter

      // For admin users, we might not need sender_id parameter
      if (currentUserType === "admin") {
        console.log("👑 [chatService] Admin - Contact ID:", contactId);
        url += `?sender_id=${contactId}`;
        console.log("🔗 [chatService] Admin URL:", url);
      }

      console.log("🔍 [chatService] Fetching messages...");
      console.log("🔗 [chatService] Final URL:", url);
      console.log("👤 [chatService] User:", {
        id: currentUserId,
        type: currentUserType,
      });
      console.log("📞 [chatService] Contact ID:", contactId);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
      });

      console.log("📡 [chatService] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Error:", errorText);
        throw new Error("Failed to fetch messages");
      }

      const data: ApiMessage[] = await response.json();
      console.log("📄 [chatService] Messages count:", data.length);

      const mappedMessages = data.map((msg) =>
        mapApiMessageToMessage(msg, currentUserId, currentUserType)
      );

      console.log(
        "✅ [chatService] Success - Messages:",
        mappedMessages.length
      );
      return mappedMessages;
    } catch (error) {
      console.error("❌ [chatService] Error fetching messages:", error);
      throw error;
    }
  },

  async sendMessage(
    receiverId: string,
    message: string,
    authToken: string,
    currentUserId: string,
    currentUserType: "center" | "parent" | "admin",
    image?: File,
    videoUrl?: string
  ): Promise<Message> {
    const formData = new FormData();
    formData.append("receiver_id", receiverId);
    formData.append("message", message);

    if (image) {
      formData.append("image", image);
    }

    if (videoUrl) {
      formData.append("video_url", videoUrl);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      return mapApiMessageToMessage(
        data.message,
        currentUserId,
        currentUserType
      );
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  async markAsRead(messageId: string, authToken: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/${messageId}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark message as read");
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  },

  async updateOnlineStatus(
    isOnline: boolean,
    authToken: string
  ): Promise<void> {
    try {
      const endpoint = isOnline ? "online" : "offline";
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update online status to ${isOnline ? "online" : "offline"}`
        );
      }
    } catch (error) {
      console.error("Error updating online status:", error);
      throw error;
    }
  },

  // Admin-specific methods
  async getAdminConversations(authToken: string): Promise<ChatListItem[]> {
    try {
      console.log("🔍 [chatService] Fetching admin conversations...");
      console.log("🔗 [chatService] URL:", `${API_BASE_URL}/get-chats`);

      const response = await fetch(`${API_BASE_URL}/get-chats`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
      });

      console.log("📡 [chatService] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Response error:", errorText);
        throw new Error("Failed to fetch admin conversations");
      }

      const data: ApiAdminConversation[] = await response.json();
      console.log("📄 [chatService] Raw admin conversations:", data);

      const mappedConversations = data.map((conversation, index) => {
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];
        const conversationId = `${conversation.users.user1.id}-${conversation.users.user2.id}`;

        return {
          id: conversationId,
          name: `${conversation.users.user1.name} & ${conversation.users.user2.name}`,
          type: "admin" as const,
          lastMessage: lastMessage?.message || "",
          timestamp: lastMessage
            ? new Date(lastMessage.created_at)
            : new Date(),
          unreadCount: 0, // Admin doesn't have unread counts
          isOnline: false, // We'll update this from user status
          participants: [
            {
              id: conversation.users.user1.id.toString(),
              name: conversation.users.user1.name,
              type: "center" as const, // Assuming user1 is center, user2 is parent
            },
            {
              id: conversation.users.user2.id.toString(),
              name: conversation.users.user2.name,
              type: "parent" as const,
            },
          ],
        };
      });

      console.log(
        "🔄 [chatService] Mapped admin conversations:",
        mappedConversations
      );
      return mappedConversations;
    } catch (error) {
      console.error(
        "❌ [chatService] Error fetching admin conversations:",
        error
      );
      throw error;
    }
  },

  async getAdminConversationMessages(
    conversationId: string,
    authToken: string
  ): Promise<Message[]> {
    try {
      console.log("🔍 [chatService] Fetching admin conversation messages...");
      console.log("🔗 [chatService] Conversation ID:", conversationId);

      const response = await fetch(`${API_BASE_URL}/get-chats`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Error:", errorText);
        throw new Error("Failed to fetch admin conversation messages");
      }

      const data: ApiAdminConversation[] = await response.json();

      // Find the specific conversation
      const conversation = data.find((conv) => {
        const convId = `${conv.users.user1.id}-${conv.users.user2.id}`;
        return convId === conversationId;
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const mappedMessages = conversation.messages.map((msg) => ({
        id: msg.id.toString(),
        content: msg.message,
        senderId: msg.sender_id.toString(),
        senderName: msg.sender_name,
        senderType:
          msg.sender_name === "center"
            ? ("center" as const)
            : ("parent" as const),
        timestamp: new Date(msg.created_at),
        chatId: conversationId,
        imageUrl: msg.image,
        videoUrl: msg.video_url,
      }));

      console.log(
        "✅ [chatService] Admin conversation messages:",
        mappedMessages.length
      );
      return mappedMessages;
    } catch (error) {
      console.error(
        "❌ [chatService] Error fetching admin conversation messages:",
        error
      );
      throw error;
    }
  },
};
