import {
  AdminUserProfile,
  ParentUserProfile,
  CenterUserProfile,
  UserRelationship,
  RoleAccessScenario,
  RoleBasedTestScenario,
  AdminPermission
} from '../../generators/userProfileGenerators';

// ============================================================================
// Predefined Test Users for Consistent Testing
// ============================================================================

/**
 * Super Admin with full permissions
 */
export const superAdmin: AdminUserProfile = {
  id: 'admin_001',
  name: 'Super Admin',
  email: 'superadmin@example.com',
  role: 'admin',
  avatar: 'https://example.com/avatars/superadmin.jpg',
  phone: '+15551234567',
  address: '123 Admin St, Management City, CA 90210',
  isOnline: true,
  lastSeen: new Date().toISOString(),
  createdAt: '2020-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  permissions: [
    'VIEW_ALL_CONVERSATIONS',
    'MODERATE_MESSAGES',
    'MANAGE_USERS',
    'SYSTEM_SETTINGS',
    'AUDIT_LOGS',
    'BACKUP_DATA',
    'SECURITY_SETTINGS'
  ] as AdminPermission[],
  canViewAllConversations: true,
  canModerateMessages: true,
  canManageUsers: true,
  adminLevel: 'super'
};

/**
 * Standard Admin with limited permissions
 */
export const standardAdmin: AdminUserProfile = {
  id: 'admin_002',
  name: 'Standard Admin',
  email: 'admin@example.com',
  role: 'admin',
  avatar: 'https://example.com/avatars/admin.jpg',
  phone: '+15551234568',
  address: '456 Admin Ave, Management City, CA 90211',
  isOnline: false,
  lastSeen: '2024-01-15T14:30:00Z',
  createdAt: '2020-06-01T00:00:00Z',
  updatedAt: '2024-01-15T14:30:00Z',
  permissions: [
    'VIEW_ALL_CONVERSATIONS',
    'MODERATE_MESSAGES',
    'AUDIT_LOGS'
  ] as AdminPermission[],
  canViewAllConversations: true,
  canModerateMessages: true,
  canManageUsers: false,
  adminLevel: 'standard'
};

/**
 * Limited Admin with minimal permissions
 */
export const limitedAdmin: AdminUserProfile = {
  id: 'admin_003',
  name: 'Limited Admin',
  email: 'limitedadmin@example.com',
  role: 'admin',
  isOnline: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  permissions: ['VIEW_ALL_CONVERSATIONS'] as AdminPermission[],
  canViewAllConversations: true,
  canModerateMessages: false,
  canManageUsers: false,
  adminLevel: 'limited'
};

/**
 * Parent with multiple children
 */
export const parentWithMultipleChildren: ParentUserProfile = {
  id: 'parent_001',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  role: 'parent',
  avatar: 'https://example.com/avatars/sarah.jpg',
  phone: '+15559876543',
  address: '789 Family Lane, Suburbia, CA 90212',
  isOnline: true,
  lastSeen: new Date().toISOString(),
  createdAt: '2021-03-15T00:00:00Z',
  updatedAt: new Date().toISOString(),
  children: [
    {
      id: 'child_001',
      name: 'Emma Johnson',
      age: 4,
      enrolledCenterId: 'center_001',
      specialNeeds: ['Speech Therapy'],
      allergies: ['Peanuts', 'Dairy']
    },
    {
      id: 'child_002',
      name: 'Liam Johnson',
      age: 2,
      enrolledCenterId: 'center_001',
      allergies: ['Eggs']
    }
  ],
  assignedCenters: ['center_001', 'center_002'],
  emergencyContact: {
    name: 'Michael Johnson',
    phone: '+15559876544',
    relationship: 'Spouse'
  },
  preferences: {
    notificationSettings: {
      email: true,
      sms: true,
      push: true
    },
    communicationHours: {
      start: '07:00',
      end: '20:00'
    },
    language: 'en'
  }
};

/**
 * Single parent with one child
 */
