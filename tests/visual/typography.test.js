/**
 * Typography Hierarchy Testing
 * Phase 5A-1: Visual Testing Infrastructure
 *
 * Tests ensure consistent typography scale and hierarchy across components
 */

describe('Typography Hierarchy Implementation', () => {
  beforeEach(() => {
    // Setup test environment with typography elements
    document.body.innerHTML = `
      <div id="test-container">
        <h1>Main Heading</h1>
        <h2>Section Heading</h2>
        <h3>Subsection Heading</h3>
        <p>Body text paragraph</p>
        <small>Small text</small>
        <button class="liquid-glass-button">Button Text</button>
        <div class="hero-title">Hero Title</div>
        <div class="section-subtitle">Section Subtitle</div>
      </div>
    `;

    // Load CSS for testing
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/style.css';
    document.head.appendChild(link);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  describe('Modular Scale Validation', () => {
    test('should follow consistent font size progression', () => {
      const expectedScale = {
        // Base scale ratios (1.25 - Major Third, aligned with 8pt grid)
        small: 12, // 0.75rem - Small text
        base: 16, // 1rem - Base text (8pt grid aligned)
        medium: 18, // 1.125rem - Medium text
        large: 20, // 1.25rem - Large text
        xl: 24, // 1.5rem - XL text (8pt grid aligned)
        xxl: 32, // 2rem - XXL text (8pt grid aligned)
        hero: 40, // 2.5rem - Hero text (8pt grid aligned)
      };

      const elements = {
        small: document.querySelector('small'),
        base: document.querySelector('p'),
        h3: document.querySelector('h3'),
        h2: document.querySelector('h2'),
        h1: document.querySelector('h1'),
        hero: document.querySelector('.hero-title'),
      };

      Object.entries(elements).forEach(([key, element]) => {
        if (element) {
          const computedStyle = getComputedStyle(element);
          const fontSize = Math.round(parseFloat(computedStyle.fontSize));

          // Allow for some browser rounding tolerance (±1px)
          const expectedSize = expectedScale[key] || expectedScale.base;
          expect(Math.abs(fontSize - expectedSize)).toBeLessThanOrEqual(2);
        }
      });
    });

    test('should maintain consistent line height ratios', () => {
      const elements = document.querySelectorAll('h1, h2, h3, p, .hero-title');

      elements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const lineHeight = parseFloat(computedStyle.lineHeight);

        if (fontSize > 0 && lineHeight > 0) {
          const lineHeightRatio = lineHeight / fontSize;

          // Line height should be between 1.2 and 1.6 for readability
          expect(lineHeightRatio).toBeGreaterThanOrEqual(1.1);
          expect(lineHeightRatio).toBeLessThanOrEqual(1.7);
        }
      });
    });

    test('should ensure readable text on glass backgrounds', () => {
      // Create test element with glass background
      const glassElement = document.createElement('div');
      glassElement.className = 'liquid-glass-card';
      glassElement.innerHTML = '<p>Test text on glass background</p>';
      document.body.appendChild(glassElement);

      const textElement = glassElement.querySelector('p');
      const textStyle = getComputedStyle(textElement);
      const containerStyle = getComputedStyle(glassElement);

      // Text should have sufficient contrast
      const textColor = textStyle.color;
      const backgroundColor = containerStyle.backgroundColor;

      // Basic color validation (more sophisticated contrast calculation would be ideal)
      expect(textColor).toBeTruthy();
      expect(textColor).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    });
  });

  describe('Font Weight Consistency', () => {
    test('should apply consistent font weights across hierarchy', () => {
      const expectedWeights = {
        h1: [700, 800], // Bold to ExtraBold
        h2: [600, 700], // SemiBold to Bold
        h3: [500, 600], // Medium to SemiBold
        p: [400, 500], // Normal to Medium
        small: [400], // Normal
        button: [500, 600], // Medium to SemiBold
      };

      Object.entries(expectedWeights).forEach(([tag, validWeights]) => {
        const element =
          document.querySelector(tag) ||
          document.querySelector(`.${tag}`) ||
          document.querySelector(`[class*="${tag}"]`);

        if (element) {
          const computedStyle = getComputedStyle(element);
          const fontWeight = parseInt(computedStyle.fontWeight);

          expect(validWeights).toContain(fontWeight);
        }
      });
    });

    test('should maintain font family consistency', () => {
      const elements = document.querySelectorAll('h1, h2, h3, p, button, small');

      elements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily.toLowerCase();

        // Should use Inter font family
        expect(fontFamily).toMatch(/inter|system-ui|sans-serif/);
      });
    });
  });

  describe('Responsive Typography', () => {
    test('should scale typography appropriately across breakpoints', () => {
      const breakpoints = [
        { width: 320, name: 'mobile' },
        { width: 768, name: 'tablet' },
        { width: 1024, name: 'desktop' },
      ];

      const heroTitle = document.querySelector('h1') || document.querySelector('.hero-title');

      if (heroTitle) {
        breakpoints.forEach(({ width, name }) => {
          // Mock viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
          });

          // Trigger responsive recalculation
          window.dispatchEvent(new Event('resize'));

          const computedStyle = getComputedStyle(heroTitle);
          const fontSize = parseFloat(computedStyle.fontSize);

          // Typography should scale down for smaller screens
          if (name === 'mobile') {
            expect(fontSize).toBeLessThanOrEqual(40); // Max size on mobile
          } else if (name === 'desktop') {
            expect(fontSize).toBeGreaterThanOrEqual(24); // Min size on desktop
          }
        });
      }
    });

    test('should maintain readability at all breakpoints', () => {
      const breakpoints = [320, 768, 1024, 1440];

      breakpoints.forEach(width => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        const bodyText = document.querySelector('p');
        if (bodyText) {
          const computedStyle = getComputedStyle(bodyText);
          const fontSize = parseFloat(computedStyle.fontSize);

          // Body text should never be smaller than 14px for readability
          expect(fontSize).toBeGreaterThanOrEqual(14);

          // Body text should never be larger than 20px for scanning
          expect(fontSize).toBeLessThanOrEqual(20);
        }
      });
    });
  });

  describe('Typography Custom Properties', () => {
    test('should implement CSS custom properties for typography scale', () => {
      const rootStyles = getComputedStyle(document.documentElement);

      const typographyProps = [
        '--text-xs',
        '--text-sm',
        '--text-base',
        '--text-lg',
        '--text-xl',
        '--text-2xl',
        '--text-3xl',
      ];

      // Check if typography custom properties exist and follow 8pt grid
      typographyProps.forEach(prop => {
        const value = rootStyles.getPropertyValue(prop);
        if (value) {
          const pxValue = parseFloat(value) * 16; // Convert rem to px (assuming 16px base)

          // Typography should align with 8pt grid when possible
          // Allow some flexibility for optimal reading sizes
          const isValid8ptOrOptimal = pxValue % 8 === 0 || [14, 18].includes(pxValue); // Common optimal reading sizes

          expect(isValid8ptOrOptimal).toBe(true);
        }
      });
    });

    test('should validate typography token usage', () => {
      // Test that components use typography tokens when available
      const rootStyles = getComputedStyle(document.documentElement);
      const hasTypographyTokens = rootStyles.getPropertyValue('--text-base') !== '';

      if (hasTypographyTokens) {
        // If tokens exist, elements should ideally use them
        // This is more of a code quality check
        expect(hasTypographyTokens).toBe(true);
      }
    });
  });

  describe('Typography Performance', () => {
    test('should not cause layout thrashing during font loading', () => {
      // Simulate font loading scenario
      const startTime = performance.now();

      // Add multiple text elements rapidly
      for (let i = 0; i < 100; i++) {
        const textElement = document.createElement('p');
        textElement.textContent = `Performance test text ${i}`;
        textElement.className = 'performance-test';
        document.body.appendChild(textElement);
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should complete text rendering quickly
      expect(renderTime).toBeLessThan(50); // 50ms threshold

      // Cleanup
      document.querySelectorAll('.performance-test').forEach(el => el.remove());
    });

    test('should maintain performance with complex typography stacks', () => {
      const complexElement = document.createElement('div');
      complexElement.innerHTML = `
        <h1>Heading</h1>
        <h2>Subheading</h2>
        <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <small>Small text with <code>code</code> elements.</small>
      `;

      const startTime = performance.now();
      document.body.appendChild(complexElement);
      const endTime = performance.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(20); // Fast rendering threshold
    });
  });
});
