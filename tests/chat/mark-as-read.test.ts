import { chatService } from '@/services/chatService';
import { Message } from '@/components/dashboard/chat/types';

// Mock fetch globally
global.fetch = jest.fn();

describe('Mark as Read Functionality', () => {
  const mockToken = 'test-token';
  const mockUserId = '123';
  const mockChatId = '456';

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('markAsRead', () => {
    it('should call the correct API endpoint with proper parameters', async () => {
      const mockMessageId = '789';
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await chatService.markAsRead(mockMessageId, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/new-chat/mark-as-read'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ message_id: mockMessageId }),
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockMessageId = '789';
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });

      await expect(chatService.markAsRead(mockMessageId, mockToken))
        .rejects.toThrow('Failed to mark message as read');
    });

    it('should handle network errors', async () => {
      const mockMessageId = '789';
      
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(chatService.markAsRead(mockMessageId, mockToken))
        .rejects.toThrow('Network error');
    });
  });

  describe('markMultipleAsRead', () => {
    it('should mark multiple messages as read', async () => {
      const mockMessageIds = ['789', '790', '791'];
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await chatService.markMultipleAsRead(mockMessageIds, mockToken);

      // Should call markAsRead for each message
      expect(fetch).toHaveBeenCalledTimes(3);
      
      mockMessageIds.forEach((messageId, index) => {
        expect(fetch).toHaveBeenNthCalledWith(
          index + 1,
          expect.stringContaining('/new-chat/mark-as-read'),
          expect.objectContaining({
            body: JSON.stringify({ message_id: messageId }),
          })
        );
      });
    });

    it('should continue marking other messages even if one fails', async () => {
      const mockMessageIds = ['789', '790', '791'];
      
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
        .mockResolvedValueOnce({ ok: false, status: 400, text: async () => 'Bad Request' })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

      // Should not throw even if one message fails
      await expect(chatService.markMultipleAsRead(mockMessageIds, mockToken))
        .resolves.not.toThrow();

      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('markChatAsRead', () => {
    it('should mark all received messages in a chat as read', async () => {
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Message from other user',
          senderId: '999', // Different from current user
          senderName: 'Other User',
          senderType: 'center',
          timestamp: new Date(),
          chatId: mockChatId,
        },
        {
          id: '2',
          content: 'My message',
          senderId: mockUserId, // Same as current user - should not be marked as read
          senderName: 'Me',
          senderType: 'parent',
          timestamp: new Date(),
          chatId: mockChatId,
        },
        {
          id: '3',
          content: 'Another message from other user',
          senderId: '999', // Different from current user
          senderName: 'Other User',
          senderType: 'center',
          timestamp: new Date(),
          chatId: mockChatId,
        },
      ];

      // Mock getMessages to return our test messages
      const originalGetMessages = chatService.getMessages;
      chatService.getMessages = jest.fn().mockResolvedValue(mockMessages);

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await chatService.markChatAsRead(mockChatId, mockToken, mockUserId, 'parent');

      // Should only mark messages from other users as read (messages 1 and 3)
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/new-chat/mark-as-read'),
        expect.objectContaining({
          body: JSON.stringify({ message_id: '1' }),
        })
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/new-chat/mark-as-read'),
        expect.objectContaining({
          body: JSON.stringify({ message_id: '3' }),
        })
      );

      // Restore original function
      chatService.getMessages = originalGetMessages;
    });

    it('should handle empty chat gracefully', async () => {
      // Mock getMessages to return empty array
      const originalGetMessages = chatService.getMessages;
      chatService.getMessages = jest.fn().mockResolvedValue([]);

      await expect(chatService.markChatAsRead(mockChatId, mockToken, mockUserId, 'parent'))
        .resolves.not.toThrow();

      // Should not call mark as read API
      expect(fetch).not.toHaveBeenCalled();

      // Restore original function
      chatService.getMessages = originalGetMessages;
    });

    it('should not throw if marking messages fails', async () => {
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Message from other user',
          senderId: '999',
          senderName: 'Other User',
          senderType: 'center',
          timestamp: new Date(),
          chatId: mockChatId,
        },
      ];

      // Mock getMessages to return our test messages
      const originalGetMessages = chatService.getMessages;
      chatService.getMessages = jest.fn().mockResolvedValue(mockMessages);

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Server Error',
      });

      // Should not throw even if API fails
      await expect(chatService.markChatAsRead(mockChatId, mockToken, mockUserId, 'parent'))
        .resolves.not.toThrow();

      // Restore original function
      chatService.getMessages = originalGetMessages;
    });
  });

  describe('API Integration', () => {
    it('should use correct API base URL', async () => {
      const mockMessageId = '789';
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await chatService.markAsRead(mockMessageId, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/new-chat\/mark-as-read$/),
        expect.any(Object)
      );
    });

    it('should include required headers', async () => {
      const mockMessageId = '789';
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await chatService.markAsRead(mockMessageId, mockToken);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
            'X-Authorization': expect.any(String),
            'X-Authorization-Secret': expect.any(String),
          }),
        })
      );
    });
  });
});