export const singleParent: ParentUserProfile = {
  id: 'parent_002',
  name: 'Maria Rodriguez',
  email: 'maria.rodriguez@example.com',
  role: 'parent',
  avatar: 'https://example.com/avatars/maria.jpg',
  phone: '+15555551234',
  address: '321 Single St, Downtown, CA 90213',
  isOnline: false,
  lastSeen: '2024-01-15T18:45:00Z',
  createdAt: '2022-01-10T00:00:00Z',
  updatedAt: '2024-01-15T18:45:00Z',
  children: [
    {
      id: 'child_003',
      name: 'Sofia Rodriguez',
      age: 3,
      enrolledCenterId: 'center_002',
      specialNeeds: ['ADHD'],
      allergies: ['Tree Nuts']
    }
  ],
  assignedCenters: ['center_002'],
  emergencyContact: {
    name: 'Carmen Rodriguez',
    phone: '+15555551235',
    relationship: 'Grandmother'
  },
  preferences: {
    notificationSettings: {
      email: true,
      sms: false,
      push: true
    },
    communicationHours: {
      start: '08:00',
      end: '19:00'
    },
    language: 'es'
  }
};

/**
 * Parent with no assigned centers (edge case)
 */
export const parentWithoutCenters: ParentUserProfile = {
  id: 'parent_003',
  name: 'David Chen',
  email: 'david.chen@example.com',
  role: 'parent',
  phone: '+15555556789',
  isOnline: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  children: [
    {
      id: 'child_004',
      name: 'Alex Chen',
      age: 5
    }
  ],
  assignedCenters: [], // No assigned centers
  preferences: {
    notificationSettings: {
      email: true,
      sms: true,
      push: false
    },
    communicationHours: {
      start: '09:00',
      end: '18:00'
    },
    language: 'en'
  }
};

/**
 * Large daycare center
 */
