"use client";

import React from "react";
import { Message, User } from "./types";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  currentUser: User;
}

const getAvatarContent = (user: { senderName: string; senderType: string; avatar?: string; logo?: string }) => {
  if (user.senderType === "admin") {
    return (
      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
        A
      </div>
    );
  }
  
  if (user.senderType === "center") {
    if (user.logo) {
      return (
        <img
          src={user.logo}
          alt="Center Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
        C
      </div>
    );
  }
  
  // Parent type - first two letters of name
  return (
    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
      {user.senderName.substring(0, 2).toUpperCase()}
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  currentUser,
}) => {
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(timestamp);
  };

  return (
    <div
      className={`flex items-start space-x-3 ${
        isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {getAvatarContent({
          senderName: message.senderName,
          senderType: message.senderType,
          avatar: undefined, // You can add avatar support if needed
          logo: message.senderType === "center" ? "/assets/logos/center-default.png" : undefined,
        })}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-xs lg:max-w-md ${
          isCurrentUser ? "text-right" : "text-left"
        }`}
      >
        {/* Sender Name (only show if not current user) */}
        {!isCurrentUser && (
          <p className="text-xs text-gray-600 mb-1 font-medium">
            {message.senderName}
          </p>
        )}
        
        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-lg ${
            isCurrentUser
              ? "bg-primary text-white rounded-br-none"
              : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        
        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
