// -----------------------------
// Modern Chat System Types
// -----------------------------

export type UserRole = "parent" | "center" | "admin";

export interface ChatUser {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  read: boolean;
  reactions?: {
    emoji: string;
    userId: string;
  }[];
  replyTo?: string;
  attachments?: {
    type: string;
    url: string;
    name: string;
    size: number;
  }[];
}

export interface GroupChat {
  id: string;
  name: string;
  description?: string;
  participants: ChatUser[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  unreadCount: number;
  lastMessage?: ChatMessage;
  avatar?: string;
}

export interface ChatState {
  chats: GroupChat[];
  activeChat: GroupChat | null;
  currentUser: ChatUser | null;
  isLoading: boolean;
  onlineUsers: string[];
}
