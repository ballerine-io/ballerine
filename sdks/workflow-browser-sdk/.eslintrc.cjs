const { parserOptions, ...config } = require('../../packages/config/eslintrc.base.cjs');

module.exports = {
  ...config,

  parserOptions: {
    ...parserOptions,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
