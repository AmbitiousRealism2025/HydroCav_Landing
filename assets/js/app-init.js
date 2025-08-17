/**
 * Application Initialization Module
 * 
 * PHASE 5: Extracted from inline module script for CSP compliance
 * Handles security initialization and module loading
 */

import security from './security.js';

// Initialize security and make it globally available
window.security = security;

// Initialize security features when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await security.initialize();
        console.log('Security features initialized');
        
        // Get secure Supabase client
        window.supabaseClient = security.getSupabaseClient();
        
        // Initialize UX enhancements after security
        const uxModule = await import('./ux-enhancements.js');
        console.log('UX enhancements loaded');
        
        // Initialize monitoring alerts
        if (window.MonitoringAlerts) {
            window.monitoringAlerts = new window.MonitoringAlerts();
            console.log('Monitoring alerts initialized');
        }
    } catch (error) {
        console.error('Failed to initialize security:', error);
    }
});