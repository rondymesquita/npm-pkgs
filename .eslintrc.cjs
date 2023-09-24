module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist',],
  parser: '@typescript-eslint/parser',
  plugins: [
    'simple-import-sort', 'unused-imports', 'newline-destructuring', 'sort-destructure-keys',
  ],
  rules: {
    // 'multiline-comment-style': ['error',],
    'comma-style': ['error', 'last',],
    'comma-dangle': [
      'error', {
        'arrays': 'always',
        'objects': 'always',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never',
      },
    ],
    quotes: ['error', 'single',],
    // 'max-len': ['error', { code: 80 }],
    'space-infix-ops': ['error',],
    indent: ['error', 2,],
    'space-in-parens': ['error', 'never',],
    'function-paren-newline': ['error',  'consistent',],
    'comma-spacing': [
      'error', {
        'before': false,
        'after': true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-this-alias': 'off',
    // '@typescript-eslint/indent': ['error', 2],
    'new-cap': ['error',],
    'object-curly-spacing': ['error', 'always',],
    'object-curly-newline': [
      'error', {
        'ObjectExpression': { 'multiline': true, },
        'ObjectPattern': { 'multiline': true, },
        'ImportDeclaration': 'never',
        'ExportDeclaration': {
          'multiline': true,
          'minProperties': 3,
        },
      },
    ],
    // 'sort-keys': ['error', 'asc', { 'caseSensitive': true, 'natural': true, 'minKeys': 2, },],
    'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': false, },],
    'array-bracket-newline': [
      'error', {
        multiline: true,
        minItems: 4,
      },
    ],
    'sort-destructure-keys/sort-destructure-keys': ['error', { 'caseSensitive': false, },],
    'new-parens': ['error', 'always',],
    'newline-destructuring/newline': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': ['error',],
    'space-before-function-paren': ['error', 'never',],
    '@typescript-eslint/no-var-requires': 'off',
  },
};
