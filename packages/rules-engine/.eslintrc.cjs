const config = require('../../packages/config/eslintrc.base.cjs');

module.exports = {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    project: './tsconfig.json',
  },
};
