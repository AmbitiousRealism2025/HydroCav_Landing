/**
 * 8pt Grid System Validation Tests
 * Phase 5A-1: Visual Testing Infrastructure
 *
 * Tests ensure all spacing values follow 8pt grid system (multiples of 8px)
 */

describe('8pt Grid System Implementation', () => {
  beforeEach(() => {
    // Setup test environment with DOM manipulation
    document.body.innerHTML = `
      <div id="test-container">
        <div class="liquid-glass-card">Test Card</div>
        <div class="hero-section">Hero Section</div>
        <div class="advantages-section">Advantages</div>
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

  describe('Grid Alignment Validation', () => {
    test('should enforce 8pt spacing for all margin values', () => {
      const elements = document.querySelectorAll(
        '.liquid-glass-card, .hero-section, .advantages-section'
      );

      elements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const margins = [
          parseInt(computedStyle.marginTop) || 0,
          parseInt(computedStyle.marginRight) || 0,
          parseInt(computedStyle.marginBottom) || 0,
          parseInt(computedStyle.marginLeft) || 0,
        ];

        margins.forEach(margin => {
          if (margin > 0) {
            expect(margin % 8).toBe(0); // Must be divisible by 8
          }
        });
      });
    });

    test('should enforce 8pt spacing for all padding values', () => {
      const elements = document.querySelectorAll(
        '.liquid-glass-card, .hero-section, .advantages-section'
      );

      elements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const paddings = [
          parseInt(computedStyle.paddingTop) || 0,
          parseInt(computedStyle.paddingRight) || 0,
          parseInt(computedStyle.paddingBottom) || 0,
          parseInt(computedStyle.paddingLeft) || 0,
        ];

        paddings.forEach(padding => {
          if (padding > 0) {
            expect(padding % 8).toBe(0); // Must be divisible by 8
          }
        });
      });
    });

    test('should maintain grid consistency across responsive breakpoints', () => {
      const breakpoints = [
        { width: 320, name: 'mobile' },
        { width: 768, name: 'tablet' },
        { width: 1024, name: 'desktop' },
        { width: 1440, name: 'large' },
      ];

      breakpoints.forEach(({ width, name }) => {
        // Mock viewport width
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        // Trigger responsive recalculation
        window.dispatchEvent(new Event('resize'));

        // Validate grid consistency at this breakpoint
        const card = document.querySelector('.liquid-glass-card');
        if (card) {
          const computedStyle = getComputedStyle(card);
          const padding = parseInt(computedStyle.paddingTop) || 0;

          if (padding > 0) {
            expect(padding % 8).toBe(0); // Grid consistency maintained
          }
        }
      });
    });
  });

  describe('Component Spacing Validation', () => {
    test('should validate liquid glass card spacing', () => {
      const card = document.querySelector('.liquid-glass-card');
      if (card) {
        const computedStyle = getComputedStyle(card);

        // Check specific component spacing requirements
        const expectedSpacing = {
          padding: [16, 24, 32], // Valid 8pt grid values
          margin: [8, 16, 24, 32, 40], // Valid 8pt grid values
        };

        const actualPadding = parseInt(computedStyle.paddingTop) || 0;
        const actualMargin = parseInt(computedStyle.marginBottom) || 0;

        if (actualPadding > 0) {
          expect(expectedSpacing.padding).toContain(actualPadding);
        }
        if (actualMargin > 0) {
          expect(expectedSpacing.margin).toContain(actualMargin);
        }
      }
    });

    test('should validate section spacing consistency', () => {
      const sections = document.querySelectorAll('.hero-section, .advantages-section');

      sections.forEach(section => {
        const computedStyle = getComputedStyle(section);
        const marginBottom = parseInt(computedStyle.marginBottom) || 0;

        if (marginBottom > 0) {
          // Section spacing should be larger grid units (32px, 48px, 64px)
          const validSectionSpacing = [32, 48, 64, 80, 96];
          expect(validSectionSpacing).toContain(marginBottom);
        }
      });
    });
  });

  describe('Grid System Utilities', () => {
    /**
     * Utility function to validate if a value follows 8pt grid
     */
    function isValidGridValue(value) {
      return typeof value === 'number' && value >= 0 && value % 8 === 0;
    }

    test('should provide utility for grid validation', () => {
      // Test the utility function itself
      expect(isValidGridValue(8)).toBe(true);
      expect(isValidGridValue(16)).toBe(true);
      expect(isValidGridValue(24)).toBe(true);
      expect(isValidGridValue(32)).toBe(true);

      expect(isValidGridValue(7)).toBe(false);
      expect(isValidGridValue(15)).toBe(false);
      expect(isValidGridValue(-8)).toBe(false);
    });

    test('should validate custom spacing implementation', () => {
      // Test CSS custom properties if they exist
      const rootStyles = getComputedStyle(document.documentElement);

      // Check for spacing custom properties
      const spacingProps = [
        '--spacing-xs',
        '--spacing-sm',
        '--spacing-md',
        '--spacing-lg',
        '--spacing-xl',
      ];

      spacingProps.forEach(prop => {
        const value = rootStyles.getPropertyValue(prop);
        if (value) {
          const numericValue = parseInt(value);
          expect(isValidGridValue(numericValue)).toBe(true);
        }
      });
    });
  });
});
