"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";
import { chatService } from "@/services/chatService";
import ComingSoonOverlay from "@/components/ui/coming-soon-overlay";
import { MessageCircle } from "lucide-react";
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
    if (!token) return;

    try {
      setIsLoading(true);
      const contacts = await chatService.getChatContacts(token);
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
      const chatMessages = await chatService.getMessages(selectedChatId, token);
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
        token
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

      // In a real implementation, you would create a new chat with the participant
      // For now, we'll just select the chat if it exists
      const existingChat = chats.find((chat) => chat.id === participantId);
      if (existingChat) {
        setSelectedChatId(participantId);
      } else {
        // Here you would typically call an API to create a new chat
        // For now, we'll just show an error
        toast.error("Could not start a new chat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to create a new chat");
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  return (
    <div className="relative flex h-[calc(100vh-140px)] overflow-hidden bg-gray-50 rounded-lg shadow-sm">
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

      {/* Coming Soon Overlay */}
      <ComingSoonOverlay
        message="Chat feature is being polished with amazing new capabilities! Stay tuned for seamless communication."
        icon={<MessageCircle className="w-8 h-8 text-blue-400 animate-pulse" />}
        theme="gradient"
        showBlur={true}
      />
    </div>
  );
};

export default CenterChatPage;
