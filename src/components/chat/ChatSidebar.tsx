"use client"
import React, { useState, useEffect, useMemo } from "react";
import { useChat } from "./ChatProvider";
import { useAuthUser } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoreVertical, MessageSquare, Plus, X, User, ChevronDown } from "lucide-react";
import { Chat, User as UserType } from "@/types";
import { cn } from "@/lib/utils";

// -----------------------------
// ChatSidebar Component
// -----------------------------
const ChatSidebar: React.FC = () => {
  const { chats, selectChat, selectedChatId, addChat } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const currentUser = useAuthUser();

  // Mock function to fetch available users based on current user role
  useEffect(() => {
    if (!currentUser) return;
    
    // In a real app, this would be an API call to fetch users
    const mockUsers = [
      { id: "1", name: "اسم ولي الأمر", role: "parent" },
      { id: "2", name: "مركز النور", role: "center", logoUrl: "/public/assets/logos/center-logo.png" },
      { id: "3", name: "First Step", role: "admin", logoUrl: "/public/assets/logos/complete_logo.svg" },
    ];

    // Filter out current user and show relevant users based on role
    const filteredUsers = mockUsers.filter(user => {
      if (user.id === currentUser.id) return false;
      
      // Parent can chat with centers
      if (currentUser.role === 'parent') {
        return user.role === 'center';
      }
      // Center can chat with parents
      else if (currentUser.role === 'center') {
        return user.role === 'parent';
      }
      // Admin can see all conversations but can't start new ones
      return false;
    });

    setAvailableUsers(filteredUsers);
  }, [currentUser]);

  const handleNewChat = (user: any) => {
    if (!currentUser || currentUser.role === 'admin') return;
    
    // Prevent creating a chat if one already exists between these users
    const existingChat = chats.find(chat => 
      chat.participants.some(p => p.id === user.id)
    );

    if (existingChat) {
      selectChat(existingChat.id);
      setShowNewChatModal(false);
      return;
    }

    try {
      // Ensure we have valid user objects
      const currentUserObj = { ...currentUser };
      const otherUser = { ...user };
      
      // Add the new chat with the participants
      addChat([currentUserObj, otherUser]);
      setShowNewChatModal(false);
    } catch (error) {
      console.error('Error creating new chat:', error);
      // You might want to show an error toast/message to the user here
    }
  };

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    
    return chats.filter(chat => {
      return chat.participants.some(
        p => p.id !== currentUser?.id && 
             p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [chats, searchQuery, currentUser?.id]);

  // Get other participant in chat (not current user)
  const getOtherParticipant = (chat: any) => {
    return chat.participants.find((p: any) => p.id !== currentUser?.id) || {};
  };

  // Format time to relative time (e.g., "2h ago")
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full md:w-80 h-full bg-white border-r border-gray-100 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold text-gray-900">المحادثات</h2>
          <button className="p-1 rounded-md hover:bg-gray-100">
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex space-x-1 rtl:space-x-reverse">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100 bg-gray-50/50">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن محادثة..."
            className="w-full pr-10 pl-4 py-2 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir="rtl"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">لا توجد محادثات</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isActive = chat.id === selectedChatId;
            const unreadCount = chat.messages.filter(
              msg => !msg.read && msg.sender.id !== currentUser?.id
            ).length;
            
            return (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center p-3 border-b border-gray-100 cursor-pointer transition-colors group",
                  isActive ? 'bg-blue-50' : 'hover:bg-gray-50',
                  unreadCount > 0 && 'bg-blue-50/50'
                )}
                onClick={() => selectChat(chat.id)}
              >
                <div className="relative flex-shrink-0">
                  {otherUser?.logoUrl ? (
                    <img 
                      src={otherUser.logoUrl} 
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-medium text-lg">
                      {otherUser?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 mr-3 rtl:mr-0 rtl:ml-3 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {otherUser?.name || 'مستخدم'}
                    </h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-400 whitespace-nowrap mr-2 rtl:mr-0 rtl:ml-2">
                        {formatTime(lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm truncate mt-0.5",
                      unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                    )}>
                      {lastMessage?.content || 'لا توجد رسائل'}
                    </p>
                    {unreadCount > 0 && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Chat Button - Only show for parent and center roles */}
      {currentUser?.role !== 'admin' && (
        <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>رسالة جديدة</span>
          </button>
        </div>
      )}

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentUser?.role === 'parent' ? 'اختر مركزاً' : 'اختر ولي أمر'}
                </h3>
                <button 
                  onClick={() => setShowNewChatModal(false)}
                  className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن مستخدم..."
                    className="w-full pr-10 pl-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border border-gray-200 focus:border-blue-500 transition-all"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                      onClick={() => handleNewChat(user)}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-medium text-lg flex-shrink-0">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="mr-3 rtl:mr-0 rtl:ml-3 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                        <p className="text-xs text-gray-500">
                          {user.role === 'parent' ? 'ولي أمر' : 'مركز'}
                        </p>
                      </div>
                      <div className="ml-auto rtl:ml-0 rtl:mr-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <User className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">لا يوجد مستخدمون متاحون للدردشة</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default ChatSidebar;
