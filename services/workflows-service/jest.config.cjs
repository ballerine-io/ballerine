module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testRegex: '(/__tests__/.*|(\\.|/)(unit|e2e|intg)\\.test)\\.ts$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  globalSetup: '<rootDir>/src/test/db-setup.ts',
  globalTeardown: '<rootDir>/src/test/db-teardown.ts',
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        logo: 'https://blrn-cdn-prod.s3.eu-central-1.amazonaws.com/images/ballerine_logo.svg',
        outputPath: './ci/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
        includeConsoleLog: true,
        includeObsoleteSnapshots: true,
        sort: 'status',
      },
    ],
  ],
};
