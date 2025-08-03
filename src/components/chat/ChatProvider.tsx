"use client"
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { User, Chat, Message, Role } from "../../types"; // Adjust path if needed
import { getUserInitials, getUserLogo } from "../../utils"; // Adjust path if needed

// -----------------------------
// Chat Context Types
// -----------------------------
interface ChatContextType {
  currentUser: User;
  chats: Chat[];
  selectedChatId: string | null;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => void;
  addChat: (participants: User[]) => void;
}

// -----------------------------
// Mock Data (Replace with API calls)
// -----------------------------
const mockUsers: User[] = [
  { id: "1", name: "اسم ولي الأمر", role: "parent" },
  {
    id: "2",
    name: "مركز النور",
    role: "center",
    logoUrl: "/public/assets/logos/center-logo.png",
  },
  {
    id: "3",
    name: "First Step",
    role: "admin",
    logoUrl: "/public/assets/logos/complete_logo.svg",
  },
];

const mockChats: Chat[] = [
  {
    id: "chat1",
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    messages: [
      {
        id: "msg1",
        chatId: "chat1",
        sender: mockUsers[0],
        content: "رسالة من ولي الأمر للصفحة",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: "msg2",
        chatId: "chat1",
        sender: mockUsers[2],
        content: "رسالة مسجلة من الصفحة في أول الأمر",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: "msg3",
        chatId: "chat1",
        sender: mockUsers[1],
        content: "first step من رسالة",
        timestamp: new Date().toISOString(),
        read: false,
      },
    ],
  },
];

// -----------------------------
// Chat Context Implementation
// -----------------------------
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  // For demo, assume current user is parent (mockUsers[0])
  // Replace with real auth/user context in production
  const [currentUser] = useState<User>(mockUsers[0]);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    chats[0]?.id || null
  );

  // Select a chat by ID
  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  // Send a message in the selected chat
  const sendMessage = (content: string) => {
    if (!selectedChatId) return;
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: `msg${Date.now()}`,
                  chatId: selectedChatId,
                  sender: currentUser,
                  content,
                  timestamp: new Date().toISOString(),
                  read: false,
                },
              ],
            }
          : chat
      )
    );
  };

  // Add a new chat (for center or admin)
  const addChat = (participants: User[]) => {
    const newChat: Chat = {
      id: `chat${Date.now()}`,
      participants,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
  };

  // Memoize context value
  const value = useMemo(
    () => ({
      currentUser,
      chats,
      selectedChatId,
      selectChat,
      sendMessage,
      addChat,
    }),
    [currentUser, chats, selectedChatId]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// -----------------------------
// Custom Hook for Chat Context
// -----------------------------
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// -----------------------------
// Comments:
// - Replace mockUsers and mockChats with real API calls or data fetching logic.
// - Use getUserInitials and getUserLogo from utils in UI components to display avatars.
// - This provider should wrap the dashboard layout for parent, center, and admin.
