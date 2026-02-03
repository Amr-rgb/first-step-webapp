import { ChatListItem, Message } from "@/components/dashboard/chat/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://development.firststep-app.com/api";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequestsPerSecond: 5, // Limit to 5 requests per second
  requestQueue: [] as Array<() => Promise<any>>,
  isProcessing: false,
  lastRequestTime: 0,
};

// Rate-limited fetch wrapper
const rateLimitedFetch = async (url: string, options: RequestInit): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      try {
        const now = Date.now();
        const timeSinceLastRequest = now - RATE_LIMIT_CONFIG.lastRequestTime;
        const minInterval = 1000 / RATE_LIMIT_CONFIG.maxRequestsPerSecond; // 200ms between requests

        if (timeSinceLastRequest < minInterval) {
          const delay = minInterval - timeSinceLastRequest;
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        RATE_LIMIT_CONFIG.lastRequestTime = Date.now();
        const response = await fetch(url, options);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    };

    RATE_LIMIT_CONFIG.requestQueue.push(executeRequest);
    processRequestQueue();
  });
};

// Process the request queue
const processRequestQueue = async () => {
  if (RATE_LIMIT_CONFIG.isProcessing || RATE_LIMIT_CONFIG.requestQueue.length === 0) {
    return;
  }

  RATE_LIMIT_CONFIG.isProcessing = true;

  while (RATE_LIMIT_CONFIG.requestQueue.length > 0) {
    const request = RATE_LIMIT_CONFIG.requestQueue.shift();
    if (request) {
      try {
        await request();
      } catch (error) {
        console.error("Rate-limited request failed:", error);
      }
    }
  }

  RATE_LIMIT_CONFIG.isProcessing = false;
};

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
  currentUserType: "center" | "parent" | "admin",
  currentUserName?: string
): Message => ({
  id: apiMessage.id.toString(),
  content: apiMessage.message,
  senderId: apiMessage.sender_id.toString(),
  senderName: apiMessage.sender_id.toString() === currentUserId 
    ? (currentUserName || (currentUserType === "admin" ? "Admin" : currentUserType === "center" ? "Center" : "Parent"))
    : "Unknown User", // This will be updated with actual names when available
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
  // Handle new API format from /new-chat-contacts endpoint
  if (apiContact.contact_id && apiContact.contact && apiContact.latest_message) {
    return {
      id: apiContact.contact_id.toString(),
      name: apiContact.contact.name,
      type:
        apiContact.contact_id.toString() === currentUserId
          ? currentUserType
          : currentUserType === "center"
          ? "parent"
          : "center",
      lastMessage: apiContact.latest_message?.text || "",
      timestamp: apiContact.latest_message?.created_at 
        ? new Date(apiContact.latest_message.created_at) 
        : new Date(),
      unreadCount: apiContact.unread_count || 0,
      isOnline: apiContact.is_online === 1,
      avatar: apiContact.contact.avatar || undefined,
      email: apiContact.contact.email,
    };
  }

  // Handle direct user object format
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

  // Handle old API format (with contact property but no latest_message)
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

// Utility function to find the actual last message by timestamp
const getLastMessage = (messages: Message[]): Message | null => {
  if (messages.length === 0) return null;
  
  // Sort messages by timestamp and return the most recent one
  const sortedMessages = [...messages].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  return sortedMessages[0];
};

// Helper function to update sender names with proper names
const updateSenderNames = (messages: Message[], currentUserId: string, currentUserType: "center" | "parent" | "admin", contactName?: string, currentUserName?: string) => {
  messages.forEach(message => {
    if (message.senderId === currentUserId) {
      // Current user's message - use actual user name
      if (currentUserType === "admin") {
        message.senderName = "Admin";
      } else if (currentUserName) {
        message.senderName = currentUserName;
      } else {
        message.senderName = currentUserType === "center" ? "Center" : "Parent";
      }
    } else {
      // Other user's message - use contact name if available
      if (message.senderType === "admin") {
        message.senderName = "Admin";
      } else if (contactName) {
        message.senderName = contactName;
      } else if (message.senderType === "center") {
        message.senderName = "Center";
      } else {
        message.senderName = "Parent";
      }
    }
  });
};

export const chatService = {
  // Get all center parents (contacts for centers to chat with)
  async getCenterParents(authToken: string): Promise<ApiParent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/center/parents`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
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
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
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

      const response = await rateLimitedFetch(`${API_BASE_URL}/new-chat-contacts`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
        },
      });

      console.log("📡 [chatService] Response status:", response.status);
      console.log("📡 [chatService] Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Response error:", errorText);
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          console.warn("⚠️ [chatService] Rate limited - will retry with delay");
          // Wait a bit longer and retry once
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.getChatContacts(authToken, currentUserId, currentUserType);
        }
        
        throw new Error("Failed to fetch chat contacts");
      }

      const data: any[] = await response.json(); // Changed to any[] to handle new format
      console.log("📄 [chatService] Raw API response:", data);

      const mappedContacts = data.map((contact) =>
        mapApiContactToChatListItem(contact, currentUserId, currentUserType)
      );

      // Sort contacts by last message timestamp (most recent first)
      // For now, we'll sort by name since we don't have last message data yet
      // This will be updated when messages are loaded
      mappedContacts.sort((a, b) => {
        // If both have timestamps, sort by timestamp (most recent first)
        if (a.timestamp && b.timestamp) {
          return b.timestamp.getTime() - a.timestamp.getTime();
        }
        // Otherwise, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });

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
    senderId?: string,
    contactName?: string,
    currentUserName?: string
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

      const response = await rateLimitedFetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
        },
      });

      console.log("📡 [chatService] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Error:", errorText);
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          console.warn("⚠️ [chatService] Rate limited - will retry with delay");
          // Wait a bit longer and retry once
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.getMessages(contactId, authToken, currentUserId, currentUserType, senderId, undefined, undefined);
        }
        
        throw new Error("Failed to fetch messages");
      }

      const data: ApiMessage[] = await response.json();
      console.log("📄 [chatService] Messages count:", data.length);

      const mappedMessages = data.map((msg) =>
        mapApiMessageToMessage(msg, currentUserId, currentUserType, currentUserName)
      );

      // Sort messages by timestamp to ensure proper ordering
      mappedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Update sender names with proper names
      updateSenderNames(mappedMessages, currentUserId, currentUserType, contactName, currentUserName);

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
    videoUrl?: string,
    currentUserName?: string
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
            "X-Authorization": process.env.X_AUTHORIZATION || "",
            "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
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
              senderName: currentUserName || (currentUserType === "center" ? "Center" : "Parent"),
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
          currentUserType,
          currentUserName
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
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
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

  async markAsRead(messageId: string, authToken: string, senderId?: string, retryCount: number = 0): Promise<void> {
    try {
      console.log("📖 [chatService] Marking message as read:", messageId, "sender:", senderId);
      
      // Prepare request body - include sender_id if provided
      const requestBody: any = { message_id: messageId };
      if (senderId) {
        requestBody.sender_id = senderId;
      }
      
      const response = await rateLimitedFetch(`${API_BASE_URL}/new-chat/mark-as-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📖 [chatService] Mark as read response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [chatService] Mark as read error:", errorText);
        
        // Handle rate limiting with exponential backoff
        if (response.status === 429 && retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.warn(`⚠️ [chatService] Rate limited on mark as read - retrying in ${delay}ms (attempt ${retryCount + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.markAsRead(messageId, authToken, senderId, retryCount + 1);
        }
        
        if (response.status === 429) {
          console.warn("⚠️ [chatService] Rate limited on mark as read - max retries reached, skipping");
          return; // Skip after max retries
        }
        
        // Handle validation errors (422) - log and skip
        if (response.status === 422) {
          console.warn("⚠️ [chatService] Validation error on mark as read - skipping this message:", errorText);
          return; // Skip validation errors to avoid blocking other messages
        }
        
        throw new Error("Failed to mark message as read");
      }

      console.log("✅ [chatService] Message marked as read successfully");
    } catch (error) {
      console.error("❌ [chatService] Error marking message as read:", error);
      throw error;
    }
  },

  // Mark multiple messages as read (for when entering a chat)
  async markMultipleAsRead(messagesToMark: Array<{id: string, senderId: string}>, authToken: string): Promise<void> {
    if (messagesToMark.length === 0) {
      console.log("📖 [chatService] No messages to mark as read");
      return;
    }

    try {
      console.log("📖 [chatService] Marking multiple messages as read:", messagesToMark.length);
      
      // Limit concurrent requests to avoid rate limiting
      const BATCH_SIZE = 3; // Process 3 messages at a time
      const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches

      for (let i = 0; i < messagesToMark.length; i += BATCH_SIZE) {
        const batch = messagesToMark.slice(i, i + BATCH_SIZE);
        console.log(`📖 [chatService] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(messagesToMark.length / BATCH_SIZE)}`);
        
        const promises = batch.map(message => 
          this.markAsRead(message.id, authToken, message.senderId).catch(error => {
            console.warn(`⚠️ [chatService] Failed to mark message ${message.id} as read:`, error);
            // Don't throw here to avoid stopping other messages from being marked
          })
        );

        await Promise.all(promises);

        // Add delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < messagesToMark.length) {
          console.log(`📖 [chatService] Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      console.log("✅ [chatService] All messages processed");
    } catch (error) {
      console.error("❌ [chatService] Error marking multiple messages as read:", error);
      throw error;
    }
  },

  // Mark all unread messages in a chat as read (OPTIMIZED VERSION)
  async markChatAsRead(chatId: string, authToken: string, currentUserId: string, currentUserType: "center" | "parent" | "admin"): Promise<void> {
    try {
      console.log("📖 [chatService] Marking entire chat as read:", chatId);
      
      // Get all messages in the chat
      const messages = await this.getMessages(chatId, authToken, currentUserId, currentUserType, undefined, undefined, undefined);
      
      // Filter messages that are not from the current user (only mark received messages as read)
      // Focus on recent unread messages to avoid overwhelming the API
      const recentCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours (increased from 7 days)
      const messagesToMarkAsRead = messages
        .filter(message => 
          message.senderId !== currentUserId && 
          message.timestamp > recentCutoff // Only mark recent messages
        )
        .slice(-20) // Increased from 10 to 20 messages to catch more unread messages
        .map(message => ({ id: message.id, senderId: message.senderId }));

      if (messagesToMarkAsRead.length > 0) {
        console.log(`📖 [chatService] Marking ${messagesToMarkAsRead.length} recent messages as read`);
        await this.markMultipleAsRead(messagesToMarkAsRead, authToken);
        console.log(`✅ [chatService] Marked ${messagesToMarkAsRead.length} messages as read in chat ${chatId}`);
      } else {
        console.log("📖 [chatService] No recent messages to mark as read in chat", chatId);
      }
    } catch (error) {
      console.error("❌ [chatService] Error marking chat as read:", error);
      // Don't throw here as this is not critical functionality
      console.warn("⚠️ [chatService] Continuing despite mark-as-read error");
    }
  },

  // Mark only the most recent unread messages (for immediate feedback)
  async markRecentMessagesAsRead(chatId: string, authToken: string, currentUserId: string, currentUserType: "center" | "parent" | "admin"): Promise<void> {
    try {
      console.log("📖 [chatService] Marking recent messages as read for immediate feedback:", chatId);
      
      // Get all messages in the chat
      const messages = await this.getMessages(chatId, authToken, currentUserId, currentUserType, undefined, undefined, undefined);
      
      // Only mark the last 5 messages that are not from current user
      const messagesToMark = messages
        .filter(message => message.senderId !== currentUserId)
        .slice(-5) // Only last 5 messages for immediate feedback
        .map(message => ({ id: message.id, senderId: message.senderId }));

      if (messagesToMark.length > 0) {
        console.log(`📖 [chatService] Marking ${messagesToMark.length} most recent messages as read`);
        // Mark them individually with small delays to avoid rate limiting
        for (const message of messagesToMark) {
          try {
            await this.markAsRead(message.id, authToken, message.senderId);
            // Small delay between each message
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            console.warn(`⚠️ [chatService] Failed to mark message ${message.id} as read:`, error);
            // Continue with other messages
          }
        }
        console.log(`✅ [chatService] Marked recent messages as read in chat ${chatId}`);
      } else {
        console.log("📖 [chatService] No recent messages to mark as read in chat", chatId);
      }
    } catch (error) {
      console.error("❌ [chatService] Error marking recent messages as read:", error);
      // Don't throw here as this is not critical functionality
      console.warn("⚠️ [chatService] Continuing despite mark-as-read error");
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

      const response = await rateLimitedFetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
        },
      });

      console.log(
        `📡 [chatService] Online status response: ${response.status}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [chatService] Online status error: ${errorText}`);

        // Handle rate limiting specifically
        if (response.status === 429) {
          console.warn(
            `⚠️ [chatService] Rate limited on online status - will skip this update`
          );
          return; // Don't retry online status updates
        }

        console.warn(
          `⚠️ [chatService] Online status update failed, but continuing...`
        );
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
          "X-Authorization": process.env.X_AUTHORIZATION || "",
          "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
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

      // Sort conversations by last message timestamp (most recent first)
      mappedConversations.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return b.timestamp.getTime() - a.timestamp.getTime();
        }
        return 0;
      });

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
            "X-Authorization": process.env.X_AUTHORIZATION || "",
            "X-Authorization-Secret": process.env.X_AUTHORIZATION_SECRET || "",
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
              "X-Authorization": process.env.X_AUTHORIZATION || "",
              "X-Authorization-Secret":
                process.env.X_AUTHORIZATION_SECRET || "",
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
// Export utility functions
export const chatUtils = {
  getLastMessage,
  sortMessagesByTimestamp: (messages: Message[]): Message[] => {
    return [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },
  sortChatsByLastMessage: (chats: ChatListItem[]): ChatListItem[] => {
    return [...chats].sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return a.name.localeCompare(b.name);
    });
  }
};