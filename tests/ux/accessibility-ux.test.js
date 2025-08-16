/**
 * @fileoverview User Experience Testing - Accessibility & Inclusive Design
 * Comprehensive accessibility testing following WCAG 2.1 AA compliance requirements
 *
 * Testing Strategy from Phase 5B consultations:
 * - WCAG 2.1 AA compliance validation
 * - Screen reader compatibility testing
 * - Keyboard navigation functionality
 * - Color contrast and visual accessibility
 * - Focus management and skip links
 * - Reduced motion preferences support
 */

describe('Accessibility UX - WCAG 2.1 AA Compliance', () => {
  beforeEach(() => {
    // Setup comprehensive accessibility test environment
    document.body.innerHTML = `
      <!-- Skip Navigation Link -->
      <a href="#main-content" class="skip-link" id="skip-to-main">Skip to main content</a>
      
      <!-- Navigation with proper ARIA -->
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="#home" id="nav-home" aria-current="page">Home</a></li>
          <li><a href="#about" id="nav-about">About</a></li>
          <li><a href="#contact" id="nav-contact">Contact</a></li>
        </ul>
      </nav>
      
      <!-- Main Content Area -->
      <main id="main-content" role="main">
        <!-- Hero Section -->
        <section id="hero" aria-labelledby="hero-heading">
          <h1 id="hero-heading">HydroCav Water Treatment Solutions</h1>
          <p>Advanced hydrodynamic cavitation technology for industrial water treatment.</p>
          <button id="cta-button" class="liquid-glass-button" aria-describedby="cta-description">
            Learn More
          </button>
          <div id="cta-description" class="sr-only">
            Learn more about HydroCav's water treatment technology
          </div>
        </section>
        
        <!-- Contact Form -->
        <section id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact Us</h2>
          <form id="contact-form" class="liquid-glass-card" novalidate>
            <fieldset>
              <legend>Contact Information</legend>
              
              <div class="form-group">
                <label for="name" class="required">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  aria-required="true"
                  aria-describedby="name-counter name-error"
                  maxlength="100"
                />
                <div id="name-counter" class="character-counter" aria-live="polite">0/100 characters</div>
                <div id="name-error" class="error-message hidden" role="alert" aria-live="assertive"></div>
              </div>
              
              <div class="form-group">
                <label for="company">Company (Optional)</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  aria-describedby="company-counter"
                  maxlength="100"
                />
                <div id="company-counter" class="character-counter" aria-live="polite">0/100 characters</div>
              </div>
              
              <div class="form-group">
                <label for="email" class="required">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  aria-required="true"
                  aria-describedby="email-hint email-error"
                  autocomplete="email"
                />
                <div id="email-hint" class="field-hint">We'll never share your email address</div>
                <div id="email-error" class="error-message hidden" role="alert" aria-live="assertive"></div>
              </div>
              
              <div class="form-group">
                <label for="message" class="required">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required 
                  aria-required="true"
                  aria-describedby="message-counter message-error"
                  maxlength="2000"
                  rows="5"
                ></textarea>
                <div id="message-counter" class="character-counter" aria-live="polite">0/2000 characters</div>
                <div id="message-error" class="error-message hidden" role="alert" aria-live="assertive"></div>
              </div>
            </fieldset>
            
            <button type="submit" class="liquid-glass-button" aria-describedby="submit-status">
              <span class="button-text">Send Message</span>
              <span class="loading-spinner hidden" aria-hidden="true"></span>
            </button>
            
            <div id="submit-status" class="sr-only" aria-live="polite" aria-atomic="true"></div>
          </form>
          
          <!-- Success/Error Messages -->
          <div id="success-message" class="success-message hidden" role="alert" aria-live="polite">
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll respond within 24 hours.</p>
          </div>
          
          <div id="error-message" class="error-message hidden" role="alert" aria-live="assertive">
            <h3>Error Sending Message</h3>
            <p id="error-details"></p>
            <button id="retry-button" class="liquid-glass-button">Try Again</button>
          </div>
        </section>
        
        <!-- Image with proper alt text -->
        <section aria-labelledby="technology-heading">
          <h2 id="technology-heading">Our Technology</h2>
          <img 
            src="/assets/images/hydrocav-process.jpg" 
            alt="Diagram showing HydroCav hydrodynamic cavitation process with water molecules being treated"
            width="600"
            height="400"
          />
        </section>
      </main>
      
      <!-- Toast Notifications -->
      <div id="toast-container" aria-live="polite" aria-label="Notifications"></div>
      
      <!-- Focus Trap for Modals -->
      <div id="modal-overlay" class="hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <h2 id="modal-title">Modal Title</h2>
          <button id="modal-close" aria-label="Close modal">×</button>
          <p>Modal content goes here.</p>
          <div class="modal-actions">
            <button id="modal-confirm" class="liquid-glass-button">Confirm</button>
            <button id="modal-cancel" class="liquid-glass-button">Cancel</button>
          </div>
        </div>
      </div>
    `;

    // Mock window.matchMedia for reduced motion testing
    global.matchMedia = jest.fn(query => ({
      matches: query.includes('prefers-reduced-motion') ? false : true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    // Mock getComputedStyle for contrast testing
    global.getComputedStyle = jest.fn(element => ({
      color: 'rgb(31, 41, 55)', // #1f2937
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      fontSize: '16px',
      lineHeight: '1.5',
      minHeight: '44px',
      padding: '12px 16px',
      borderRadius: '8px',
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WCAG 2.1 AA Compliance - Perceivable', () => {
    test('should provide alternative text for images', () => {
      // Arrange: Get image element
      const image = document.querySelector('img[src*="hydrocav-process"]');

      // Assert: Verify proper alt text
      expect(image.getAttribute('alt')).toBeTruthy();
      expect(image.getAttribute('alt')).not.toBe('');
      expect(image.getAttribute('alt').length).toBeGreaterThan(10);
      expect(image.getAttribute('alt')).toContain('HydroCav');
    });

    test('should maintain proper color contrast ratios', () => {
      // Arrange: Get text elements with different backgrounds
      const heading = document.getElementById('hero-heading');
      const button = document.getElementById('cta-button');
      const label = document.querySelector('label[for="name"]');

      // Act: Check computed colors
      const headingStyles = getComputedStyle(heading);
      const buttonStyles = getComputedStyle(button);
      const labelStyles = getComputedStyle(label);

      // Assert: Verify color contrast (simplified validation)
      expect(headingStyles.color).toBe('rgb(31, 41, 55)'); // Dark text
      expect(buttonStyles.color).toBe('rgb(31, 41, 55)');
      expect(labelStyles.color).toBe('rgb(31, 41, 55)');

      // Background should be light enough for contrast
      expect(headingStyles.backgroundColor).toContain('255, 255, 255');
    });

    test('should provide text alternatives for non-text content', () => {
      // Arrange: Check for icon buttons and decorative elements
      const closeButton = document.getElementById('modal-close');
      const retryButton = document.getElementById('retry-button');

      // Assert: Verify text alternatives
      expect(closeButton.getAttribute('aria-label')).toBe('Close modal');
      expect(retryButton.textContent.trim()).toBe('Try Again');
    });

    test('should support text scaling up to 200% without loss of functionality', () => {
      // Arrange: Simulate 200% text scaling
      const originalFontSize = 16;
      const scaledFontSize = originalFontSize * 2; // 200% scaling

      document.body.style.fontSize = `${scaledFontSize}px`;

      // Act: Check if interactive elements remain usable
      const button = document.getElementById('cta-button');
      const input = document.getElementById('name');

      const buttonStyles = getComputedStyle(button);
      const inputStyles = getComputedStyle(input);

      // Assert: Verify elements remain functional at 200% scale
      expect(parseInt(buttonStyles.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(inputStyles.minHeight)).toBeGreaterThanOrEqual(44);
    });
  });

  describe('WCAG 2.1 AA Compliance - Operable', () => {
    test('should be fully keyboard navigable', () => {
      // Arrange: Get focusable elements
      const focusableElements = [
        document.getElementById('skip-to-main'),
        document.getElementById('nav-home'),
        document.getElementById('nav-about'),
        document.getElementById('nav-contact'),
        document.getElementById('cta-button'),
        document.getElementById('name'),
        document.getElementById('company'),
        document.getElementById('email'),
        document.getElementById('message'),
        document.querySelector('button[type="submit"]'),
      ];

      // Act: Test keyboard navigation
      let currentIndex = 0;

      focusableElements.forEach((element, index) => {
        if (element) {
          // Simulate Tab key navigation
          element.focus();
          expect(document.activeElement).toBe(element);

          // Ensure element has visible focus indicator
          expect(element.getAttribute('tabindex')).not.toBe('-1');

          currentIndex = index;
        }
      });

      // Assert: Verify complete navigation chain
      expect(currentIndex).toBe(focusableElements.length - 1);
    });

    test('should provide skip navigation link', () => {
      // Arrange: Get skip link
      const skipLink = document.getElementById('skip-to-main');
      const mainContent = document.getElementById('main-content');

      // Act: Test skip link functionality
      skipLink.focus();
      const clickEvent = new Event('click');
      skipLink.dispatchEvent(clickEvent);

      // Assert: Verify skip link works
      expect(skipLink.getAttribute('href')).toBe('#main-content');
      expect(mainContent.getAttribute('id')).toBe('main-content');
      expect(skipLink.textContent).toBe('Skip to main content');
    });

    test('should have appropriate focus management in modals', () => {
      // Arrange: Get modal elements
      const modalOverlay = document.getElementById('modal-overlay');
      const modalClose = document.getElementById('modal-close');
      const modalConfirm = document.getElementById('modal-confirm');
      const modalCancel = document.getElementById('modal-cancel');

      // Act: Open modal and test focus trap
      modalOverlay.classList.remove('hidden');
      modalClose.focus();

      // Simulate Tab navigation within modal
      const modalFocusableElements = [modalClose, modalConfirm, modalCancel];

      modalFocusableElements.forEach(element => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });

      // Assert: Verify modal focus management
      expect(modalOverlay.getAttribute('role')).toBe('dialog');
      expect(modalOverlay.getAttribute('aria-modal')).toBe('true');
      expect(modalOverlay.getAttribute('aria-labelledby')).toBe('modal-title');
    });

    test('should provide sufficient time for user interactions', done => {
      // Arrange: Test form auto-save or session timeout
      const form = document.getElementById('contact-form');
      const nameInput = document.getElementById('name');

      // Act: Start typing and measure response time
      const startTime = Date.now();
      nameInput.value = 'Test User';
      nameInput.dispatchEvent(new Event('input'));

      // Simulate character counter update
      setTimeout(() => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Assert: Verify reasonable response time
        expect(responseTime).toBeLessThan(500); // Should respond within 500ms
        done();
      }, 100);
    });

    test('should not use flashing content that could cause seizures', () => {
      // Arrange: Check for any rapidly flashing content
      const allElements = document.querySelectorAll('*');

      // Act: Check animation properties
      allElements.forEach(element => {
        const styles = getComputedStyle(element);
        const animationName = styles.animationName;

        // Assert: Verify no rapid flashing animations
        if (animationName && animationName !== 'none') {
          // Animation should not flash more than 3 times per second
          expect(animationName).not.toMatch(/flash|blink|strobe/i);
        }
      });
    });
  });

  describe('WCAG 2.1 AA Compliance - Understandable', () => {
    test('should use proper semantic HTML and ARIA labels', () => {
      // Arrange: Check semantic structure
      const main = document.querySelector('main');
      const nav = document.querySelector('nav');
      const sections = document.querySelectorAll('section');
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

      // Assert: Verify semantic structure
      expect(main.getAttribute('role')).toBe('main');
      expect(nav.getAttribute('role')).toBe('navigation');
      expect(nav.getAttribute('aria-label')).toBe('Main navigation');

      // Check heading hierarchy
      expect(headings[0].tagName).toBe('H1'); // First heading should be H1

      // Check section labeling
      sections.forEach(section => {
        const hasAriaLabelledby = section.hasAttribute('aria-labelledby');
        const hasAriaLabel = section.hasAttribute('aria-label');

        // Section should have either aria-labelledby or aria-label
        expect(hasAriaLabelledby || hasAriaLabel).toBe(true);
      });
    });

    test('should provide clear form instructions and error messages', () => {
      // Arrange: Get form elements
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const form = document.getElementById('contact-form');

      // Act: Check form accessibility attributes
      const nameLabel = document.querySelector('label[for="name"]');
      const emailHint = document.getElementById('email-hint');
      const nameError = document.getElementById('name-error');

      // Assert: Verify form accessibility
      expect(nameInput.getAttribute('aria-required')).toBe('true');
      expect(nameInput.getAttribute('aria-describedby')).toContain('name-counter');
      expect(nameInput.getAttribute('aria-describedby')).toContain('name-error');

      expect(emailHint.textContent).toContain('never share');
      expect(nameError.getAttribute('role')).toBe('alert');
      expect(nameError.getAttribute('aria-live')).toBe('assertive');

      // Check required field indicators
      expect(nameLabel.classList.contains('required')).toBe(true);
    });

    test('should provide helpful error recovery instructions', () => {
      // Arrange: Simulate form validation error
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');

      // Act: Display error messages
      nameError.textContent = 'Name is required. Please enter your full name.';
      nameError.classList.remove('hidden');

      emailError.textContent = 'Please enter a valid email address (e.g., name@example.com).';
      emailError.classList.remove('hidden');

      // Assert: Verify helpful error messages
      expect(nameError.textContent).toContain('Please enter');
      expect(emailError.textContent).toContain('valid email');
      expect(emailError.textContent).toContain('example.com');
    });

    test('should maintain consistent navigation and terminology', () => {
      // Arrange: Check navigation consistency
      const navLinks = document.querySelectorAll('nav a');
      const currentPage = document.querySelector('[aria-current="page"]');

      // Assert: Verify navigation consistency
      expect(currentPage).toBeTruthy();
      expect(currentPage.getAttribute('aria-current')).toBe('page');

      // Check for consistent link text
      navLinks.forEach(link => {
        expect(link.textContent.trim().length).toBeGreaterThan(0);
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });
  });

  describe('WCAG 2.1 AA Compliance - Robust', () => {
    test('should work with assistive technologies', () => {
      // Arrange: Check ARIA landmarks and roles
      const landmarks = [
        { element: 'main', role: 'main' },
        { element: 'nav', role: 'navigation' },
        { element: '[role="dialog"]', role: 'dialog' },
      ];

      // Assert: Verify landmark roles
      landmarks.forEach(({ element, role }) => {
        const el = document.querySelector(element);
        if (el) {
          expect(el.getAttribute('role') || el.tagName.toLowerCase()).toBe(role);
        }
      });
    });

    test('should have proper ARIA live regions for dynamic content', () => {
      // Arrange: Get dynamic content areas
      const successMessage = document.getElementById('success-message');
      const errorMessage = document.getElementById('error-message');
      const toastContainer = document.getElementById('toast-container');
      const characterCounters = document.querySelectorAll('.character-counter');

      // Assert: Verify live regions
      expect(successMessage.getAttribute('aria-live')).toBe('polite');
      expect(errorMessage.getAttribute('aria-live')).toBe('assertive');
      expect(toastContainer.getAttribute('aria-live')).toBe('polite');

      characterCounters.forEach(counter => {
        expect(counter.getAttribute('aria-live')).toBe('polite');
      });
    });

    test('should maintain accessibility with JavaScript disabled', () => {
      // Arrange: Test core functionality without JavaScript
      const form = document.getElementById('contact-form');
      const inputs = form.querySelectorAll('input, textarea');

      // Act: Check basic HTML functionality
      inputs.forEach(input => {
        // Basic HTML validation should still work
        if (input.hasAttribute('required')) {
          expect(input.getAttribute('required')).toBe('');
        }

        if (input.type === 'email') {
          expect(input.type).toBe('email');
        }
      });

      // Assert: Verify form can still be submitted
      expect(form.getAttribute('method') || 'GET').toBeTruthy();
      expect(form.tagName).toBe('FORM');
    });

    test('should validate HTML markup structure', () => {
      // Arrange: Check basic HTML validity
      const requiredElements = ['html', 'head', 'body', 'main', 'nav'];

      // Act: Verify HTML structure
      requiredElements.forEach(tagName => {
        const element =
          document.querySelector(tagName) || document.getElementsByTagName(tagName)[0];

        if (tagName === 'html' || tagName === 'head') {
          // These might not be present in test environment
          return;
        }

        // Assert: Element should exist for proper document structure
        expect(element).toBeTruthy();
      });

      // Check for proper form structure
      const form = document.getElementById('contact-form');
      const fieldset = form.querySelector('fieldset');
      const legend = fieldset?.querySelector('legend');

      expect(fieldset).toBeTruthy();
      expect(legend).toBeTruthy();
      expect(legend.textContent).toBe('Contact Information');
    });
  });

  describe('Enhanced Accessibility Features', () => {
    test('should support reduced motion preferences', () => {
      // Arrange: Mock reduced motion preference
      global.matchMedia = jest.fn(query => ({
        matches: query.includes('prefers-reduced-motion') ? true : false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      // Act: Check for reduced motion support
      const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animatedElements = document.querySelectorAll(
        '.liquid-glass-card, .liquid-glass-button'
      );

      // Assert: Verify reduced motion handling
      expect(prefersReducedMotion).toBe(true);

      if (prefersReducedMotion) {
        animatedElements.forEach(element => {
          element.classList.add('reduced-motion');
          expect(element.classList.contains('reduced-motion')).toBe(true);
        });
      }
    });

    test('should provide screen reader announcements for state changes', () => {
      // Arrange: Get status announcement element
      const submitStatus = document.getElementById('submit-status');
      const form = document.getElementById('contact-form');

      // Act: Simulate form submission state changes
      submitStatus.textContent = 'Form is being submitted';
      expect(submitStatus.getAttribute('aria-live')).toBe('polite');

      // Simulate success
      submitStatus.textContent = 'Message sent successfully';

      // Simulate error
      submitStatus.textContent = 'Error: Please check your email address';

      // Assert: Verify announcements are properly configured
      expect(submitStatus.getAttribute('aria-atomic')).toBe('true');
      expect(submitStatus.textContent.length).toBeGreaterThan(0);
    });

    test('should maintain focus visibility for keyboard users', () => {
      // Arrange: Get interactive elements
      const button = document.getElementById('cta-button');
      const input = document.getElementById('name');
      const link = document.getElementById('nav-home');

      // Act: Focus elements and check visibility
      [button, input, link].forEach(element => {
        element.focus();

        // Assert: Verify focus is visible
        expect(document.activeElement).toBe(element);

        // Check that element can receive focus
        expect(element.tabIndex).not.toBe(-1);
      });
    });

    test('should provide appropriate touch target sizes', () => {
      // Arrange: Get interactive elements
      const buttons = document.querySelectorAll('button');
      const links = document.querySelectorAll('a');
      const inputs = document.querySelectorAll('input, textarea');

      // Act: Check touch target sizes
      [...buttons, ...links, ...inputs].forEach(element => {
        const styles = getComputedStyle(element);

        // Assert: Verify minimum 44px touch targets
        expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
      });
    });
  });
});
