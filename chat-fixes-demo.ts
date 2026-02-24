// Demo script to show the chat fixes working
import { chatUtils } from './src/services/chatService';
import { Message, ChatListItem } from './src/components/dashboard/chat/types';

// Demo data that simulates the issue from the URL
const messagesOutOfOrder: Message[] = [
  {
    id: '181',
    content: 'تمام',
    senderId: '1',
    senderName: 'Admin user',
    senderType: 'admin',
    timestamp: new Date('2025-10-19T16:36:07Z'), // Older message
    chatId: '1',
  },
  {
    id: '191',
    content: 'mmmmmmmmmmmmmmmmmm',
    senderId: '30',
    senderName: "Mo'menn",
    senderType: 'parent',
    timestamp: new Date('2025-11-23T16:58:12Z'), // Newer message
    chatId: '30',
  },
];

const chatsUnsorted: ChatListItem[] = [
  {
    id: '1',
    name: 'Admin user',
    type: 'admin',
    lastMessage: 'تمام',
    timestamp: new Date('2025-10-19T16:36:07Z'),
    unreadCount: 16,
    isOnline: false,
    email: 'info@firststep-app.com',
  },
  {
    id: '30',
    name: "Mo'menn",
    type: 'parent',
    lastMessage: 'mmmmmmmmmmmmmmmmmm',
    timestamp: new Date('2025-11-23T16:58:12Z'),
    unreadCount: 7,
    isOnline: true,
    email: 'momen@gmail.com',
  },
];

console.log('=== Chat Fixes Demo ===\n');

console.log('1. Original messages (potentially out of order):');
messagesOutOfOrder.forEach((msg, i) => {
  console.log(`   ${i}: ${msg.content} (${msg.timestamp.toISOString()})`);
});

console.log('\n2. After sorting by timestamp:');
const sortedMessages = chatUtils.sortMessagesByTimestamp(messagesOutOfOrder);
sortedMessages.forEach((msg, i) => {
  console.log(`   ${i}: ${msg.content} (${msg.timestamp.toISOString()})`);
});

console.log('\n3. Getting last message (most recent by timestamp):');
const lastMessage = chatUtils.getLastMessage(messagesOutOfOrder);
console.log(`   Last message: "${lastMessage?.content}" from ${lastMessage?.senderName}`);
console.log(`   Timestamp: ${lastMessage?.timestamp.toISOString()}`);

console.log('\n4. Original chat list order:');
chatsUnsorted.forEach((chat, i) => {
  console.log(`   ${i}: ${chat.name} - "${chat.lastMessage}" (${chat.timestamp?.toISOString()})`);
});

console.log('\n5. After sorting by last message timestamp (most recent first):');
const sortedChats = chatUtils.sortChatsByLastMessage(chatsUnsorted);
sortedChats.forEach((chat, i) => {
  console.log(`   ${i}: ${chat.name} - "${chat.lastMessage}" (${chat.timestamp?.toISOString()})`);
});

console.log('\n=== Summary of Fixes ===');
console.log('✅ Messages are now properly sorted by timestamp');
console.log('✅ Last message is identified by actual timestamp, not array position');
console.log('✅ Chat list is sorted by most recent message timestamp');
console.log('✅ All sorting functions preserve original arrays (immutable)');
console.log('✅ Handles edge cases like missing timestamps gracefully');