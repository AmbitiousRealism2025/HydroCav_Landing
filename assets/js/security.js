/**
 * Main Security Module
 * Integrates all security features and provides unified interface
 */

import secureConfig from './secure-config.js';
import xssProtection from './xss-protection.js';
import csrfProtection from './csrf-protection.js';

class SecurityManager {
  constructor() {
    this.initialized = false;
    this.supabaseClient = null;
  }

  /**
   * Initialize all security features
   */
  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Initializing security features...');

      // Initialize configuration first
      await secureConfig.initialize();

      // Initialize XSS protection
      await xssProtection.initialize();
      xssProtection.setContentSecurityPolicy();

      // Initialize CSRF protection if enabled
      const features = secureConfig.getFeatures();
      if (features.enableCSRF) {
        csrfProtection.initialize();
      }

      // Initialize Supabase with secure config
      this.supabaseClient = await secureConfig.createSupabaseClient();

      // Set up global error handling
      this.setupErrorHandling();

      // Set up rate limiting
      if (features.enableRateLimiting) {
        this.setupRateLimiting();
      }

      this.initialized = true;
      console.log('Security features initialized successfully');
    } catch (error) {
      console.error('Security initialization failed:', error);
      // Fail securely - disable features if security can't be initialized
      this.disableFeatures();
      throw error;
    }
  }

  /**
   * Secure form submission handler
   */
  async submitForm(formElement, customHandler) {
    try {
      // Validate initialization
      if (!this.initialized) {
        throw new Error('Security not initialized');
      }

      // Rate limiting check
      if (!this.checkRateLimit('form_submission')) {
        throw new Error('Rate limit exceeded. Please wait before submitting again.');
      }

      // Get and sanitize form data
      const rawData = new FormData(formElement);
      const sanitizedData = this.sanitizeFormData(rawData);

      // CSRF validation
      const features = secureConfig.getFeatures();
      if (features.enableCSRF) {
        csrfProtection.validateRequest({
          body: sanitizedData,
        });
      }

      // Additional validation
      this.validateFormData(sanitizedData, formElement.dataset.validation);

      // Call custom handler with sanitized data
      if (customHandler) {
        return await customHandler(sanitizedData);
      }

      // Default: submit to Supabase
      return await this.submitToSupabase(sanitizedData, formElement.dataset.table);
    } catch (error) {
      console.error('Form submission error:', error);
      this.handleSecurityError(error);
      throw error;
    }
  }

  /**
   * Sanitize form data
   */
  sanitizeFormData(formData) {
    const sanitized = {};

    for (const [key, value] of formData.entries()) {
      // Skip CSRF token (already validated)
      if (key === 'csrf_token') {
        sanitized[key] = value;
        continue;
      }

      // Sanitize based on field type
      const fieldType = this.getFieldType(key);

      switch (fieldType) {
        case 'email':
          sanitized[key] = xssProtection.sanitizeEmail(value);
          break;
        case 'url':
          sanitized[key] = xssProtection.sanitizeURL(value);
          break;
        case 'html':
          // Use DOMPurify for fields intended to contain safe HTML
          sanitized[key] = xssProtection.sanitizeHTML(value);
          break;
        default:
          // CRITICAL FIX: Use proper HTML entity encoding for all text fields
          // This prevents any HTML from being rendered (fixes XSS vulnerability)
          sanitized[key] = xssProtection.sanitizeText(value);
      }
    }

    return sanitized;
  }

  /**
   * Validate form data against rules
   */
  validateFormData(data, validationRules) {
    const rules = validationRules ? JSON.parse(validationRules) : {};

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];

      // Required field check
      if (rule.required && !value) {
        throw new Error(`${field} is required`);
      }

      // Length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        throw new Error(`${field} exceeds maximum length of ${rule.maxLength}`);
      }

      if (rule.minLength && value.length < rule.minLength) {
        throw new Error(`${field} must be at least ${rule.minLength} characters`);
      }

      // Pattern validation
      if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
        throw new Error(`${field} format is invalid`);
      }
    });
  }

  /**
   * Submit data to Supabase securely via Edge Function
   * CRITICAL FIX: Now uses Edge Function with server-side CSRF validation
   */
  async submitToSupabase(data, table = 'contact_submissions') {
    if (!this.supabaseClient) {
      throw new Error('Database connection not available');
    }

    // Get CSRF token for header
    const csrfToken = window.CSRFProtection?.getToken();
    if (!csrfToken) {
      throw new Error('CSRF token not available. Please refresh the page.');
    }

    // Prepare submission data
    const submission = {
      ...data,
      submitted_at: new Date().toISOString(),
      ip_address: 'masked', // Don't store actual IP for privacy
      user_agent: this.getSafeUserAgent(),
    };

    // Remove CSRF token from body (it goes in header)
    delete submission.csrf_token;

    try {
      // CRITICAL: Call Edge Function instead of direct database insert
      // This provides server-side CSRF validation that was missing
      const response = await fetch(`${this.supabaseClient.supabaseUrl}/functions/v1/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // CSRF token in header for server validation
          'apikey': this.supabaseClient.supabaseKey, // Supabase API key
        },
        credentials: 'include', // Include cookies for CSRF validation
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Log successful submission with CSRF validation
      this.logSecurityEvent('form_submitted_with_csrf', {
        table,
        csrf_validated: true,
        edge_function: true
      });

      return result;
    } catch (error) {
      console.error('Edge Function submission error:', error);
      
      // Log the security failure
      this.logSecurityEvent('form_submission_failed', {
        error: error.message,
        csrf_validation: error.message.includes('CSRF') ? 'failed' : 'unknown'
      });
      
      throw new Error(error.message || 'Failed to submit data. Please try again.');
    }
  }

  /**
   * Set up rate limiting
   */
  setupRateLimiting() {
    this.rateLimits = new Map();
    this.rateLimitConfig = {
      form_submission: { max: 5, window: 60000 }, // 5 per minute
      api_call: { max: 100, window: 60000 }, // 100 per minute
      login_attempt: { max: 3, window: 300000 }, // 3 per 5 minutes
    };
  }

  /**
   * Check rate limit
   */
  checkRateLimit(action) {
    const config = this.rateLimitConfig[action];
    if (!config) return true;

    const now = Date.now();
    const key = `${action}_${this.getClientId()}`;

    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, { count: 1, window: now });
      return true;
    }

    const limit = this.rateLimits.get(key);

    // Reset if window expired
    if (now - limit.window > config.window) {
      this.rateLimits.set(key, { count: 1, window: now });
      return true;
    }

    // Check if limit exceeded
    if (limit.count >= config.max) {
      return false;
    }

    // Increment counter
    limit.count++;
    return true;
  }

  /**
   * Get client identifier for rate limiting
   */
  getClientId() {
    // Use sessionStorage to maintain ID across page refreshes
    let clientId = sessionStorage.getItem('client_id');

    if (!clientId) {
      clientId = this.generateClientId();
      sessionStorage.setItem('client_id', clientId);
    }

    return clientId;
  }

  /**
   * Generate unique client ID
   */
  generateClientId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get safe user agent string
   */
  getSafeUserAgent() {
    const ua = navigator.userAgent;
    // Remove potentially sensitive information
    return ua.replace(/\([^)]*\)/g, '(Hidden)').substring(0, 100);
  }

  /**
   * Determine field type for sanitization
   */
  getFieldType(fieldName) {
    const fieldTypes = {
      email: ['email', 'mail'],
      url: ['url', 'website', 'link'],
      html: ['description', 'content', 'body'],
    };

    const lowerFieldName = fieldName.toLowerCase();

    for (const [type, patterns] of Object.entries(fieldTypes)) {
      if (patterns.some(pattern => lowerFieldName.includes(pattern))) {
        return type;
      }
    }

    return 'text';
  }

  /**
   * Set up global error handling
   */
  setupErrorHandling() {
    window.addEventListener('error', event => {
      // Log security-related errors
      if (this.isSecurityError(event.error)) {
        this.logSecurityEvent('error', {
          message: event.error.message,
          stack: event.error.stack,
        });
      }
    });

    window.addEventListener('unhandledrejection', event => {
      // Log unhandled promise rejections
      if (this.isSecurityError(event.reason)) {
        this.logSecurityEvent('unhandled_rejection', {
          reason: event.reason,
        });
      }
    });
  }

  /**
   * Check if error is security-related
   */
  isSecurityError(error) {
    if (!error) return false;

    const securityKeywords = ['csrf', 'xss', 'security', 'token', 'sanitize'];
    const errorString = (error.message || error.toString()).toLowerCase();

    return securityKeywords.some(keyword => errorString.includes(keyword));
  }

  /**
   * Handle security errors
   */
  handleSecurityError(error) {
    // Log the error
    this.logSecurityEvent('security_error', {
      message: error.message,
      stack: error.stack,
    });

    // User-friendly error messages
    const userMessage = this.getUserFriendlyError(error);

    // Display error to user (customize based on your UI)
    this.displayError(userMessage);
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyError(error) {
    const errorMap = {
      'rate limit': 'Please wait a moment before trying again.',
      csrf: 'Security validation failed. Please refresh and try again.',
      validation: error.message,
      network: 'Connection error. Please check your internet and try again.',
      default: 'An error occurred. Please try again.',
    };

    const errorString = error.message.toLowerCase();

    for (const [key, message] of Object.entries(errorMap)) {
      if (errorString.includes(key)) {
        return message;
      }
    }

    return errorMap.default;
  }

  /**
   * Display error to user
   */
  displayError(message) {
    // This should integrate with your UI feedback system
    console.error('User error:', message);

    // Example: show toast notification
    if (window.showToast) {
      window.showToast(message, 'error');
    }
  }

  /**
   * Log security events
   */
  logSecurityEvent(type, data) {
    const event = {
      type,
      timestamp: new Date().toISOString(),
      data,
      url: window.location.href,
      clientId: this.getClientId(),
    };

    // In production, send to logging service
    if (secureConfig.get('environment') === 'production') {
      // Send to logging endpoint
      this.sendToLoggingService(event);
    } else {
      console.log('Security Event:', event);
    }
  }

  /**
   * Send logs to logging service
   */
  async sendToLoggingService(event) {
    // Implement based on your logging service
    // Example: Sentry, LogRocket, custom endpoint
  }

  /**
   * Disable features on security failure
   */
  disableFeatures() {
    // Disable form submissions
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        alert('Security features could not be loaded. Please refresh the page.');
      });
    });
  }

  /**
   * Get secure Supabase client
   */
  getSupabaseClient() {
    if (!this.initialized) {
      throw new Error('Security not initialized');
    }
    return this.supabaseClient;
  }
}

// Export singleton instance
const security = new SecurityManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => security.initialize());
} else {
  security.initialize();
}

export default security;
