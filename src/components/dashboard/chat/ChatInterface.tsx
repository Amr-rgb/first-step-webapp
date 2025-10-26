"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { dashboardIcons } from "@/components/general/icons";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Message, User } from "./types";

interface ChatInterfaceProps {
  currentUser: User;
  selectedChat: {
    id: string;
    name: string;
    avatar?: string;
    type: "center" | "parent" | "admin";
  } | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBackToChats?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  selectedChat,
  messages,
  onSendMessage,
  onBackToChats,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("chat.interface");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <dashboardIcons.chat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("selectConversation")}
          </h3>
          <p className="text-gray-500">
            {currentUser.type === "admin"
              ? "Choose a conversation from the sidebar to view messages between users"
              : t("selectConversationRegular")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center">
          {/* Back button for mobile/tablet */}
          {onBackToChats && (
            <button
              onClick={onBackToChats}
              className="lg:hidden mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div className="flex-shrink-0">
            {selectedChat.avatar ? (
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-xs md:text-sm">
                {selectedChat.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm md:text-base font-medium text-gray-900 truncate">
              {selectedChat.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {selectedChat.type}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUser.id}
            currentUser={currentUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input - Show for all users including admin */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatInterface;
