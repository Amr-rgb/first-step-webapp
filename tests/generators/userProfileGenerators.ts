import * as fc from 'fast-check';

// ============================================================================
// TypeScript Interfaces for Test User Profiles
// ============================================================================

/**
 * Base user profile interface for all user types
 */
export interface BaseUserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'parent' | 'center';
  avatar?: string;
  phone?: string;
  address?: string;
  isOnline: boolean;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin user profile with elevated permissions
 */
export interface AdminUserProfile extends BaseUserProfile {
  role: 'admin';
  permissions: AdminPermission[];
  canViewAllConversations: boolean;
  canModerateMessages: boolean;
  canManageUsers: boolean;
  adminLevel: 'super' | 'standard' | 'limited';
}

/**
 * Parent user profile with child relationships
 */
export interface ParentUserProfile extends BaseUserProfile {
  role: 'parent';
  children: ChildInfo[];
  assignedCenters: string[]; // Center IDs this parent can communicate with
  emergencyContact?: EmergencyContact;
  preferences: ParentPreferences;
}

/**
 * Center user profile with parent relationships
 */
export interface CenterUserProfile extends BaseUserProfile {
  role: 'center';
  enrolledParents: string[]; // Parent IDs this center can communicate with
  centerInfo: CenterInfo;
  operatingHours: OperatingHours;
  capacity: number;
  currentEnrollment: number;
}

/**
 * Child information for parent profiles
 */
export interface ChildInfo {
  id: string;
  name: string;
  age: number;
  enrolledCenterId?: string;
  specialNeeds?: string[];
  allergies?: string[];
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

/**
 * Parent preferences for communication
 */
export interface ParentPreferences {
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  communicationHours: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  language: string;
}

/**
 * Center information
 */
export interface CenterInfo {
  centerName: string;
  licenseNumber: string;
  address: string;
  website?: string;
  description?: string;
  ageGroups: string[];
  services: string[];
}

/**
 * Operating hours for centers
 */
export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

/**
 * Daily schedule
 */
export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
}

/**
 * Admin permissions enum
 */
export type AdminPermission = 
  | 'VIEW_ALL_CONVERSATIONS'
  | 'MODERATE_MESSAGES'
  | 'MANAGE_USERS'
  | 'SYSTEM_SETTINGS'
  | 'AUDIT_LOGS'
  | 'BACKUP_DATA'
  | 'SECURITY_SETTINGS';

/**
 * Role-based access control scenario
 */
export interface RoleAccessScenario {
  senderId: string;
  senderRole: 'admin' | 'parent' | 'center';
  receiverId: string;
  receiverRole: 'admin' | 'parent' | 'center';
  isAllowed: boolean;
  reason: string;
  relationshipType?: 'assigned' | 'enrolled' | 'admin_override' | 'none';
}

/**
 * User relationship mapping
 */
export interface UserRelationship {
  parentId: string;
  centerId: string;
  relationshipType: 'enrolled' | 'assigned' | 'pending' | 'terminated';
  establishedDate: string;
  childrenIds: string[];
}

/**
 * Test scenario for role-based testing
 */
export interface RoleBasedTestScenario {
  users: (AdminUserProfile | ParentUserProfile | CenterUserProfile)[];
  relationships: UserRelationship[];
  accessScenarios: RoleAccessScenario[];
  expectedOutcomes: {
    allowedCommunications: number;
    deniedCommunications: number;
    adminOverrides: number;
  };
}

// ============================================================================
// Property-Based Generators
// ============================================================================

/**
 * Generate a valid user ID
 */
export const userIdArb = fc.integer({ min: 1, max: 999999 }).map(id => `user_${id}`);

/**
 * Generate a realistic name
 */
