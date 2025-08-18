/**
 * Contact Form Handler with Enhanced UX Features
 *
 * PHASE 5: Extracted from inline script for CSP compliance
 * This removes the need for 'unsafe-inline' in Content Security Policy
 */

// Toast notification system
class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
  }

  show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = this.getIcon(type);

    toast.innerHTML = `
            <svg class="toast-icon" fill="currentColor" viewBox="0 0 20 20">
                ${icon}
            </svg>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
            </button>
        `;

    this.container.appendChild(toast);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  }

  getIcon(type) {
    const icons = {
      success:
        '<path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>',
      error:
        '<path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>',
      info: '<path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>',
    };
    return icons[type] || icons.info;
  }
}

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const toastManager = new ToastManager();

// Form validation state
let isFormSubmitting = false;

// Character counter setup
const setupCharacterCounters = () => {
  const counters = [
    { input: 'name', counter: 'name-counter', max: 100 },
    { input: 'company', counter: 'company-counter', max: 100 },
    { input: 'message', counter: 'message-counter', max: 2000 },
  ];

  counters.forEach(({ input, counter, max }) => {
    const inputEl = document.getElementById(input);
    const counterEl = document.getElementById(counter);

    if (inputEl && counterEl) {
      const updateCounter = () => {
        const count = inputEl.value.length;
        counterEl.textContent = `${count} / ${max}`;
        counterEl.className = count > max * 0.9 ? 'char-counter warning' : 'char-counter';
      };

      inputEl.addEventListener('input', updateCounter);
      updateCounter();
    }
  });
};

// Real-time validation
const setupRealTimeValidation = () => {
  const fields = ['name', 'email', 'company', 'message'];

  fields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    const errorDiv = document.getElementById(`${fieldName}-error`);

    if (field && errorDiv) {
      field.addEventListener('input', () => {
        if (!isFormSubmitting) {
          validateField(fieldName);
        }
      });

      field.addEventListener('blur', () => {
        validateField(fieldName);
      });
    }
  });
};

// Field validation
const validateField = fieldName => {
  const field = document.getElementById(fieldName);
  const errorDiv = document.getElementById(`${fieldName}-error`);

  if (!field || !errorDiv) return true;

  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Field-specific validation
  switch (fieldName) {
    case 'name':
      if (value.length === 0) {
        isValid = false;
        errorMessage = 'Name is required';
      } else if (value.length > 100) {
        isValid = false;
        errorMessage = 'Name must be 100 characters or less';
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.length === 0) {
        isValid = false;
        errorMessage = 'Email is required';
      } else if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
      break;

    case 'company':
      if (value.length > 100) {
        isValid = false;
        errorMessage = 'Company name must be 100 characters or less';
      }
      break;

    case 'message':
      if (value.length === 0) {
        isValid = false;
        errorMessage = 'Message is required';
      } else if (value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters';
      } else if (value.length > 2000) {
        isValid = false;
        errorMessage = 'Message must be 2000 characters or less';
      }
      break;
  }

  // Update UI
  if (isValid) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
  } else {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    errorDiv.textContent = errorMessage;
    errorDiv.style.display = 'block';

    // Auto-fade error message after 4 seconds (if not submitting)
    if (!isFormSubmitting) {
      setTimeout(() => {
        if (errorDiv.textContent === errorMessage) {
          errorDiv.style.animation = 'fadeOut 0.5s ease';
          setTimeout(() => {
            errorDiv.style.display = 'none';
            errorDiv.style.animation = '';
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
          }, 500);
        }
      }, 4000);
    }
  }

  return isValid;
};

// Form validation
const validateForm = () => {
  const fields = ['name', 'email', 'message'];
  let isValid = true;

  fields.forEach(fieldName => {
    if (!validateField(fieldName)) {
      isValid = false;
    }
  });

  return isValid;
};

