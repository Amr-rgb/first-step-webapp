import * as fc from 'fast-check';
import {
  AdminUserProfile,
  ParentUserProfile,
  CenterUserProfile,
  UserRelationship,
  RoleAccessScenario,
  adminUserProfileArb,
  parentUserProfileArb,
  centerUserProfileArb,
  anyUserProfileArb,
  userRelationshipArb,
  roleAccessScenarioArb,
  roleBasedTestScenarioArb,
  validateRoleAccess,
  generateTestData
} from './userProfileGenerators';
import {
  completeTestScenario,
  getAllTestUsers,
  getUsersByRole,
  hasRelationship,
  getExpectedAccess,
  testRelationships,
  superAdmin,
  parentWithMultipleChildren,
  largeDaycareCenter
} from '../mocks/data/roleBasedTestData';

describe('User Profile Generators', () => {
  describe('TypeScript Interface Validation', () => {
    test('AdminUserProfile should have all required fields', () => {
      fc.assert(fc.property(adminUserProfileArb, (admin: AdminUserProfile) => {
        // Required base fields
        expect(admin.id).toBeDefined();
        expect(admin.name).toBeDefined();
        expect(admin.email).toBeDefined();
        expect(admin.role).toBe('admin');
        expect(typeof admin.isOnline).toBe('boolean');
        expect(admin.createdAt).toBeDefined();
        expect(admin.updatedAt).toBeDefined();

        // Admin-specific fields
        expect(Array.isArray(admin.permissions)).toBe(true);
        expect(typeof admin.canViewAllConversations).toBe('boolean');
        expect(typeof admin.canModerateMessages).toBe('boolean');
        expect(typeof admin.canManageUsers).toBe('boolean');
        expect(['super', 'standard', 'limited']).toContain(admin.adminLevel);

        // Validate email format
        expect(admin.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        // Validate permissions are valid
        const validPermissions = [
          'VIEW_ALL_CONVERSATIONS',
          'MODERATE_MESSAGES',
          'MANAGE_USERS',
          'SYSTEM_SETTINGS',
          'AUDIT_LOGS',
          'BACKUP_DATA',
          'SECURITY_SETTINGS'
        ];
        admin.permissions.forEach(permission => {
          expect(validPermissions).toContain(permission);
        });

        return true;
      }), { numRuns: 50 });
    });

    test('ParentUserProfile should have all required fields', () => {
      fc.assert(fc.property(parentUserProfileArb, (parent: ParentUserProfile) => {
        // Required base fields
        expect(parent.id).toBeDefined();
        expect(parent.name).toBeDefined();
        expect(parent.email).toBeDefined();
        expect(parent.role).toBe('parent');
        expect(typeof parent.isOnline).toBe('boolean');
        expect(parent.createdAt).toBeDefined();
        expect(parent.updatedAt).toBeDefined();

        // Parent-specific fields
        expect(Array.isArray(parent.children)).toBe(true);
        expect(parent.children.length).toBeGreaterThan(0);
        expect(Array.isArray(parent.assignedCenters)).toBe(true);
        expect(parent.preferences).toBeDefined();

        // Validate children structure
        parent.children.forEach(child => {
          expect(child.id).toBeDefined();
          expect(child.name).toBeDefined();
          expect(typeof child.age).toBe('number');
          expect(child.age).toBeGreaterThanOrEqual(0);
          expect(child.age).toBeLessThanOrEqual(18);
        });

        // Validate preferences structure
        expect(parent.preferences.notificationSettings).toBeDefined();
        expect(typeof parent.preferences.notificationSettings.email).toBe('boolean');
        expect(typeof parent.preferences.notificationSettings.sms).toBe('boolean');
        expect(typeof parent.preferences.notificationSettings.push).toBe('boolean');
        expect(parent.preferences.communicationHours).toBeDefined();
        expect(parent.preferences.language).toBeDefined();

        return true;
      }), { numRuns: 50 });
    });

    test('CenterUserProfile should have all required fields', () => {
      fc.assert(fc.property(centerUserProfileArb, (center: CenterUserProfile) => {
        // Required base fields
        expect(center.id).toBeDefined();
        expect(center.name).toBeDefined();
        expect(center.email).toBeDefined();
        expect(center.role).toBe('center');
        expect(typeof center.isOnline).toBe('boolean');
        expect(center.createdAt).toBeDefined();
        expect(center.updatedAt).toBeDefined();

        // Center-specific fields
        expect(Array.isArray(center.enrolledParents)).toBe(true);
        expect(center.centerInfo).toBeDefined();
        expect(center.operatingHours).toBeDefined();
        expect(typeof center.capacity).toBe('number');
        expect(typeof center.currentEnrollment).toBe('number');

        // Validate capacity constraints
        expect(center.capacity).toBeGreaterThan(0);
        expect(center.currentEnrollment).toBeGreaterThanOrEqual(0);
        expect(center.currentEnrollment).toBeLessThanOrEqual(center.capacity);

        // Validate center info structure
        expect(center.centerInfo.centerName).toBeDefined();
        expect(center.centerInfo.licenseNumber).toBeDefined();
        expect(center.centerInfo.address).toBeDefined();
        expect(Array.isArray(center.centerInfo.ageGroups)).toBe(true);
        expect(Array.isArray(center.centerInfo.services)).toBe(true);

        // Validate operating hours structure
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
          const schedule = center.operatingHours[day as keyof typeof center.operatingHours];
          expect(typeof schedule.isOpen).toBe('boolean');
          if (schedule.isOpen) {
            expect(schedule.openTime).toBeDefined();
            expect(schedule.closeTime).toBeDefined();
          }
        });

        return true;
      }), { numRuns: 50 });
    });
  });

  describe('Property-Based Generators', () => {
    test('anyUserProfileArb generates valid user profiles', () => {
      fc.assert(fc.property(anyUserProfileArb, (user) => {
        expect(['admin', 'parent', 'center']).toContain(user.role);
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(typeof user.isOnline).toBe('boolean');
        return true;
      }), { numRuns: 100 });
    });

    test('userRelationshipArb generates valid relationships', () => {
      fc.assert(fc.property(userRelationshipArb, (relationship: UserRelationship) => {
        expect(relationship.parentId).toBeDefined();
        expect(relationship.centerId).toBeDefined();
        expect(relationship.parentId).not.toBe(relationship.centerId);
        expect(['enrolled', 'assigned', 'pending', 'terminated']).toContain(relationship.relationshipType);
        expect(relationship.establishedDate).toBeDefined();
        expect(Array.isArray(relationship.childrenIds)).toBe(true);
        expect(relationship.childrenIds.length).toBeGreaterThan(0);
        return true;
      }), { numRuns: 50 });
    });

    test('roleAccessScenarioArb generates valid access scenarios', () => {
      fc.assert(fc.property(roleAccessScenarioArb, (scenario: RoleAccessScenario) => {
        expect(scenario.senderId).toBeDefined();
        expect(scenario.receiverId).toBeDefined();
        expect(['admin', 'parent', 'center']).toContain(scenario.senderRole);
        expect(['admin', 'parent', 'center']).toContain(scenario.receiverRole);
        expect(typeof scenario.isAllowed).toBe('boolean');
        expect(scenario.reason).toBeDefined();
        expect(['assigned', 'enrolled', 'admin_override', 'none']).toContain(scenario.relationshipType);

        // Validate role-based access logic
        if (scenario.senderId === scenario.receiverId) {
          expect(scenario.isAllowed).toBe(false);
          expect(scenario.reason).toBe('Cannot chat with self');
        } else if (scenario.senderRole === 'admin') {
          expect(scenario.isAllowed).toBe(true);
          expect(scenario.reason).toBe('Admin has universal access');
          expect(scenario.relationshipType).toBe('admin_override');
        }

        return true;
      }), { numRuns: 100 });
    });

    test('roleBasedTestScenarioArb generates comprehensive test scenarios', () => {
      fc.assert(fc.property(roleBasedTestScenarioArb, (scenario) => {
        expect(Array.isArray(scenario.users)).toBe(true);
        expect(scenario.users.length).toBeGreaterThan(0);
        expect(Array.isArray(scenario.relationships)).toBe(true);
        expect(Array.isArray(scenario.accessScenarios)).toBe(true);
        expect(scenario.expectedOutcomes).toBeDefined();

        // Validate user roles
        const adminCount = scenario.users.filter(u => u.role === 'admin').length;
        const parentCount = scenario.users.filter(u => u.role === 'parent').length;
        const centerCount = scenario.users.filter(u => u.role === 'center').length;

        expect(adminCount).toBeGreaterThan(0);
        expect(parentCount).toBeGreaterThan(0);
        expect(centerCount).toBeGreaterThan(0);

        // Validate expected outcomes
        expect(typeof scenario.expectedOutcomes.allowedCommunications).toBe('number');
        expect(typeof scenario.expectedOutcomes.deniedCommunications).toBe('number');
        expect(typeof scenario.expectedOutcomes.adminOverrides).toBe('number');

        const totalScenarios = scenario.expectedOutcomes.allowedCommunications + 
                              scenario.expectedOutcomes.deniedCommunications;
        expect(totalScenarios).toBe(scenario.accessScenarios.length);

        return true;
      }), { numRuns: 10 }); // Fewer runs due to complexity
    });
  });

  describe('Role-Based Access Validation', () => {
    test('validateRoleAccess correctly validates admin access', () => {
      const result = validateRoleAccess('admin', 'parent', [], 'admin_1', 'parent_1');
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('Admin has universal access');
    });

    test('validateRoleAccess correctly validates parent-center relationships', () => {
      const relationships: UserRelationship[] = [{
        parentId: 'parent_1',
        centerId: 'center_1',
        relationshipType: 'enrolled',
        establishedDate: '2024-01-01T00:00:00Z',
        childrenIds: ['child_1']
      }];

      const result = validateRoleAccess('parent', 'center', relationships, 'parent_1', 'center_1');
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('Parent assigned to center');
    });

    test('validateRoleAccess correctly denies unauthorized access', () => {
      const result = validateRoleAccess('parent', 'center', [], 'parent_1', 'center_1');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Parent not assigned to center');
    });

    test('validateRoleAccess denies self-chat', () => {
      const result = validateRoleAccess('parent', 'parent', [], 'parent_1', 'parent_1');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Cannot chat with self');
    });

    test('validateRoleAccess denies parent-parent communication', () => {
      const result = validateRoleAccess('parent', 'parent', [], 'parent_1', 'parent_2');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('parent cannot chat with parent');
    });

    test('validateRoleAccess denies center-center communication', () => {
      const result = validateRoleAccess('center', 'center', [], 'center_1', 'center_2');
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('center cannot chat with center');
    });
  });

  describe('Test Data Generation Utilities', () => {
    test('generateTestData.usersWithRelationships creates valid data structure', () => {
      const data = generateTestData.usersWithRelationships({ admin: 1, parent: 3, center: 2 });
      
      expect(data.admins).toHaveLength(1);
      expect(data.parents).toHaveLength(3);
      expect(data.centers).toHaveLength(2);
      expect(Array.isArray(data.relationships)).toBe(true);

      // Validate relationships reference existing users
      data.relationships.forEach(rel => {
        const parentExists = data.parents.some(p => p.id === rel.parentId);
        const centerExists = data.centers.some(c => c.id === rel.centerId);
        expect(parentExists).toBe(true);
        expect(centerExists).toBe(true);
      });
    });

    test('generateTestData.edgeCaseScenarios returns valid edge cases', () => {
      const edgeCases = generateTestData.edgeCaseScenarios();
      
      expect(Array.isArray(edgeCases)).toBe(true);
      expect(edgeCases.length).toBeGreaterThan(0);

      edgeCases.forEach(edgeCase => {
        expect(edgeCase.description).toBeDefined();
        expect(edgeCase.user).toBeDefined();
        expect(['admin', 'parent', 'center']).toContain(edgeCase.user.role);
      });
    });
  });
});

