import { resolve } from 'path';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['node_modules', 'src/database', 'src/test', 'src/types'],
  reporters: ['default'],
  globals: { 'ts-jest': { diagnostics: false } },
  transform: {},
  moduleNameMapper: {
    '^@components/(.*)$': `${resolve(__dirname, './src/components/$1')}`,
    '^@common/(.*)$': `${resolve(__dirname, './src/common/$1')}`,
  },
};
