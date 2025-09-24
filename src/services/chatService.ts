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
  is_admin_message?: boolean;
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
  last_message: {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    created_at: string;
  };
}

interface ApiAdminConversationWithMessages extends ApiAdminConversation {
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
  apiContact: any, // Changed to any to handle both old and new formats
  currentUserId: string,
  currentUserType: "center" | "parent" | "admin"
): ChatListItem => {
  // Handle new API format (direct user object)
  if (apiContact.id && apiContact.name && !apiContact.contact) {
    return {
      id: apiContact.id.toString(),
      name: apiContact.name,
      type:
        apiContact.id.toString() === currentUserId
          ? currentUserType
          : currentUserType === "center"
          ? "parent"
          : "center",
      lastMessage: "", // Will be updated when messages are loaded
      timestamp: new Date(),
      unreadCount: 0, // Default value for new format
      isOnline: apiContact.is_online === 1,
      avatar: apiContact.avatar || undefined,
      email: apiContact.email,
    };
  }

  // Handle old API format (with contact property)
  return {
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
    unreadCount: apiContact.unread_count || 0,
    isOnline: apiContact.is_online === 1,
    avatar: apiContact.contact.avatar,
    email: apiContact.contact.email,
  };
};

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
      console.log("🔗 [chatService] URL:", `${API_BASE_URL}/new-chat-contacts`);
      console.log("👤 [chatService] User:", {
        id: currentUserId,
        type: currentUserType,
      });

      const response = await fetch(`${API_BASE_URL}/new-chat-contacts`, {
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

      const data: any[] = await response.json(); // Changed to any[] to handle new format
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
    currentUserType: "center" | "parent" | "admin",
    senderId?: string
  ): Promise<Message[]> {
    try {
      // For admin users, we need to call the messages endpoint differently
      // For parent and center users, we only need the receiver_id (contactId)
      let url = `${API_BASE_URL}/new-messages/${contactId}`;

      // For admin users, we need to use the correct participant ID
      // Based on Postman data, messages are stored with receiver_id = 11 and sender_id = 2
      // So we need to use the receiver_id (11) as contactId and add sender_id (2) as parameter

      // For admin users, use the senderId parameter
      if (currentUserType === "admin") {
        console.log("👑 [chatService] Admin - Contact ID:", contactId);
        console.log("👑 [chatService] Admin - Sender ID:", senderId);
        url += `?sender_id=${senderId}`;
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
    // For center and parent users, use the new messages endpoint
    if (currentUserType === "center" || currentUserType === "parent") {
      const requestBody = {
        sender_id: parseInt(currentUserId),
        receiver_id: receiverId,
        message: message,
        image: image || null,
        video_url: videoUrl || null,
      };

      try {
        console.log("📤 [chatService] Sending message:", requestBody);

        const response = await fetch(`${API_BASE_URL}/new-messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ [chatService] Message error:", errorText);

          // Check if it's a Pusher data size error
          if (
            errorText.includes("Pusher error") &&
            errorText.includes("exceeds the allowed maximum")
          ) {
            // This is a backend issue - the message is likely saved but Pusher failed
            // We'll return a mock message to keep the UI working
            console.warn(
              "⚠️ [chatService] Pusher data size error - message may still be saved"
            );

            const mockMessage: Message = {
              id: Date.now().toString(),
              content: message,
              senderId: currentUserId,
              senderName: currentUserType === "center" ? "Center" : "Parent",
              senderType: currentUserType,
              timestamp: new Date(),
              chatId: receiverId,
              imageUrl: image ? URL.createObjectURL(image) : undefined,
              videoUrl: videoUrl,
            };

            return mockMessage;
          }

          throw new Error("Failed to send message");
        }

        const data = await response.json();
        console.log("✅ [chatService] Message sent successfully:", data);

        return mapApiMessageToMessage(
          data.message,
          currentUserId,
          currentUserType
        );
      } catch (error) {
        console.error("❌ [chatService] Error sending message:", error);
        throw error;
      }
    }

    // For admin users, use the admin messages endpoint
    if (currentUserType === "admin") {
      // This should not be called directly - use sendAdminMessage instead
      throw new Error("Admin messages should use sendAdminMessage function");
    }

    throw new Error("Invalid user type");
  },

  // Admin-specific method to send messages in existing conversations
  async sendAdminMessage(
    conversationId: string,
    message: string,
    authToken: string,
    currentUserId: string,
    image?: File,
    videoUrl?: string
  ): Promise<Message> {
    // Extract user IDs from conversation ID (format: "user1-user2")
    const [user1Id, user2Id] = conversationId.split("-");

    // For admin messages, we need to send to one of the participants
    // Based on your API structure, we'll send to user2Id as the receiver
    const requestBody = {
      sender_id: parseInt(currentUserId), // Admin user ID
      receiver_id: user2Id, // Receiver ID (as string)
      message: message,
      image: image || null,
      video_url: videoUrl || null,
      is_read: false,
      is_read_admin: true,
      is_admin_message: true,
      original_conversation_sender: user1Id, // As string
      original_conversation_receiver: user2Id, // As string
    };

    try {
      console.log("📤 [chatService] Sending admin message:", requestBody);
      console.log(
        "🔗 [chatService] Admin send URL:",
        `${API_BASE_URL}/admin/messages/send`
      );

      const response = await fetch(`${API_BASE_URL}/admin/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
        body: JSON.stringify(requestBody),
      });

      console.log(
        "📡 [chatService] Admin send response status:",
        response.status
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Admin message error:", errorText);
        throw new Error("Failed to send admin message");
      }

      const data = await response.json();
      console.log("✅ [chatService] Admin message sent successfully:", data);
      console.log(
        "📄 [chatService] Full API response:",
        JSON.stringify(data, null, 2)
      );

      // Map the response to our Message interface
      // The API returns the message wrapped in a 'message' object
      const messageData = data.message || data;
      const adminMessage: Message = {
        id: messageData?.id?.toString() || Date.now().toString(),
        content: messageData?.message || message,
        senderId: messageData?.sender_id?.toString() || currentUserId,
        senderName: "Admin",
        senderType: "admin",
        timestamp: new Date(messageData?.created_at || new Date()),
        chatId: conversationId,
        imageUrl: messageData?.image_url || undefined,
        videoUrl: messageData?.video_url_path || undefined,
      };

      console.log("📤 [chatService] Mapped admin message:", adminMessage);
      console.log("📤 [chatService] Message ID from API:", messageData?.id);
      console.log(
        "📤 [chatService] Message created_at from API:",
        messageData?.created_at
      );
      console.log(
        "📤 [chatService] Is admin message:",
        messageData?.is_admin_message
      );
      return adminMessage;
    } catch (error) {
      console.error("❌ [chatService] Error sending admin message:", error);
      throw error;
    }
  },

  async markAsRead(messageId: string, authToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/new-chat/mark-as-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
          "X-Authorization-Secret":
            process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
        },
        body: JSON.stringify({ message_id: messageId }),
      });

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
      const endpoint = isOnline ? "new-online" : "new-offline";
      console.log(
        `🔄 [chatService] Updating online status to ${
          isOnline ? "online" : "offline"
        }`
      );
      console.log(`🔗 [chatService] Endpoint: ${API_BASE_URL}/${endpoint}`);

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

      console.log(
        `📡 [chatService] Online status response: ${response.status}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [chatService] Online status error: ${errorText}`);

        // Check if it's a Pusher data size error
        if (
          errorText.includes("Pusher error") &&
          errorText.includes("exceeds the allowed maximum")
        ) {
          console.warn(
            `⚠️ [chatService] Pusher data size error - backend issue, not critical`
          );
        } else {
          console.warn(
            `⚠️ [chatService] Online status update failed, but continuing...`
          );
        }
        return;
      }

      console.log(`✅ [chatService] Online status updated successfully`);
    } catch (error) {
      console.error("❌ [chatService] Error updating online status:", error);
      // Don't throw error for online status - it's not critical
      console.warn(
        "⚠️ [chatService] Online status update failed, but continuing..."
      );
    }
  },

  // Admin-specific methods
  async getAdminConversations(authToken: string): Promise<ChatListItem[]> {
    try {
      console.log("🔍 [chatService] Fetching admin conversations...");
      console.log(
        "🔗 [chatService] URL:",
        `${API_BASE_URL}/admin/conversations`
      );

      const response = await fetch(`${API_BASE_URL}/admin/conversations`, {
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

      const responseData: { data: ApiAdminConversation[] } =
        await response.json();
      const conversations = responseData.data;
      console.log("📄 [chatService] Raw admin conversations:", conversations);

      const mappedConversations: ChatListItem[] = conversations.map((conv) => {
        const conversationId = `${conv.users.user1.id}-${conv.users.user2.id}`;

        // Handle null names safely
        const user1Name =
          conv.users.user1.name || `User ${conv.users.user1.id}`;
        const user2Name =
          conv.users.user2.name || `User ${conv.users.user2.id}`;

        return {
          id: conversationId,
          name: `${user1Name} & ${user2Name}`,
          type: "admin" as const,
          lastMessage: conv.last_message?.message || "",
          timestamp: conv.last_message
            ? new Date(conv.last_message.created_at)
            : new Date(),
          unreadCount: 0, // Admin doesn't track unread counts
          isOnline: false, // Will be updated by Pusher
          participants: [
            {
              id: conv.users.user1.id.toString(),
              name: user1Name,
              type: user1Name.toLowerCase().includes("admin")
                ? ("admin" as const)
                : user1Name.toLowerCase().includes("center")
                ? ("center" as const)
                : ("parent" as const),
            },
            {
              id: conv.users.user2.id.toString(),
              name: user2Name,
              type: user2Name.toLowerCase().includes("admin")
                ? ("admin" as const)
                : user2Name.toLowerCase().includes("center")
                ? ("center" as const)
                : ("parent" as const),
            },
          ],
        };
      });

      console.log(
        "🔄 [chatService] Mapped admin conversations:",
        mappedConversations.length
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

      // Extract user IDs from conversation ID (format: "user1-user2")
      const [user1Id, user2Id] = conversationId.split("-");

      // First, get the conversation details to get user names
      const conversationsResponse = await fetch(
        `${API_BASE_URL}/admin/conversations`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
            "X-Authorization-Secret":
              process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
          },
        }
      );

      let user1Name = `User ${user1Id}`;
      let user2Name = `User ${user2Id}`;

      if (conversationsResponse.ok) {
        const conversationsData: { data: ApiAdminConversation[] } =
          await conversationsResponse.json();
        const conversation = conversationsData.data.find((conv) => {
          const convId = `${conv.users.user1.id}-${conv.users.user2.id}`;
          return convId === conversationId;
        });

        if (conversation) {
          user1Name = conversation.users.user1.name || `User ${user1Id}`;
          user2Name = conversation.users.user2.name || `User ${user2Id}`;
        }
      }

      // For admin conversations, we need to fetch messages from both directions
      // and include admin messages (sender_id = 1)
      // Try multiple endpoints to get all messages in the conversation
      const urls = [
        `${API_BASE_URL}/new-messages/${user2Id}?sender_id=${user1Id}`,
        `${API_BASE_URL}/new-messages/${user1Id}?sender_id=${user2Id}`,
        `${API_BASE_URL}/new-messages/${user2Id}?sender_id=1`, // Admin messages
        `${API_BASE_URL}/new-messages/${user1Id}?sender_id=1`, // Admin messages
      ];

      console.log("🔗 [chatService] Fetching from multiple URLs:", urls);

      // Fetch from all URLs and combine results
      const allMessages: ApiMessage[] = [];
      const messageIds = new Set<number>(); // To avoid duplicates

      for (const url of urls) {
        try {
          console.log("🔗 [chatService] Fetching from:", url);
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
              "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
              "X-Authorization-Secret":
                process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
            },
          });

          if (response.ok) {
            const data: ApiMessage[] = await response.json();
            console.log(
              `📄 [chatService] Got ${data.length} messages from ${url}`
            );

            // Add unique messages only
            data.forEach((msg) => {
              if (!messageIds.has(msg.id)) {
                messageIds.add(msg.id);
                allMessages.push(msg);
              }
            });
          } else {
            console.warn(
              `⚠️ [chatService] Failed to fetch from ${url}: ${response.status}`
            );
          }
        } catch (error) {
          console.warn(`⚠️ [chatService] Error fetching from ${url}:`, error);
        }
      }

      console.log(
        "📄 [chatService] Total unique messages:",
        allMessages.length
      );
      console.log("📄 [chatService] Sample message:", allMessages[0]);

      // Sort messages by timestamp
      allMessages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const mappedMessages: Message[] = allMessages.map((msg) => {
        // Determine sender name and type
        let senderName: string;
        let senderType: "admin" | "center" | "parent";

        // Check if this is an admin message first
        if (msg.is_admin_message || msg.sender_id.toString() === "1") {
          senderName = "Admin";
          senderType = "admin";
        } else if (msg.sender_id.toString() === user1Id) {
          senderName = user1Name;
          senderType = user1Name.toLowerCase().includes("admin")
            ? "admin"
            : user1Name.toLowerCase().includes("center")
            ? "center"
            : "parent";
        } else if (msg.sender_id.toString() === user2Id) {
          senderName = user2Name;
          senderType = user2Name.toLowerCase().includes("admin")
            ? "admin"
            : user2Name.toLowerCase().includes("center")
            ? "center"
            : "parent";
        } else {
          // Fallback for unknown senders
          senderName = `User ${msg.sender_id}`;
          senderType = "parent";
        }

        return {
          id: msg.id.toString(),
          content: msg.message,
          senderId: msg.sender_id.toString(),
          senderName,
          senderType,
          timestamp: new Date(msg.created_at),
          chatId: conversationId,
          imageUrl: msg.image_url,
          videoUrl: msg.video_url_path,
        };
      });

      console.log(
        "📄 [chatService] Mapped messages sample:",
        mappedMessages[0]
      );
      console.log(
        "📄 [chatService] Latest message:",
        mappedMessages[mappedMessages.length - 1]
      );
      console.log(
        "📄 [chatService] Admin messages count:",
        mappedMessages.filter((msg) => msg.senderType === "admin").length
      );
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
