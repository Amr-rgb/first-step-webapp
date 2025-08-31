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

  // Fetch chat contacts
  const fetchChatContacts = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const contacts = await chatService.getChatContacts(
        token,
        user?.id?.toString() || "",
        "admin"
      );
      setChats(contacts);

      // Select the first chat by default if none selected
      if (contacts.length > 0 && !selectedChatId) {
        setSelectedChatId(contacts[0].id);
      }
    } catch (error) {
      console.error("Error fetching chat contacts:", error);
      toast.error("Failed to load chat contacts");
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId, token]);

  // Fetch messages for the selected chat
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId || !token) return;

    try {
      setIsLoading(true);
      const chatMessages = await chatService.getMessages(
        selectedChatId,
        token,
        user?.id?.toString() || "",
        "admin"
      );
      setMessages(chatMessages);

      // Update last message in chats list
      if (chatMessages.length > 0) {
        const lastMessage = chatMessages[chatMessages.length - 1];
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
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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
      fetchChatContacts();
    } else {
      router.push("/sign-in");
    }
  }, [isAuthenticated, fetchChatContacts, router]);

  // Load messages when selected chat changes
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages();
    }
  }, [selectedChatId, fetchMessages]);

  // Set up Pusher real-time messaging for admin
  useEffect(() => {
    if (!currentUser.id) return;

    // Initialize Pusher
    pusherService.initialize();

    // Subscribe to admin chat list channel
    pusherService.subscribeToAdminChatList({
      onChatUpdate: (chatData) => {
        // Update chat list when a chat is updated
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatData.chatId
              ? {
                  ...chat,
                  lastMessage: chatData.lastMessage,
                  timestamp: new Date(chatData.timestamp),
                }
              : chat
          )
        );
      },
      onNewChatCreated: (chatData) => {
        // Add new chat to the list
        const newChatItem: ChatListItem = {
          id: chatData.chatId,
          name: chatData.chatName,
          type: chatData.type || "parent",
          lastMessage: chatData.lastMessage || "",
          timestamp: new Date(chatData.timestamp),
          unreadCount: 1,
          isOnline: chatData.isOnline || false,
        };
        setChats((prev) => [newChatItem, ...prev]);
      },
    });

    // Subscribe to admin chat channel for all messages
    pusherService.subscribeToAdminChat({
      onNewMessage: (message) => {
        const newMessage: Message = {
          id: message.id.toString(),
          content: message.message,
          senderId: message.sender_id.toString(),
          senderName: message.sender_name || "User",
          senderType: message.sender_type || "parent",
          timestamp: new Date(message.created_at),
          chatId: message.receiver_id?.toString() || selectedChatId || "",
          imageUrl: message.image_url,
          videoUrl: message.video_url_path,
        };

        // Add message if it's for the currently selected chat
        if (
          selectedChatId &&
          (message.receiver_id?.toString() === selectedChatId ||
            message.sender_id?.toString() === selectedChatId)
        ) {
          setMessages((prev) => [...prev, newMessage]);
        }

        // Update last message in chats list
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === message.sender_id?.toString() ||
            chat.id === message.receiver_id?.toString()
              ? {
                  ...chat,
                  lastMessage: newMessage.content,
                  timestamp: newMessage.timestamp,
                  unreadCount:
                    chat.id === selectedChatId ? 0 : chat.unreadCount + 1,
                }
              : chat
          )
        );
      },
    });

    // Subscribe to global user status
    pusherService.subscribeToUserStatus({
      onUserOnline: (userId) => {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === userId ? { ...chat, isOnline: true } : chat
          )
        );
      },
      onUserOffline: (userId) => {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === userId ? { ...chat, isOnline: false } : chat
          )
        );
      },
    });

    // Cleanup on component unmount
    return () => {
      pusherService.unsubscribeFromAdminChatList();
      pusherService.unsubscribeFromAdminChat();
      pusherService.unsubscribeFromUserStatus();
    };
  }, [currentUser.id, selectedChatId]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId || !content.trim() || !token) return;

    try {
      setIsSending(true);

      const newMessage = await chatService.sendMessage(
        selectedChatId,
        content,
        token,
        user?.id?.toString() || "",
        "admin"
      );

      setMessages((prev) => [...prev, newMessage]);

      // Update last message in chats list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage: newMessage.content,
                timestamp: newMessage.timestamp,
                unreadCount: 0, // Reset unread count
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-gray-50 rounded-lg shadow-sm">
      <ChatSidebar
        currentUser={currentUser}
        chats={chats}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect}
        onNewChat={() => {}} // Admin cannot start new chats
      />
      <ChatInterface
        currentUser={currentUser}
        selectedChat={selectedChat}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default AdminChatPage;
