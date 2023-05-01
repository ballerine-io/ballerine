const config = require('../../packages/config/eslintrc.base.cjs');

module.exports = {
  ...config,
  extends: ['react-app', 'react-app/jest', ...config.extends],
  env: {
    ...config.env,
    node: true,
  },
  parserOptions: {
    ...config.parserOptions,
    // These types of configs should be relative to the package's root
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
