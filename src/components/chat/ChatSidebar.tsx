"use client"
import React, { useState, useEffect } from "react";
import { useChat } from "./ChatProvider";
import { useAuthUser } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoreVertical, MessageSquare, Plus, X } from "lucide-react";
import { Chat } from "@/types";

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
    if (!currentUser) return;
    
    try {
      // Ensure we have valid user objects
      const currentUserObj = { ...currentUser };
      const otherUser = { ...user };
      
      // Add the new chat with the participants
      // The ChatProvider will create the chat and select it
      addChat([currentUserObj, otherUser]);
      setShowNewChatModal(false);
    } catch (error) {
      console.error('Error creating new chat:', error);
      // You might want to show an error toast/message to the user here
    }
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    return chat.participants.some(
      p => p.id !== currentUser?.id && 
           p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
      className="w-80 h-full bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <MessageSquare className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          const otherUser = getOtherParticipant(chat);
          const lastMessage = chat.messages[chat.messages.length - 1];
          const isActive = chat.id === selectedChatId;
          
          return (
            <div
              key={chat.id}
              className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                isActive ? 'bg-blue-50' : ''
              }`}
              onClick={() => selectChat(chat.id)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg">
                  {otherUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 mr-3 rtl:mr-0 rtl:ml-3 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">{otherUser?.name || 'User'}</h3>
                  <span className="text-xs text-gray-400">
                    {lastMessage ? formatTime(lastMessage.timestamp) : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {lastMessage?.content || 'No messages yet'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Chat Button - Only show for parent and center roles */}
      {currentUser?.role !== 'admin' && (
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Message</span>
          </button>
        </div>
      )}

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div 
              className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentUser?.role === 'parent' ? 'Select a Center' : 'Select a Parent'}
                </h3>
                <button 
                  onClick={() => setShowNewChatModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleNewChat(user)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="mr-3 rtl:mr-0 rtl:ml-3">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No users available to chat with.
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
