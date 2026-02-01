// Basic Jest configuration without Next.js dependencies
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup/basic-jest.setup.ts'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/basic-*.test.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/not-found.tsx',
    '!src/app/**/error.tsx',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 30000, // 30 seconds for property-based tests
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Ignore patterns
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  // Use ts-jest for TypeScript transformation
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  // Handle ES modules
  extensionsToTreatAsEsm: ['.ts'],
}

module.exports = customJestConfig;