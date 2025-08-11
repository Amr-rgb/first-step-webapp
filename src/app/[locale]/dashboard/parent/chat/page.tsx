"use client";

import React, { useState, useEffect } from "react";
import ChatSidebar from "@/components/dashboard/chat/ChatSidebar";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { User, Message, ChatListItem } from "@/components/dashboard/chat/types";
import ComingSoonOverlay from "@/components/ui/coming-soon-overlay";
import { Heart } from "lucide-react";

const ParentChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUser: User = {
    id: "parent-1",
    name: "Sarah Johnson",
    type: "parent",
  };

  // Sample data for parent to see center conversations
  useEffect(() => {
    const sampleChats: ChatListItem[] = [
      {
        id: "chat-1",
        name: "Sunshine Daycare",
        type: "center",
        lastMessage: "Emma had a great day today! 📸",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        unreadCount: 1,
        isOnline: true,
        avatar: "/assets/logos/center-1.png",
      },
      {
        id: "chat-2", 
        name: "Little Angels Center",
        type: "center",
        lastMessage: "Thank you for updating Emma's pickup time.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
        isOnline: true,
        avatar: "/assets/logos/center-2.png",
      },
      {
        id: "chat-3",
        name: "Rainbow Kids Academy",
        type: "center", 
        lastMessage: "We're excited to have Emma join our summer program!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 0,
        isOnline: false,
        avatar: "/assets/logos/center-3.png",
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
        content: "Good morning! How is Emma settling in today?",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderType: "parent",
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        chatId,
      },
      {
        id: "msg-2", 
        content: "Good morning Sarah! Emma is doing wonderfully. She joined our morning circle time and is now enjoying free play with her friends.",
        senderId: "center-1",
        senderName: "Sunshine Daycare", 
        senderType: "center",
        timestamp: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
        chatId,
      },
      {
        id: "msg-3",
        content: "That's wonderful to hear! She was so excited this morning. Has she eaten her snack?",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderType: "parent", 
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        chatId,
      },
      {
        id: "msg-4",
        content: "Yes, she enjoyed her apple slices and crackers. She's such a good eater! I'll send you some photos from today's activities. 📸",
        senderId: "center-1",
        senderName: "Sunshine Daycare",
        senderType: "center", 
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
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
    // Logic to start a new chat with a center
    console.log("Starting new chat with center:", participantId);
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
        message="Parent chat is being redesigned with real-time updates and photo sharing! Connect with your child's nursery like never before."
        icon={<Heart className="w-8 h-8 text-pink-400 animate-bounce" />}
        theme="gradient"
        showBlur={true}
      />
    </div>
  );
};

export default ParentChatPage;
