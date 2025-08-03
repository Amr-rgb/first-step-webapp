export interface User {
  id: string;
  name: string;
  type: "admin" | "center" | "parent";
  avatar?: string;
  logo?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderType: "admin" | "center" | "parent";
  timestamp: Date;
  chatId: string;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  type: "parent-center" | "admin-view";
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatListItem {
  id: string;
  name: string;
  avatar?: string;
  type: "center" | "parent" | "admin";
  lastMessage?: string;
  timestamp?: Date;
  unreadCount: number;
  isOnline?: boolean;
}
