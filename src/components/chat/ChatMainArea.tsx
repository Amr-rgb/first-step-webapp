"use client"
import React, { useRef, useEffect, useState } from "react";
import { useChat } from "./ChatProvider";
import { useAuthUser } from "../../store/authStore";
import { getUserInitials, getUserLogo } from "../../utils";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, Send, Smile, MoreVertical, Search } from "lucide-react";

// -----------------------------
// ChatMainArea Component
// -----------------------------
const ChatMainArea: React.FC = () => {
  const { chats, selectedChatId, sendMessage } = useChat();
  const user = useAuthUser();
  const chat = chats.find((c) => c.id === selectedChatId);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle sending a message
  const handleSend = () => {
    const value = inputRef.current?.value?.trim();
    if (value) {
      sendMessage(value);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // Render avatar (logo or initials)
  const renderAvatar = (sender: any, isCurrentUser: boolean = false) => {
    const logo = getUserLogo(sender);
    const avatarSize = isCurrentUser ? 32 : 40; // Larger avatar for received messages
    
    if (logo) {
      return (
        <div className={`relative ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
          <img
            src={logo}
            alt={sender.name}
            className="rounded-full object-cover border-2 border-white shadow-sm"
            style={{ 
              width: avatarSize, 
              height: avatarSize,
              minWidth: avatarSize,
              minHeight: avatarSize
            }}
          />
          {!isCurrentUser && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      );
    }
    
    return (
      <div 
        className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium ${isCurrentUser ? 'ml-2' : 'mr-2'}`}
        style={{
          width: avatarSize,
          height: avatarSize,
          minWidth: avatarSize,
          minHeight: avatarSize,
          fontSize: avatarSize * 0.4,
        }}
      >
        {getUserInitials(sender)}
      </div>
    );
  };

  // Render top bar with user info and actions
  const renderTopBar = () => {
    if (!chat) return null;
    
    // Get other participants (not current user)
    const others = chat.participants.filter((p) => String(p.id) !== String(user?.id));
    const otherUser = others[0]; // Assuming 1:1 chat for now
    
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {renderAvatar(otherUser, false)}
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {otherUser?.name || 'User'}
            </h3>
            <p className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Active now
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button className="text-gray-500 hover:text-gray-700">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // Memoize the messages to prevent unnecessary re-renders
  const memoizedMessages = React.useMemo(() => {
    if (!chat) return [];
    // Use a Set to ensure unique messages by ID
    const uniqueMessages = Array.from(
      new Map(chat.messages.map(msg => [msg.id, msg])).values()
    );
    return uniqueMessages;
  }, [chat?.messages]);

  // Render message list
  const renderMessages = () => {
    if (!chat) return null;
    
    return (
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <AnimatePresence initial={false}>
          {memoizedMessages.map((msg) => {
            const isCurrentUser = String(msg.sender.id) === String(user?.id);
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  display: "flex",
                  justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                  width: "100%",
                  paddingLeft: isCurrentUser ? '20%' : '16px',
                  paddingRight: isCurrentUser ? '16px' : '20%',
                  boxSizing: 'border-box'
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    maxWidth: "100%",
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  }}
                >
                  {!isCurrentUser && renderAvatar(msg.sender)}
                  <div
                    style={{
                      background: isCurrentUser
                        ? "linear-gradient(90deg, #6a8dff, #3e5ed7)"
                        : "#f0f0f0",
                      color: isCurrentUser ? "#fff" : "#222",
                      borderRadius: 16,
                      padding: "10px 16px",
                      maxWidth: "100%",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      borderBottomRightRadius: isCurrentUser ? 4 : 16,
                      borderBottomLeftRadius: isCurrentUser ? 16 : 4,
                    }}
                  >
                    {!isCurrentUser && (
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 13 }}>
                        {msg.sender.name}
                      </div>
                    )}
                    <div style={{ fontSize: 14, wordBreak: 'break-word' }}>{msg.content}</div>
                    <div
                      style={{
                        fontSize: 10,
                        opacity: 0.7,
                        marginTop: 4,
                        textAlign: isCurrentUser ? "left" : "right",
                        direction: 'ltr',
                        display: 'inline-block',
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {isCurrentUser && renderAvatar(msg.sender)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  // Render message input
  const renderInput = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid #eee",
        padding: 16,
        gap: 8,
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="اكتب رسالتك"
        style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 8,
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        onClick={handleSend}
        style={{
          background: "#3e5ed7",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: "bold",
        }}
      >
        إرسال
      </button>
    </div>
  );

  if (!chat) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
        }}
      >
        اختر دردشة لبدء المحادثة
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {renderTopBar()}
      {renderMessages()}
      {renderInput()}
    </div>
  );
};

export default ChatMainArea;
