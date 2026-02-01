import { chatUtils } from '@/services/chatService';
import { Message, ChatListItem } from '@/components/dashboard/chat/types';

describe('Chat Message Ordering Fixes', () => {
  describe('getLastMessage', () => {
    it('should return the most recent message by timestamp', () => {
      const messages: Message[] = [
        {
          id: '1',
          content: 'First message',
          senderId: '1',
          senderName: 'User 1',
          senderType: 'parent',
          timestamp: new Date('2025-01-01T10:00:00Z'),
          chatId: 'chat1',
        },
        {
          id: '2',
          content: 'Second message',
          senderId: '2',
          senderName: 'User 2',
          senderType: 'center',
          timestamp: new Date('2025-01-01T11:00:00Z'),
          chatId: 'chat1',
        },
        {
          id: '3',
          content: 'Third message (most recent)',
          senderId: '1',
          senderName: 'User 1',
          senderType: 'parent',
          timestamp: new Date('2025-01-01T12:00:00Z'),
          chatId: 'chat1',
        },
      ];

      const lastMessage = chatUtils.getLastMessage(messages);
      expect(lastMessage).toBeTruthy();
      expect(lastMessage?.content).toBe('Third message (most recent)');
      expect(lastMessage?.id).toBe('3');
    });

    it('should return null for empty messages array', () => {
      const lastMessage = chatUtils.getLastMessage([]);
      expect(lastMessage).toBeNull();
    });

    it('should handle messages in wrong order and still return the most recent', () => {
      const messages: Message[] = [
        {
          id: '3',
          content: 'Latest message',
          senderId: '1',
          senderName: 'User 1',
          senderType: 'parent',
          timestamp: new Date('2025-01-01T12:00:00Z'),
          chatId: 'chat1',
        },
        {
          id: '1',
          content: 'Oldest message',
          senderId: '2',
          senderName: 'User 2',
          senderType: 'center',
          timestamp: new Date('2025-01-01T10:00:00Z'),
          chatId: 'chat1',
        },
        {
          id: '2',
          content: 'Middle message',
          senderId: '1',
          senderName: 'User 1',
          senderType: 'parent',
          timestamp: new Date('2025-01-01T11:00:00Z'),
          chatId: 'chat1',
        },
      ];

      const lastMessage = chatUtils.getLastMessage(messages);
      expect(lastMessage?.content).toBe('Latest message');
      expect(lastMessage?.id).toBe('3');
    });
  });

  describe('sortMessagesByTimestamp', () => {
    it('should sort messages by timestamp in ascending order', () => {
      const messages: Message[] = [
        {
          id: '3',
          content: 'Third',
          senderId: '1',
          senderName: 'User 1',
          senderType: 'parent',
          timestamp: new Date('2025-01-01T12:00:00Z'),
          chatId: 'chat1',
        },
        {
          id: '1',
          content: 'First',
          senderId: '2',
          senderName: 'User 2',
          senderType: 'center',
          timestamp: new Date('2025-01-01T10:00:00Z'),
          chatId: 'chat1',
        },
        {
          id: '2',
          content: 'Second',
          senderId: '1',
          senderName: 'User 1',
          senderType: 'parent',
          timestamp: new Date('2025-01-01T11:00:00Z'),
          chatId: 'chat1',
        },
      ];

      const sortedMessages = chatUtils.sortMessagesByTimestamp(messages);
      
      expect(sortedMessages).toHaveLength(3);
      expect(sortedMessages[0].content).toBe('First');
      expect(sortedMessages[1].content).toBe('Second');
      expect(sortedMessages[2].content).toBe('Third');
    });

    it('should not mutate the original array', () => {
      const messages: Message[] = [
        {
          id: '2',
          content: 'Second',
          senderId: '1',
          senderName: 'User 1',
          senderType: 'parent',
          timestamp: new Date('2025-01-01T11:00:00Z'),
          chatId: 'chat1',
        },
        {
          id: '1',
          content: 'First',
          senderId: '2',
          senderName: 'User 2',
          senderType: 'center',
          timestamp: new Date('2025-01-01T10:00:00Z'),
          chatId: 'chat1',
        },
      ];

      const originalOrder = messages.map(m => m.id);
      const sortedMessages = chatUtils.sortMessagesByTimestamp(messages);
      
      // Original array should be unchanged
      expect(messages.map(m => m.id)).toEqual(originalOrder);
      
      // Sorted array should be different
      expect(sortedMessages.map(m => m.id)).toEqual(['1', '2']);
    });
  });

  describe('sortChatsByLastMessage', () => {
    it('should sort chats by last message timestamp in descending order (most recent first)', () => {
      const chats: ChatListItem[] = [
        {
          id: '1',
          name: 'Chat 1',
          type: 'center',
          lastMessage: 'Old message',
          timestamp: new Date('2025-01-01T10:00:00Z'),
          unreadCount: 0,
        },
        {
          id: '2',
          name: 'Chat 2',
          type: 'parent',
          lastMessage: 'Recent message',
          timestamp: new Date('2025-01-01T12:00:00Z'),
          unreadCount: 1,
        },
        {
          id: '3',
          name: 'Chat 3',
          type: 'center',
          lastMessage: 'Middle message',
          timestamp: new Date('2025-01-01T11:00:00Z'),
          unreadCount: 0,
        },
      ];

      const sortedChats = chatUtils.sortChatsByLastMessage(chats);
      
      expect(sortedChats).toHaveLength(3);
      expect(sortedChats[0].name).toBe('Chat 2'); // Most recent
      expect(sortedChats[1].name).toBe('Chat 3'); // Middle
      expect(sortedChats[2].name).toBe('Chat 1'); // Oldest
    });

    it('should fall back to alphabetical sorting when timestamps are missing', () => {
      const chats: ChatListItem[] = [
        {
          id: '1',
          name: 'Zebra Chat',
          type: 'center',
          lastMessage: '',
          unreadCount: 0,
        },
        {
          id: '2',
          name: 'Alpha Chat',
          type: 'parent',
          lastMessage: '',
          unreadCount: 0,
        },
      ];

      const sortedChats = chatUtils.sortChatsByLastMessage(chats);
      
      expect(sortedChats[0].name).toBe('Alpha Chat');
      expect(sortedChats[1].name).toBe('Zebra Chat');
    });

    it('should not mutate the original array', () => {
      const chats: ChatListItem[] = [
        {
          id: '2',
          name: 'Chat B',
          type: 'center',
          lastMessage: 'Message',
          timestamp: new Date('2025-01-01T12:00:00Z'),
          unreadCount: 0,
        },
        {
          id: '1',
          name: 'Chat A',
          type: 'parent',
          lastMessage: 'Message',
          timestamp: new Date('2025-01-01T10:00:00Z'),
          unreadCount: 0,
        },
      ];

      const originalOrder = chats.map(c => c.id);
      const sortedChats = chatUtils.sortChatsByLastMessage(chats);
      
      // Original array should be unchanged
      expect(chats.map(c => c.id)).toEqual(originalOrder);
      
      // Sorted array should be different (most recent first)
      expect(sortedChats.map(c => c.id)).toEqual(['2', '1']);
    });
  });
});