export const nameArb = fc.oneof(
  fc.constantFrom(
    'John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Wilson', 'David Brown',
    'Emily Davis', 'Robert Miller', 'Lisa Anderson', 'William Taylor', 'Jennifer Thomas',
    'Christopher Jackson', 'Amanda White', 'Matthew Harris', 'Jessica Martin', 'Daniel Thompson',
    'Ashley Garcia', 'James Martinez', 'Melissa Robinson', 'Joseph Clark', 'Stephanie Rodriguez'
  ),
  fc.record({
    first: fc.constantFrom('Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn'),
    last: fc.constantFrom('Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez')
  }).map(({ first, last }) => `${first} ${last}`)
);

/**
 * Generate a valid email address
 */
export const emailArb = fc.record({
  username: fc.string({ minLength: 3, maxLength: 15 }).filter(s => /^[a-z0-9]+$/.test(s)),
  domain: fc.constantFrom('example.com', 'test.org', 'demo.net', 'sample.edu', 'mock.gov')
}).map(({ username, domain }) => `${username}@${domain}`);

/**
 * Generate a phone number
 */
export const phoneArb = fc.record({
  area: fc.integer({ min: 200, max: 999 }),
  exchange: fc.integer({ min: 200, max: 999 }),
  number: fc.integer({ min: 1000, max: 9999 })
}).map(({ area, exchange, number }) => `+1${area}${exchange}${number}`);

/**
 * Generate an address
 */
export const addressArb = fc.record({
  street: fc.integer({ min: 1, max: 9999 }),
  streetName: fc.constantFrom('Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Maple Ln', 'Cedar Blvd'),
  city: fc.constantFrom('Springfield', 'Franklin', 'Georgetown', 'Madison', 'Washington', 'Lincoln'),
  state: fc.constantFrom('CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'),
  zip: fc.integer({ min: 10000, max: 99999 })
}).map(({ street, streetName, city, state, zip }) => 
  `${street} ${streetName}, ${city}, ${state} ${zip}`
);

/**
 * Generate a timestamp
 */
export const timestampArb = fc.integer({ min: 1577836800000, max: 1735689599000 }) // 2020-01-01 to 2024-12-31
  .map(timestamp => new Date(timestamp).toISOString());

/**
 * Generate admin permissions
 */
export const adminPermissionsArb = fc.subarray([
  'VIEW_ALL_CONVERSATIONS',
  'MODERATE_MESSAGES',
  'MANAGE_USERS',
  'SYSTEM_SETTINGS',
  'AUDIT_LOGS',
  'BACKUP_DATA',
  'SECURITY_SETTINGS'
] as AdminPermission[], { minLength: 1, maxLength: 7 });

/**
 * Generate child information
 */
export const childInfoArb = fc.record({
  id: userIdArb,
  name: nameArb,
  age: fc.integer({ min: 0, max: 18 }),
  enrolledCenterId: fc.option(userIdArb, { nil: undefined }),
  specialNeeds: fc.option(
    fc.subarray(['ADHD', 'Autism', 'Dyslexia', 'Speech Therapy', 'Physical Therapy'], 
    { minLength: 0, maxLength: 3 }), 
    { nil: undefined }
  ),
  allergies: fc.option(
    fc.subarray(['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'], 
    { minLength: 0, maxLength: 4 }), 
    { nil: undefined }
  )
});

/**
 * Generate emergency contact
 */
export const emergencyContactArb = fc.record({
  name: nameArb,
  phone: phoneArb,
  relationship: fc.constantFrom('Spouse', 'Parent', 'Sibling', 'Grandparent', 'Friend', 'Neighbor')
});

/**
 * Generate parent preferences
 */
export const parentPreferencesArb = fc.record({
  notificationSettings: fc.record({
    email: fc.boolean(),
    sms: fc.boolean(),
    push: fc.boolean()
  }),
  communicationHours: fc.record({
    start: fc.constantFrom('06:00', '07:00', '08:00', '09:00'),
    end: fc.constantFrom('18:00', '19:00', '20:00', '21:00', '22:00')
  }),
  language: fc.constantFrom('en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja')
});

