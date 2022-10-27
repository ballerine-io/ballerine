const { parserOptions, ...config } = require('../../packages/config/eslintrc.svelte.cjs');

module.exports = {
  ...config,
  parserOptions: {
    ...parserOptions,
    // These types of configs should be relative to the package's root
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
