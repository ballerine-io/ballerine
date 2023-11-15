module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    '@ballerine/eslint-config',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
