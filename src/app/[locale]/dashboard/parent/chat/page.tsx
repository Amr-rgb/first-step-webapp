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

const ParentChatPage = () => {
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
    name: user?.name || "Parent User",
    type: "parent",
    email: user?.email || "",
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

  // Set up Pusher real-time messaging for parent
  useEffect(() => {
    if (!selectedChatId || !currentUser.id) return;

    console.log(
      "🔧 Setting up Pusher for chat:",
      selectedChatId,
      "user:",
      currentUser.id
    );

    // Initialize Pusher
    pusherService.initialize();

    // Subscribe to current user's chat list updates
    pusherService.subscribeToChatList(currentUser.id, {
      onChatUpdate: (chatData) => {

        console.log("📋 Processing chat list update:", chatData);
        // The data structure is different - it contains contacts array
        if (chatData.contacts && Array.isArray(chatData.contacts)) {
          const updatedChats = chatData.contacts.map((contact: any) => ({
            id: contact.contact_id.toString(),
            name: contact.contact.name,
            type: "center",
            lastMessage: contact.latest_message?.text || "",
            timestamp: new Date(
              contact.latest_message?.created_at || Date.now()
            ),
            unreadCount: contact.unread_count || 0,
            isOnline: contact.is_online === 1,
          }));
          console.log("📋 Updating chats with:", updatedChats);
          setChats(updatedChats);
        }
      },
      onNewChatCreated: (chatData) => {
        const newChatItem: ChatListItem = {
          id: chatData.chatId,
          name: chatData.chatName,
          type: "center",
          lastMessage: chatData.lastMessage || "",
          timestamp: new Date(chatData.timestamp),
          unreadCount: 1,
          isOnline: chatData.isOnline || false,
        };
        setChats((prev) => [newChatItem, ...prev]);
      },
    });

    // Subscribe to chat channel for real-time messages
    console.log("🔧 Subscribing to user's own channel:", currentUser.id);
    pusherService.subscribeToChat(currentUser.id, {
      onNewMessage: (message) => {
        console.log("📨 Processing new message from user channel:", message);
        console.log(
          "📨 Message sender_id:",
          message.sender_id,
          "Current user ID:",
          currentUser.id
        );
        console.log(
          "📨 Comparison result:",
          message.sender_id.toString() !== currentUser.id
        );

        // Only add message if it's not from current user (to avoid duplicates)
        if (message.sender_id.toString() !== currentUser.id) {
          const newMessage: Message = {
            id: Date.now().toString(), // Generate temporary ID since message.id doesn't exist
            content: message.message,
            senderId: message.sender_id.toString(),

            senderName: "Center", // Default name since sender_name doesn't exist
            senderType: "center",
            timestamp: new Date(message.created_at),
            chatId: selectedChatId,
            imageUrl: message.image_url,
            videoUrl: message.video_url,
          };

          console.log("📨 Adding new message to state:", newMessage);
          setMessages((prev) => {
            console.log("📨 Previous messages count:", prev.length);
            const newMessages = [...prev, newMessage];
            console.log("📨 New messages count:", newMessages.length);
            return newMessages;
          });

          // Update last message in chats list
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === message.sender_id.toString()
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
        } else {
          console.log("📨 Message from current user, skipping");
        }
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

    // Cleanup on component unmount or chat change
    return () => {
      console.log(
        "🔧 Cleaning up Pusher subscriptions for chat:",
        selectedChatId
      );
      pusherService.unsubscribeFromChat(currentUser.id);
      pusherService.unsubscribeFromChatList(currentUser.id);
      pusherService.unsubscribeFromUserStatus();
    };
  }, [selectedChatId, currentUser.id]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleBackToChats = () => {
    setSelectedChatId(null);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId || !content.trim() || !token || !currentUser.id) return;

    console.log("📤 Sending message:", {
      content,
      selectedChatId,
      currentUser: currentUser.id,
    });

    try {
      setIsSending(true);

      const newMessage = await chatService.sendMessage(
        selectedChatId,
        content,
        token,
        currentUser.id,
        currentUser.type
      );

      console.log("📤 Message sent successfully:", newMessage);
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
      console.error("❌ Error sending message:", error);
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
        type: "center",
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
          onNewChat={handleNewChat}
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

export default ParentChatPage;
