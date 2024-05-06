import { Config } from 'jest';

export default {
  testRegex: '(/__tests__/.*|(\\.|/)(unit|e2e|intg)\\.test)\\.ts$',

  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  modulePaths: ['<rootDir>/src'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.{ts}?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  globalSetup: '<rootDir>/src/test/db-setup.ts',
  globalTeardown: '<rootDir>/src/test/db-teardown.ts',
} as Config;
