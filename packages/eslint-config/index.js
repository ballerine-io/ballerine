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
  plugins: ['@typescript-eslint', 'unused-imports', 'prefer-arrow', '@stylistic/eslint-plugin-ts'],
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
    curly: ['error', 'all'], // Enforce curly braces for all control statements
    'brace-style': ['error', '1tbs', { allowSingleLine: false }], // Enforce one true brace style and disallow single-line blocks
    'nonblock-statement-body-position': ['error', 'below'], // Enforce body on new line
    'object-curly-newline': ['error', { multiline: true, consistent: true }], // Enforce consistent line breaks inside braces
    'newline-before-return': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['import', 'export'], next: '*' },
      {
        blankLine: 'any',
        prev: ['import'],
        next: ['import'],
      },
      {
        blankLine: 'any',
        prev: ['export'],
        next: ['export'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['if', 'switch', 'for', 'while'],
      }, // Line break before these statements
      {
        blankLine: 'always',
        prev: ['if', 'switch', 'for', 'while'],
        next: '*',
      }, // Line break after these statements
    ],
  },
};
