"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";
import { chatService } from "@/services/chatService";
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

      // Select the first conversation by default if none selected
      if (conversations.length > 0 && !selectedChatId) {
        console.log(
          "🎯 Auto-selecting first conversation:",
          conversations[0].id
        );
        setSelectedChatId(conversations[0].id);
      }
    } catch (error) {
      console.error("❌ Error fetching admin conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId, token]);

  // Fetch messages for the selected conversation
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId || !token) return;

    try {
      setIsLoading(true);

    

      const conversationMessages =
        await chatService.getAdminConversationMessages(selectedChatId, token);

      setMessages(conversationMessages);

      // Update last message in conversations list
      if (conversationMessages.length > 0) {
        const lastMessage =
          conversationMessages[conversationMessages.length - 1];
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChatId
              ? {
                  ...chat,
                  lastMessage: lastMessage.content,
                  timestamp: lastMessage.timestamp,
                }
              : chat
          )
        );
      } else {
        console.log("📭 [AdminChat] No messages found");
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      toast.error("Failed to load messages");
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

    // Set up interval to keep alive (every 30 seconds)
    keepAliveInterval = setInterval(() => {
      updateStatus(true);
    }, 30000);

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
          setMessages((prev) => [...prev, newMessage]);
        }


        // Update last message in conversations list for both possible conversation IDs
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === conversationId1 || chat.id === conversationId2
              ? {
                  ...chat,
                  lastMessage: newMessage.content,
                  timestamp: newMessage.timestamp,

                }
              : chat
          )
        );
      },
      onConversationUpdate: (conversationData) => {
        console.log("📋 Admin conversations update:", conversationData);
        // Refresh conversations when updated
        fetchAdminConversations();
      },
    });

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
    };
  }, [currentUser.id, selectedChatId, fetchAdminConversations]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };


  const handleBackToChats = () => {
    setSelectedChatId(null);
  };

  const handleSendMessage = async (content: string) => {
    // Admin cannot send messages - they are only viewing conversations
    toast.info("Admin can only view conversations, not send messages");
    return;
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-gray-50 rounded-lg shadow-sm">
      {/* Sidebar - Hidden on mobile when chat is selected */}
      <div
        className={`${
          selectedChatId ? "hidden md:block" : "block"
        } w-full md:w-80`}
      >
        <ChatSidebar
          currentUser={currentUser}
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onNewChat={() => {}} // Admin cannot start new chats
        />
      </div>

      {/* Chat Interface - Hidden on mobile when no chat is selected */}
      <div className={`${selectedChatId ? "block" : "hidden md:block"} flex-1`}>
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
