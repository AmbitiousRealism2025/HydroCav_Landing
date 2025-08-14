/**
 * XSS Protection Module
 * Implements DOMPurify and content sanitization
 */

class XSSProtection {
    constructor() {
        this.purifier = null;
        this.initialized = false;
    }

    /**
     * Initialize DOMPurify
     */
    async initialize() {
        if (this.initialized) return;

        try {
            // Load DOMPurify if not already loaded
            if (typeof DOMPurify === 'undefined') {
                await this.loadDOMPurify();
            }

            this.purifier = DOMPurify;
            this.configurePurifier();
            this.initialized = true;

            console.log('XSS Protection initialized');
        } catch (error) {
            console.error('Failed to initialize XSS protection:', error);
            // Fallback to basic sanitization
            this.purifier = this.createFallbackSanitizer();
        }
    }

    /**
     * Load DOMPurify library dynamically
     */
    async loadDOMPurify() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';
            script.integrity = 'sha384-6H3mH6EjEELhF1ERCv4zvh2H5xPO6PnqVZvSmLdHQ8pGQq8Z7TqJqsFoWcY6CZ2B';
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Configure DOMPurify settings
     */
    configurePurifier() {
        if (!this.purifier) return;

        // Set default configuration
        this.purifier.setConfig({
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'span'],
            ALLOWED_ATTR: ['href', 'target', 'rel'],
            ALLOW_DATA_ATTR: false,
            SAFE_FOR_TEMPLATES: true,
            KEEP_CONTENT: true,
            RETURN_TRUSTED_TYPE: false
        });

        // Add hooks for additional security
        this.purifier.addHook('afterSanitizeAttributes', (node) => {
            // Set target="_blank" and rel="noopener" on all links
            if (node.tagName === 'A') {
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    /**
     * Sanitize HTML content
     */
    sanitizeHTML(dirty) {
        if (!this.initialized) {
            console.warn('XSS Protection not initialized, using fallback');
            return this.fallbackSanitize(dirty);
        }

        try {
            return this.purifier.sanitize(dirty);
        } catch (error) {
            console.error('Sanitization error:', error);
            return this.fallbackSanitize(dirty);
        }
    }

    /**
     * Sanitize plain text (escapes HTML entities)
     */
    sanitizeText(text) {
        if (typeof text !== 'string') {
            return '';
        }

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sanitize form input values
     */
    sanitizeFormInput(input) {
        if (typeof input !== 'string') {
            return '';
        }

        // Remove any HTML tags and scripts
        let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        clean = clean.replace(/<[^>]+>/g, '');
        
        // Remove dangerous patterns
        clean = clean.replace(/javascript:/gi, '');
        clean = clean.replace(/on\w+\s*=/gi, '');
        clean = clean.replace(/data:text\/html/gi, '');
        
        // Trim and normalize whitespace
        clean = clean.trim().replace(/\s+/g, ' ');

        return clean;
    }

    /**
     * Validate and sanitize email
     */
    sanitizeEmail(email) {
        if (typeof email !== 'string') {
            return '';
        }

        // Basic email validation and sanitization
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const cleaned = email.trim().toLowerCase();

        if (!emailRegex.test(cleaned)) {
            throw new Error('Invalid email format');
        }

        return cleaned;
    }

    /**
     * Sanitize URL
     */
    sanitizeURL(url) {
        if (typeof url !== 'string') {
            return '';
        }

        try {
            const parsed = new URL(url);
            
            // Only allow http(s) protocols
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                throw new Error('Invalid protocol');
            }

            // Check for suspicious patterns
            if (parsed.href.includes('javascript:') || 
                parsed.href.includes('data:') ||
                parsed.href.includes('vbscript:')) {
                throw new Error('Dangerous URL pattern detected');
            }

            return parsed.href;
        } catch (error) {
            console.error('URL sanitization failed:', error);
            return '';
        }
    }

    /**
     * Create Content Security Policy meta tag
     */
    setContentSecurityPolicy() {
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
            "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://*.supabase.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
        
        document.head.appendChild(cspMeta);
    }

    /**
     * Fallback sanitizer for when DOMPurify fails to load
     */
    createFallbackSanitizer() {
        return {
            sanitize: (dirty) => this.fallbackSanitize(dirty)
        };
    }

    /**
     * Basic fallback sanitization
     */
    fallbackSanitize(dirty) {
        if (typeof dirty !== 'string') {
            return '';
        }

        // Basic HTML entity encoding
        return dirty
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Sanitize all form inputs in a container
     */
    sanitizeFormData(formElement) {
        const sanitized = {};
        
        const inputs = formElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const name = input.name;
            if (!name) return;

            let value = input.value;

            // Apply appropriate sanitization based on input type
            switch (input.type) {
                case 'email':
                    try {
                        sanitized[name] = this.sanitizeEmail(value);
                    } catch (e) {
                        sanitized[name] = '';
                    }
                    break;
                case 'url':
                    sanitized[name] = this.sanitizeURL(value);
                    break;
                case 'number':
                    sanitized[name] = parseFloat(value) || 0;
                    break;
                default:
                    sanitized[name] = this.sanitizeFormInput(value);
            }
        });

        return sanitized;
    }
}

// Export singleton instance
const xssProtection = new XSSProtection();
export default xssProtection;