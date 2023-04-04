const { parserOptions, ...config } = require('../../packages/config/eslintrc.base.cjs');

module.exports = {
  ...config,
  extends: ['../../.eslint.ballerine.cjs'],
  parserOptions: {
    ...parserOptions,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  ignorePatterns: ['.eslintrc.cjs'],
};
