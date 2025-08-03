"use client";

import React, { useState, useEffect } from "react";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";

const CenterChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUser: User = {
    id: "center-1",
    name: "Sunshine Daycare",
    type: "center",
    avatar: "/assets/logos/center-logo.png",
  };

  // Sample data for center to see parent conversations
  useEffect(() => {
    const sampleChats: ChatListItem[] = [
      {
        id: "chat-1",
        name: "Sarah Johnson",
        type: "parent",
        lastMessage: "Thank you for the daily report!",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        unreadCount: 0,
        isOnline: true,
      },
      {
        id: "chat-2", 
        name: "Michael Brown",
        type: "parent",
        lastMessage: "Can we schedule a parent-teacher meeting?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        unreadCount: 1,
        isOnline: false,
      },
      {
        id: "chat-3",
        name: "Emily Davis",
        type: "parent", 
        lastMessage: "My daughter loved the art activity today!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        unreadCount: 0,
        isOnline: true,
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
        content: "Hi! How was Emma's day today?",
        senderId: "parent-1",
        senderName: "Sarah Johnson",
        senderType: "parent",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        chatId,
      },
      {
        id: "msg-2", 
        content: "Emma had a wonderful day! She participated actively in our reading circle and made a beautiful painting.",
        senderId: currentUser.id,
        senderName: currentUser.name, 
        senderType: "center",
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        chatId,
      },
      {
        id: "msg-3",
        content: "That's fantastic! She's been talking about painting all week. Can you send me a photo?",
        senderId: "parent-1",
        senderName: "Sarah Johnson",
        senderType: "parent", 
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        chatId,
      },
      {
        id: "msg-4",
        content: "Of course! I'll send it right now. 📸",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderType: "center", 
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
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

  const handleNewChat = (participantId: string) => {
    // Logic to start a new chat with a parent
    console.log("Starting new chat with:", participantId);
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

