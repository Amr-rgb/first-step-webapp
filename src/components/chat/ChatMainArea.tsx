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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

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

  // Render welcome screen when no chat is selected
  const renderWelcomeScreen = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Messages</h2>
        <p className="text-gray-500 max-w-md">
          Select a conversation or start a new chat to begin messaging.
        </p>
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
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto w-full space-y-3">
          <AnimatePresence initial={false}>
            {memoizedMessages.map((msg) => {
              const isCurrentUser = String(msg.sender.id) === String(user?.id);
              const isArabic = /[\u0600-\u06FF]/.test(msg.content);
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isCurrentUser && (
                      <div className="flex-shrink-0 self-end mb-1">
                        {renderAvatar(msg.sender, isCurrentUser)}
                      </div>
                    )}
                    
                    <div className={`mx-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {!isCurrentUser && (
                        <div className="text-xs font-medium text-gray-500 mb-1 px-2">
                          {msg.sender.name}
                        </div>
                      )}
                      
                      <div 
                        className={`inline-block px-4 py-2 rounded-2xl ${
                          isCurrentUser 
                            ? 'bg-blue-500 text-white rounded-br-sm' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <div className="text-sm">{msg.content}</div>
                        <div 
                          className={`text-xs mt-1 opacity-70 flex items-center ${
                            isCurrentUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span className="text-[10px]">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-1 inline-block">
                              <svg width="16" height="16" viewBox="0 0 16 15" fill="none" className="text-white">
                                <path d="M10.5 5.5L13 8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 5.5L9.5 8L7 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isCurrentUser && (
                      <div className="flex-shrink-0 self-end mb-1">
                        {renderAvatar(msg.sender, isCurrentUser)}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  };

  // Render message input
  const renderInput = () => {
    if (!chat) return null;
    
    return (
      <div className="border-t border-gray-100 p-3 bg-white">
        <div className="flex items-center bg-gray-50 rounded-full px-4 py-2">
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm text-gray-700 placeholder-gray-400 px-3 py-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <Smile className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render welcome screen when no chat is selected
  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Messages</h2>
        <p className="text-gray-500 max-w-md">
          Select a conversation or start a new chat to begin messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {renderTopBar()}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>
      {renderInput()}
    </div>
  );
};

export default ChatMainArea;
