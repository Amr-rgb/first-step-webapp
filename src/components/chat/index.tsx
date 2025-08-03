import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatState, GroupChat, ChatUser } from '@/types/chat';

const Chat = () => {
  const [state, setState] = useState<ChatState>({
    chats: [],
    activeChat: null,
    currentUser: {
      id: '1',
      name: 'Admin',
      role: 'admin',
      isOnline: true,
      email: 'admin@example.com'
    },
    isLoading: true,
    onlineUsers: []
  });

  useEffect(() => {
    // Simulate fetching chat data
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        chats: mockChats,
        onlineUsers: ['1', '2'] // Dummy online users
      }));
    }, 1000);
  }, []);

  const selectChat = (chatId: string) => {
    const selectedChat = state.chats.find(chat => chat.id === chatId);
    setState(prevState => ({ ...prevState, activeChat: selectedChat || null }));
  };

  return (
    <div className="chat-app h-full flex">
      <ChatSidebar 
        chats={state.chats} 
        onlineUsers={state.onlineUsers} 
        currentUser={state.currentUser} 
        selectChat={selectChat} 
      />
      <ChatMainArea activeChat={state.activeChat} currentUser={state.currentUser} />
    </div>
  );
};

const ChatSidebar = ({ chats, onlineUsers, currentUser, selectChat }: any) => (
  <motion.aside className="w-1/4 bg-gray-100 border-r">
    {/* Header */}
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold">Chats</h2>
    </div>
    <div className="overflow-y-auto">
      {chats.map((chat: GroupChat) => (
        <div key={chat.id} className="p-4 border-b cursor-pointer" onClick={() => selectChat(chat.id)}>
          <h3 className="text-md font-semibold">{chat.name}</h3>
          <p className="text-sm text-gray-600">{chat.lastMessage?.content || 'No messages yet'}</p>
        </div>
      ))}
    </div>
  </motion.aside>
);

const ChatMainArea = ({ activeChat, currentUser }: any) => (
  <div className="flex-1 flex flex-col">
    {activeChat ? (
      <div>
        {/* Chat Header */}
        <div className="p-4 border-b">
          <h2 className="text-md font-bold">{activeChat.name}</h2>
        </div>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeChat.messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.senderId === currentUser.id ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        {/* Chat Input */}
        <div className="p-4 border-t">
          <input type="text" placeholder="Type a message..." className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>
    ) : (
      <div className="flex-1 flex items-center justify-center">
        <p>Select a chat to start messaging</p>
      </div>
    )}
  </div>
);

// Mock Data
const mockChats: GroupChat[] = [
  {
    id: '1',
    name: 'General Chat',
    participants: [],
    messages: [
      { id: 'msg1', chatId: '1', senderId: '1', content: 'Welcome to the chat!', type: 'text', timestamp: new Date().toISOString(), read: true }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isGroup: true,
    unreadCount: 1,
    lastMessage: { id: 'msg1', chatId: '1', senderId: '1', content: 'Welcome to the chat!', type: 'text', timestamp: new Date().toISOString(), read: true }
  }
];

export default Chat;
