"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { dashboardIcons } from "@/components/general/icons";
import { ChatListItem, User } from "./types";
import NewChatModal from "./NewChatModal";

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
  const t = useTranslations("chat.sidebar");
  const tTypes = useTranslations("chat.types");

  const getAvatarContent = (chat: ChatListItem) => {
    if (chat.type === "admin") {
      return (
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-xs md:text-sm font-bold shadow-lg">
          A
        </div>
      );
    }

    if (chat.type === "center") {
      if (chat.avatar) {
        return (
          <img
            src={chat.avatar}
            alt="Center Logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md"
          />
        );
      }
      return (
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xs md:text-sm font-bold shadow-lg">
          C
        </div>
      );
    }

    // Parent type - first two letters of name
    return (
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-xs md:text-sm font-bold shadow-lg">
        {chat.name.substring(0, 2).toUpperCase()}
      </div>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <dashboardIcons.chat className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-500 text-sm">
                {currentUser.type === "admin"
                  ? "All conversations between parents and centers will appear here. You can view any conversation."
                  : "Start a new conversation to begin messaging"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {chats.map((chat) => (
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
                    <div className="relative">
                      {getAvatarContent(chat)}
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500 hidden sm:block">
                          {formatTimestamp(chat.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm text-gray-600 truncate">
                          {chat.lastMessage || "No messages yet"}
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
                              ? "bg-blue-100 text-blue-800"
                              : chat.type === "parent"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
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
