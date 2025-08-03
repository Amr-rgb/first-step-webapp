"use client";

import React, { useState, useEffect } from "react";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";

const AdminChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUser: User = {
    id: "admin-1",
    name: "Admin User",
    type: "admin",
  };

  // Sample data for admin to see all conversations
  useEffect(() => {
    const sampleChats: ChatListItem[] = [
      {
        id: "chat-1",
        name: "Sunshine Daycare",
        type: "center",
        lastMessage: "Thanks for the update!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 0,
        isOnline: true,
        avatar: "/assets/logos/center-1.png",
      },
      {
        id: "chat-2", 
        name: "Sarah Johnson",
        type: "parent",
        lastMessage: "When can I schedule a visit?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 2,
        isOnline: false,
      },
      {
        id: "chat-3",
        name: "Little Angels Center",
        type: "center", 
        lastMessage: "We need to discuss the new policy",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 1,
        isOnline: true,
        avatar: "/assets/logos/center-2.png",
      }
    ];
    setChats(sampleChats);
  }, []);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    
    // Sample messages for demonstration
    const sampleMessages: Message[] = [
      {
        id: "msg-1",
        content: "Hello! How can I help you today?",
        senderId: "center-1",
        senderName: "Sunshine Daycare",
        senderType: "center",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        chatId,
      },
      {
        id: "msg-2", 
        content: "I wanted to ask about the enrollment process for my daughter.",
        senderId: "parent-1",
        senderName: "Sarah Johnson", 
        senderType: "parent",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        chatId,
      },
      {
        id: "msg-3",
        content: "Of course! I'd be happy to help. What's your daughter's age?",
        senderId: "center-1",
        senderName: "Sunshine Daycare",
        senderType: "center", 
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        chatId,
      }
    ];
    setMessages(sampleMessages);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatId) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: currentUser.type,
      timestamp: new Date(),
      chatId: selectedChatId,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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

