"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toastError } from "@/lib/toast";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";
import { chatService, chatUtils } from "@/services/chatService";
import { pusherService } from "@/services/pusherService";
import { useAuthStore } from "@/store/authStore";

const AdminChatPage = () => {
  const meta = usePageMetadata();

  const { user, token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const currentUser: User = {
    id: user?.id?.toString() || "",
    name: user?.name || "Admin User",
    type: "admin",
    email: user?.email || "",
  };

  // Fetch admin conversations
  const fetchAdminConversations = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);

      console.log("🔍 Fetching admin conversations...");
      console.log("📋 Current user:", {
        id: currentUser.id,
        type: currentUser.type,
      });

      const conversations = await chatService.getAdminConversations(token);

      // Only log when conversations are loaded initially
      if (conversations.length > 0) {
        console.log(
          "📞 [AdminChat] Loaded conversations:",
          conversations.length
        );
      }
      setChats(conversations);

      // Only auto-select first conversation on large screens (lg and up - 1024px+)
      // On mobile/tablet, let users choose from the conversation list
      if (
        conversations.length > 0 &&
        !selectedChatId &&
        window.innerWidth >= 1024
      ) {
        console.log(
          "🎯 Auto-selecting first conversation:",
          conversations[0].id
        );
        setSelectedChatId(conversations[0].id);
      }
    } catch (error) {
      console.error("❌ Error fetching admin conversations:", error);
      toastError("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId, token]);

  // Fetch messages for the selected conversation
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId || !token) return;

    try {
      setIsLoading(true);

      console.log(
        "🔍 [AdminChat] Fetching messages for conversation:",
        selectedChatId
      );

      // Use the dedicated admin method for fetching conversation messages
      const conversationMessages =
        await chatService.getAdminConversationMessages(selectedChatId, token);

      setMessages(conversationMessages);

      // For admin, we don't mark messages as read since admin is just viewing
      // But we can still reset unread count in the UI for better UX
      
      // Update last message in conversations list and reset unread count
      if (conversationMessages.length > 0) {
        // Use utility function to get the actual last message by timestamp
        const lastMessage = chatUtils.getLastMessage(conversationMessages);
        if (lastMessage) {
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) =>
              chat.id === selectedChatId
                ? {
                    ...chat,
                    lastMessage: lastMessage.content,
                    timestamp: lastMessage.timestamp,
                    unreadCount: 0, // Reset unread count for admin view
                  }
                : chat
            );
            // Sort chats by last message timestamp
            return chatUtils.sortChatsByLastMessage(updatedChats);
          });
        }
      } else {
        console.log("📭 [AdminChat] No messages found");
        // Even if no messages, reset unread count for this conversation
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat.id === selectedChatId
              ? { ...chat, unreadCount: 0 }
              : chat
          );
          return chatUtils.sortChatsByLastMessage(updatedChats);
        });
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      toastError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId, token]);

  // Update online status when component mounts/unmounts
  useEffect(() => {
    let keepAliveInterval: NodeJS.Timeout;

    const updateStatus = async (isOnline: boolean) => {
      try {
        if (!token) return;

        await chatService.updateOnlineStatus(isOnline, token);
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    // Set online
    updateStatus(true);

    // Set up interval to keep alive (every 2 minutes instead of 30 seconds to avoid rate limiting)
    keepAliveInterval = setInterval(() => {
      updateStatus(true);
    }, 120000); // 2 minutes

    // Set up beforeunload to set offline
    const handleBeforeUnload = () => {
      updateStatus(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(keepAliveInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateStatus(false);
      // Disconnect Pusher when component unmounts
      pusherService.disconnect();
    };
  }, [token]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated()) {
      fetchAdminConversations();
    } else {
      router.push("/sign-in");
    }
  }, [isAuthenticated, fetchAdminConversations, router]);

  // Load messages when selected chat changes
  useEffect(() => {
    // Only log when a chat is actually selected
    if (selectedChatId) {
      console.log("🔄 [AdminChat] Chat selected:", selectedChatId);
    }
    if (selectedChatId) {
      fetchMessages();
    } else {
      console.log("⚠️ [AdminChat] No selectedChatId, skipping fetchMessages");
    }
  }, [selectedChatId, fetchMessages]);

  // Set up Pusher real-time messaging for admin conversations
  useEffect(() => {
    if (!currentUser.id) return;

    console.log("🔧 Setting up Pusher for admin conversations");

    // Initialize Pusher
    pusherService.initialize();

    // Subscribe to admin conversations channel
    pusherService.subscribeToAdminConversations({
      onNewMessage: (message) => {
        console.log("📨 Admin conversations new message:", message);

        const newMessage: Message = {
          id: message.id.toString(),
          content: message.message,
          senderId: message.sender_id.toString(),
          senderName: message.sender_name || "User",

          senderType:
            message.sender_name === "center"
              ? "center"
              : message.sender_name === "Admin user"
              ? "admin"
              : "parent",
          timestamp: new Date(message.created_at),
          chatId: `${message.sender_id}-${message.receiver_id}`,
          imageUrl: message.image,
          videoUrl: message.video_url,
        };

        // Determine the conversation ID - it could be either direction
        const conversationId1 = `${message.sender_id}-${message.receiver_id}`;
        const conversationId2 = `${message.receiver_id}-${message.sender_id}`;

        // Check if this message belongs to the currently selected conversation
        if (
          selectedChatId === conversationId1 ||
          selectedChatId === conversationId2
        ) {
          setMessages((prev) => {
            const newMessages = [...prev, newMessage];
            // Sort messages by timestamp to ensure proper ordering
            return chatUtils.sortMessagesByTimestamp(newMessages);
          });
        }

        // Update last message in conversations list for both possible conversation IDs
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat.id === conversationId1 || chat.id === conversationId2
              ? {
                  ...chat,
                  lastMessage: newMessage.content,
                  timestamp: newMessage.timestamp,
                }
              : chat
          );
          // Sort chats by last message timestamp
          return chatUtils.sortChatsByLastMessage(updatedChats);
        });
      },
      onConversationUpdate: (conversationData) => {
        console.log("📋 Admin conversations update:", conversationData);
        // Refresh conversations when updated
        fetchAdminConversations();
      },
    });

    // Subscribe to specific chat channel for real-time messages in the selected conversation
    if (selectedChatId) {
      // Extract user IDs from conversation ID (format: "user1-user2")
      const [user1Id, user2Id] = selectedChatId.split("-");

      // Subscribe to both possible chat channels
      pusherService.subscribeToSpecificChat(user1Id, {
        onNewMessage: (message) => {
          console.log("📨 Admin specific chat new message (user1):", message);

          const newMessage: Message = {
            id: message.id?.toString() || Date.now().toString(),
            content: message.message,
            senderId: message.sender_id.toString(),
            senderName: message.sender_name || "User",
            senderType: message.sender_name === "center" ? "center" : "parent",
            timestamp: new Date(message.created_at),
            chatId: selectedChatId,
            imageUrl: message.image_url,
            videoUrl: message.video_url,
          };

          setMessages((prev) => {
            const newMessages = [...prev, newMessage];
            // Sort messages by timestamp to ensure proper ordering
            return chatUtils.sortMessagesByTimestamp(newMessages);
          });

          // Update last message in conversations list
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) =>
              chat.id === selectedChatId
                ? {
                    ...chat,
                    lastMessage: newMessage.content,
                    timestamp: newMessage.timestamp,
                  }
                : chat
            );
            // Sort chats by last message timestamp
            return chatUtils.sortChatsByLastMessage(updatedChats);
          });
        },
      });

      pusherService.subscribeToSpecificChat(user2Id, {
        onNewMessage: (message) => {
          console.log("📨 Admin specific chat new message (user2):", message);

          const newMessage: Message = {
            id: message.id?.toString() || Date.now().toString(),
            content: message.message,
            senderId: message.sender_id.toString(),
            senderName: message.sender_name || "User",
            senderType: message.sender_name === "center" ? "center" : "parent",
            timestamp: new Date(message.created_at),
            chatId: selectedChatId,
            imageUrl: message.image_url,
            videoUrl: message.video_url,
          };

          setMessages((prev) => {
            const newMessages = [...prev, newMessage];
            // Sort messages by timestamp to ensure proper ordering
            return chatUtils.sortMessagesByTimestamp(newMessages);
          });

          // Update last message in conversations list
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) =>
              chat.id === selectedChatId
                ? {
                    ...chat,
                    lastMessage: newMessage.content,
                    timestamp: newMessage.timestamp,
                  }
                : chat
            );
            // Sort chats by last message timestamp
            return chatUtils.sortChatsByLastMessage(updatedChats);
          });
        },
      });
    }

    // Subscribe to global user status
    pusherService.subscribeToUserStatus({
      onUserOnline: (userId) => {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            // Check if the user is a participant in this conversation
            const isParticipant = chat.participants?.some(
              (p) => p.id === userId
            );
            return isParticipant ? { ...chat, isOnline: true } : chat;
          })
        );
      },
      onUserOffline: (userId) => {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            // Check if the user is a participant in this conversation
            const isParticipant = chat.participants?.some(
              (p) => p.id === userId
            );
            return isParticipant ? { ...chat, isOnline: false } : chat;
          })
        );
      },
    });

    // Cleanup on component unmount
    return () => {
      pusherService.unsubscribeFromAdminConversations();
      pusherService.unsubscribeFromUserStatus();

      // Unsubscribe from specific chat channels if they exist
      if (selectedChatId) {
        const [user1Id, user2Id] = selectedChatId.split("-");
        pusherService.unsubscribeFromSpecificChat(user1Id);
        pusherService.unsubscribeFromSpecificChat(user2Id);
      }
    };
  }, [currentUser.id, selectedChatId, fetchAdminConversations]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    
    // For admin, just reset the unread count in the UI (admin doesn't mark messages as read)
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      );
      return chatUtils.sortChatsByLastMessage(updatedChats);
    });
  };

  const handleBackToChats = () => {
    setSelectedChatId(null);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId || !content.trim() || !token || !currentUser.id) return;

    console.log("📤 Admin sending message:", {
      content,
      selectedChatId,
      currentUser: currentUser.id,
    });

    try {
      setIsSending(true);

      const newMessage = await chatService.sendAdminMessage(
        selectedChatId,
        content,
        token,
        currentUser.id
      );

      console.log("📤 Admin message sent successfully:", newMessage);
      console.log("📤 Current messages before adding:", messages.length);

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        console.log("📤 Messages after adding:", updated.length);
        // Sort messages by timestamp to ensure proper ordering
        return chatUtils.sortMessagesByTimestamp(updated);
      });

      // Verify the message was actually saved by fetching messages again
      console.log("🔍 [AdminChat] Verifying message persistence...");
      try {
        const verificationMessages =
          await chatService.getAdminConversationMessages(selectedChatId, token);
        console.log(
          "🔍 [AdminChat] Verification - messages after send:",
          verificationMessages.length
        );
        console.log(
          "🔍 [AdminChat] Latest message:",
          verificationMessages[verificationMessages.length - 1]
        );

        // Check if our sent message is in the verification
        const foundMessage = verificationMessages.find(
          (msg) => msg.id === newMessage.id
        );
        if (foundMessage) {
          console.log("✅ [AdminChat] Message verified in database!");
        } else {
          console.warn(
            "⚠️ [AdminChat] Message not found in database verification"
          );
        }
      } catch (error) {
        console.error("❌ [AdminChat] Verification failed:", error);
      }

      // Update last message in conversations list
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage: newMessage.content,
                timestamp: newMessage.timestamp,
              }
            : chat
        );
        // Sort chats by last message timestamp
        return chatUtils.sortChatsByLastMessage(updatedChats);
      });

      console.log("📤 Message added to UI successfully");
    } catch (error) {
      console.error("❌ Error sending admin message:", error);
      toastError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-gray-50 rounded-lg shadow-sm">
      {/* Sidebar - Hidden on mobile/tablet when chat is selected, overlay on larger screens */}
      <div
        className={`${
          selectedChatId ? "hidden lg:block" : "block"
        } w-full lg:w-80`}
      >
        <ChatSidebar
          currentUser={currentUser}
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onNewChat={() => {}} // Admin cannot start new chats
        />
      </div>

      {/* Chat Interface - Hidden on mobile/tablet when no chat is selected */}
      <div className={`${selectedChatId ? "block" : "hidden lg:block"} flex-1`}>
        <ChatInterface
          currentUser={currentUser}
          selectedChat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBackToChats={handleBackToChats}
        />
      </div>
    </div>
  );
};

export default AdminChatPage;
