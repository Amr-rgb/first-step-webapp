# Property-Based Tests

This directory contains property-based tests using fast-check library.

## Test Categories

- Role-based access control properties
- Message delivery consistency properties
- Security invariant properties
- Performance characteristic properties

## Running Property Tests

```bash
npm run test:property
```

## Test Structure

Property tests validate universal behaviors across many generated test cases. Each property test should run minimum 100 iterations for comprehensive coverage.