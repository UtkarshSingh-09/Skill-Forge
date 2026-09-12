/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/tech_sync/**/test/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/tools/phone-test/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
};