/**
 * Generate day schedule
 */
export const dayScheduleArb = fc.record({
  isOpen: fc.boolean(),
  openTime: fc.option(fc.constantFrom('06:00', '07:00', '08:00', '09:00'), { nil: undefined }),
  closeTime: fc.option(fc.constantFrom('16:00', '17:00', '18:00', '19:00'), { nil: undefined })
}).map(schedule => ({
  ...schedule,
  openTime: schedule.isOpen ? schedule.openTime || '08:00' : undefined,
  closeTime: schedule.isOpen ? schedule.closeTime || '17:00' : undefined
}));

/**
 * Generate operating hours
 */
export const operatingHoursArb = fc.record({
  monday: dayScheduleArb,
  tuesday: dayScheduleArb,
  wednesday: dayScheduleArb,
  thursday: dayScheduleArb,
  friday: dayScheduleArb,
  saturday: dayScheduleArb,
  sunday: dayScheduleArb
});

/**
 * Generate center information
 */
export const centerInfoArb = fc.record({
  centerName: fc.record({
    prefix: fc.constantFrom('Sunshine', 'Rainbow', 'Little Stars', 'Bright Future', 'Happy Kids', 'Growing Minds'),
    suffix: fc.constantFrom('Daycare', 'Learning Center', 'Preschool', 'Academy', 'School', 'Care Center')
  }).map(({ prefix, suffix }) => `${prefix} ${suffix}`),
  licenseNumber: fc.record({
    prefix: fc.constantFrom('DC', 'LC', 'PS', 'CC'),
    number: fc.integer({ min: 100000, max: 999999 })
  }).map(({ prefix, number }) => `${prefix}-${number}`),
  address: addressArb,
  website: fc.option(
    fc.record({
      name: fc.string({ minLength: 5, maxLength: 15 }).filter(s => /^[a-z]+$/.test(s)),
      tld: fc.constantFrom('com', 'org', 'net', 'edu')
    }).map(({ name, tld }) => `https://www.${name}.${tld}`),
    { nil: undefined }
  ),
  description: fc.option(
    fc.constantFrom(
      'A nurturing environment for children to learn and grow.',
      'Quality childcare with experienced staff.',
      'Educational programs for early childhood development.',
      'Safe and fun learning environment for kids.',
      'Comprehensive care and education for young children.'
    ),
    { nil: undefined }
  ),
  ageGroups: fc.subarray(['Infants', 'Toddlers', 'Preschool', 'Pre-K', 'School Age'], 
    { minLength: 1, maxLength: 5 }),
  services: fc.subarray([
    'Full-time Care', 'Part-time Care', 'Drop-in Care', 'Before/After School',
    'Summer Camp', 'Meals Provided', 'Transportation', 'Special Needs Support'
  ], { minLength: 1, maxLength: 6 })
});

/**
 * Generate Admin User Profile
 */
export const adminUserProfileArb: fc.Arbitrary<AdminUserProfile> = fc.record({
  id: userIdArb,
  name: nameArb,
  email: emailArb,
  role: fc.constant('admin' as const),
  avatar: fc.option(fc.webUrl(), { nil: undefined }),
  phone: fc.option(phoneArb, { nil: undefined }),
  address: fc.option(addressArb, { nil: undefined }),
  isOnline: fc.boolean(),
  lastSeen: fc.option(timestampArb, { nil: undefined }),
  createdAt: timestampArb,
  updatedAt: timestampArb,
  permissions: adminPermissionsArb,
  canViewAllConversations: fc.boolean(),
  canModerateMessages: fc.boolean(),
  canManageUsers: fc.boolean(),
  adminLevel: fc.constantFrom('super', 'standard', 'limited')
});

/**
 * Generate Parent User Profile
 */
