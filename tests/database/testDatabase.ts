// Mock database implementation for testing
// This simulates database operations without requiring a real database connection

interface DatabaseRecord {
  id: number;
  created_at: string;
  updated_at: string;
}

interface MessageRecord extends DatabaseRecord {
  sender_id: number;
  receiver_id: number;
  message: string;
  image: string | null;
  video_url: string | null;
  is_read: boolean;
  is_read_admin: boolean;
  image_url: string | null;
  video_url_path: string | null;
  is_admin_message?: boolean;
}

interface UserRecord extends DatabaseRecord {
  name: string;
  email: string;
  role: 'admin' | 'parent' | 'center';
  is_online: number;
  avatar?: string;
}

interface ConversationRecord extends DatabaseRecord {
  user1_id: number;
  user2_id: number;
  last_message_id: number | null;
}

class TestDatabase {
  private messages: MessageRecord[] = [];
  private users: UserRecord[] = [];
  private conversations: ConversationRecord[] = [];
  private nextId = 1;

  constructor() {
    this.seedInitialData();
  }

  // Seed the database with initial test data
  private seedInitialData() {
    // Add test users
    this.users = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        is_online: 1,
        avatar: 'http://example.com/avatars/admin.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'Parent One',
        email: 'parent1@example.com',
        role: 'parent',
        is_online: 1,
        avatar: 'http://example.com/avatars/parent1.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 3,
        name: 'Parent Two',
        email: 'parent2@example.com',
        role: 'parent',
        is_online: 0,
        avatar: 'http://example.com/avatars/parent2.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 4,
        name: 'Center One',
        email: 'center1@example.com',
        role: 'center',
        is_online: 1,
        avatar: 'http://example.com/avatars/center1.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 5,
        name: 'Center Two',
        email: 'center2@example.com',
        role: 'center',
        is_online: 0,
        avatar: 'http://example.com/avatars/center2.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    // Add test conversations
    this.conversations = [
      {
        id: 1,
        user1_id: 2,
        user2_id: 4,
        last_message_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        user1_id: 3,
        user2_id: 5,
        last_message_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    this.nextId = 6; // Start IDs after seeded data
  }

  // Message operations
  async insertMessage(messageData: Omit<MessageRecord, 'id' | 'created_at' | 'updated_at'>): Promise<MessageRecord> {
    const now = new Date().toISOString();
    const message: MessageRecord = {
      id: this.nextId++,
      created_at: now,
      updated_at: now,
      ...messageData,
    };

    this.messages.push(message);
    
    // Update conversation last_message_id
    const conversation = this.conversations.find(c => 
      (c.user1_id === messageData.sender_id && c.user2_id === messageData.receiver_id) ||
      (c.user1_id === messageData.receiver_id && c.user2_id === messageData.sender_id)
    );
    
    if (conversation) {
      conversation.last_message_id = message.id;
      conversation.updated_at = now;
    }

    return message;
  }

  async findMessages(senderId?: number, receiverId?: number, limit?: number): Promise<MessageRecord[]> {
    let messages = [...this.messages];

    if (senderId && receiverId) {
      messages = messages.filter(msg => 
        (msg.sender_id === senderId && msg.receiver_id === receiverId) ||
        (msg.sender_id === receiverId && msg.receiver_id === senderId)
      );
    } else if (senderId) {
      messages = messages.filter(msg => msg.sender_id === senderId);
    } else if (receiverId) {
      messages = messages.filter(msg => msg.receiver_id === receiverId);
    }

    // Sort by created_at
    messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    if (limit) {
      messages = messages.slice(-limit); // Get last N messages
    }

    return messages;
  }

  async findMessageById(id: number): Promise<MessageRecord | null> {
    return this.messages.find(msg => msg.id === id) || null;
  }

  async updateMessage(id: number, updates: Partial<MessageRecord>): Promise<MessageRecord | null> {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index === -1) return null;

    this.messages[index] = {
      ...this.messages[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.messages[index];
  }

  async deleteMessage(id: number): Promise<boolean> {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index === -1) return false;

    this.messages.splice(index, 1);
    return true;
  }

  // User operations
  async findUserById(id: number): Promise<UserRecord | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findUsersByRole(role: 'admin' | 'parent' | 'center'): Promise<UserRecord[]> {
    return this.users.filter(user => user.role === role);
  }

  async updateUserOnlineStatus(id: number, isOnline: boolean): Promise<UserRecord | null> {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;

    user.is_online = isOnline ? 1 : 0;
    user.updated_at = new Date().toISOString();
    return user;
  }

  // Conversation operations
  async findConversations(userId?: number): Promise<ConversationRecord[]> {
    if (userId) {
      return this.conversations.filter(conv => 
        conv.user1_id === userId || conv.user2_id === userId
      );
    }
    return [...this.conversations];
  }

  async findOrCreateConversation(user1Id: number, user2Id: number): Promise<ConversationRecord> {
    // Ensure consistent ordering (smaller ID first)
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    let conversation = this.conversations.find(conv => 
      conv.user1_id === smallerId && conv.user2_id === largerId
    );

    if (!conversation) {
      const now = new Date().toISOString();
      conversation = {
        id: this.nextId++,
        user1_id: smallerId,
        user2_id: largerId,
        last_message_id: null,
        created_at: now,
        updated_at: now,
      };
      this.conversations.push(conversation);
    }

    return conversation;
  }

  // Utility methods for testing
  async getMessageCount(): Promise<number> {
    return this.messages.length;
  }

  async getUserCount(): Promise<number> {
    return this.users.length;
  }

  async getConversationCount(): Promise<number> {
    return this.conversations.length;
  }

  // Performance testing methods
  async measureQueryTime<T>(queryFn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await queryFn();
    const end = performance.now();
    return { result, duration: end - start };
  }

  async bulkInsertMessages(messages: Omit<MessageRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<MessageRecord[]> {
    const insertedMessages: MessageRecord[] = [];
    const now = new Date().toISOString();

    for (const messageData of messages) {
      const message: MessageRecord = {
        id: this.nextId++,
        created_at: now,
        updated_at: now,
        ...messageData,
      };
      this.messages.push(message);
      insertedMessages.push(message);
    }

    return insertedMessages;
  }

  // Test data management
  async reset(): Promise<void> {
    this.messages = [];
    this.users = [];
    this.conversations = [];
    this.nextId = 1;
    this.seedInitialData();
  }

  async clear(): Promise<void> {
    this.messages = [];
    this.users = [];
    this.conversations = [];
    this.nextId = 1;
  }

  // Transaction simulation for testing
  async transaction<T>(fn: (db: TestDatabase) => Promise<T>): Promise<T> {
    // Create a snapshot of current state
    const messagesSnapshot = JSON.parse(JSON.stringify(this.messages));
    const usersSnapshot = JSON.parse(JSON.stringify(this.users));
    const conversationsSnapshot = JSON.parse(JSON.stringify(this.conversations));
    const nextIdSnapshot = this.nextId;

    try {
      return await fn(this);
    } catch (error) {
      // Rollback on error
      this.messages = messagesSnapshot;
      this.users = usersSnapshot;
      this.conversations = conversationsSnapshot;
      this.nextId = nextIdSnapshot;
      throw error;
    }
  }

  // Statistics for testing
  async getStatistics(): Promise<{
    messageCount: number;
    userCount: number;
    conversationCount: number;
    onlineUserCount: number;
    unreadMessageCount: number;
    averageMessagesPerConversation: number;
  }> {
    const messageCount = this.messages.length;
    const userCount = this.users.length;
    const conversationCount = this.conversations.length;
    const onlineUserCount = this.users.filter(u => u.is_online === 1).length;
    const unreadMessageCount = this.messages.filter(m => !m.is_read).length;
    const averageMessagesPerConversation = conversationCount > 0 ? messageCount / conversationCount : 0;

    return {
      messageCount,
      userCount,
      conversationCount,
      onlineUserCount,
      unreadMessageCount,
      averageMessagesPerConversation,
    };
  }
}

// Singleton instance for testing
export const testDatabase = new TestDatabase();

// Helper functions for test setup
export const testDatabaseUtils = {
  // Reset database to initial state
  reset: () => testDatabase.reset(),
  
  // Clear all data
  clear: () => testDatabase.clear(),
  
  // Seed with specific test data
  seedWithData: async (data: {
    users?: UserRecord[];
    messages?: MessageRecord[];
    conversations?: ConversationRecord[];
  }) => {
    await testDatabase.clear();
    
    if (data.users) {
      for (const user of data.users) {
        testDatabase['users'].push(user);
      }
    }
    
    if (data.conversations) {
      for (const conversation of data.conversations) {
        testDatabase['conversations'].push(conversation);
      }
    }
    
    if (data.messages) {
      for (const message of data.messages) {
        testDatabase['messages'].push(message);
      }
    }
  },
  
  // Generate test data
  generateTestData: {
    users: (count: number, role?: 'admin' | 'parent' | 'center'): UserRecord[] => {
      const users: UserRecord[] = [];
      for (let i = 0; i < count; i++) {
        users.push({
          id: 1000 + i,
          name: `Test User ${i}`,
          email: `test${i}@example.com`,
          role: role || (['admin', 'parent', 'center'] as const)[i % 3],
          is_online: Math.random() > 0.5 ? 1 : 0,
          avatar: `http://example.com/avatars/test${i}.jpg`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return users;
    },
    
    messages: (count: number, senderId: number, receiverId: number): MessageRecord[] => {
      const messages: MessageRecord[] = [];
      for (let i = 0; i < count; i++) {
        messages.push({
          id: 2000 + i,
          sender_id: senderId,
          receiver_id: receiverId,
          message: `Test message ${i}`,
          image: null,
          video_url: null,
          is_read: Math.random() > 0.5,
          is_read_admin: Math.random() > 0.7,
          image_url: null,
          video_url_path: null,
          created_at: new Date(Date.now() - (count - i) * 60000).toISOString(), // 1 minute apart
          updated_at: new Date(Date.now() - (count - i) * 60000).toISOString(),
        });
      }
      return messages;
    },
  },
};