/**
 * XSS Protection Module Tests
 *
 * Tests for the XSS (Cross-Site Scripting) protection functionality
 * as specified in the TDD Implementation Plan Phase 1A.
 */

describe('XSS Protection Module', () => {
  let XSSProtection;

  beforeEach(async () => {
    // Load the XSS protection module
    const fs = require('fs');
    const path = require('path');
    const xssProtectionCode = fs.readFileSync(
      path.join(__dirname, '../../assets/js/xss-protection.js'),
      'utf8'
    );

    // Execute the module code in test environment
    eval(xssProtectionCode);
    XSSProtection = window.XSSProtection;
  });

  afterEach(() => {
    delete window.XSSProtection;
  });

  describe('Module Initialization', () => {
    test('should initialize XSSProtection module', () => {
      expect(XSSProtection).toBeDefined();
      expect(typeof XSSProtection).toBe('object');
    });

    test('should have required methods', () => {
      expect(typeof XSSProtection.sanitizeInput).toBe('function');
      expect(typeof XSSProtection.sanitizeHTML).toBe('function');
      expect(typeof XSSProtection.validateInput).toBe('function');
    });
  });

  describe('Input Sanitization', () => {
    test('should sanitize script tags', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello';
      const sanitized = XSSProtection.sanitizeInput(maliciousInput);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('Hello');
    });

    test('should sanitize event handlers', () => {
      const maliciousInput = '<img src="x" onerror="alert(\'XSS\')">';
      const sanitized = XSSProtection.sanitizeInput(maliciousInput);

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
    });

    test('should sanitize javascript: URLs', () => {
      const maliciousInput = '<a href="javascript:alert(\'XSS\')" >Click me</a>';
      const sanitized = XSSProtection.sanitizeInput(maliciousInput);

      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).not.toContain('alert');
    });

    test('should handle empty and null inputs', () => {
      expect(XSSProtection.sanitizeInput('')).toBe('');
      expect(XSSProtection.sanitizeInput(null)).toBe('');
      expect(XSSProtection.sanitizeInput(undefined)).toBe('');
    });

    test('should preserve safe content', () => {
      const safeInput = 'Hello World! This is safe content.';
      const sanitized = XSSProtection.sanitizeInput(safeInput);

      expect(sanitized).toBe(safeInput);
    });

    test('should handle special characters safely', () => {
      const input = 'Price: $100 & tax @ 10%';
      const sanitized = XSSProtection.sanitizeInput(input);

      expect(sanitized).toContain('Price:');
      expect(sanitized).toContain('$100');
    });
  });

  describe('HTML Sanitization', () => {
    test('should allow safe HTML tags', () => {
      const safeHTML = '<p>This is <strong>bold</strong> text.</p>';
      const sanitized = XSSProtection.sanitizeHTML(safeHTML);

      expect(sanitized).toContain('<p>');
      expect(sanitized).toContain('<strong>');
      expect(sanitized).toContain('</strong>');
      expect(sanitized).toContain('</p>');
    });

    test('should remove dangerous HTML tags', () => {
      const dangerousHTML = '<div><script>alert("XSS")</script><p>Safe content</p></div>';
      const sanitized = XSSProtection.sanitizeHTML(dangerousHTML);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toContain('<p>Safe content</p>');
    });

    test('should remove dangerous attributes', () => {
      const dangerousHTML = '<div onclick="alert(\'XSS\')" class="safe">Content</div>';
      const sanitized = XSSProtection.sanitizeHTML(dangerousHTML);

      expect(sanitized).not.toContain('onclick');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toContain('class="safe"');
      expect(sanitized).toContain('Content');
    });
  });

  describe('Input Validation', () => {
    test('should validate email format', () => {
      expect(XSSProtection.validateInput('test@example.com', 'email')).toBe(true);
      expect(XSSProtection.validateInput('invalid-email', 'email')).toBe(false);
      expect(XSSProtection.validateInput('', 'email')).toBe(false);
    });

    test('should validate text length', () => {
      const longText = 'a'.repeat(2001); // Over 2000 char limit
      const shortText = 'Hello World';

      expect(XSSProtection.validateInput(shortText, 'text')).toBe(true);
      expect(XSSProtection.validateInput(longText, 'text')).toBe(false);
    });

    test('should detect potential XSS in validation', () => {
      const xssAttempt = '<script>alert("XSS")</script>';
      const safeInput = 'Hello World';

      expect(XSSProtection.validateInput(xssAttempt, 'text')).toBe(false);
      expect(XSSProtection.validateInput(safeInput, 'text')).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    test('should sanitize large inputs efficiently', () => {
      const largeInput = 'a'.repeat(1000) + '<script>alert("XSS")</script>' + 'b'.repeat(1000);

      const startTime = performance.now();
      const sanitized = XSSProtection.sanitizeInput(largeInput);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
      expect(sanitized).not.toContain('<script>');
    });

    test('should handle multiple sanitization calls', () => {
      const inputs = [
        '<script>alert("XSS1")</script>',
        '<img onerror="alert(\'XSS2\')" src="x">',
        'Safe content',
        '<div onclick="alert(\'XSS3\')">Content</div>',
      ];

      const startTime = performance.now();
      const sanitized = inputs.map(input => XSSProtection.sanitizeInput(input));
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should complete quickly
      expect(sanitized.some(s => s.includes('<script>'))).toBe(false);
      expect(sanitized.some(s => s.includes('onerror'))).toBe(false);
      expect(sanitized.some(s => s.includes('onclick'))).toBe(false);
      expect(sanitized).toContain('Safe content');
    });
  });

  describe('Edge Cases', () => {
    test('should handle nested XSS attempts', () => {
      const nestedXSS = '<div><span><script>alert("nested")</script></span></div>';
      const sanitized = XSSProtection.sanitizeInput(nestedXSS);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });

    test('should handle encoded XSS attempts', () => {
      const encodedXSS = '&lt;script&gt;alert("XSS")&lt;/script&gt;';
      const sanitized = XSSProtection.sanitizeInput(encodedXSS);

      expect(sanitized).toBeDefined();
      // Should handle encoded content appropriately
    });

    test('should handle mixed content types', () => {
      const mixedContent = 'Text <strong>bold</strong> <script>alert("XSS")</script> more text';
      const sanitized = XSSProtection.sanitizeInput(mixedContent);

      expect(sanitized).toContain('Text');
      expect(sanitized).toContain('more text');
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });
  });
});
