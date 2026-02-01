"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { dashboardIcons } from "@/components/general/icons";
import { ChatListItem, User } from "./types";
import NewChatModal from "./NewChatModal";
import Avatar from "./Avatar";

interface ChatSidebarProps {
  currentUser: User;
  chats: ChatListItem[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: (participantId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  currentUser,
  chats,
  selectedChatId,
  onChatSelect,
  onNewChat,
}) => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("chat.sidebar");
  const tTypes = useTranslations("chat.types");

  // Filter chats based on search term
  const filteredChats = useMemo(() => {
    if (!searchTerm.trim()) {
      return chats;
    }

    const searchLower = searchTerm.toLowerCase();
    return chats.filter((chat) => {
      // Search by name
      const nameMatch = chat.name.toLowerCase().includes(searchLower);
      
      // Search by last message content
      const messageMatch = chat.lastMessage?.toLowerCase().includes(searchLower);
      
      // Search by email if available
      const emailMatch = chat.email?.toLowerCase().includes(searchLower);
      
      return nameMatch || messageMatch || emailMatch;
    });
  }, [chats, searchTerm]);

  // Helper function to highlight search terms
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return "";

    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hours < 168) {
      // 7 days
      return timestamp.toLocaleDateString([], { weekday: "short" });
    } else {
      return timestamp.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <>
      <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              {currentUser.type === "admin" ? "All Conversations" : "Messages"}
            </h2>
            {currentUser.type !== "admin" && (
              <button
                onClick={() => setShowNewChatModal(true)}
                className="p-2 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
                title="Start new conversation"
              >
                <dashboardIcons.plus className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <dashboardIcons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mt-2 text-xs text-gray-500">
              {filteredChats.length === 0 
                ? "No results found"
                : `${filteredChats.length} conversation${filteredChats.length === 1 ? '' : 's'} found`
              }
            </div>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <dashboardIcons.chat className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchTerm ? "No conversations found" : "No conversations yet"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm 
                  ? `No conversations match "${searchTerm}"`
                  : currentUser.type === "admin"
                  ? "All conversations between parents and centers will appear here. You can view any conversation."
                  : "Start a new conversation to begin messaging"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-3 px-4 py-2 text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`p-3 md:p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    selectedChatId === chat.id
                      ? "bg-primary/5 border-r-2 border-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar with online indicator */}
                    <Avatar
                      name={chat.name}
                      type={chat.type}
                      avatar={chat.avatar}
                      logo={chat.type === "center" ? chat.avatar : undefined}
                      size="md"
                      isOnline={chat.isOnline}
                    />

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          {searchTerm ? highlightSearchTerm(chat.name, searchTerm) : chat.name}
                        </h3>
                        <span className="text-xs text-gray-500 hidden sm:block">
                          {formatTimestamp(chat.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm text-gray-600 truncate">
                          {chat.lastMessage 
                            ? (searchTerm ? highlightSearchTerm(chat.lastMessage, searchTerm) : chat.lastMessage)
                            : "No messages yet"}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="ml-2 px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-medium text-white bg-primary rounded-full min-w-[16px] md:min-w-[20px] text-center">
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Chat type indicator */}
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium ${
                            chat.type === "center"
                              ? "bg-blue-100 text-primary-blue"
                              : chat.type === "parent"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-secondary-burgundy"
                          }`}
                        >
                          <span className="hidden sm:inline">
                            {chat.type === "center"
                              ? "🏢 Center"
                              : chat.type === "parent"
                              ? "👨‍👩‍👧‍👦 Parent"
                              : "👨‍💼 Admin"}
                          </span>
                          <span className="sm:hidden">
                            {chat.type === "center"
                              ? "🏢"
                              : chat.type === "parent"
                              ? "👨‍👩‍👧‍👦"
                              : "👨‍💼"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          currentUser={currentUser}
          onClose={() => setShowNewChatModal(false)}
          onStartChat={onNewChat}
        />
      )}
    </>
  );
};

export default ChatSidebar;
