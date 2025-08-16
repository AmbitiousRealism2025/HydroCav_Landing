/**
 * CSRF Protection Module
 * Implements double-submit cookie pattern for CSRF protection
 */

class CSRFProtection {
  constructor() {
    this.tokenName = 'csrf_token';
    this.headerName = 'X-CSRF-Token';
    this.cookieName = 'csrf_cookie';
    this.initialized = false;
  }

  /**
   * Initialize CSRF protection
   */
  initialize() {
    if (this.initialized) return;

    // Generate and store token
    this.generateToken();

    // Add token to all forms automatically
    this.attachToForms();

    // Add token to all AJAX requests
    this.attachToAjax();

    this.initialized = true;
    console.log('CSRF Protection initialized');
  }

  /**
   * Generate a cryptographically secure token
   */
  generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

    // Store in sessionStorage (survives page refreshes but not new tabs)
    sessionStorage.setItem(this.tokenName, token);

    // Also set as a secure cookie for double-submit pattern
    this.setTokenCookie(token);

    return token;
  }

  /**
   * Get the current CSRF token
   */
  getToken() {
    let token = sessionStorage.getItem(this.tokenName);

    if (!token) {
      token = this.generateToken();
    }

    return token;
  }

  /**
   * Set CSRF token as a secure cookie
   */
  setTokenCookie(token) {
    const secure = location.protocol === 'https:';
    const sameSite = 'Strict';

    // Set cookie with security flags
    document.cookie =
      `${this.cookieName}=${token}; ` +
      `SameSite=${sameSite}; ` +
      (secure ? 'Secure; ' : '') +
      'Path=/';
  }

  /**
   * Get token from cookie
   */
  getTokenFromCookie() {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.cookieName) {
        return value;
      }
    }

    return null;
  }

  /**
   * Validate CSRF token (double-submit pattern)
   */
  validateToken(providedToken) {
    const sessionToken = this.getToken();
    const cookieToken = this.getTokenFromCookie();

    // Both session and cookie tokens must match the provided token
    return providedToken === sessionToken && providedToken === cookieToken;
  }

  /**
   * Attach CSRF token to all forms
   */
  attachToForms() {
    // Add to existing forms
    document.querySelectorAll('form').forEach(form => {
      this.addTokenToForm(form);
    });

    // Watch for dynamically added forms
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            // Element node
            if (node.tagName === 'FORM') {
              this.addTokenToForm(node);
            }
            // Check for forms within added elements
            const forms = node.querySelectorAll?.('form');
            forms?.forEach(form => this.addTokenToForm(form));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Add CSRF token to a specific form
   */
  addTokenToForm(form) {
    // Skip if token already exists
    if (form.querySelector(`input[name="${this.tokenName}"]`)) {
      return;
    }

    // Skip for external forms
    const action = form.action;
    if (action && !this.isSameOrigin(action)) {
      return;
    }

    const token = this.getToken();
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = this.tokenName;
    input.value = token;
    form.appendChild(input);
  }

  /**
   * Attach CSRF token to AJAX requests
   */
  attachToAjax() {
    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      // Only add token for same-origin requests
      if (this.isSameOrigin(url)) {
        options.headers = {
          ...options.headers,
          [this.headerName]: this.getToken(),
        };
      }

      return originalFetch(url, options);
    };

    // Override XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      this._csrfUrl = url;
      return originalOpen.call(this, method, url, ...args);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
      if (this._csrfUrl && csrfProtection.isSameOrigin(this._csrfUrl)) {
        this.setRequestHeader(csrfProtection.headerName, csrfProtection.getToken());
      }
      return originalSend.call(this, ...args);
    };
  }

  /**
   * Check if URL is same origin
   */
  isSameOrigin(url) {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.origin === window.location.origin;
    } catch {
      // Relative URL, treat as same origin
      return true;
    }
  }

  /**
   * Validate a request (server-side simulation for demonstration)
   */
  validateRequest(request) {
    // Get token from request (header or body)
    const headerToken = request.headers?.[this.headerName];
    const bodyToken = request.body?.[this.tokenName];
    const token = headerToken || bodyToken;

    if (!token) {
      throw new Error('CSRF token missing');
    }

    if (!this.validateToken(token)) {
      throw new Error('CSRF token invalid');
    }

    return true;
  }

  /**
   * Refresh token (call periodically for long sessions)
   */
  refreshToken() {
    this.generateToken();

    // Update all forms with new token
    document.querySelectorAll(`input[name="${this.tokenName}"]`).forEach(input => {
      input.value = this.getToken();
    });
  }

  /**
   * Create middleware for form submission
   */
  createFormMiddleware() {
    return formData => {
      // Ensure token is present
      if (!formData[this.tokenName]) {
        formData[this.tokenName] = this.getToken();
      }

      // Validate token before submission
      if (!this.validateToken(formData[this.tokenName])) {
        throw new Error('CSRF validation failed');
      }

      return formData;
    };
  }
}

// Export singleton instance
const csrfProtection = new CSRFProtection();
export default csrfProtection;
