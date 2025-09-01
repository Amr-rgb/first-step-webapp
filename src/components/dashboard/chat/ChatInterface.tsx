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
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  selectedChat,
  messages,
  onSendMessage,
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
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {selectedChat.avatar ? (
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                {selectedChat.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {selectedChat.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {selectedChat.type}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
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

      {/* Chat Input - Only show for non-admin users */}
      {currentUser.type !== "admin" && (
        <ChatInput onSendMessage={onSendMessage} />
      )}

      {/* Admin Notice */}
      {currentUser.type === "admin" && (
        <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
          <div className="flex items-center text-blue-700">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium">
              Admin View: You can only view conversations between users
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
