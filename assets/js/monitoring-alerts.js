/**
 * Monitoring Alerts Configuration
 * Production-ready alert system for HydroCav monitoring infrastructure
 */

class MonitoringAlerts {
  constructor() {
    this.alertThresholds = {
      // Error tracking thresholds
      errorRate: {
        warning: 0.02, // 2% error rate
        critical: 0.05, // 5% error rate
      },
      
      // Performance monitoring thresholds
      performance: {
        lcp: {
          good: 2500, // 2.5s
          needsImprovement: 4000, // 4s
        },
        fid: {
          good: 100, // 100ms
          needsImprovement: 300, // 300ms
        },
        cls: {
          good: 0.1,
          needsImprovement: 0.25,
        },
      },
      
      // Health monitoring thresholds
      health: {
        uptime: {
          warning: 0.99, // 99% uptime
          critical: 0.95, // 95% uptime
        },
        responseTime: {
          warning: 3000, // 3s
          critical: 5000, // 5s
        },
      },
    };

    this.alertMethods = {
      console: true, // Development
      email: false, // Requires email service setup
      webhook: false, // Requires webhook endpoint
    };

    this.init();
  }

  init() {
    console.log('🚨 Monitoring Alerts System Initialized');
    this.setupErrorAlerts();
    this.setupPerformanceAlerts();
    this.setupHealthAlerts();
  }

  setupErrorAlerts() {
    if (window.ErrorTracker) {
      // Monitor error rate every 5 minutes
      setInterval(() => {
        const errorRate = this.calculateErrorRate();
        this.checkErrorThresholds(errorRate);
      }, 5 * 60 * 1000);
    }
  }

  setupPerformanceAlerts() {
    if (window.PerformanceMonitor) {
      // Monitor Core Web Vitals every 10 minutes
      setInterval(() => {
        this.checkPerformanceThresholds();
      }, 10 * 60 * 1000);
    }
  }

  setupHealthAlerts() {
    if (window.HealthMonitor) {
      // Monitor health status every 2 minutes
      setInterval(() => {
        this.checkHealthThresholds();
      }, 2 * 60 * 1000);
    }
  }

  calculateErrorRate() {
    const errors = window.ErrorTracker?.getErrorSummary() || {};
    const totalErrors = Object.values(errors).reduce((sum, count) => sum + count, 0);
    const totalPageViews = this.getPageViewCount();
    
    return totalPageViews > 0 ? totalErrors / totalPageViews : 0;
  }

  getPageViewCount() {
    // Simple page view tracking (can be enhanced with analytics)
    return parseInt(sessionStorage.getItem('pageViews') || '1');
  }

  checkErrorThresholds(errorRate) {
    const thresholds = this.alertThresholds.errorRate;
    
    if (errorRate >= thresholds.critical) {
      this.sendAlert('CRITICAL', 'Error Rate', `Critical error rate: ${(errorRate * 100).toFixed(2)}%`);
    } else if (errorRate >= thresholds.warning) {
      this.sendAlert('WARNING', 'Error Rate', `High error rate: ${(errorRate * 100).toFixed(2)}%`);
    }
  }

  checkPerformanceThresholds() {
    const metrics = window.PerformanceMonitor?.getMetrics() || {};
    const thresholds = this.alertThresholds.performance;

    // Check LCP
    if (metrics.lcp && metrics.lcp > thresholds.lcp.needsImprovement) {
      this.sendAlert('WARNING', 'Performance', `Poor LCP: ${metrics.lcp}ms`);
    }

    // Check FID
    if (metrics.fid && metrics.fid > thresholds.fid.needsImprovement) {
      this.sendAlert('WARNING', 'Performance', `Poor FID: ${metrics.fid}ms`);
    }

    // Check CLS
    if (metrics.cls && metrics.cls > thresholds.cls.needsImprovement) {
      this.sendAlert('WARNING', 'Performance', `Poor CLS: ${metrics.cls}`);
    }
  }

  checkHealthThresholds() {
    const health = window.HealthMonitor?.getHealthStatus() || {};
    const thresholds = this.alertThresholds.health;

    // Check uptime
    if (health.uptime !== undefined && health.uptime < thresholds.uptime.critical) {
      this.sendAlert('CRITICAL', 'Health', `Low uptime: ${(health.uptime * 100).toFixed(2)}%`);
    } else if (health.uptime !== undefined && health.uptime < thresholds.uptime.warning) {
      this.sendAlert('WARNING', 'Health', `Uptime concern: ${(health.uptime * 100).toFixed(2)}%`);
    }

    // Check response time
    if (health.responseTime && health.responseTime > thresholds.health.responseTime.critical) {
      this.sendAlert('CRITICAL', 'Health', `Slow response: ${health.responseTime}ms`);
    } else if (health.responseTime && health.responseTime > thresholds.health.responseTime.warning) {
      this.sendAlert('WARNING', 'Health', `Response time concern: ${health.responseTime}ms`);
    }
  }

  sendAlert(severity, category, message) {
    const timestamp = new Date().toISOString();
    const alert = {
      timestamp,
      severity,
      category,
      message,
      url: window.location.href,
    };

    console.log(`🚨 [${severity}] ${category}: ${message}`);

    // Store alert for dashboard
    this.storeAlert(alert);

    // Send via configured methods
    if (this.alertMethods.console) {
      this.sendConsoleAlert(alert);
    }

    if (this.alertMethods.email) {
      this.sendEmailAlert(alert);
    }

    if (this.alertMethods.webhook) {
      this.sendWebhookAlert(alert);
    }
  }

  storeAlert(alert) {
    const alerts = JSON.parse(localStorage.getItem('monitoring_alerts') || '[]');
    alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (alerts.length > 100) {
      alerts.splice(100);
    }
    
    localStorage.setItem('monitoring_alerts', JSON.stringify(alerts));
  }

  sendConsoleAlert(alert) {
    const emoji = alert.severity === 'CRITICAL' ? '🔥' : '⚠️';
    console.warn(`${emoji} [${alert.timestamp}] ${alert.category}: ${alert.message}`);
  }

  sendEmailAlert(alert) {
    // Email service integration (requires backend setup)
    console.log('📧 Email alert would be sent:', alert);
  }

  sendWebhookAlert(alert) {
    // Webhook integration (e.g., Slack, Discord, Teams)
    console.log('🪝 Webhook alert would be sent:', alert);
  }

  // Public methods for dashboard
  getRecentAlerts(limit = 10) {
    const alerts = JSON.parse(localStorage.getItem('monitoring_alerts') || '[]');
    return alerts.slice(0, limit);
  }

  clearAlerts() {
    localStorage.removeItem('monitoring_alerts');
    console.log('🧹 Monitoring alerts cleared');
  }

  updateThresholds(newThresholds) {
    this.alertThresholds = { ...this.alertThresholds, ...newThresholds };
    console.log('⚙️ Alert thresholds updated');
  }

  configureAlertMethods(methods) {
    this.alertMethods = { ...this.alertMethods, ...methods };
    console.log('📡 Alert methods configured:', this.alertMethods);
  }
}

// Initialize monitoring alerts if all monitoring systems are available
if (typeof window !== 'undefined') {
  window.MonitoringAlerts = MonitoringAlerts;
  
  // Auto-initialize in production
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.monitoringAlerts = new MonitoringAlerts();
    });
  } else {
    window.monitoringAlerts = new MonitoringAlerts();
  }
}

export default MonitoringAlerts;