const config = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src/$1',
  },
  globals: true,
};

export default config;
