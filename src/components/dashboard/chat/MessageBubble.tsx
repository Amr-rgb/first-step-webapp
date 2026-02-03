"use client";

import React from "react";
import Avatar from "./Avatar";
import { Message, User } from "./types";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  currentUser: User;
}

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
      <Avatar
        name={message.senderName}
        type={message.senderType as "admin" | "center" | "parent"}
        size="sm"
      />

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
