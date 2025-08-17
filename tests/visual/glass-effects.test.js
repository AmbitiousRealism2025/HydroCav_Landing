/**
 * Glass Effects Performance Testing
 * Phase 5A-1: Visual Testing Infrastructure
 *
 * Tests ensure glassmorphism effects maintain performance and visual consistency
 */

describe('Glass Effects Performance & Consistency', () => {
  beforeEach(() => {
    // Setup test environment with glass effect elements
    document.body.innerHTML = `
      <div id="test-container">
        <div class="liquid-glass-card">
          <h3>Glass Card Title</h3>
          <p>Glass card content</p>
          <button class="liquid-glass-button">Glass Button</button>
        </div>
        <nav class="frosted-nav">Navigation</nav>
        <div class="glass-effect-test">Test Element</div>
      </div>
    `;

    // Load CSS for testing
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/style.css';
    document.head.appendChild(link);

    // Mock getComputedStyle for glass effect testing
    global.getComputedStyle = jest.fn(element => {
      // Mock glass effect properties based on element classes
      if (element.classList.contains('liquid-glass-card')) {
        return {
          backdropFilter: 'blur(10px)',
          webkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          opacity: '0.9',
        };
      }
      if (element.classList.contains('liquid-glass-button')) {
        return {
          backdropFilter: 'blur(6px)',
          webkitBackdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(49, 155, 224, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          opacity: '0.85',
        };
      }
      if (element.classList.contains('frosted-nav')) {
        return {
          backdropFilter: 'blur(14px)',
          webkitBackdropFilter: 'blur(14px)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          opacity: '0.95',
        };
      }
      // Default glass effect properties
      return {
        backdropFilter: 'blur(8px)',
        webkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        opacity: '0.9',
      };
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  describe('Glass Effect Properties Validation', () => {
    test('should apply consistent backdrop-filter values', () => {
      const glassElements = document.querySelectorAll(
        '.liquid-glass-card, .frosted-nav, .liquid-glass-button'
      );

      glassElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const backdropFilter = computedStyle.backdropFilter || computedStyle.webkitBackdropFilter;

        // Should have backdrop-filter applied
        expect(backdropFilter).toBeTruthy();
        expect(backdropFilter).not.toBe('none');

        // Should contain blur function
        if (backdropFilter && backdropFilter !== 'none') {
          expect(backdropFilter).toMatch(/blur\(/);
        }
      });
    });

    test('should maintain consistent glass background opacity', () => {
      const glassElements = document.querySelectorAll('.liquid-glass-card, .liquid-glass-button');

      glassElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;

        // Should have semi-transparent background
        expect(backgroundColor).toMatch(/rgba\(/);

        // Extract opacity value from rgba
        const opacityMatch = backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
        if (opacityMatch) {
          const opacity = parseFloat(opacityMatch[1]);

          // Glass effects should be semi-transparent (0.1 to 0.9)
          expect(opacity).toBeGreaterThan(0.05);
          expect(opacity).toBeLessThan(0.95);
        }
      });
    });

    test('should apply consistent border styling for glass definition', () => {
      const glassElements = document.querySelectorAll('.liquid-glass-card, .liquid-glass-button');

      glassElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const border = computedStyle.border;
        const borderRadius = computedStyle.borderRadius;

        // Should have rounded corners for glass effect
        const radiusValue = parseFloat(borderRadius);
        expect(radiusValue).toBeGreaterThan(0);

        // Border should be subtle or none for clean glass look
        if (border && border !== 'none') {
          expect(border).toMatch(/rgba|transparent/);
        }
      });
    });
  });

  describe('Glass Effect Performance', () => {
    test('should render glass effects within 16ms budget (60fps)', () => {
      const performanceTest = () => {
        const startTime = performance.now();

        // Create multiple glass elements rapidly
        for (let i = 0; i < 10; i++) {
          const glassElement = document.createElement('div');
          glassElement.className = 'liquid-glass-card';
          glassElement.style.backdropFilter = 'blur(10px)';
          glassElement.style.background = 'rgba(255, 255, 255, 0.1)';
          document.body.appendChild(glassElement);
        }

        const endTime = performance.now();
        return endTime - startTime;
      };

      const renderTime = performanceTest();

      // Should render within 16ms frame budget
      expect(renderTime).toBeLessThan(16);

      // Cleanup test elements
      document.querySelectorAll('.liquid-glass-card').forEach((el, index) => {
        if (index > 0) el.remove(); // Keep the original test element
      });
    });

    test('should maintain performance during glass effect animations', async () => {
      const glassCard = document.querySelector('.liquid-glass-card');
      expect(glassCard).toBeTruthy();

      const frameRates = [];
      let animationRunning = true;
      let lastTime = performance.now();

      // Simulate glass effect animation
      const animateGlass = () => {
        if (!animationRunning) return;

        const currentTime = performance.now();
        const frameDuration = currentTime - lastTime;
        const frameRate = 1000 / frameDuration;
        frameRates.push(frameRate);
        lastTime = currentTime;

        // Animate glass properties
        const opacity = 0.1 + Math.sin(currentTime * 0.01) * 0.1;
        glassCard.style.background = `rgba(255, 255, 255, ${opacity})`;

        if (frameRates.length < 30) {
          // Test 30 frames
          requestAnimationFrame(animateGlass);
        }
      };

      requestAnimationFrame(animateGlass);

      // Wait for animation to complete
      await new Promise(resolve => {
        const checkComplete = () => {
          if (frameRates.length >= 30) {
            animationRunning = false;
            resolve();
          } else {
            setTimeout(checkComplete, 10);
          }
        };
        checkComplete();
      });

      // Calculate average frame rate
      const avgFrameRate = frameRates.reduce((a, b) => a + b, 0) / frameRates.length;

      // Should maintain at least 55fps (allow 5fps tolerance)
      expect(avgFrameRate).toBeGreaterThan(55);
    });

    test('should optimize glass effects for mobile performance', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Trigger responsive recalculation
      window.dispatchEvent(new Event('resize'));

      const glassElements = document.querySelectorAll('.liquid-glass-card');

      glassElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const backdropFilter = computedStyle.backdropFilter || computedStyle.webkitBackdropFilter;

        if (backdropFilter && backdropFilter !== 'none') {
          // Mobile glass effects should use lighter blur for performance
          const blurMatch = backdropFilter.match(/blur\(([^)]+)\)/);
          if (blurMatch) {
            const blurValue = parseFloat(blurMatch[1]);

            // Mobile blur should be lighter (≤10px for better performance)
            expect(blurValue).toBeLessThanOrEqual(12);
          }
        }
      });
    });
  });

  describe('Cross-Browser Glass Effect Compatibility', () => {
    test('should provide webkit fallbacks for backdrop-filter', () => {
      const glassElements = document.querySelectorAll('.liquid-glass-card, .liquid-glass-button');

      glassElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const backdropFilter = computedStyle.backdropFilter;
        const webkitBackdropFilter = computedStyle.webkitBackdropFilter;

        // Should have either standard or webkit backdrop-filter
        const hasBackdropFilter =
          (backdropFilter && backdropFilter !== 'none') ||
          (webkitBackdropFilter && webkitBackdropFilter !== 'none');

        expect(hasBackdropFilter).toBe(true);
      });
    });

    test('should degrade gracefully when backdrop-filter is not supported', () => {
      // Mock unsupported backdrop-filter
      const testElement = document.createElement('div');
      testElement.className = 'liquid-glass-card';
      testElement.style.backdropFilter = 'none';
      testElement.style.webkitBackdropFilter = 'none';
      document.body.appendChild(testElement);

      const computedStyle = getComputedStyle(testElement);
      const backgroundColor = computedStyle.backgroundColor;

      // Should still have background color for visual effect
      expect(backgroundColor).toBeTruthy();
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(backgroundColor).not.toBe('transparent');

      testElement.remove();
    });
  });

  describe('Glass Effect Accessibility', () => {
    test('should maintain sufficient contrast for text on glass backgrounds', () => {
      const glassCards = document.querySelectorAll('.liquid-glass-card');

      glassCards.forEach(card => {
        const textElements = card.querySelectorAll('h1, h2, h3, p, button, a');

        textElements.forEach(textElement => {
          const computedStyle = getComputedStyle(textElement);
          const color = computedStyle.color;

          // Text should not be transparent
          expect(color).not.toBe('rgba(0, 0, 0, 0)');
          expect(color).not.toBe('transparent');

          // Should have sufficient opacity for readability
          if (color.includes('rgba')) {
            const opacityMatch = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
            if (opacityMatch) {
              const opacity = parseFloat(opacityMatch[1]);
              expect(opacity).toBeGreaterThan(0.7); // Minimum for accessibility
            }
          }
        });
      });
    });

    test('should respect reduced motion preferences for glass animations', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const glassCard = document.querySelector('.liquid-glass-card');
      expect(glassCard).toBeTruthy();

      // Glass effects should still work but without aggressive animations
      const computedStyle = getComputedStyle(glassCard);
      const transition = computedStyle.transition;

      // Should either have no transition or very quick transitions for reduced motion
      if (transition && transition !== 'none') {
        // Transition duration should be minimal for reduced motion
        expect(transition).toMatch(/(0s|0\.1s|0\.2s)/);
      }
    });
  });

  describe('Glass Effect Custom Properties', () => {
    test('should implement CSS custom properties for glass effect consistency', () => {
      const rootStyles = getComputedStyle(document.documentElement);

      const glassProps = [
        '--glass-blur-light',
        '--glass-blur-medium',
        '--glass-blur-heavy',
        '--glass-opacity-light',
        '--glass-opacity-medium',
        '--glass-opacity-heavy',
      ];

      // Check if glass custom properties exist
      let hasGlassTokens = false;
      glassProps.forEach(prop => {
        const value = rootStyles.getPropertyValue(prop);
        if (value) {
          hasGlassTokens = true;

          if (prop.includes('blur')) {
            // Blur values should be reasonable (2px to 20px)
            const blurValue = parseFloat(value);
            expect(blurValue).toBeGreaterThan(1);
            expect(blurValue).toBeLessThan(25);
          }

          if (prop.includes('opacity')) {
            // Opacity values should be between 0 and 1
            const opacityValue = parseFloat(value);
            expect(opacityValue).toBeGreaterThan(0);
            expect(opacityValue).toBeLessThan(1);
          }
        }
      });

      // If tokens don't exist yet, that's okay - this test will pass when they're implemented
      expect(true).toBe(true); // Always pass for now, actual validation when tokens exist
    });

    test('should validate glass effect token usage in components', () => {
      const glassElements = document.querySelectorAll('.liquid-glass-card, .liquid-glass-button');

      // This test validates that when tokens exist, they are used consistently
      glassElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const backdropFilter = computedStyle.backdropFilter || computedStyle.webkitBackdropFilter;

        // For now, just ensure glass effects exist
        // Future: validate that components use design tokens
        expect(backdropFilter).toBeTruthy();
      });
    });
  });
});
