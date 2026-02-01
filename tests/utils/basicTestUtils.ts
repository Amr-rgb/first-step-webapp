import { testData } from '../mocks/data/testData';

// Test utilities for chat testing (without JSX dependencies)
export const chatTestUtils = {
  // Create a mock auth token for testing
  createMockAuthToken: (role: 'admin' | 'parent' | 'center' = 'parent') => {
    return `Bearer ${testData.tokens[role]}`;
  },

  // Create a mock user for testing
  createMockUser: (role: 'admin' | 'parent' | 'center' = 'parent', id?: string) => {
    const baseUser = testData.users[role === 'parent' ? 'parent1' : role === 'center' ? 'center1' : 'admin'];
    return {
      ...baseUser,
      id: id || baseUser.id,
    };
  },

  // Create a mock message for testing
  createMockMessage: (overrides: Partial<any> = {}) => {
    return {
      id: Date.now().toString(),
      sender_id: 2,
      receiver_id: 4,
      message: 'Test message',
      image: null,
      video_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_read: false,
      is_read_admin: false,
      image_url: null,
      video_url_path: null,
      ...overrides,
    };
  },

  // Create a mock conversation for testing
  createMockConversation: (messageCount: number = 5) => {
    const participants = ['2', '4']; // Parent and Center
    return testData.testDataGenerators.generateConversation(messageCount, participants);
  },

  // Simulate network delay for testing
  simulateNetworkDelay: (ms: number = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Create a mock API response
  createMockApiResponse: <T>(data: T, status: number = 200) => {
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
    } as Response;
  },

  // Validate message structure
  validateMessageStructure: (message: any) => {
    const requiredFields = ['id', 'sender_id', 'receiver_id', 'message', 'created_at'];
    return requiredFields.every(field => message.hasOwnProperty(field));
  },

  // Validate user role permissions
  validateRolePermissions: (senderRole: string, receiverRole: string) => {
    const validCombinations = [
      ['admin', 'parent'],
      ['admin', 'center'],
      ['parent', 'center'],
      ['center', 'parent'],
    ];
    
    return validCombinations.some(([sender, receiver]) => 
      sender === senderRole && receiver === receiverRole
    );
  },

  // Generate test data for property-based testing
  generateTestScenarios: {
    // Generate role-based access scenarios
    roleAccessScenarios: () => {
      const roles = ['admin', 'parent', 'center'];
      const scenarios = [];
      
      for (const sender of roles) {
        for (const receiver of roles) {
          scenarios.push({
            sender,
            receiver,
            allowed: chatTestUtils.validateRolePermissions(sender, receiver),
          });
        }
      }
      
      return scenarios;
    },

    // Generate message validation scenarios
    messageValidationScenarios: () => {
      return [
        { message: 'Valid message', valid: true },
        { message: '', valid: false },
        { message: 'A'.repeat(1001), valid: false },
        { message: 'Normal length message', valid: true },
        { message: '   ', valid: false }, // Only whitespace
        { message: 'Message with emoji 😊', valid: true },
      ];
    },

    // Generate security test scenarios
    securityTestScenarios: () => {
      return testData.scenarios.maliciousPayloads.map(payload => ({
        payload,
        shouldBeSanitized: true,
        expectedResult: 'sanitized',
      }));
    },

    // Generate performance test scenarios
    performanceTestScenarios: () => {
      return Object.entries(testData.scenarios.performanceScenarios).map(([name, config]) => ({
        name,
        ...config,
        expectedLatency: config.messageCount < 100 ? 500 : config.messageCount < 1000 ? 2000 : 5000,
      }));
    },
  },
};

// Performance measurement utilities
export const performanceUtils = {
  // Measure function execution time
  measureExecutionTime: async <T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { result, duration: end - start };
  },

  // Measure memory usage (mock for testing)
  measureMemoryUsage: () => {
    // In a real browser environment, this would use performance.memory
    return {
      usedJSHeapSize: Math.random() * 50 * 1024 * 1024, // Mock 0-50MB
      totalJSHeapSize: 100 * 1024 * 1024, // Mock 100MB total
      jsHeapSizeLimit: 2 * 1024 * 1024 * 1024, // Mock 2GB limit
    };
  },

  // Create performance benchmarks
  createBenchmark: (name: string, threshold: number) => ({
    name,
    threshold,
    measure: async <T>(fn: () => Promise<T>) => {
      const { result, duration } = await performanceUtils.measureExecutionTime(fn);
      return {
        result,
        duration,
        passed: duration <= threshold,
        benchmark: name,
      };
    },
  }),
};

// Security testing utilities
export const securityUtils = {
  // Test for XSS vulnerabilities
  testXSSPrevention: (input: string, output: string) => {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];
    
    return dangerousPatterns.every(pattern => !pattern.test(output));
  },

  // Test for SQL injection patterns
  testSQLInjectionPrevention: (input: string) => {
    const sqlPatterns = [
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
      /union\s+select/i,
      /'\s*or\s*'1'\s*=\s*'1/i,
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  },

  // Generate malicious payloads for testing
  generateMaliciousPayloads: () => testData.scenarios.maliciousPayloads,

  // Validate input sanitization
  validateSanitization: (original: string, sanitized: string) => {
    return {
      original,
      sanitized,
      wasSanitized: original !== sanitized,
      isSafe: securityUtils.testXSSPrevention(original, sanitized),
    };
  },
};

// Database testing utilities
export const databaseUtils = {
  // Mock database operations for testing
  mockDatabase: {
    messages: [...testData.messages],
    users: Object.values(testData.users),
    
    // Simulate database queries
    findMessages: (senderId: string, receiverId: string) => {
      return databaseUtils.mockDatabase.messages.filter(msg => 
        (msg.sender_id.toString() === senderId && msg.receiver_id.toString() === receiverId) ||
        (msg.sender_id.toString() === receiverId && msg.receiver_id.toString() === senderId)
      );
    },
    
    insertMessage: (message: any) => {
      const newMessage = { ...message, id: Date.now() };
      databaseUtils.mockDatabase.messages.push(newMessage);
      return newMessage;
    },
    
    updateMessage: (id: number, updates: any) => {
      const index = databaseUtils.mockDatabase.messages.findIndex(msg => msg.id === id);
      if (index !== -1) {
        databaseUtils.mockDatabase.messages[index] = { 
          ...databaseUtils.mockDatabase.messages[index], 
          ...updates 
        };
        return databaseUtils.mockDatabase.messages[index];
      }
      return null;
    },
    
    // Reset database to initial state
    reset: () => {
      databaseUtils.mockDatabase.messages = [...testData.messages];
      databaseUtils.mockDatabase.users = Object.values(testData.users);
    },
  },

  // Measure query performance
  measureQueryPerformance: async (queryFn: () => Promise<any>) => {
    return performanceUtils.measureExecutionTime(queryFn);
  },
};