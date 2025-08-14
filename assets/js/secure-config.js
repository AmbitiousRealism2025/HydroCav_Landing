/**
 * Secure Configuration Loader
 * Handles environment variables and configuration safely
 * Prevents API key exposure in client-side code
 */

class SecureConfig {
    constructor() {
        this.config = {};
        this.initialized = false;
    }

    /**
     * Initialize configuration from meta tags or environment
     * This approach works with static hosting
     */
    async initialize() {
        if (this.initialized) return this.config;

        try {
            // Option 1: Load from meta tags (injected during build)
            const metaConfig = this.loadFromMetaTags();
            
            // Option 2: Load from config endpoint (if using edge functions)
            // const apiConfig = await this.loadFromAPI();
            
            // Merge configurations with validation
            this.config = this.validateConfig({
                ...metaConfig,
                // ...apiConfig
            });

            this.initialized = true;
            
            // Clear sensitive data from memory after initialization
            this.sanitizeConfig();
            
            return this.config;
        } catch (error) {
            console.error('Failed to load configuration:', error.message);
            throw new Error('Configuration initialization failed');
        }
    }

    /**
     * Load configuration from meta tags
     * Meta tags are injected during build process
     */
    loadFromMetaTags() {
        const config = {};
        
        // Read from meta tags (safer than inline scripts)
        const metaTags = document.querySelectorAll('meta[name^="config:"]');
        metaTags.forEach(tag => {
            const key = tag.getAttribute('name').replace('config:', '');
            const value = tag.getAttribute('content');
            
            // Only load non-sensitive config from meta tags
            if (this.isPublicConfig(key)) {
                config[key] = value;
            }
        });

        return config;
    }

    /**
     * Validate configuration values
     */
    validateConfig(config) {
        const required = ['supabase_url'];
        const validated = {};

        // Check required fields
        required.forEach(field => {
            if (!config[field]) {
                throw new Error(`Missing required configuration: ${field}`);
            }
        });

        // Validate and sanitize values
        if (config.supabase_url) {
            // Ensure URL is valid and from expected domain
            try {
                const url = new URL(config.supabase_url);
                if (!url.hostname.endsWith('supabase.co')) {
                    throw new Error('Invalid Supabase URL domain');
                }
                validated.supabaseUrl = config.supabase_url;
            } catch (e) {
                throw new Error('Invalid Supabase URL format');
            }
        }

        // Add anon key if present (this is public anyway)
        if (config.supabase_anon_key) {
            validated.supabaseAnonKey = config.supabase_anon_key;
        }

        // Add feature flags
        validated.features = {
            enableCSRF: config.enable_csrf === 'true',
            enableXSSProtection: config.enable_xss_protection !== 'false',
            enableRateLimiting: config.enable_rate_limiting === 'true',
            enableDebugLogging: config.enable_debug_logging === 'true' && this.isDevelopment()
        };

        return validated;
    }

    /**
     * Check if a config key is safe for public exposure
     */
    isPublicConfig(key) {
        const publicKeys = [
            'supabase_url',
            'supabase_anon_key', // Anon key is designed to be public
            'enable_csrf',
            'enable_xss_protection',
            'enable_rate_limiting',
            'environment'
        ];
        return publicKeys.includes(key.toLowerCase());
    }

    /**
     * Sanitize configuration to prevent accidental exposure
     */
    sanitizeConfig() {
        // Remove any sensitive patterns from config values
        Object.keys(this.config).forEach(key => {
            if (typeof this.config[key] === 'string') {
                // Remove any service_role keys if accidentally included
                if (this.config[key].includes('service_role') || 
                    this.config[key].includes('secret')) {
                    delete this.config[key];
                    console.warn(`Removed potentially sensitive config: ${key}`);
                }
            }
        });
    }

    /**
     * Check if running in development environment
     */
    isDevelopment() {
        return location.hostname === 'localhost' || 
               location.hostname === '127.0.0.1' ||
               location.hostname.startsWith('192.168.');
    }

    /**
     * Get configuration value safely
     */
    get(key, defaultValue = null) {
        return this.config[key] || defaultValue;
    }

    /**
     * Get all feature flags
     */
    getFeatures() {
        return this.config.features || {};
    }

    /**
     * Create Supabase client with secure config
     */
    async createSupabaseClient() {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!window.supabase) {
            throw new Error('Supabase library not loaded');
        }

        const url = this.get('supabaseUrl');
        const anonKey = this.get('supabaseAnonKey');

        if (!url || !anonKey) {
            throw new Error('Supabase configuration incomplete');
        }

        // Create client with additional security options
        return window.supabase.createClient(url, anonKey, {
            auth: {
                persistSession: true,
                detectSessionInUrl: true,
                autoRefreshToken: true
            },
            global: {
                headers: {
                    'X-Client-Version': '1.0.0'
                }
            }
        });
    }
}

// Export singleton instance
const secureConfig = new SecureConfig();

// Freeze to prevent tampering
Object.freeze(secureConfig);

export default secureConfig;