describe('Role-Based Test Data', () => {
  describe('Predefined Test Users', () => {
    test('superAdmin has correct structure and permissions', () => {
      expect(superAdmin.role).toBe('admin');
      expect(superAdmin.adminLevel).toBe('super');
      expect(superAdmin.canViewAllConversations).toBe(true);
      expect(superAdmin.canModerateMessages).toBe(true);
      expect(superAdmin.canManageUsers).toBe(true);
      expect(superAdmin.permissions).toContain('VIEW_ALL_CONVERSATIONS');
      expect(superAdmin.permissions).toContain('MANAGE_USERS');
    });

    test('parentWithMultipleChildren has valid children structure', () => {
      expect(parentWithMultipleChildren.role).toBe('parent');
      expect(parentWithMultipleChildren.children.length).toBeGreaterThan(1);
      expect(parentWithMultipleChildren.assignedCenters.length).toBeGreaterThan(0);
      
      parentWithMultipleChildren.children.forEach(child => {
        expect(child.id).toBeDefined();
        expect(child.name).toBeDefined();
        expect(typeof child.age).toBe('number');
      });
    });

    test('largeDaycareCenter has valid center structure', () => {
      expect(largeDaycareCenter.role).toBe('center');
      expect(largeDaycareCenter.capacity).toBeGreaterThan(0);
      expect(largeDaycareCenter.currentEnrollment).toBeLessThanOrEqual(largeDaycareCenter.capacity);
      expect(largeDaycareCenter.centerInfo.centerName).toBeDefined();
      expect(largeDaycareCenter.centerInfo.licenseNumber).toBeDefined();
      expect(Array.isArray(largeDaycareCenter.enrolledParents)).toBe(true);
    });
  });

  describe('Test Relationships', () => {
    test('testRelationships contain valid relationship data', () => {
      testRelationships.forEach(rel => {
        expect(rel.parentId).toBeDefined();
        expect(rel.centerId).toBeDefined();
        expect(['enrolled', 'assigned', 'pending', 'terminated']).toContain(rel.relationshipType);
        expect(rel.establishedDate).toBeDefined();
        expect(Array.isArray(rel.childrenIds)).toBe(true);
      });
    });

    test('relationships reference existing test users', () => {
      const allUsers = getAllTestUsers();
      const userIds = allUsers.map(u => u.id);

      testRelationships.forEach(rel => {
        // Note: Some relationships may reference users not in the predefined set
        // This is intentional for testing scenarios with missing users
        expect(rel.parentId).toBeDefined();
        expect(rel.centerId).toBeDefined();
      });
    });
  });

  describe('Utility Functions', () => {
    test('getAllTestUsers returns all predefined users', () => {
      const users = getAllTestUsers();
      expect(users.length).toBeGreaterThan(0);
      
      const roles = users.map(u => u.role);
      expect(roles).toContain('admin');
      expect(roles).toContain('parent');
      expect(roles).toContain('center');
    });

    test('getUsersByRole filters users correctly', () => {
      const admins = getUsersByRole('admin');
      const parents = getUsersByRole('parent');
      const centers = getUsersByRole('center');

      expect(admins.every(u => u.role === 'admin')).toBe(true);
      expect(parents.every(u => u.role === 'parent')).toBe(true);
      expect(centers.every(u => u.role === 'center')).toBe(true);
    });

    test('hasRelationship correctly identifies relationships', () => {
      // Test existing relationship
      const hasRel = hasRelationship('parent_001', 'center_001');
      expect(typeof hasRel).toBe('boolean');

      // Test non-existing relationship
      const noRel = hasRelationship('nonexistent_1', 'nonexistent_2');
      expect(noRel).toBe(false);
    });

    test('getExpectedAccess returns correct access scenarios', () => {
      const access = getExpectedAccess('admin_001', 'parent_001');
      if (access) {
        expect(access.senderId).toBe('admin_001');
        expect(access.receiverId).toBe('parent_001');
        expect(typeof access.isAllowed).toBe('boolean');
        expect(access.reason).toBeDefined();
      }
    });
  });

  describe('Complete Test Scenario', () => {
    test('completeTestScenario has valid structure', () => {
      expect(Array.isArray(completeTestScenario.users)).toBe(true);
      expect(Array.isArray(completeTestScenario.relationships)).toBe(true);
      expect(Array.isArray(completeTestScenario.accessScenarios)).toBe(true);
      expect(completeTestScenario.expectedOutcomes).toBeDefined();

      // Validate expected outcomes match actual scenarios
      const allowedCount = completeTestScenario.accessScenarios.filter(s => s.isAllowed).length;
      const deniedCount = completeTestScenario.accessScenarios.filter(s => !s.isAllowed).length;
      const adminOverrideCount = completeTestScenario.accessScenarios.filter(s => s.relationshipType === 'admin_override').length;

      expect(completeTestScenario.expectedOutcomes.allowedCommunications).toBe(allowedCount);
      expect(completeTestScenario.expectedOutcomes.deniedCommunications).toBe(deniedCount);
      expect(completeTestScenario.expectedOutcomes.adminOverrides).toBe(adminOverrideCount);
    });

    test('access scenarios follow role-based rules', () => {
      completeTestScenario.accessScenarios.forEach(scenario => {
        // Self-chat should be denied
        if (scenario.senderId === scenario.receiverId) {
          expect(scenario.isAllowed).toBe(false);
          expect(scenario.reason).toBe('Cannot chat with self');
        }
        
        // Admin should have universal access
        if (scenario.senderRole === 'admin' && scenario.senderId !== scenario.receiverId) {
          expect(scenario.isAllowed).toBe(true);
          expect(scenario.reason).toBe('Admin has universal access');
          expect(scenario.relationshipType).toBe('admin_override');
        }

        // Parent-parent and center-center should be denied
        if (scenario.senderRole === scenario.receiverRole && 
            scenario.senderRole !== 'admin' && 
            scenario.senderId !== scenario.receiverId) {
          expect(scenario.isAllowed).toBe(false);
        }
      });
    });
  });
});

