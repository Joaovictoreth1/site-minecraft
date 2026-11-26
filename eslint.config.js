import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  {
    rules: {
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-fallthrough': 'error',
      'no-unreachable': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['error', { args: 'none' }],
      'no-unused-private-class-members': 'error',
      'no-return-assign': ['error', 'except-parens'],
      'no-var': 'error',
    },
  },
  {
    files: ['src/**/*.js', 'tests/**/*.spec.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.config.js', 'tests/**/*.spec.js'],
    languageOptions: { globals: globals.node },
  },
];
