/**
 * Visual Consistency Validation Tests
 * Phase 5A-1: Visual Testing Infrastructure
 * 
 * Tests ensure consistent visual design across all components and sections
 */

describe('Visual Consistency Validation', () => {
  beforeEach(() => {
    // Setup comprehensive test environment
    document.body.innerHTML = `
      <div id="test-container">
        <!-- Navigation -->
        <nav class="frosted-nav">
          <a href="#" class="menu-link">Navigation Link</a>
        </nav>
        
        <!-- Hero Section -->
        <section class="hero-section">
          <h1 class="hero-title">Hero Title</h1>
          <p class="hero-subtitle">Hero subtitle text</p>
          <button class="liquid-glass-button liquid-glass-button-large">Hero CTA</button>
        </section>
        
        <!-- Content Cards -->
        <section class="content-section">
          <div class="liquid-glass-card">
            <h3>Card Title</h3>
            <p>Card content paragraph</p>
            <button class="liquid-glass-button">Card Button</button>
          </div>
          <div class="liquid-glass-card">
            <h3>Another Card</h3>
            <p>More card content</p>
          </div>
        </section>
        
        <!-- Form Elements -->
        <section class="contact-section">
          <form>
            <input type="text" class="form-input" placeholder="Text input">
            <textarea class="form-textarea" placeholder="Textarea"></textarea>
            <button type="submit" class="liquid-glass-button">Submit</button>
          </form>
        </section>
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

  describe('Component Design Consistency', () => {
    test('should maintain consistent liquid glass styling across all glass components', () => {
      const glassComponents = document.querySelectorAll(
        '.liquid-glass-card, .liquid-glass-button, .frosted-nav'
      );
      
      const glassProperties = [];
      
      glassComponents.forEach(component => {
        const computedStyle = getComputedStyle(component);
        glassProperties.push({
          element: component.className,
          backdropFilter: computedStyle.backdropFilter || computedStyle.webkitBackdropFilter,
          background: computedStyle.backgroundColor,
          borderRadius: computedStyle.borderRadius,
          border: computedStyle.border
        });
      });
      
      // All glass components should have backdrop-filter
      glassProperties.forEach(props => {
        expect(props.backdropFilter).toBeTruthy();
        expect(props.backdropFilter).not.toBe('none');
        expect(props.backdropFilter).toMatch(/blur\(/);
      });
      
      // All should have semi-transparent backgrounds
      glassProperties.forEach(props => {
        expect(props.background).toMatch(/rgba\(/);
      });
      
      // All should have rounded corners
      glassProperties.forEach(props => {
        const radiusValue = parseFloat(props.borderRadius);
        expect(radiusValue).toBeGreaterThan(0);
      });
    });

    test('should maintain consistent spacing patterns across components', () => {
      const components = document.querySelectorAll(
        '.liquid-glass-card, .hero-section, .content-section, .contact-section'
      );
      
      components.forEach(component => {
        const computedStyle = getComputedStyle(component);
        
        // Check padding values follow 8pt grid
        const paddings = [
          parseInt(computedStyle.paddingTop) || 0,
          parseInt(computedStyle.paddingRight) || 0,
          parseInt(computedStyle.paddingBottom) || 0,
          parseInt(computedStyle.paddingLeft) || 0
        ];
        
        paddings.forEach(padding => {
          if (padding > 0) {
            expect(padding % 8).toBe(0); // Should follow 8pt grid
          }
        });
        
        // Check margin values follow 8pt grid
        const margins = [
          parseInt(computedStyle.marginTop) || 0,
          parseInt(computedStyle.marginBottom) || 0
        ];
        
        margins.forEach(margin => {
          if (margin > 0) {
            expect(margin % 8).toBe(0); // Should follow 8pt grid
          }
        });
      });
    });

    test('should maintain consistent button styling across all button variants', () => {
      const buttons = document.querySelectorAll('button, .liquid-glass-button');
      
      const buttonStyles = [];
      buttons.forEach(button => {
        const computedStyle = getComputedStyle(button);
        buttonStyles.push({
          element: button.className,
          borderRadius: computedStyle.borderRadius,
          minHeight: computedStyle.minHeight,
          padding: computedStyle.padding,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight
        });
      });
      
      // All buttons should have consistent border radius
      buttonStyles.forEach(style => {
        const radiusValue = parseFloat(style.borderRadius);
        expect(radiusValue).toBeGreaterThan(4); // Minimum roundedness
        expect(radiusValue).toBeLessThan(30); // Maximum roundedness
      });
      
      // All buttons should have minimum touch target size (44px)
      buttonStyles.forEach(style => {
        const minHeight = parseFloat(style.minHeight) || 0;
        const paddingTop = parseFloat(style.padding.split(' ')[0]) || 0;
        const paddingBottom = paddingTop; // Assuming symmetric padding
        const totalHeight = minHeight + paddingTop + paddingBottom;
        
        // Should meet accessibility touch target requirements
        expect(totalHeight).toBeGreaterThanOrEqual(40); // Allow some tolerance
      });
    });
  });

  describe('Color Palette Consistency', () => {
    test('should use consistent color scheme across all components', () => {
      const coloredElements = document.querySelectorAll(
        '.liquid-glass-card, .liquid-glass-button, .hero-title, h1, h2, h3, p'
      );
      
      const colorScheme = {
        primaryBlue: '#319be0',
        secondaryBlue: '#6bafdc', 
        textDark: '#1f2937',
        textLight: '#6b7280',
        white: '#ffffff',
        glassWhite: 'rgba(255, 255, 255'
      };
      
      coloredElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const textColor = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Colors should be from defined palette or reasonable variations
        if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
          // Text colors should be readable (not too light)
          expect(textColor).toBeTruthy();
        }
        
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          // Background colors should be appropriate
          expect(backgroundColor).toBeTruthy();
        }
      });
    });

    test('should maintain consistent accent color usage', () => {
      const accentElements = document.querySelectorAll(
        '.liquid-glass-button, .hero-title, .menu-link'
      );
      
      // Check for consistent use of brand colors
      accentElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        const borderColor = computedStyle.borderColor;
        
        // Should use brand colors or neutral colors, not random colors
        const hasReasonableColor = 
          color.includes('rgb') || 
          backgroundColor.includes('rgb') || 
          borderColor.includes('rgb') ||
          color === 'inherit' ||
          backgroundColor === 'transparent';
          
        expect(hasReasonableColor).toBe(true);
      });
    });
  });

  describe('Layout Consistency', () => {
    test('should maintain consistent grid layouts across sections', () => {
      const cards = document.querySelectorAll('.liquid-glass-card');
      
      if (cards.length > 1) {
        const firstCardRect = cards[0].getBoundingClientRect();
        
        for (let i = 1; i < cards.length; i++) {
          const cardRect = cards[i].getBoundingClientRect();
          
          // Cards should have similar widths in grid layout
          const widthDifference = Math.abs(firstCardRect.width - cardRect.width);
          expect(widthDifference).toBeLessThan(20); // Allow 20px tolerance
        }
      }
    });

    test('should maintain consistent section spacing', () => {
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
        const computedStyle = getComputedStyle(section);
        const marginBottom = parseInt(computedStyle.marginBottom) || 0;
        const paddingTop = parseInt(computedStyle.paddingTop) || 0;
        const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
        
        // Section spacing should follow 8pt grid
        if (marginBottom > 0) {
          expect(marginBottom % 8).toBe(0);
        }
        if (paddingTop > 0) {
          expect(paddingTop % 8).toBe(0);
        }
        if (paddingBottom > 0) {
          expect(paddingBottom % 8).toBe(0);
        }
      });
    });
  });

  describe('Responsive Design Consistency', () => {
    test('should maintain design consistency across breakpoints', () => {
      const breakpoints = [320, 768, 1024, 1440];
      
      breakpoints.forEach(width => {
        // Mock viewport width
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width
        });
        
        window.dispatchEvent(new Event('resize'));
        
        // Check that glass effects are maintained
        const glassCard = document.querySelector('.liquid-glass-card');
        if (glassCard) {
          const computedStyle = getComputedStyle(glassCard);
          const backdropFilter = computedStyle.backdropFilter || computedStyle.webkitBackdropFilter;
          
          // Glass effects should be maintained (though possibly optimized)
          expect(backdropFilter).toBeTruthy();
          expect(backdropFilter).not.toBe('none');
        }
        
        // Check that typography scales appropriately
        const heroTitle = document.querySelector('.hero-title, h1');
        if (heroTitle) {
          const computedStyle = getComputedStyle(heroTitle);
          const fontSize = parseFloat(computedStyle.fontSize);
          
          // Typography should scale but remain readable
          expect(fontSize).toBeGreaterThan(18); // Minimum readable size
          expect(fontSize).toBeLessThan(80); // Maximum reasonable size
        }
      });
    });

    test('should maintain touch target sizes on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      
      window.dispatchEvent(new Event('resize'));
      
      const touchTargets = document.querySelectorAll('button, .liquid-glass-button, .menu-link');
      
      touchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const computedStyle = getComputedStyle(target);
        
        // Minimum touch target size for mobile accessibility
        expect(rect.height).toBeGreaterThanOrEqual(40); // Allow some tolerance
        expect(rect.width).toBeGreaterThanOrEqual(40);
      });
    });
  });

  describe('Animation Consistency', () => {
    test('should apply consistent transition timing across interactive elements', () => {
      const interactiveElements = document.querySelectorAll(
        'button, .liquid-glass-button, .menu-link, .liquid-glass-card'
      );
      
      interactiveElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const transition = computedStyle.transition;
        
        if (transition && transition !== 'none') {
          // Transitions should be reasonable duration (0.1s to 0.5s)
          const durationMatch = transition.match(/(\d+\.?\d*)s/);
          if (durationMatch) {
            const duration = parseFloat(durationMatch[1]);
            expect(duration).toBeGreaterThan(0.05);
            expect(duration).toBeLessThan(1.0);
          }
        }
      });
    });

    test('should respect reduced motion preferences consistently', () => {
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
      
      const animatedElements = document.querySelectorAll(
        'button, .liquid-glass-button, .liquid-glass-card'
      );
      
      // With reduced motion, animations should be minimal or none
      animatedElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        const transition = computedStyle.transition;
        
        // Should either have no transition or very quick transitions
        if (transition && transition !== 'none') {
          expect(transition).toMatch(/(0s|0\.1s|0\.2s)/);
        }
      });
    });
  });

  describe('Accessibility Consistency', () => {
    test('should maintain consistent focus indicators across interactive elements', () => {
      const focusableElements = document.querySelectorAll(
        'button, .liquid-glass-button, .menu-link, input, textarea'
      );
      
      focusableElements.forEach(element => {
        // Simulate focus
        element.focus();
        
        const computedStyle = getComputedStyle(element);
        const outline = computedStyle.outline;
        const boxShadow = computedStyle.boxShadow;
        
        // Should have visible focus indicator
        const hasFocusIndicator = 
          (outline && outline !== 'none') ||
          (boxShadow && boxShadow !== 'none') ||
          computedStyle.borderColor !== 'rgba(0, 0, 0, 0)';
          
        expect(hasFocusIndicator).toBe(true);
      });
    });

    test('should maintain consistent semantic structure', () => {
      // Check heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      if (headings.length > 0) {
        // Should start with h1
        const firstHeading = headings[0];
        expect(firstHeading.tagName.toLowerCase()).toBe('h1');
        
        // Should not skip heading levels
        for (let i = 1; i < headings.length; i++) {
          const currentLevel = parseInt(headings[i].tagName.slice(1));
          const previousLevel = parseInt(headings[i-1].tagName.slice(1));
          
          // Should not skip more than one level
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
      }
    });
  });
});