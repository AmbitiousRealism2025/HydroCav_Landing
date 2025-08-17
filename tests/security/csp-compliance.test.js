/**
 * CSP Compliance Tests
 * Tests Content Security Policy implementation for XSS protection
 * Phase 5: CSP Hardening - TDD Validation
 */

const fs = require('fs');
const path = require('path');

describe('Content Security Policy Compliance', () => {
  let indexHtml, adminHtml;

  beforeAll(() => {
    // Load the HTML files
    indexHtml = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
    adminHtml = fs.readFileSync(path.join(__dirname, '../../admin.html'), 'utf8');
  });

  describe('CSP Header Presence', () => {
    test('index.html should have CSP meta tag', () => {
      const cspMetaRegex = /<meta\s+http-equiv="Content-Security-Policy"\s+content="[^"]+"/i;
      expect(indexHtml).toMatch(cspMetaRegex);
    });

    test('admin.html should have CSP meta tag', () => {
      const cspMetaRegex = /<meta\s+http-equiv="Content-Security-Policy"\s+content="[^"]+"/i;
      expect(adminHtml).toMatch(cspMetaRegex);
    });
  });

  describe('CSP Directive Validation', () => {
    const extractCSPContent = html => {
      const match = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
      return match ? match[1] : '';
    };

    test('index.html CSP should not allow unsafe-inline for scripts', () => {
      const cspContent = extractCSPContent(indexHtml);

      // Should have script-src directive
      expect(cspContent).toMatch(/script-src[^;]*;/);

      // Should NOT include 'unsafe-inline' in script-src directive
      const scriptSrcMatch = cspContent.match(/script-src\s+([^;]+);/);
      expect(scriptSrcMatch).toBeTruthy();
      expect(scriptSrcMatch[1]).not.toContain("'unsafe-inline'");
    });

    test('admin.html CSP should not allow unsafe-inline for scripts', () => {
      const cspContent = extractCSPContent(adminHtml);

      // Should have script-src directive
      expect(cspContent).toMatch(/script-src[^;]*;/);

      // Should NOT include 'unsafe-inline' in script-src directive
      const scriptSrcMatch = cspContent.match(/script-src\s+([^;]+);/);
      expect(scriptSrcMatch).toBeTruthy();
      expect(scriptSrcMatch[1]).not.toContain("'unsafe-inline'");
    });

    test('CSP should allow required CDN sources', () => {
      const cspContent = extractCSPContent(indexHtml);

      // Should allow Tailwind CDN
      expect(cspContent).toContain('https://cdn.tailwindcss.com');

      // Should allow jsDelivr CDN
      expect(cspContent).toContain('https://cdn.jsdelivr.net');

      // Should allow Supabase connections
      expect(cspContent).toContain('https://*.supabase.co');
    });

    test('CSP should have restrictive default-src', () => {
      const cspContent = extractCSPContent(indexHtml);

      // Should have restrictive default-src
      expect(cspContent).toMatch(/default-src\s+'self';/);
    });

    test('CSP should prevent XSS vectors', () => {
      const cspContent = extractCSPContent(adminHtml);

      // Should prevent object embedding
      expect(cspContent).toContain("object-src 'none'");

      // Should prevent framing
      expect(cspContent).toContain("frame-ancestors 'none'");

      // Should restrict form actions
      expect(cspContent).toContain("form-action 'self'");

      // Should restrict base URI
      expect(cspContent).toContain("base-uri 'self'");
    });
  });

  describe('No Inline Scripts Detection', () => {
    test('index.html should have no inline JavaScript', () => {
      // Check for script tags with content but no src attribute
      const inlineScriptRegex = /<script(?![^>]*src\s*=)[^>]*>[\s\S]*?<\/script>/gi;
      const matches = indexHtml.match(inlineScriptRegex) || [];

      // Filter out empty script tags and type="module" imports
      const nonEmptyInlineScripts = matches.filter(script => {
        const content = script.replace(/<script[^>]*>|<\/script>/gi, '').trim();
        return content.length > 0 && !script.includes('type="module"');
      });

      expect(nonEmptyInlineScripts).toHaveLength(0);
    });

    test('admin.html should have no inline JavaScript', () => {
      // Check for script tags with content but no src attribute
      const inlineScriptRegex = /<script(?![^>]*src\s*=)[^>]*>[\s\S]*?<\/script>/gi;
      const matches = adminHtml.match(inlineScriptRegex) || [];

      // Filter out empty script tags and type="module" imports
      const nonEmptyInlineScripts = matches.filter(script => {
        const content = script.replace(/<script[^>]*>|<\/script>/gi, '').trim();
        return content.length > 0 && !script.includes('type="module"');
      });

      expect(nonEmptyInlineScripts).toHaveLength(0);
    });

    test('index.html should have no inline event handlers', () => {
      // Check for common inline event handlers
      const inlineEvents = ['onclick', 'onload', 'onsubmit', 'onchange', 'onkeyup'];

      inlineEvents.forEach(event => {
        expect(indexHtml).not.toMatch(new RegExp(`${event}\\s*=`, 'i'));
      });
    });

    test('admin.html should have no inline event handlers', () => {
      // Check for common inline event handlers
      const inlineEvents = ['onclick', 'onload', 'onsubmit', 'onchange', 'onkeyup'];

      inlineEvents.forEach(event => {
        expect(adminHtml).not.toMatch(new RegExp(`${event}\\s*=`, 'i'));
      });
    });
  });

  describe('External Script Security', () => {
    test('index.html external scripts should be from trusted domains', () => {
      // Extract all script src attributes
      const scriptSrcRegex = /<script[^>]*src\s*=\s*["']([^"']+)["']/gi;
      const scripts = [];
      let match;
      while ((match = scriptSrcRegex.exec(indexHtml)) !== null) {
        scripts.push(match[1]);
      }

      const trustedDomains = [
        'https://cdn.tailwindcss.com',
        'https://cdn.jsdelivr.net',
        'assets/js/',
      ];

      scripts.forEach(src => {
        const isTrusted = trustedDomains.some(
          domain => src.startsWith(domain) || src.startsWith(domain.replace('https://', ''))
        );
        expect(isTrusted).toBe(true);
      });
    });

    test('admin.html external scripts should be from trusted domains', () => {
      // Extract all script src attributes
      const scriptSrcRegex = /<script[^>]*src\s*=\s*["']([^"']+)["']/gi;
      const scripts = [];
      let match;
      while ((match = scriptSrcRegex.exec(adminHtml)) !== null) {
        scripts.push(match[1]);
      }

      const trustedDomains = [
        'https://cdn.tailwindcss.com',
        'https://cdn.jsdelivr.net',
        'assets/js/',
      ];

      scripts.forEach(src => {
        const isTrusted = trustedDomains.some(
          domain => src.startsWith(domain) || src.startsWith(domain.replace('https://', ''))
        );
        expect(isTrusted).toBe(true);
      });
    });
  });

  describe('CSP Effectiveness Against XSS', () => {
    const extractCSPContent = html => {
      const match = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
      return match ? match[1] : '';
    };

    test('CSP should block eval() and similar functions', () => {
      const cspContent = extractCSPContent(indexHtml);

      // Should not allow 'unsafe-eval'
      expect(cspContent).not.toContain("'unsafe-eval'");
    });

    test('CSP should restrict style sources appropriately', () => {
      const cspContent = extractCSPContent(indexHtml);

      // Should have style-src directive
      expect(cspContent).toMatch(/style-src[^;]*;/);

      // Should allow Google Fonts for index.html
      expect(cspContent).toContain('https://fonts.googleapis.com');
    });

    test('CSP should have comprehensive coverage', () => {
      const cspContent = extractCSPContent(adminHtml);

      const requiredDirectives = [
        'default-src',
        'script-src',
        'style-src',
        'img-src',
        'connect-src',
        'form-action',
        'frame-ancestors',
        'base-uri',
        'object-src',
      ];

      requiredDirectives.forEach(directive => {
        expect(cspContent).toMatch(new RegExp(`${directive}\\s+`));
      });
    });
  });
});
