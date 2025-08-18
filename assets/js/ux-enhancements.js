/**
 * @fileoverview UX Enhancements Module
 * Phase 5B implementation of comprehensive user experience improvements
 *
 * Features:
 * - Enhanced error recovery workflows
 * - Loading state management with accessibility
 * - Character counters with live feedback
 * - Toast notification system
 * - Mobile performance optimizations
 * - Accessibility compliance (WCAG 2.1 AA)
 */

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

class UXEnhancementManager {
  constructor() {
    this.toastContainer = null;
    this.loadingStates = new Map();
    this.characterCounters = new Map();
    this.performanceMonitor = null;

    this.init();
  }

  async init() {
    console.log('🎯 Initializing UX Enhancements...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createToastContainer();
    this.enhanceFormElements();
    this.setupLoadingStates();
    this.initializeAccessibilityFeatures();
    this.optimizeForMobile();
    this.setupPerformanceMonitoring();

    console.log('✅ UX Enhancements initialized successfully');
  }

  // ===================================================================
  // TOAST NOTIFICATION SYSTEM
  // ===================================================================

  createToastContainer() {
    if (!document.getElementById('toast-container')) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toast-container';
      this.toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
      this.toastContainer.setAttribute('aria-live', 'polite');
      this.toastContainer.setAttribute('aria-label', 'Notifications');
      document.body.appendChild(this.toastContainer);
    } else {
      this.toastContainer = document.getElementById('toast-container');
    }
  }

  showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `
      toast-notification liquid-glass-card p-4 rounded-lg shadow-lg
      transform translate-x-full transition-transform duration-300 ease-out
      max-w-sm
      ${type === 'success' ? 'border-green-500' : ''}
      ${type === 'error' ? 'border-red-500' : ''}
      ${type === 'warning' ? 'border-yellow-500' : ''}
    `;

    // Add icon based on type
    const icon = this.getToastIcon(type);

    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${icon}
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">${escapeHtml(message)}</p>
        </div>
        <button 
          class="ml-auto pl-3 flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;

    // Add to container
    this.toastContainer.appendChild(toast);

