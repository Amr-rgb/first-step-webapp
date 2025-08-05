"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";
import { chatService } from "@/services/chatService";

const CenterChatPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const currentUser: User = {
    id: session?.user?.id?.toString() || "",
    name: session?.user?.name || "Center User",
    type: "center",
    email: session?.user?.email || "",
    avatar: "/assets/logos/center-logo.png",
  };

  // Fetch chat contacts
  const fetchChatContacts = useCallback(async () => {
    const token = await fetch('/api/auth/session')
      .then(res => res.json())
      .then(session => session?.accessToken);
    
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
  }, [selectedChatId]);

  // Fetch messages for the selected chat
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId) return;
    
    const token = await fetch('/api/auth/session')
      .then(res => res.json())
      .then(session => session?.accessToken);
    
    if (!token) return;
    
    try {
      setIsLoading(true);
      const chatMessages = await chatService.getMessages(selectedChatId, token);
      setMessages(chatMessages);
      
      // Update last message in chats list
      if (chatMessages.length > 0) {
        const lastMessage = chatMessages[chatMessages.length - 1];
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === selectedChatId 
              ? { ...chat, lastMessage: lastMessage.content, timestamp: lastMessage.timestamp }
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
  }, [selectedChatId]);

  // Update online status when component mounts/unmounts
  useEffect(() => {
    let keepAliveInterval: NodeJS.Timeout;
    
    const updateStatus = async (isOnline: boolean) => {
      try {
        const token = await fetch('/api/auth/session')
          .then(res => res.json())
          .then(session => session?.accessToken);
        
        if (!token) return;
        
        await chatService.updateOnlineStatus(isOnline, token);
      } catch (error) {
        console.error('Error updating online status:', error);
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
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(keepAliveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateStatus(false);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    if (status === "authenticated") {
      fetchChatContacts();
    } else if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, fetchChatContacts, router]);

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
    if (!selectedChatId || !content.trim()) return;
    
    try {
      setIsSending(true);
      
      // Get token from session
      const token = await fetch('/api/auth/session')
        .then(res => res.json())
        .then(session => session?.accessToken);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const newMessage = await chatService.sendMessage(
        selectedChatId,
        content,
        token
      );
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update last message in chats list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChatId 
            ? { 
                ...chat, 
                lastMessage: newMessage.content, 
                timestamp: newMessage.timestamp,
                unreadCount: 0 // Reset unread count
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
      // Get token from session
      const token = await fetch('/api/auth/session')
        .then(res => res.json())
        .then(session => session?.accessToken);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // In a real implementation, you would create a new chat with the participant
      // For now, we'll just select the chat if it exists
      const existingChat = chats.find(chat => chat.id === participantId);
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

