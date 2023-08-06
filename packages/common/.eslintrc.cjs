const { parserOptions, ...config } = require('../../packages/config/eslintrc.base.cjs');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...config,
  parserOptions: {
    ...parserOptions,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  ignorePatterns: ['.eslintrc.cjs'],
};
