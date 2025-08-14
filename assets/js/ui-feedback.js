/**
 * UI Feedback module for HydroCav website
 * Handles toast notifications, error displays, and user feedback
 * @module UIFeedback
 */

import { UI_CONFIG, debugLog, isFeatureEnabled } from './config.js';

/**
 * Toast notification types
 */
export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
};

/**
 * Toast notification manager class
 */
class ToastManager {
    constructor() {
        this.container = null;
        this.activeToasts = new Set();
        this.initialized = false;
    }

    /**
     * Initialize the toast container
     */
    _initializeContainer() {
        if (this.initialized) return;

        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
            this.container.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.container);
        }
        this.initialized = true;
        debugLog('Toast container initialized');
    }

    /**
     * Create and show a toast notification
     */
    show(message, type = TOAST_TYPES.INFO, duration = UI_CONFIG.toast.duration) {
        if (!isFeatureEnabled('enableToastNotifications')) {
            console.log(`Toast (${type}): ${message}`);
            return null;
        }

        this._initializeContainer();

        const toast = document.createElement('div');
        const bgColor = type === TOAST_TYPES.SUCCESS ? 'bg-green-500' : 
                       type === TOAST_TYPES.ERROR ? 'bg-red-500' : 'bg-blue-500';
        
        toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-300 mb-4`;
        
        // Create toast content
        const content = document.createElement('div');
        content.className = 'flex items-center justify-between';
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        content.appendChild(messageSpan);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'ml-4 text-white hover:text-gray-200 focus:outline-none';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close notification');
        closeButton.onclick = () => this.hide(toast);
        content.appendChild(closeButton);

        toast.appendChild(content);
        this.container.appendChild(toast);
        this.activeToasts.add(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => this.hide(toast), duration);
        }

        debugLog(`Toast shown: ${type} - ${message}`);
        return toast;
    }

    /**
     * Hide a specific toast
     */
    hide(toast) {
        if (!toast || !this.activeToasts.has(toast)) return;

        toast.classList.add('translate-x-full', 'opacity-0');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.activeToasts.delete(toast);
        }, UI_CONFIG.toast.animationDuration);

        debugLog('Toast hidden');
    }

    /**
     * Hide all active toasts
     */
    hideAll() {
        this.activeToasts.forEach(toast => this.hide(toast));
    }
}

// Create singleton instance
const toastManager = new ToastManager();

/**
 * Show a toast notification
 */
export function showToast(message, type = TOAST_TYPES.INFO, duration = UI_CONFIG.toast.duration) {
    return toastManager.show(message, type, duration);
}

/**
 * Form field error management
 */
export class FormErrorManager {
    constructor() {
        this.activeErrors = new Map();
        this.errorTimeouts = new Map();
    }

    /**
     * Show error message for a form field
     */
    showFieldError(fieldName, message, autoHide = true) {
        const field = document.getElementById(fieldName);
        if (!field) {
            debugLog(`Field not found: ${fieldName}`);
            return;
        }

        // Clear existing error for this field
        this.clearFieldError(fieldName);

        // Find or create error container
        let errorElement = document.getElementById(`${fieldName}-error`);
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = `${fieldName}-error`;
            errorElement.className = 'text-red-400 text-sm mt-1 transition-opacity duration-300';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            
            // Insert after the field
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Update field styling
        field.classList.add('border-red-400');
        field.classList.remove('border-white/20');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id);

        // Store error reference
        this.activeErrors.set(fieldName, errorElement);

        // Auto-hide if enabled
        if (autoHide) {
            const timeout = setTimeout(() => {
                this.clearFieldError(fieldName);
            }, UI_CONFIG.form.errorDisplayDuration);
            
            this.errorTimeouts.set(fieldName, timeout);
        }

        debugLog(`Field error shown: ${fieldName} - ${message}`);
    }

    /**
     * Clear error message for a form field
     */
    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = this.activeErrors.get(fieldName);
        const timeout = this.errorTimeouts.get(fieldName);

        // Clear timeout if exists
        if (timeout) {
            clearTimeout(timeout);
            this.errorTimeouts.delete(fieldName);
        }

        // Remove error element
        if (errorElement) {
            errorElement.style.display = 'none';
            this.activeErrors.delete(fieldName);
        }

        // Reset field styling
        if (field) {
            field.classList.remove('border-red-400');
            field.classList.add('border-white/20');
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        }

        debugLog(`Field error cleared: ${fieldName}`);
    }

    /**
     * Clear all field errors
     */
    clearAllErrors() {
        this.activeErrors.forEach((_, fieldName) => {
            this.clearFieldError(fieldName);
        });
    }
}

// Create singleton instance for form errors
const formErrorManager = new FormErrorManager();

/**
 * Show error message for a form field
 */
export function showFieldError(fieldName, message, autoHide = true) {
    formErrorManager.showFieldError(fieldName, message, autoHide);
}

/**
 * Clear error message for a form field
 */
export function clearFieldError(fieldName) {
    formErrorManager.clearFieldError(fieldName);
}

/**
 * Clear all error messages
 */
export function clearAllErrors() {
    formErrorManager.clearAllErrors();
}

/**
 * Loading state management utilities
 */
export const LoadingManager = {
    /**
     * Show loading state for an element
     */
    show(element, loadingText = 'Loading...') {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (!el) return;

        el.setAttribute('data-original-text', el.textContent);
        el.setAttribute('data-original-disabled', el.disabled);
        
        const spinner = document.getElementById('submit-spinner');
        const text = document.getElementById('submit-text');
        
        if (spinner && text) {
            text.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            el.textContent = loadingText;
        }
        
        el.disabled = true;
        el.classList.add('opacity-50', 'cursor-not-allowed');

        debugLog(`Loading state shown for element: ${el.id || 'unnamed'}`);
    },

    /**
     * Hide loading state for an element
     */
    hide(element) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (!el) return;

        const spinner = document.getElementById('submit-spinner');
        const text = document.getElementById('submit-text');
        
        if (spinner && text) {
            text.classList.remove('hidden');
            spinner.classList.add('hidden');
        } else {
            const originalText = el.getAttribute('data-original-text');
            if (originalText) {
                el.textContent = originalText;
                el.removeAttribute('data-original-text');
            }
        }
        
        const originalDisabled = el.getAttribute('data-original-disabled');
        el.disabled = originalDisabled === 'true';
        el.removeAttribute('data-original-disabled');
        
        el.classList.remove('opacity-50', 'cursor-not-allowed');

        debugLog(`Loading state hidden for element: ${el.id || 'unnamed'}`);
    }
};

/**
 * Character counter utilities
 */
export const CharacterCounter = {
    /**
     * Update character counter for a field
     */
    update(fieldName, maxLength) {
        const field = document.getElementById(fieldName);
        const counterId = `${fieldName}-counter`;
        let counter = document.getElementById(counterId);

        if (!field) return;

        const currentLength = field.value.length;
        const remaining = maxLength - currentLength;

        if (!counter) {
            counter = document.createElement('div');
            counter.id = counterId;
            counter.className = 'text-xs text-blue-300 mt-1 text-right';
            
            // Find the right place to insert the counter
            const existingCounter = field.parentNode.querySelector('.text-xs');
            if (existingCounter) {
                existingCounter.replaceWith(counter);
            } else {
                field.parentNode.appendChild(counter);
            }
        }

        counter.textContent = `${currentLength}/${maxLength}`;
        
        // Update styling based on usage
        if (currentLength > maxLength) {
            counter.className = 'text-xs text-red-400 mt-1 text-right';
            field.classList.add('border-red-400');
        } else if (currentLength > maxLength * 0.9) {
            counter.className = 'text-xs text-yellow-400 mt-1 text-right';
        } else {
            counter.className = 'text-xs text-blue-300 mt-1 text-right';
            field.classList.remove('border-red-400');
        }
    }
};