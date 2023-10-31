module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  node: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    moduleDirectory: ['node_modules', 'src/'],
  },
  plugins: ['@typescript-eslint', 'unused-imports'],
  rules: {
    'no-unused-vars': 'off', // We use the unused-imports plugin instead
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }],
  },
};
