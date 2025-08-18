/**
 * Configuration module for HydroCav website
 * Centralizes all configuration constants and API credentials
 * @module Config
 */

/**
 * Supabase configuration
 */
export const SUPABASE_CONFIG = {
  url: 'https://icfombdnbaeckgivfkdw.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZm9tYmRuYmFlY2tnaXZma2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzA1MjIsImV4cCI6MjA3MDQwNjUyMn0.6E7SSsyQpmkpyiHQLLMzKSXL9S8bHMY4THeW_iiSFlw',
};

/**
 * UI Configuration constants
 */
export const UI_CONFIG = {
  toast: {
    duration: 5000, // Toast display duration in milliseconds
    slideDistance: 100, // Slide animation distance in pixels
    animationDuration: 300, // Animation duration in milliseconds
  },
  form: {
    characterLimits: {
      name: 100,
      company: 100,
      message: 2000,
    },
    errorDisplayDuration: 4000, // Error message auto-fade duration
    validationDebounceDelay: 300, // Debounce delay for real-time validation
  },
  animation: {
    bubblesPerSection: 30, // Number of bubbles per animation section
    bubbleAnimationDuration: '20s', // CSS animation duration
    frameRate: 60, // Target frame rate for smooth animations
  },
  navigation: {
    scrollBehavior: 'smooth',
    mobileBreakpoint: 768, // Mobile breakpoint in pixels
    headerOffset: 80, // Fixed header offset for scroll calculations
  },
};

/**
 * Feature flags for conditional functionality
 */
export const FEATURE_FLAGS = {
  enableRealTimeValidation: true,
  enableToastNotifications: true,
  enableBubbleAnimations: true,
  enableSmoothScrolling: true,
  enableA11yEnhancements: true,
  enableMotionReduction: true, // Respect user's motion preferences
};

/**
 * Environment detection
 */
export const ENVIRONMENT = {
  isDevelopment: location.hostname === 'localhost' || location.hostname === '127.0.0.1',
  isProduction: location.protocol === 'https:' && !location.hostname.includes('localhost'),
  enableDebugLogging: location.hostname === 'localhost' || location.search.includes('debug=true'),
};

/**
 * Default configuration object combining all settings
 */
export const DEFAULT_CONFIG = {
  supabase: SUPABASE_CONFIG,
  ui: UI_CONFIG,
  features: FEATURE_FLAGS,
  environment: ENVIRONMENT,
};

/**
 * Utility function to get configuration with environment overrides
 */
export function getConfig(path, defaultValue = null) {
  return path.split('.').reduce((config, key) => {
    return config && config[key] !== undefined ? config[key] : defaultValue;
  }, DEFAULT_CONFIG);
}

/**
 * Utility function to check if a feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return FEATURE_FLAGS[featureName] || false;
}

/**
 * Debug logging utility
 */
export function debugLog(message, data = null) {
  if (ENVIRONMENT.enableDebugLogging) {
    if (data !== null) {
      console.log(`[HydroCav Debug] ${message}`, data);
    } else {
      console.log(`[HydroCav Debug] ${message}`);
    }
  }
}
