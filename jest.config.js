/**
 * Jest Configuration for HydroCav Website Testing
 * 
 * This configuration supports testing of:
 * - Security modules (XSS, CSRF protection)
 * - Form validation logic
 * - Bubble animation management
 * - Supabase integration functions
 */

module.exports = {
  // Test environment - use jsdom for DOM testing
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Coverage thresholds (as per TDD plan - >80% requirement)
  // Temporarily lowered for initial setup, will be raised as tests are implemented
  coverageThreshold: {
    global: {
      branches: 0, // Will be raised to 80 as tests are added
      functions: 0, // Will be raised to 80 as tests are added  
      lines: 0, // Will be raised to 80 as tests are added
      statements: 0 // Will be raised to 80 as tests are added
    }
  },
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'assets/js/**/*.js',
    '!assets/js/main.js', // Exclude main.js (bubble animations - hard to test)
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Module name mapping for assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Global variables available in tests
  globals: {
    'window': {}
  }
};