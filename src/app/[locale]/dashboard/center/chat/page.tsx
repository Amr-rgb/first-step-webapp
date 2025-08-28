"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";
import { chatService } from "@/services/chatService";
import { pusherService } from "@/services/pusherService";
import { useAuthStore } from "@/store/authStore";

const CenterChatPage = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const currentUser: User = {
    id: user?.id?.toString() || "",
    name: user?.name || "Center User",
    type: "center",
    email: user?.email || "",
    avatar: "/assets/logos/center-logo.png",
  };

  // Fetch chat contacts
  const fetchChatContacts = useCallback(async () => {
    if (!token || !currentUser.id) return;

    try {
      setIsLoading(true);
      const contacts = await chatService.getChatContacts(
        token,
        currentUser.id,
        currentUser.type
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
  }, [selectedChatId, token, currentUser.id, currentUser.type]);

  // Fetch messages for the selected chat
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId || !token || !currentUser.id) return;

    try {
      setIsLoading(true);
      const chatMessages = await chatService.getMessages(
        selectedChatId,
        token,
        currentUser.id,
        currentUser.type
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
  }, [selectedChatId, token, currentUser.id, currentUser.type]);

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

  // Set up Pusher real-time messaging
  useEffect(() => {
    if (!selectedChatId || !currentUser.id) return;

    // Initialize Pusher
    pusherService.initialize();

    // Subscribe to chat channel for real-time messages
    pusherService.subscribeToChat(selectedChatId, {
      onNewMessage: (message) => {
        // Only add message if it's not from current user (to avoid duplicates)
        if (message.sender_id.toString() !== currentUser.id) {
          const newMessage: Message = {
            id: message.id.toString(),
            content: message.message,
            senderId: message.sender_id.toString(),
            senderName: message.sender_name || "User",
            senderType:
              message.sender_id.toString() === currentUser.id
                ? "center"
                : "parent",
            timestamp: new Date(message.created_at),
            chatId: selectedChatId,
            imageUrl: message.image_url,
            videoUrl: message.video_url_path,
          };

          setMessages((prev) => [...prev, newMessage]);

          // Update last message in chats list
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === selectedChatId
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
        }
      },
      onUserOnline: (userId: string) => {
        // Update user online status
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === userId ? { ...chat, isOnline: true } : chat
          )
        );
      },
      onUserOffline: (userId: string) => {
        // Update user offline status
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === userId ? { ...chat, isOnline: false } : chat
          )
        );
      },
    });

    // Subscribe to user status updates
    pusherService.subscribeToUserStatus({
      onUserOnline: (userId: string) => {
        // Update user online status
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === userId ? { ...chat, isOnline: true } : chat
          )
        );
      },
      onUserOffline: (userId: string) => {
        // Update user offline status
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === userId ? { ...chat, isOnline: false } : chat
          )
        );
      },
    });

    // Cleanup on component unmount or chat change
    return () => {
      pusherService.unsubscribeFromChat(selectedChatId);
      pusherService.unsubscribeFromUserStatus();
    };
  }, [selectedChatId, currentUser.id]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId || !content.trim() || !token || !currentUser.id) return;

    try {
      setIsSending(true);

      const newMessage = await chatService.sendMessage(
        selectedChatId,
        content,
        token,
        currentUser.id,
        currentUser.type
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

  const handleNewChat = async (participantId: string) => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Check if chat already exists
      const existingChat = chats.find((chat) => chat.id === participantId);
      if (existingChat) {
        setSelectedChatId(participantId);
        return;
      }

      // Create new chat entry for immediate UI feedback
      const newChatItem: ChatListItem = {
        id: participantId,
        name: "New Chat", // This will be updated when we fetch the actual contact info
        type: "parent",
        lastMessage: "",
        timestamp: new Date(),
        unreadCount: 0,
        isOnline: false,
      };

      setChats((prev) => [...prev, newChatItem]);
      setSelectedChatId(participantId);
      setMessages([]); // Start with empty messages

      toast.success("New chat started!");
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to create a new chat");
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
        onNewChat={handleNewChat}
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

export default CenterChatPage;
