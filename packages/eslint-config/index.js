/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'unused-imports', 'prefer-arrow'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn',
    'no-unused-vars': 'off', // We use the unused-imports plugin instead
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
  },
};
