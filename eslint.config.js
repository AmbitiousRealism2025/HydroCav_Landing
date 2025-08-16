/**
 * ESLint Configuration for HydroCav Website
 * Phase 4A-1: Security-focused code quality configuration
 *
 * Implements recommendations from codebot-alpha + codemaster-alpha consultation:
 * - Security-first rule configuration
 * - TDD framework compatibility
 * - Performance-optimized execution
 * - SOLID principles enforcement
 */

import js from '@eslint/js';
import security from 'eslint-plugin-security';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Global ignores (modern ESLint v9 pattern)
  {
    ignores: [
      '**/*.html',
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'build/**',
      '.vscode/**',
      '.idea/**',
    ],
  },

  // Base JavaScript recommendations
  js.configs.recommended,

  // Security-focused configuration
  {
    plugins: {
      security,
      'no-unsanitized': noUnsanitized,
      'jsx-a11y': jsxA11y,
      prettier,
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser environment
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        getComputedStyle: 'readonly',
        HTMLElement: 'readonly',
        Element: 'readonly',
        FormData: 'readonly',
        XMLHttpRequest: 'readonly',
        URL: 'readonly',
        MutationObserver: 'readonly',
        IntersectionObserver: 'readonly',
        crypto: 'readonly',
        performance: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',

        // Third-party libraries
        DOMPurify: 'readonly',

        // Our security modules (global access pattern)
        XSSProtection: 'readonly',
        CSRFProtection: 'readonly',
        SecurityManager: 'readonly',

        // Supabase global
        supabase: 'readonly',
      },
    },

    rules: {
      // Security-first rules (from codebot-alpha recommendations)
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-pseudoRandomBytes': 'error',
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',

      // Core JavaScript best practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // SOLID principles enforcement (from codemaster-alpha)
      'max-lines-per-function': [
        'error',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      complexity: ['error', 10],
      'max-depth': ['error', 4],
      'max-params': ['error', 5],

      // Code quality
      'no-unused-vars': ['error', { args: 'after-used' }],
      'prefer-arrow-callback': 'error',
      'consistent-return': 'error',
      'no-console': 'warn',

      // Prettier integration
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },

    files: ['**/*.js', '**/*.mjs'],
  },

  // Jest testing framework configuration (TDD compatibility)
  {
    files: ['tests/**/*.js', '**/*.test.js', '**/jest.config.js'],
    languageOptions: {
      globals: {
        // Jest globals
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',

        // Node.js globals for test setup
        global: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',

        // Test helpers
        testHelpers: 'readonly',

        // Browser globals in test environment
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        performance: 'readonly',
        getComputedStyle: 'readonly',
        Event: 'readonly',
        MutationObserver: 'readonly',
        IntersectionObserver: 'readonly',
        XMLHttpRequest: 'readonly',
        URL: 'readonly',
        crypto: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
      },
    },
    rules: {
      // Relaxed rules for test files
      'security/detect-object-injection': 'off',
      'security/detect-eval-with-expression': 'off',
      'no-eval': 'off', // Tests may need eval for module loading
      'no-script-url': 'off', // Tests may use script URLs
      'no-console': 'off',
      'no-unused-vars': 'warn', // Less strict for test variables
      'max-lines-per-function': 'off', // Tests can be longer
      complexity: 'off', // Test complexity is acceptable
    },
  },

  // Security modules enhanced rules (from codemaster-alpha)
  {
    files: ['**/security.js', '**/xss-protection.js', '**/csrf-protection.js'],
    rules: {
      // Stricter rules for security modules
      complexity: ['error', 8],
      'max-lines-per-function': ['error', 30],
      'no-console': 'error', // Security modules should use SecurityManager logging
      'security/detect-object-injection': 'error',

      // Custom architectural patterns for security modules
      'prefer-const': 'error',
      'no-var': 'error',
      'consistent-return': 'error',
      'no-implicit-globals': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // Security module pattern enforcement
      'max-params': ['error', 3], // Security functions should be simple
      'max-depth': ['error', 3], // Reduce nesting in security code
      'no-unused-vars': 'error', // All variables must be used in security modules
    },
  },

  // Custom rules for UI/Animation modules (main.js, ui-feedback.js)
  {
    files: ['**/main.js', '**/ui-feedback.js'],
    rules: {
      // Relaxed rules for UI modules (animations, user feedback)
      'no-console': 'warn', // Allow console for debugging animations
      'max-lines-per-function': ['warn', 100], // Animations can be longer
      complexity: ['warn', 15], // Animation logic can be complex
      'security/detect-object-injection': 'warn', // Less strict for UI modules
    },
  },

  // HTML files (limited linting)
  {
    files: ['**/*.html'],
    rules: {
      // Minimal rules for HTML files
      'no-undef': 'off',
    },
  },

  // Prettier configuration integration
  prettierConfig,

  // Performance optimization
  {
    settings: {
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint/',
    },
  },
];
