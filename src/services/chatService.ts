import { ChatListItem, Message } from "@/components/dashboard/chat/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://development.firststep-app.com/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ApiMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  image: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  is_read_admin: boolean;
  image_url: string | null;
  video_url_path: string | null;
}

interface ApiContact {
  contact_id: number;
  unread_count: number;
  is_online: number;
  contact: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface ApiParent {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  is_online: number;
  children: Array<{
    id: number;
    child_name: string;
    parent_name: string;
    mother_name: string;
  }>;
}

interface ApiCenterParent {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  is_online?: number;
}

const mapApiMessageToMessage = (apiMessage: ApiMessage, currentUserId: string, currentUserType: 'center' | 'parent' | 'admin'): Message => ({
  id: apiMessage.id.toString(),
  content: apiMessage.message,
  senderId: apiMessage.sender_id.toString(),
  senderName: 'User', // This will be set from the contact info
  senderType: apiMessage.sender_id.toString() === currentUserId ? currentUserType : (currentUserType === 'center' ? 'parent' : 'center'),
  timestamp: new Date(apiMessage.created_at),
  chatId: apiMessage.receiver_id.toString(),
  imageUrl: apiMessage.image_url,
  videoUrl: apiMessage.video_url_path,
});

const mapApiContactToChatListItem = (apiContact: ApiContact, currentUserId: string, currentUserType: 'center' | 'parent' | 'admin'): ChatListItem => ({
  id: apiContact.contact.id.toString(),
  name: apiContact.contact.name,
  type: apiContact.contact.id.toString() === currentUserId ? currentUserType : (currentUserType === 'center' ? 'parent' : 'center'),
  lastMessage: '', // Will be updated when messages are loaded
  timestamp: new Date(),
  unreadCount: apiContact.unread_count,
  isOnline: apiContact.is_online === 1,
  avatar: apiContact.contact.avatar,
  email: apiContact.contact.email,
});

export const chatService = {
  // Get all center parents (contacts for centers to chat with)
  async getCenterParents(authToken: string): Promise<ApiParent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/center/parents`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Authorization': process.env.NEXT_PUBLIC_X_AUTHORIZATION || '',
          'X-Authorization-Secret': process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch center parents');
      }

      const data: ApiParent[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching center parents:', error);
      throw error;
    }
  },

  // Get center parent for specific parent (for parent dashboard)
  async getCentersForParent(authToken: string): Promise<ApiCenterParent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/get-centers-parent`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Authorization': process.env.NEXT_PUBLIC_X_AUTHORIZATION || '',
          'X-Authorization-Secret': process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch centers for parent');
      }

      const data: ApiCenterParent[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching centers for parent:', error);
      throw error;
    }
  },

  async getChatContacts(authToken: string, currentUserId: string, currentUserType: 'center' | 'parent' | 'admin'): Promise<ChatListItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-contacts`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Authorization': process.env.NEXT_PUBLIC_X_AUTHORIZATION || '',
          'X-Authorization-Secret': process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat contacts');
      }

      const data: ApiContact[] = await response.json();
      return data.map(contact => mapApiContactToChatListItem(contact, currentUserId, currentUserType));
    } catch (error) {
      console.error('Error fetching chat contacts:', error);
      throw error;
    }
  },

  async getMessages(contactId: string, authToken: string, currentUserId: string, currentUserType: 'center' | 'parent' | 'admin'): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data: ApiMessage[] = await response.json();
      return data.map(msg => mapApiMessageToMessage(msg, currentUserId, currentUserType));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async sendMessage(
    receiverId: string,
    message: string,
    authToken: string,
    currentUserId: string,
    currentUserType: 'center' | 'parent' | 'admin',
    image?: File,
    videoUrl?: string
  ): Promise<Message> {
    const formData = new FormData();
    formData.append('receiver_id', receiverId);
    formData.append('message', message);
    
    if (image) {
      formData.append('image', image);
    }
    
    if (videoUrl) {
      formData.append('video_url', videoUrl);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return mapApiMessageToMessage(data.message, currentUserId, currentUserType);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async markAsRead(messageId: string, authToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  async updateOnlineStatus(isOnline: boolean, authToken: string): Promise<void> {
    try {
      const endpoint = isOnline ? 'online' : 'offline';
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update online status to ${isOnline ? 'online' : 'offline'}`);
      }
    } catch (error) {
      console.error('Error updating online status:', error);
      throw error;
    }
  },
};