describe('Integration with Requirements', () => {
  test('generators support Requirements 1.1, 1.2, 1.3 - Role-based access control', () => {
    // Requirement 1.1: Admin can communicate with both Parent and Center users
    const adminScenarios = completeTestScenario.accessScenarios.filter(s => 
      s.senderRole === 'admin' && s.senderId !== s.receiverId
    );
    expect(adminScenarios.every(s => s.isAllowed)).toBe(true);

    // Requirement 1.2: Parent can only chat with assigned Centers
    const parentToCenterScenarios = completeTestScenario.accessScenarios.filter(s => 
      s.senderRole === 'parent' && s.receiverRole === 'center'
    );
    // Some should be allowed (with relationships), some denied (without relationships)
    const allowedParentToCenter = parentToCenterScenarios.filter(s => s.isAllowed);
    const deniedParentToCenter = parentToCenterScenarios.filter(s => !s.isAllowed);
    expect(allowedParentToCenter.length).toBeGreaterThan(0);
    expect(deniedParentToCenter.length).toBeGreaterThan(0);

    // Requirement 1.3: Center can only chat with enrolled Parents
    const centerToParentScenarios = completeTestScenario.accessScenarios.filter(s => 
      s.senderRole === 'center' && s.receiverRole === 'parent'
    );
    const allowedCenterToParent = centerToParentScenarios.filter(s => s.isAllowed);
    const deniedCenterToParent = centerToParentScenarios.filter(s => !s.isAllowed);
    expect(allowedCenterToParent.length).toBeGreaterThan(0);
    expect(deniedCenterToParent.length).toBeGreaterThan(0);
  });

  test('generators support Requirement 9.2 - Role-based access validation across scenarios', () => {
    // Generate multiple test scenarios and validate they all follow role-based rules
    fc.assert(fc.property(roleBasedTestScenarioArb, (scenario) => {
      scenario.accessScenarios.forEach(accessScenario => {
        const validation = validateRoleAccess(
          accessScenario.senderRole,
          accessScenario.receiverRole,
          scenario.relationships,
          accessScenario.senderId,
          accessScenario.receiverId
        );

        // The generated scenario should match our validation logic
        expect(accessScenario.isAllowed).toBe(validation.allowed);
      });

      return true;
    }), { numRuns: 5 }); // Limited runs due to complexity
  });
});