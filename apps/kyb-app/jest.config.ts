const config = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src/$1',
  },
  globals: true,
  testRegex: '(/__tests__/.*|(\\.|/)(unit|e2e|intg)\\.test)\\.ts$',
};

export default config;