export const parentUserProfileArb: fc.Arbitrary<ParentUserProfile> = fc.record({
  id: userIdArb,
  name: nameArb,
  email: emailArb,
  role: fc.constant('parent' as const),
  avatar: fc.option(fc.webUrl(), { nil: undefined }),
  phone: fc.option(phoneArb, { nil: undefined }),
  address: fc.option(addressArb, { nil: undefined }),
  isOnline: fc.boolean(),
  lastSeen: fc.option(timestampArb, { nil: undefined }),
  createdAt: timestampArb,
  updatedAt: timestampArb,
  children: fc.array(childInfoArb, { minLength: 1, maxLength: 4 }),
  assignedCenters: fc.array(userIdArb, { minLength: 0, maxLength: 3 }),
  emergencyContact: fc.option(emergencyContactArb, { nil: undefined }),
  preferences: parentPreferencesArb
});

/**
 * Generate Center User Profile
 */
export const centerUserProfileArb: fc.Arbitrary<CenterUserProfile> = fc.record({
  id: userIdArb,
  name: nameArb,
  email: emailArb,
  role: fc.constant('center' as const),
  avatar: fc.option(fc.webUrl(), { nil: undefined }),
  phone: fc.option(phoneArb, { nil: undefined }),
  address: fc.option(addressArb, { nil: undefined }),
  isOnline: fc.boolean(),
  lastSeen: fc.option(timestampArb, { nil: undefined }),
  createdAt: timestampArb,
  updatedAt: timestampArb,
  enrolledParents: fc.array(userIdArb, { minLength: 0, maxLength: 50 }),
  centerInfo: centerInfoArb,
  operatingHours: operatingHoursArb,
  capacity: fc.integer({ min: 10, max: 200 }),
  currentEnrollment: fc.integer({ min: 0, max: 200 })
}).map(center => ({
  ...center,
  // Ensure current enrollment doesn't exceed capacity
  currentEnrollment: Math.min(center.currentEnrollment, center.capacity)
}));

/**
 * Generate any user profile (admin, parent, or center)
 */
export const anyUserProfileArb = fc.oneof(
  adminUserProfileArb,
  parentUserProfileArb,
  centerUserProfileArb
);

/**
 * Generate user relationship
 */
export const userRelationshipArb = fc.record({
  parentId: userIdArb,
  centerId: userIdArb,
  relationshipType: fc.constantFrom('enrolled', 'assigned', 'pending', 'terminated'),
  establishedDate: timestampArb,
  childrenIds: fc.array(userIdArb, { minLength: 1, maxLength: 3 })
});

/**
 * Generate role access scenario
 */
export const roleAccessScenarioArb = fc.record({
  senderId: userIdArb,
  senderRole: fc.constantFrom('admin', 'parent', 'center'),
  receiverId: userIdArb,
  receiverRole: fc.constantFrom('admin', 'parent', 'center')
}).map(scenario => {
  // Determine if access is allowed based on role-based rules
  let isAllowed = false;
  let reason = '';
  let relationshipType: 'assigned' | 'enrolled' | 'admin_override' | 'none' = 'none';

  // Same user cannot chat with themselves
  if (scenario.senderId === scenario.receiverId) {
    isAllowed = false;
    reason = 'Cannot chat with self';
  }
  // Admin can chat with anyone
  else if (scenario.senderRole === 'admin') {
    isAllowed = true;
    reason = 'Admin has universal access';
    relationshipType = 'admin_override';
  }
  // Parent can only chat with assigned centers
  else if (scenario.senderRole === 'parent' && scenario.receiverRole === 'center') {
    isAllowed = true;
    reason = 'Parent can chat with assigned centers';
    relationshipType = 'assigned';
  }
  // Center can only chat with enrolled parents
  else if (scenario.senderRole === 'center' && scenario.receiverRole === 'parent') {
    isAllowed = true;
    reason = 'Center can chat with enrolled parents';
    relationshipType = 'enrolled';
  }
  // All other combinations are not allowed
  else {
    isAllowed = false;
    reason = `${scenario.senderRole} cannot chat with ${scenario.receiverRole}`;
  }

  return {
    ...scenario,
    isAllowed,
    reason,
    relationshipType
  };
});

