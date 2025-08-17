/**
 * Admin Dashboard Security Initialization
 *
 * PHASE 5: Extracted from inline script for CSP compliance
 * Handles loading and initialization of security modules for admin dashboard
 */

let securityInitialized = false;

async function initializeAdminSecurity() {
  try {
    console.log('🔄 Starting security module loading...');

    console.log('📦 Loading secure-config...');
    const secureConfig = await import('./secure-config.js');
    console.log('✅ secure-config loaded:', secureConfig);

    console.log('📦 Loading xss-protection...');
    const xssProtection = await import('./xss-protection.js');
    console.log('✅ xss-protection loaded:', xssProtection);
    window.XSSProtection = xssProtection.default;

    console.log('📦 Loading csrf-protection...');
    const csrfProtection = await import('./csrf-protection.js');
    console.log('✅ csrf-protection loaded:', csrfProtection);
    window.CSRFProtection = csrfProtection.default;

    console.log('📦 Loading security manager...');
    const securityManager = await import('./security.js');
    console.log('✅ security manager loaded:', securityManager);
    window.SecurityManager = securityManager.default;

    // Initialize all security modules
    console.log('🔧 Initializing security modules...');

    await window.XSSProtection.initialize();
    console.log('✅ XSS Protection initialized');

    await window.CSRFProtection.initialize();
    console.log('✅ CSRF Protection initialized');

    await window.SecurityManager.initialize();
    console.log('✅ Security Manager initialized');

    securityInitialized = true;
    console.log('🎉 All security modules loaded and initialized successfully!');

    // Trigger custom event to notify that security is ready
    window.dispatchEvent(new CustomEvent('securityReady'));
  } catch (error) {
    console.error('❌ Failed to load security modules:', error);
    // Show user-friendly error
    document.body.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #dc2626;">
        <h1>Security Loading Error</h1>
        <p>Failed to load security features. Please refresh the page.</p>
        <button onclick="location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem;">
          Refresh Page
        </button>
      </div>
    `;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAdminSecurity);

// Export for global access
window.initializeAdminSecurity = initializeAdminSecurity;
window.securityInitialized = () => securityInitialized;
