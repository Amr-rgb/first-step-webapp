# Chat Testing Framework

This directory contains comprehensive tests for the chat functionality, organized according to the chat testing specification.

## Directory Structure

```
tests/chat/
├── unit/                    # Unit tests for specific components and functions
├── property/                # Property-based tests using fast-check
├── integration/             # Integration tests for end-to-end scenarios
├── security/                # Security-focused tests
├── performance/             # Performance and load tests
├── ui/                      # UI and cross-platform tests
└── fixtures/                # Test fixtures and sample data
```

## Test Categories

### Unit Tests (`unit/`)
- API endpoint testing
- Component behavior testing
- Service function testing
- Error handling testing

### Property-Based Tests (`property/`)
- Role-based access control properties
- Message delivery consistency properties
- Security invariant properties
- Performance characteristic properties

### Integration Tests (`integration/`)
- End-to-end chat workflows
- Real-time messaging integration
- Database persistence integration
- Authentication flow integration

### Security Tests (`security/`)
- IDOR prevention testing
- Input validation and sanitization
- Rate limiting enforcement
- Malicious payload handling

### Performance Tests (`performance/`)
- Message delivery latency testing
- Concurrent user load testing
- Memory usage monitoring
- Database query performance

### UI Tests (`ui/`)
- Cross-platform responsiveness
- Accessibility compliance
- User interaction testing
- Error state handling

## Running Tests

```bash
# Run all chat tests
npm run test:chat

# Run specific test categories
npm run test:property    # Property-based tests
npm run test:unit       # Unit tests
npm run test:integration # Integration tests
npm run test:security   # Security tests
npm run test:performance # Performance tests

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Test Configuration

Tests are configured to:
- Use Jest with TypeScript support
- Include MSW for API mocking
- Support property-based testing with fast-check
- Provide comprehensive coverage reporting
- Support parallel test execution
- Include performance benchmarking

## Writing Tests

### Property-Based Tests
Use the generators in `tests/generators/chatGenerators.ts` to create property-based tests:

```typescript
import * as fc from 'fast-check';
import { userRoleArb, messageContentArb } from '../../generators/chatGenerators';

test('Property: Role-based access control', () => {
  fc.assert(fc.property(
    userRoleArb,
    userRoleArb,
    (senderRole, receiverRole) => {
      // Test property implementation
    }
  ));
});
```

### Unit Tests
Use the test utilities for consistent testing:

```typescript
import { chatTestUtils } from '../../utils/testUtils';

test('Unit: Send message API', async () => {
  const mockUser = chatTestUtils.createMockUser('parent');
  const mockToken = chatTestUtils.createMockAuthToken('parent');
  // Test implementation
});
```

### Integration Tests
Use the test database and Pusher mocks:

```typescript
import { testDatabase } from '../../database/testDatabase';
import { pusherTestUtils } from '../../mocks/pusherMock';

test('Integration: End-to-end message flow', async () => {
  await testDatabase.reset();
  const pusher = pusherTestUtils.createMockInstance('test-key');
  // Test implementation
});
```

## Test Data

Test data is managed through:
- `tests/mocks/data/testData.ts` - Static test data
- `tests/generators/chatGenerators.ts` - Property-based generators
- `tests/database/testDatabase.ts` - Database test utilities
- `tests/mocks/pusherMock.ts` - Real-time testing utilities

## Coverage Requirements

Tests must maintain:
- 70% line coverage
- 70% function coverage
- 70% branch coverage
- 70% statement coverage

## Performance Benchmarks

Performance tests validate:
- Message delivery < 2 seconds
- API response times < 500ms
- UI rendering < 3 seconds
- Memory usage < 50MB per conversation