/**
 * Generate a complete role-based test scenario
 */
export const roleBasedTestScenarioArb: fc.Arbitrary<RoleBasedTestScenario> = fc.record({
  adminCount: fc.integer({ min: 1, max: 3 }),
  parentCount: fc.integer({ min: 2, max: 10 }),
  centerCount: fc.integer({ min: 1, max: 5 })
}).chain(({ adminCount, parentCount, centerCount }) => {
  return fc.record({
    admins: fc.array(adminUserProfileArb, { minLength: adminCount, maxLength: adminCount }),
    parents: fc.array(parentUserProfileArb, { minLength: parentCount, maxLength: parentCount }),
    centers: fc.array(centerUserProfileArb, { minLength: centerCount, maxLength: centerCount })
  }).chain(({ admins, parents, centers }) => {
    const allUsers = [...admins, ...parents, ...centers];
    
    // Generate relationships between parents and centers
    const relationships = fc.array(
      fc.record({
        parentId: fc.constantFrom(...parents.map(p => p.id)),
        centerId: fc.constantFrom(...centers.map(c => c.id)),
        relationshipType: fc.constantFrom('enrolled', 'assigned'),
        establishedDate: timestampArb,
        childrenIds: fc.array(userIdArb, { minLength: 1, maxLength: 2 })
      }),
      { minLength: Math.min(parentCount, centerCount), maxLength: parentCount * centerCount }
    );

    return relationships.map(rels => {
      // Generate access scenarios for all user combinations
      const accessScenarios: RoleAccessScenario[] = [];
      
      for (const sender of allUsers) {
        for (const receiver of allUsers) {
          if (sender.id !== receiver.id) {
            let isAllowed = false;
            let reason = '';
            let relationshipType: 'assigned' | 'enrolled' | 'admin_override' | 'none' = 'none';

            // Admin can chat with anyone
            if (sender.role === 'admin') {
              isAllowed = true;
              reason = 'Admin has universal access';
              relationshipType = 'admin_override';
            }
            // Parent-Center communication (check relationships)
            else if (sender.role === 'parent' && receiver.role === 'center') {
              const hasRelationship = rels.some(rel => 
                rel.parentId === sender.id && rel.centerId === receiver.id
              );
              isAllowed = hasRelationship;
              reason = hasRelationship ? 'Parent assigned to center' : 'Parent not assigned to center';
              relationshipType = hasRelationship ? 'assigned' : 'none';
            }
            // Center-Parent communication (check relationships)
            else if (sender.role === 'center' && receiver.role === 'parent') {
              const hasRelationship = rels.some(rel => 
                rel.centerId === sender.id && rel.parentId === receiver.id
              );
              isAllowed = hasRelationship;
              reason = hasRelationship ? 'Center has enrolled parent' : 'Center does not have enrolled parent';
              relationshipType = hasRelationship ? 'enrolled' : 'none';
            }
            // All other combinations not allowed
            else {
              isAllowed = false;
              reason = `${sender.role} cannot chat with ${receiver.role}`;
            }

            accessScenarios.push({
              senderId: sender.id,
              senderRole: sender.role,
              receiverId: receiver.id,
              receiverRole: receiver.role,
              isAllowed,
              reason,
              relationshipType
            });
          }
        }
      }

      const allowedCommunications = accessScenarios.filter(s => s.isAllowed).length;
      const deniedCommunications = accessScenarios.filter(s => !s.isAllowed).length;
      const adminOverrides = accessScenarios.filter(s => s.relationshipType === 'admin_override').length;

      return {
        users: allUsers,
        relationships: rels,
        accessScenarios,
        expectedOutcomes: {
          allowedCommunications,
          deniedCommunications,
          adminOverrides
        }
      };
    });
  });
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a realistic test scenario with proper relationships
 */
export const createRealisticTestScenario = (
  adminCount: number = 1,
  parentCount: number = 5,
  centerCount: number = 2
): RoleBasedTestScenario => {
  const scenario = fc.sample(roleBasedTestScenarioArb, 1)[0];
  return scenario;
};

/**
 * Validate role-based access rules
 */
export const validateRoleAccess = (
  senderRole: 'admin' | 'parent' | 'center',
  receiverRole: 'admin' | 'parent' | 'center',
  relationships: UserRelationship[],
  senderId: string,
  receiverId: string
): { allowed: boolean; reason: string } => {
  // Same user cannot chat with themselves
  if (senderId === receiverId) {
    return { allowed: false, reason: 'Cannot chat with self' };
  }

  // Admin can chat with anyone
  if (senderRole === 'admin') {
    return { allowed: true, reason: 'Admin has universal access' };
  }

  // Parent can only chat with assigned centers
  if (senderRole === 'parent' && receiverRole === 'center') {
    const hasRelationship = relationships.some(rel => 
      rel.parentId === senderId && rel.centerId === receiverId && 
      ['enrolled', 'assigned'].includes(rel.relationshipType)
    );
    return {
      allowed: hasRelationship,
      reason: hasRelationship ? 'Parent assigned to center' : 'Parent not assigned to center'
    };
  }

  // Center can only chat with enrolled parents
  if (senderRole === 'center' && receiverRole === 'parent') {
    const hasRelationship = relationships.some(rel => 
      rel.centerId === senderId && rel.parentId === receiverId && 
      ['enrolled', 'assigned'].includes(rel.relationshipType)
    );
    return {
      allowed: hasRelationship,
      reason: hasRelationship ? 'Center has enrolled parent' : 'Center does not have enrolled parent'
    };
  }

  // All other combinations not allowed
  return {
    allowed: false,
    reason: `${senderRole} cannot chat with ${receiverRole}`
  };
};

/**
 * Generate test data for specific scenarios
 */
export const generateTestData = {
  /**
   * Generate a set of users with realistic relationships
   */
  usersWithRelationships: (count: { admin: number; parent: number; center: number }) => {
    const admins = fc.sample(adminUserProfileArb, count.admin);
    const parents = fc.sample(parentUserProfileArb, count.parent);
    const centers = fc.sample(centerUserProfileArb, count.center);
    
    // Create relationships between parents and centers
    const relationships: UserRelationship[] = [];
    parents.forEach((parent, pIndex) => {
      // Each parent is assigned to 1-2 centers
      const assignedCenters = centers.slice(pIndex % centers.length, (pIndex % centers.length) + 2);
      assignedCenters.forEach(center => {
        relationships.push({
          parentId: parent.id,
          centerId: center.id,
          relationshipType: 'enrolled',
          establishedDate: new Date().toISOString(),
          childrenIds: parent.children.map(child => child.id)
        });
      });
    });

    return { admins, parents, centers, relationships };
  },

  /**
   * Generate edge case scenarios for testing
   */
  edgeCaseScenarios: () => [
    // User with no relationships
    {
      description: 'Parent with no assigned centers',
      user: fc.sample(parentUserProfileArb.map(p => ({ ...p, assignedCenters: [] })), 1)[0],
      expectedAccess: []
    },
    // Center at capacity
    {
      description: 'Center at full capacity',
      user: fc.sample(centerUserProfileArb.map(c => ({ ...c, currentEnrollment: c.capacity })), 1)[0],
      expectedBehavior: 'should still allow communication with enrolled parents'
    },
    // Admin with limited permissions
    {
      description: 'Admin with limited permissions',
      user: fc.sample(adminUserProfileArb.map(a => ({ 
        ...a, 
        adminLevel: 'limited' as const,
        permissions: ['VIEW_ALL_CONVERSATIONS'] as AdminPermission[]
      })), 1)[0],
      expectedBehavior: 'should still have universal chat access'
    }
  ]
};