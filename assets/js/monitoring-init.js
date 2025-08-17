/**
 * Monitoring Systems Initialization
 * 
 * PHASE 5: Extracted from inline script for CSP compliance
 * Initializes all monitoring systems when page loads
 */

// Auto-initialize monitoring systems in production
document.addEventListener('DOMContentLoaded', () => {
    if (window.ErrorTracker && window.PerformanceMonitor && window.HealthMonitor) {
        console.log('🚀 All monitoring systems loaded successfully');
        
        // Start health monitoring heartbeat
        if (window.healthMonitor) {
            window.healthMonitor.startHeartbeat();
        }
    }
});