// Loading state management
const showLoadingState = show => {
  const button = document.querySelector('#contact-form button[type="submit"]') || document.getElementById('submit-button');
  
  if (!button) {
    console.error('Submit button not found');
    return;
  }

  // Check if button has internal structure or just text
  const buttonText = button.querySelector('.button-text');
  const loadingSpinner = button.querySelector('.loading-spinner');

  if (show) {
    button.disabled = true;
    button.style.opacity = '0.7';
    
    if (buttonText) {
      buttonText.textContent = 'Sending...';
    } else {
      // Button has direct text content
      button.textContent = 'Sending...';
    }
    
    if (loadingSpinner) {
      loadingSpinner.style.display = 'inline-block';
    }
  } else {
    button.disabled = false;
    button.style.opacity = '1';
    
    if (buttonText) {
      buttonText.textContent = 'Send Message';
    } else {
      // Button has direct text content
      button.textContent = 'Send Message';
    }
    
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
  }
};

// Status message display
const showStatusMessage = (message, type) => {
  toastManager.show(message, type);
};

// Success animation
const showSuccessAnimation = () => {
  const form = document.getElementById('contact-form');

  // Create success overlay
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay';
  overlay.innerHTML = `
        <div class="success-content">
            <div class="success-checkmark">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
        </div>
    `;

  form.style.position = 'relative';
  form.appendChild(overlay);

  // Remove overlay and reset form after delay
  setTimeout(() => {
    overlay.remove();
    form.reset();
    setupCharacterCounters(); // Reset counters
    isFormSubmitting = false;
  }, 3000);
};

// Main form submission handler
async function handleContactSubmission(event) {
  event.preventDefault();

  // Set form submission flag to prevent auto-fade during validation
  isFormSubmitting = true;

  // Validate form first
  if (!validateForm()) {
    isFormSubmitting = false; // Reset flag if validation fails
    toastManager.show('Please correct the errors in the form', 'error');
    return;
  }

  // Check if security is initialized
  if (!window.security || !window.security.initialized) {
    isFormSubmitting = false; // Reset flag
    showStatusMessage('Security features are loading. Please try again in a moment.', 'error');
    return;
  }

  const form = event.target;

  try {
    // Show loading state
    showLoadingState(true);

    // Use secure form submission
    const result = await window.security.submitForm(form, async sanitizedData => {
      // Custom handler for the sanitized data
      const submission = {
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company || '',
        message: sanitizedData.message,
      };

      // ACTUALLY SUBMIT TO SUPABASE - This was missing!
      console.log('📤 Submitting to Supabase:', submission);
      
      // Get Supabase credentials from meta tags (same as admin dashboard)
      const supabaseUrl = document.querySelector('meta[name="config:supabase_url"]')?.content;
      const supabaseKey = document.querySelector('meta[name="config:supabase_anon_key"]')?.content;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }

      // Create Supabase client
      const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
      
      // Insert into contact_submissions table
      const { data, error } = await supabaseClient
        .from('contact_submissions')
        .insert([{
          name: submission.name,
          email: submission.email,
          company: submission.company,
          message: submission.message,
          status: 'new',
          priority: 'normal'
        }])
        .select();

      if (error) {
        console.error('❌ Supabase insertion failed:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Successfully saved to Supabase:', data);
      return submission;
    });

    // Show success
    showSuccessAnimation();
    showStatusMessage(
      "Message sent successfully! We'll get back to you within 24 hours.",
      'success'
    );
  } catch (error) {
    console.error('Form submission error:', error);
    showStatusMessage(error.message || 'Something went wrong. Please try again.', 'error');
    isFormSubmitting = false; // Reset flag on error
  } finally {
    showLoadingState(false);
  }
}

// Initialize form features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupCharacterCounters();
  setupRealTimeValidation();

  // Reduced motion support
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
});

// Export for global access
window.handleContactSubmission = handleContactSubmission;

// CSP Compliance: Add event listener for form submission instead of inline handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmission);
  }
});