    // Slide in animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full');
    });

    // Auto dismiss
    setTimeout(() => {
      this.dismissToast(toast);
    }, duration);

    // Manual dismiss
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => this.dismissToast(toast));

    return toast;
  }

  getToastIcon(type) {
    const icons = {
      success: `<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>`,
      error: `<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
      </svg>`,
      warning: `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>`,
      info: `<svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
      </svg>`,
    };

    return icons[type] || icons.info;
  }

  dismissToast(toast) {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // ===================================================================
  // FORM ENHANCEMENTS
  // ===================================================================

  enhanceFormElements() {
    // Enhance contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      this.enhanceContactForm(contactForm);
    }

    // Add character counters to inputs with maxlength
    const inputsWithMaxLength = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    inputsWithMaxLength.forEach(input => {
      this.addCharacterCounter(input);
    });

    // Enhance form validation
    this.enhanceFormValidation();
  }

  enhanceContactForm(form) {
    // Add ARIA attributes
    form.setAttribute('novalidate', ''); // Use custom validation
    form.setAttribute('aria-label', 'Contact form');

    // Add fieldset and legend if not present
    let fieldset = form.querySelector('fieldset');
    if (!fieldset) {
      fieldset = document.createElement('fieldset');
      fieldset.innerHTML = '<legend class="sr-only">Contact Information</legend>';

      // Move all form controls into fieldset
      const formControls = Array.from(form.children).filter(
        child => child.tagName !== 'FIELDSET' && !child.classList.contains('form-actions')
      );

      formControls.forEach(control => {
        fieldset.appendChild(control);
      });

      form.insertBefore(fieldset, form.firstChild);
    }

    // Add submit status for screen readers
    if (!document.getElementById('submit-status')) {
      const submitStatus = document.createElement('div');
      submitStatus.id = 'submit-status';
      submitStatus.className = 'sr-only';
      submitStatus.setAttribute('aria-live', 'polite');
      submitStatus.setAttribute('aria-atomic', 'true');
      form.appendChild(submitStatus);
    }
  }

  addCharacterCounter(input) {
    const maxLength = parseInt(input.getAttribute('maxlength'));
    if (!maxLength) return;

    const fieldId = input.id || input.name;
    const counterId = `${fieldId}-counter`;

    // Check if counter already exists
    if (document.getElementById(counterId)) return;

    // Create counter element
    const counter = document.createElement('div');
    counter.id = counterId;
    counter.className = 'character-counter text-sm text-gray-500 mt-1';
    counter.setAttribute('aria-live', 'polite');

    // Insert counter after input
    input.parentNode.insertBefore(counter, input.nextSibling);

    // Update counter function
    const updateCounter = () => {
      const currentLength = input.value.length;
      const remaining = maxLength - currentLength;
      const percentage = (currentLength / maxLength) * 100;

      counter.textContent = `${currentLength}/${maxLength} characters`;

      // Add warning class if over 75%
      if (percentage > 75) {
        counter.classList.add('text-yellow-600', 'warning');
      } else {
        counter.classList.remove('text-yellow-600', 'warning');
      }

      // Add danger class if over 90%
      if (percentage > 90) {
        counter.classList.add('text-red-600', 'danger');
      } else {
        counter.classList.remove('text-red-600', 'danger');
      }
    };

    // Initial update
    updateCounter();

    // Listen for input changes
    input.addEventListener('input', updateCounter);
    this.characterCounters.set(fieldId, { input, counter, updateCounter });
  }

  enhanceFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        // Add real-time validation
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });

      // Enhanced form submission
      form.addEventListener('submit', e => this.handleFormSubmission(e, form));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (isRequired && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(field)} is required.`;
    }

    // Email validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address (e.g., name@example.com).';
      }
    }

    // Show/hide error
    this.displayFieldError(field, isValid ? null : errorMessage);

    return isValid;
  }

  getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name || 'This field';
  }

  displayFieldError(field, message) {
    const errorId = `${field.id}-error`;
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'error-message text-red-600 text-sm mt-1 hidden';
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'assertive');

      field.parentNode.insertBefore(errorElement, field.nextSibling);

      // Update field aria-describedby
      const describedBy = field.getAttribute('aria-describedby') || '';
      const newDescribedBy = describedBy ? `${describedBy} ${errorId}` : errorId;
      field.setAttribute('aria-describedby', newDescribedBy);
    }

    if (message) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      field.classList.add('border-red-500');
      field.setAttribute('aria-invalid', 'true');
    } else {
      errorElement.classList.add('hidden');
      field.classList.remove('border-red-500');
      field.removeAttribute('aria-invalid');
    }
  }

  clearFieldError(field) {
    const errorId = `${field.id}-error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.classList.add('hidden');
      field.classList.remove('border-red-500');
      field.removeAttribute('aria-invalid');
    }
  }

  handleFormSubmission(event, form) {
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      event.preventDefault();
      this.showToast('Please correct the errors above.', 'error');

      // Focus first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  }

  // ===================================================================
  // LOADING STATES
  // ===================================================================

  setupLoadingStates() {
    // Create global loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className =
        'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center';
      overlay.innerHTML = `
        <div class="liquid-glass-card p-6 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-700">Loading...</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
  }

  showLoading(target = null, message = 'Loading...') {
    const timestamp = Date.now();

    if (target) {
      // Show loading state on specific element
      const loadingId = `loading-${timestamp}`;

      // Store original content
      this.loadingStates.set(loadingId, {
        element: target,
        originalContent: target.innerHTML,
        originalDisabled: target.disabled,
      });

      // Add loading content
      if (target.tagName === 'BUTTON') {
        target.disabled = true;
        target.innerHTML = `
          <span class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" aria-hidden="true"></span>
          ${message}
        `;
      } else {
        target.innerHTML = `
          <div class="flex items-center justify-center p-4">
            <div class="loading-spinner w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" aria-hidden="true"></div>
            <span>${message}</span>
          </div>
        `;
      }

      return loadingId;
    } else {
      // Show global loading overlay
      const overlay = document.getElementById('loading-overlay');
      overlay.classList.remove('hidden');
      overlay.querySelector('p').textContent = message;
      return 'global-loading';
    }
  }

  hideLoading(loadingId) {
    if (loadingId === 'global-loading') {
      const overlay = document.getElementById('loading-overlay');
      overlay.classList.add('hidden');
    } else if (this.loadingStates.has(loadingId)) {
      const state = this.loadingStates.get(loadingId);
      state.element.innerHTML = state.originalContent;
      state.element.disabled = state.originalDisabled;
      this.loadingStates.delete(loadingId);
    }
  }

  // ===================================================================
  // ACCESSIBILITY FEATURES
  // ===================================================================

  initializeAccessibilityFeatures() {
    this.addSkipLinks();
    this.enhanceKeyboardNavigation();
    this.setupFocusManagement();
    this.addScreenReaderSupport();
  }

  addSkipLinks() {
    if (!document.getElementById('skip-to-main')) {
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-to-main';
      skipLink.href = '#main-content';
      skipLink.className =
        'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded';
      skipLink.textContent = 'Skip to main content';

      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Ensure main content has ID
    let main = document.querySelector('main');
    if (!main) {
      main = document.querySelector('[role="main"]');
    }
    if (main && !main.id) {
      main.id = 'main-content';
    }
  }

  enhanceKeyboardNavigation() {
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll(
      'button, input, textarea, select, a[href]'
    );

    interactiveElements.forEach(element => {
      // Ensure elements can receive focus
      if (element.tabIndex === -1 && !element.disabled) {
        element.removeAttribute('tabindex');
      }

      // Add keyboard event handlers for custom elements
      if (
        element.classList.contains('liquid-glass-button') ||
        element.classList.contains('liquid-glass-card')
      ) {
        element.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
          }
        });
      }
    });
  }

  setupFocusManagement() {
    // Enhance focus visibility
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      .skip-link:focus {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 9999;
      }
    `;
    document.head.appendChild(style);

    // Focus management for modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"]:not(.hidden)');
        if (openModal) {
          this.closeModal(openModal);
        }
      }
    });
  }

  addScreenReaderSupport() {
    // Add screen reader only helper text
    const srHelper = document.createElement('div');
    srHelper.className = 'sr-only';
    srHelper.setAttribute('aria-live', 'polite');
    srHelper.id = 'sr-helper';
    document.body.appendChild(srHelper);

    // Announce important state changes
    window.announceToScreenReader = message => {
      srHelper.textContent = message;
      setTimeout(() => {
        srHelper.textContent = '';
      }, 1000);
    };
  }

  // ===================================================================
  // MOBILE OPTIMIZATION
  // ===================================================================

  optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      this.optimizeGlassEffects();
      this.optimizeTouchTargets();
      this.optimizeAnimations();
    }

    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.optimizeForMobile();
      }, 100);
    });
  }

  optimizeGlassEffects() {
    // Reduce backdrop-filter blur for mobile performance
    const glassElements = document.querySelectorAll('.liquid-glass-card, .liquid-glass-button');

    glassElements.forEach(element => {
      element.classList.add('mobile-optimized');
    });

    // Add mobile-specific CSS
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
      @media (max-width: 768px) {
        .mobile-optimized {
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
      }
    `;
    document.head.appendChild(mobileStyles);
  }

  optimizeTouchTargets() {
    // Ensure minimum 44px touch targets
    const interactiveElements = document.querySelectorAll(
      'button, input, textarea, select, a[href]'
    );

    interactiveElements.forEach(element => {
      const styles = getComputedStyle(element);
      const height = parseInt(styles.height);
      const minHeight = parseInt(styles.minHeight);

      if (height < 44 && minHeight < 44) {
        element.style.minHeight = '44px';
        element.style.padding = element.style.padding || '12px 16px';
      }
    });
  }

  optimizeAnimations() {
    // Reduce animations on lower-end devices
    if (navigator.hardwareConcurrency <= 2) {
      document.body.classList.add('reduced-animation');

      const reducedAnimationStyles = document.createElement('style');
      reducedAnimationStyles.textContent = `
        .reduced-animation * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(reducedAnimationStyles);
    }
  }

  // ===================================================================
  // PERFORMANCE MONITORING
  // ===================================================================

  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      this.performanceMonitor = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.handlePerformanceEntry(entry);
        });
      });

      try {
        this.performanceMonitor.observe({ type: 'largest-contentful-paint', buffered: true });
        this.performanceMonitor.observe({ type: 'first-input', buffered: true });
        this.performanceMonitor.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('Some performance metrics not supported:', e);
      }
    }
  }

  handlePerformanceEntry(entry) {
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        if (entry.startTime > 2500) {
          console.warn('LCP performance issue:', entry.startTime);
        }
        break;
      case 'first-input':
        if (entry.processingStart - entry.startTime > 100) {
          console.warn('FID performance issue:', entry.processingStart - entry.startTime);
        }
        break;
      case 'layout-shift':
        if (entry.value > 0.1) {
          console.warn('CLS performance issue:', entry.value);
        }
        break;
    }
  }

  // ===================================================================
  // ERROR RECOVERY
  // ===================================================================

  createRetryButton(container, retryCallback, message = 'Try Again') {
    const retryBtn = document.createElement('button');
    retryBtn.className = 'liquid-glass-button mt-4';
    retryBtn.textContent = message;
    retryBtn.addEventListener('click', retryCallback);

    container.appendChild(retryBtn);
    return retryBtn;
  }

  displayUserFriendlyError(error, container) {
    let friendlyMessage = 'Something went wrong. Please try again.';

    if (error.message) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        friendlyMessage =
          'There seems to be a connection problem. Please check your internet connection and try again.';
      } else if (error.message.includes('rate limit')) {
        friendlyMessage = "You've made too many requests. Please wait a moment and try again.";
      } else if (error.message.includes('email')) {
        friendlyMessage = 'Please check your email address and try again.';
      }
    }

    container.innerHTML = `
      <div class="error-state liquid-glass-card p-6 text-center border-red-200" role="alert">
        <svg class="error-icon w-12 h-12 text-red-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p class="text-gray-600 mb-4">${friendlyMessage}</p>
      </div>
    `;
  }

  // ===================================================================
  // PUBLIC API
  // ===================================================================

  // Make methods available globally for integration
  getAPI() {
    return {
      showToast: this.showToast.bind(this),
      showLoading: this.showLoading.bind(this),
      hideLoading: this.hideLoading.bind(this),
      validateField: this.validateField.bind(this),
      createRetryButton: this.createRetryButton.bind(this),
      displayUserFriendlyError: this.displayUserFriendlyError.bind(this),
      announceToScreenReader: window.announceToScreenReader,
    };
  }
}

// Initialize UX enhancements
const uxManager = new UXEnhancementManager();

// Make UX API available globally
window.UX = uxManager.getAPI();

export default uxManager;