export const largeDaycareCenter: CenterUserProfile = {
  id: 'center_001',
  name: 'Sunshine Learning Center',
  email: 'info@sunshinelearning.com',
  role: 'center',
  avatar: 'https://example.com/avatars/sunshine.jpg',
  phone: '+15551112222',
  address: '100 Learning Blvd, Education District, CA 90214',
  isOnline: true,
  lastSeen: new Date().toISOString(),
  createdAt: '2019-05-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  enrolledParents: ['parent_001', 'parent_004', 'parent_005', 'parent_006'],
  centerInfo: {
    centerName: 'Sunshine Learning Center',
    licenseNumber: 'DC-123456',
    address: '100 Learning Blvd, Education District, CA 90214',
    website: 'https://www.sunshinelearning.com',
    description: 'A nurturing environment where children learn and grow through play-based activities.',
    ageGroups: ['Infants', 'Toddlers', 'Preschool', 'Pre-K'],
    services: ['Full-time Care', 'Part-time Care', 'Meals Provided', 'Transportation', 'Special Needs Support']
  },
  operatingHours: {
    monday: { isOpen: true, openTime: '07:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '07:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '07:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '07:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '07:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
    sunday: { isOpen: false }
  },
  capacity: 120,
  currentEnrollment: 95
};

/**
 * Small family daycare
 */
export const smallFamilyDaycare: CenterUserProfile = {
  id: 'center_002',
  name: 'Little Stars Family Daycare',
  email: 'contact@littlestars.com',
  role: 'center',
  avatar: 'https://example.com/avatars/littlestars.jpg',
  phone: '+15553334444',
  address: '456 Home St, Residential Area, CA 90215',
  isOnline: false,
  lastSeen: '2024-01-15T17:00:00Z',
  createdAt: '2020-08-15T00:00:00Z',
  updatedAt: '2024-01-15T17:00:00Z',
  enrolledParents: ['parent_002', 'parent_007'],
  centerInfo: {
    centerName: 'Little Stars Family Daycare',
    licenseNumber: 'FD-789012',
    address: '456 Home St, Residential Area, CA 90215',
    description: 'Small, family-oriented daycare providing personalized care for each child.',
    ageGroups: ['Toddlers', 'Preschool'],
    services: ['Full-time Care', 'Part-time Care', 'Meals Provided']
  },
  operatingHours: {
    monday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
    saturday: { isOpen: false },
    sunday: { isOpen: false }
  },
  capacity: 12,
  currentEnrollment: 8
};

/**
 * Center at full capacity (edge case)
 */
export const fullCapacityCenter: CenterUserProfile = {
  id: 'center_003',
  name: 'Busy Bees Academy',
  email: 'admin@busybees.com',
  role: 'center',
  phone: '+15555557777',
  isOnline: true,
  createdAt: '2018-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  enrolledParents: ['parent_008', 'parent_009', 'parent_010'],
  centerInfo: {
    centerName: 'Busy Bees Academy',
    licenseNumber: 'AC-345678',
    address: '789 Busy St, Active District, CA 90216',
    ageGroups: ['Preschool', 'Pre-K', 'School Age'],
    services: ['Full-time Care', 'Before/After School', 'Summer Camp']
  },
  operatingHours: {
    monday: { isOpen: true, openTime: '06:30', closeTime: '18:30' },
    tuesday: { isOpen: true, openTime: '06:30', closeTime: '18:30' },
    wednesday: { isOpen: true, openTime: '06:30', closeTime: '18:30' },
    thursday: { isOpen: true, openTime: '06:30', closeTime: '18:30' },
    friday: { isOpen: true, openTime: '06:30', closeTime: '18:30' },
    saturday: { isOpen: false },
    sunday: { isOpen: false }
  },
  capacity: 50,
  currentEnrollment: 50 // At full capacity
};

// ============================================================================
// Predefined Relationships
// ============================================================================

/**
 * Realistic user relationships for testing
 */
export const testRelationships: UserRelationship[] = [
  {
    parentId: 'parent_001',
    centerId: 'center_001',
    relationshipType: 'enrolled',
    establishedDate: '2021-03-20T00:00:00Z',
    childrenIds: ['child_001', 'child_002']
  },
  {
    parentId: 'parent_001',
    centerId: 'center_002',
    relationshipType: 'assigned',
    establishedDate: '2021-04-01T00:00:00Z',
    childrenIds: ['child_001']
  },
  {
    parentId: 'parent_002',
    centerId: 'center_002',
    relationshipType: 'enrolled',
    establishedDate: '2022-01-15T00:00:00Z',
    childrenIds: ['child_003']
  },
  // Parent without centers has no relationships
  // This tests the edge case of a parent with no assigned centers
];

// ============================================================================
// Test Scenarios
// ============================================================================

/**
 * Comprehensive role-based access scenarios
 */
export const roleBasedAccessScenarios: RoleAccessScenario[] = [
  // Admin scenarios (should all be allowed)
  {
    senderId: 'admin_001',
    senderRole: 'admin',
    receiverId: 'parent_001',
    receiverRole: 'parent',
    isAllowed: true,
    reason: 'Admin has universal access',
    relationshipType: 'admin_override'
  },
  {
    senderId: 'admin_001',
    senderRole: 'admin',
    receiverId: 'center_001',
    receiverRole: 'center',
    isAllowed: true,
    reason: 'Admin has universal access',
    relationshipType: 'admin_override'
  },
  {
    senderId: 'admin_002',
    senderRole: 'admin',
    receiverId: 'parent_002',
    receiverRole: 'parent',
    isAllowed: true,
    reason: 'Admin has universal access',
    relationshipType: 'admin_override'
  },

  // Parent-Center scenarios (allowed with relationships)
  {
    senderId: 'parent_001',
    senderRole: 'parent',
    receiverId: 'center_001',
    receiverRole: 'center',
    isAllowed: true,
    reason: 'Parent assigned to center',
    relationshipType: 'assigned'
  },
  {
    senderId: 'parent_001',
    senderRole: 'parent',
    receiverId: 'center_002',
    receiverRole: 'center',
    isAllowed: true,
    reason: 'Parent assigned to center',
    relationshipType: 'assigned'
  },
  {
    senderId: 'parent_002',
    senderRole: 'parent',
    receiverId: 'center_002',
    receiverRole: 'center',
    isAllowed: true,
    reason: 'Parent assigned to center',
    relationshipType: 'assigned'
  },

  // Center-Parent scenarios (allowed with relationships)
  {
    senderId: 'center_001',
    senderRole: 'center',
    receiverId: 'parent_001',
    receiverRole: 'parent',
    isAllowed: true,
    reason: 'Center has enrolled parent',
    relationshipType: 'enrolled'
  },
  {
    senderId: 'center_002',
    senderRole: 'center',
    receiverId: 'parent_001',
    receiverRole: 'parent',
    isAllowed: true,
    reason: 'Center has enrolled parent',
    relationshipType: 'enrolled'
  },
  {
    senderId: 'center_002',
    senderRole: 'center',
    receiverId: 'parent_002',
    receiverRole: 'parent',
    isAllowed: true,
    reason: 'Center has enrolled parent',
    relationshipType: 'enrolled'
  },

  // Denied scenarios
  {
    senderId: 'parent_003',
    senderRole: 'parent',
    receiverId: 'center_001',
    receiverRole: 'center',
    isAllowed: false,
    reason: 'Parent not assigned to center',
    relationshipType: 'none'
  },
  {
    senderId: 'center_001',
    senderRole: 'center',
    receiverId: 'parent_003',
    receiverRole: 'parent',
    isAllowed: false,
    reason: 'Center does not have enrolled parent',
    relationshipType: 'none'
  },
  {
    senderId: 'parent_001',
    senderRole: 'parent',
    receiverId: 'parent_002',
    receiverRole: 'parent',
    isAllowed: false,
    reason: 'parent cannot chat with parent',
    relationshipType: 'none'
  },
  {
    senderId: 'center_001',
    senderRole: 'center',
    receiverId: 'center_002',
    receiverRole: 'center',
    isAllowed: false,
    reason: 'center cannot chat with center',
    relationshipType: 'none'
  },

  // Self-chat scenarios (should be denied)
  {
    senderId: 'parent_001',
    senderRole: 'parent',
    receiverId: 'parent_001',
    receiverRole: 'parent',
    isAllowed: false,
    reason: 'Cannot chat with self',
    relationshipType: 'none'
  },
  {
    senderId: 'admin_001',
    senderRole: 'admin',
    receiverId: 'admin_001',
    receiverRole: 'admin',
    isAllowed: false,
    reason: 'Cannot chat with self',
    relationshipType: 'none'
  }
];

/**
 * Complete test scenario with all users and relationships
 */
export const completeTestScenario: RoleBasedTestScenario = {
  users: [
    superAdmin,
    standardAdmin,
    limitedAdmin,
    parentWithMultipleChildren,
    singleParent,
    parentWithoutCenters,
    largeDaycareCenter,
    smallFamilyDaycare,
    fullCapacityCenter
  ],
  relationships: testRelationships,
  accessScenarios: roleBasedAccessScenarios,
  expectedOutcomes: {
    allowedCommunications: roleBasedAccessScenarios.filter(s => s.isAllowed).length,
    deniedCommunications: roleBasedAccessScenarios.filter(s => !s.isAllowed).length,
    adminOverrides: roleBasedAccessScenarios.filter(s => s.relationshipType === 'admin_override').length
  }
};

// ============================================================================
// Edge Case Scenarios
// ============================================================================

/**
 * Edge case test scenarios for comprehensive testing
 */
export const edgeCaseScenarios = {
  /**
   * Parent with no assigned centers
   */
  parentWithoutCenters: {
    user: parentWithoutCenters,
    expectedBehavior: 'Should not be able to chat with any centers',
    testCases: [
      {
        targetId: 'center_001',
        targetRole: 'center' as const,
        expectedResult: false,
        reason: 'Parent not assigned to center'
      },
      {
        targetId: 'center_002',
        targetRole: 'center' as const,
        expectedResult: false,
        reason: 'Parent not assigned to center'
      }
    ]
  },

  /**
   * Center at full capacity
   */
  centerAtCapacity: {
    user: fullCapacityCenter,
    expectedBehavior: 'Should still allow communication with enrolled parents',
    testCases: [
      {
        targetId: 'parent_008',
        targetRole: 'parent' as const,
        expectedResult: true,
        reason: 'Center has enrolled parent (capacity does not affect communication)'
      }
    ]
  },

  /**
   * Admin with limited permissions
   */
  limitedAdminAccess: {
    user: limitedAdmin,
    expectedBehavior: 'Should still have universal chat access despite limited permissions',
    testCases: [
      {
        targetId: 'parent_001',
        targetRole: 'parent' as const,
        expectedResult: true,
        reason: 'Admin has universal access regardless of permission level'
      },
      {
        targetId: 'center_001',
        targetRole: 'center' as const,
        expectedResult: true,
        reason: 'Admin has universal access regardless of permission level'
      }
    ]
  },

  /**
   * Terminated relationships
   */
  terminatedRelationship: {
    relationship: {
      parentId: 'parent_004',
      centerId: 'center_001',
      relationshipType: 'terminated' as const,
      establishedDate: '2023-01-01T00:00:00Z',
      childrenIds: ['child_005']
    },
    expectedBehavior: 'Should not allow communication',
    testCase: {
      senderId: 'parent_004',
      receiverId: 'center_001',
      expectedResult: false,
      reason: 'Relationship has been terminated'
    }
  },

  /**
   * Pending relationships
   */
  pendingRelationship: {
    relationship: {
      parentId: 'parent_005',
      centerId: 'center_001',
      relationshipType: 'pending' as const,
      establishedDate: '2024-01-01T00:00:00Z',
      childrenIds: ['child_006']
    },
    expectedBehavior: 'Should not allow communication until approved',
    testCase: {
      senderId: 'parent_005',
      receiverId: 'center_001',
      expectedResult: false,
      reason: 'Relationship is still pending approval'
    }
  }
};

// ============================================================================
// Performance Test Data
// ============================================================================

/**
 * Performance test scenarios with varying data sizes
 */
export const performanceTestScenarios = {
  small: {
    description: 'Small scale test',
    userCounts: { admin: 1, parent: 5, center: 2 },
    expectedRelationships: 10,
    expectedAccessScenarios: 56, // (8 users * 7 other users)
    performanceThresholds: {
      accessValidationTime: 10, // milliseconds
      relationshipLookupTime: 5,  // milliseconds
      memoryUsage: 1024 * 1024   // 1MB
    }
  },
  medium: {
    description: 'Medium scale test',
    userCounts: { admin: 2, parent: 20, center: 5 },
    expectedRelationships: 40,
    expectedAccessScenarios: 702, // (27 users * 26 other users)
    performanceThresholds: {
      accessValidationTime: 50,   // milliseconds
      relationshipLookupTime: 20, // milliseconds
      memoryUsage: 5 * 1024 * 1024 // 5MB
    }
  },
  large: {
    description: 'Large scale test',
    userCounts: { admin: 5, parent: 100, center: 20 },
    expectedRelationships: 200,
    expectedAccessScenarios: 15500, // (125 users * 124 other users)
    performanceThresholds: {
      accessValidationTime: 200,   // milliseconds
      relationshipLookupTime: 100, // milliseconds
      memoryUsage: 20 * 1024 * 1024 // 20MB
    }
  }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get all test users as a flat array
 */
export const getAllTestUsers = () => [
  superAdmin,
  standardAdmin,
  limitedAdmin,
  parentWithMultipleChildren,
  singleParent,
  parentWithoutCenters,
  largeDaycareCenter,
  smallFamilyDaycare,
  fullCapacityCenter
];

/**
 * Get users by role
 */
export const getUsersByRole = (role: 'admin' | 'parent' | 'center') => {
  return getAllTestUsers().filter(user => user.role === role);
};

/**
 * Find relationships for a specific user
 */
export const getRelationshipsForUser = (userId: string) => {
  return testRelationships.filter(rel => 
    rel.parentId === userId || rel.centerId === userId
  );
};

/**
 * Check if two users have a relationship
 */
export const hasRelationship = (userId1: string, userId2: string) => {
  return testRelationships.some(rel => 
    (rel.parentId === userId1 && rel.centerId === userId2) ||
    (rel.centerId === userId1 && rel.parentId === userId2)
  );
};

/**
 * Get expected access result for two users
 */
export const getExpectedAccess = (senderId: string, receiverId: string) => {
  return roleBasedAccessScenarios.find(scenario => 
    scenario.senderId === senderId && scenario.receiverId === receiverId
  );
};