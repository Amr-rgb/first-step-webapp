"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/toast";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";
import { chatService, chatUtils } from "@/services/chatService";
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

      // Only auto-select first chat on large screens (lg and up - 1024px+)
      // On mobile/tablet, let users choose from the chat list
      if (contacts.length > 0 && !selectedChatId && window.innerWidth >= 1024) {
        setSelectedChatId(contacts[0].id);
      }
    } catch (error) {
      console.error("Error fetching chat contacts:", error);
      toastError("Failed to load chat contacts");
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

      // Mark all messages in this chat as read (comprehensive marking)
      await chatService.markChatAsRead(
        selectedChatId,
        token,
        currentUser.id,
        currentUser.type
      );

      // Update last message in chats list and reset unread count
      if (chatMessages.length > 0) {
        // Use utility function to get the actual last message by timestamp
        const lastMessage = chatUtils.getLastMessage(chatMessages);
        if (lastMessage) {
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) =>
              chat.id === selectedChatId
                ? {
                    ...chat,
                    lastMessage: lastMessage.content,
                    timestamp: lastMessage.timestamp,
                    unreadCount: 0, // Reset unread count since we're viewing the chat
                  }
                : chat
            );
            // Sort chats by last message timestamp
            return chatUtils.sortChatsByLastMessage(updatedChats);
          });
        }
      } else {
        // Even if no messages, reset unread count for this chat
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
      console.error("Error fetching messages:", error);
      toastError("Failed to load messages");
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

  // Mark messages as read when user becomes active (tab visibility change)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && selectedChatId && token && currentUser.id) {
        console.log("📖 Tab became visible - marking recent messages as read");
        try {
          await chatService.markRecentMessagesAsRead(selectedChatId, token, currentUser.id, currentUser.type);
          
          // Update unread count in the UI
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) =>
              chat.id === selectedChatId ? { ...chat, unreadCount: 0 } : chat
            );
            return chatUtils.sortChatsByLastMessage(updatedChats);
          });
        } catch (error) {
          console.error("Error marking messages as read on visibility change:", error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedChatId, token, currentUser.id, currentUser.type]);

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

    // Set up periodic mark-as-read for the selected chat
    const markAsReadInterval = setInterval(async () => {
      if (selectedChatId && token && currentUser.id && !document.hidden) {
        console.log("🔄 Periodic mark-as-read check for selected chat");
        try {
          await chatService.markRecentMessagesAsRead(selectedChatId, token, currentUser.id, currentUser.type);
        } catch (error) {
          console.warn("⚠️ Periodic mark-as-read failed:", error);
        }
      }
    }, 30000); // Every 30 seconds for the active chat

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
            // Sort messages by timestamp to ensure proper ordering
            const sortedMessages = chatUtils.sortMessagesByTimestamp(newMessages);
            console.log("📨 New messages count:", sortedMessages.length);
            return sortedMessages;
          });

          // If this message is for the currently selected chat, mark it as read immediately
          if (message.sender_id.toString() === selectedChatId && token) {
            console.log("📖 Marking real-time message as read since chat is open");
            chatService.markAsRead(newMessage.id, token, message.sender_id.toString()).catch(error => {
              console.warn("⚠️ Failed to mark real-time message as read:", error);
            });
          }

          // Update last message in chats list
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) =>
              chat.id === message.sender_id.toString()
                ? {
                    ...chat,
                    lastMessage: newMessage.content,
                    timestamp: newMessage.timestamp,
                    unreadCount:
                      chat.id === selectedChatId ? 0 : chat.unreadCount + 1,
                  }
                : chat
            );
            // Sort chats by last message timestamp
            return chatUtils.sortChatsByLastMessage(updatedChats);
          });
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
      clearInterval(markAsReadInterval);
      pusherService.unsubscribeFromChat(currentUser.id);
      pusherService.unsubscribeFromChatList(currentUser.id);
      pusherService.unsubscribeFromUserStatus();
    };
  }, [selectedChatId, currentUser.id]);

  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
    
    // Update UI immediately for instant feedback
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      );
      return chatUtils.sortChatsByLastMessage(updatedChats);
    });

    // Mark recent messages as read for immediate server-side update
    if (token && currentUser.id) {
      // Use the new function that marks only recent messages quickly
      chatService.markRecentMessagesAsRead(chatId, token, currentUser.id, currentUser.type).catch(error => {
        console.warn("⚠️ Failed to mark recent messages as read:", error);
        // Don't show error toast as this is not critical
      });
    }
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
      setMessages((prev) => {
        const newMessages = [...prev, newMessage];
        // Sort messages by timestamp to ensure proper ordering
        return chatUtils.sortMessagesByTimestamp(newMessages);
      });

      // Update last message in chats list
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage: newMessage.content,
                timestamp: newMessage.timestamp,
                unreadCount: 0, // Reset unread count
              }
            : chat
        );
        // Sort chats by last message timestamp
        return chatUtils.sortChatsByLastMessage(updatedChats);
      });
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toastError("Failed to send message");
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

      toastSuccess("New chat started!");
    } catch (error) {
      console.error("Error creating new chat:", error);
      toastError("Failed to create a new chat");
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
          onNewChat={handleNewChat}
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

export default ParentChatPage;
