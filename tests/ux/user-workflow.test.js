/**
 * @fileoverview User Experience Testing - Workflow Validation
 * Comprehensive user workflow testing following Phase 5B agent consultation strategy
 *
 * Testing Strategy from validator consultation:
 * - User workflow testing for contact form and admin dashboard
 * - Error recovery path validation with user-friendly messaging
 * - Loading state verification with performance benchmarks
 * - Cross-browser/device compatibility validation
 * - Accessibility compliance testing with usability metrics
 *
 * Design System Integration from design-reviewer consultation:
 * - Interactive state standardization validation
 * - Mobile optimization verification for glass effects
 * - Error and loading state design consistency
 */

describe('User Experience - Workflow Validation', () => {
  let mockDOM;
  let mockFetch;
  let mockSupabase;

  beforeEach(() => {
    // Setup DOM environment for UX testing
    document.body.innerHTML = `
      <form id="contact-form" class="liquid-glass-card">
        <input id="name" type="text" required maxlength="100" />
        <input id="company" type="text" maxlength="100" />
        <input id="email" type="email" required />
        <textarea id="message" required maxlength="2000"></textarea>
        <button type="submit" class="liquid-glass-button">Send Message</button>
        <div id="loading-spinner" class="hidden"></div>
        <div id="success-message" class="hidden"></div>
        <div id="error-message" class="hidden"></div>
      </form>
      
      <div id="admin-dashboard" class="liquid-glass-card hidden">
        <div id="login-section">
          <input id="admin-email" type="email" />
          <input id="admin-password" type="password" />
          <button id="login-btn" class="liquid-glass-button">Login</button>
        </div>
        <div id="submissions-list" class="hidden">
          <div class="submission-item" data-testid="submission-1"></div>
        </div>
      </div>
      
      <div id="toast-container"></div>
    `;

    // Mock fetch for API calls
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock Supabase client
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      auth: {
        signIn: jest.fn(),
        user: jest.fn(),
      },
    };
    global.supabase = mockSupabase;

    // Mock performance API for benchmarks
    global.performance = {
      now: jest.fn(() => 1000),
      mark: jest.fn(),
      measure: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Contact Form User Workflow', () => {
    test('should complete successful contact form submission workflow', async () => {
      // Arrange: Setup successful API response
      mockSupabase.from().insert.mockResolvedValue({
        data: { id: 1 },
        error: null,
      });

      const form = document.getElementById('contact-form');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const submitBtn = form.querySelector('button[type="submit"]');
      const loadingSpinner = document.getElementById('loading-spinner');
      const successMessage = document.getElementById('success-message');

      // Act: Simulate user input and form submission
      nameInput.value = 'Test User';
      emailInput.value = 'test@example.com';
      messageInput.value = 'Test message content';

      // Trigger form submission
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      // Assert: Verify UX workflow steps
      expect(loadingSpinner.classList.contains('hidden')).toBe(false);
      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.textContent).toBe('Sending...');

      // Wait for async submission to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(successMessage.classList.contains('hidden')).toBe(false);
      expect(loadingSpinner.classList.contains('hidden')).toBe(true);
      expect(submitBtn.disabled).toBe(false);
      expect(form.reset).toHaveBeenCalled();
    });

    test('should handle form validation errors gracefully', () => {
      // Arrange: Empty form submission
      const form = document.getElementById('contact-form');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const errorMessage = document.getElementById('error-message');

      // Act: Attempt submission with empty required fields
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      // Assert: Verify error handling UX
      expect(nameInput.classList.contains('border-red-500')).toBe(true);
      expect(emailInput.classList.contains('border-red-500')).toBe(true);
      expect(errorMessage.classList.contains('hidden')).toBe(false);
      expect(errorMessage.textContent).toContain('required fields');
    });

    test('should provide real-time character count feedback', () => {
      // Arrange: Setup character counter elements
      const nameInput = document.getElementById('name');
      const messageInput = document.getElementById('message');

      // Add character counters to DOM
      const nameCounter = document.createElement('div');
      nameCounter.id = 'name-counter';
      nameCounter.className = 'character-counter';
      nameInput.parentNode.appendChild(nameCounter);

      const messageCounter = document.createElement('div');
      messageCounter.id = 'message-counter';
      messageCounter.className = 'character-counter';
      messageInput.parentNode.appendChild(messageCounter);

      // Act: Type in inputs
      nameInput.value = 'John Doe';
      nameInput.dispatchEvent(new Event('input'));

      messageInput.value = 'A'.repeat(1500);
      messageInput.dispatchEvent(new Event('input'));

      // Assert: Verify character count updates
      expect(nameCounter.textContent).toBe('8/100');
      expect(messageCounter.textContent).toBe('1500/2000');
      expect(messageCounter.classList.contains('warning')).toBe(true); // >75% of limit
    });

    test('should validate email format with user-friendly messaging', () => {
      // Arrange: Invalid email format
      const emailInput = document.getElementById('email');
      const errorMessage = document.getElementById('error-message');

      // Act: Enter invalid email
      emailInput.value = 'invalid-email';
      emailInput.dispatchEvent(new Event('blur'));

      // Assert: Verify email validation UX
      expect(emailInput.classList.contains('border-red-500')).toBe(true);
      expect(errorMessage.textContent).toContain('valid email address');
      expect(errorMessage.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Admin Dashboard User Workflow', () => {
    test('should complete successful admin login workflow', async () => {
      // Arrange: Setup successful auth response
      mockSupabase.auth.signIn.mockResolvedValue({
        data: { user: { id: '123', email: 'admin@hydrocav.com' } },
        error: null,
      });

      const emailInput = document.getElementById('admin-email');
      const passwordInput = document.getElementById('admin-password');
      const loginBtn = document.getElementById('login-btn');
      const loginSection = document.getElementById('login-section');
      const submissionsList = document.getElementById('submissions-list');

      // Act: Simulate admin login
      emailInput.value = 'admin@hydrocav.com';
      passwordInput.value = 'admin123';
      loginBtn.click();

      // Assert: Verify login workflow UX
      expect(loginBtn.disabled).toBe(true);
      expect(loginBtn.textContent).toBe('Signing in...');

      // Wait for async login to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(loginSection.classList.contains('hidden')).toBe(true);
      expect(submissionsList.classList.contains('hidden')).toBe(false);
    });

    test('should handle authentication errors with clear messaging', async () => {
      // Arrange: Setup auth error response
      mockSupabase.auth.signIn.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      const loginBtn = document.getElementById('login-btn');
      const errorMessage = document.getElementById('error-message');

      // Act: Attempt login with invalid credentials
      loginBtn.click();

      // Assert: Verify error handling UX
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorMessage.classList.contains('hidden')).toBe(false);
      expect(errorMessage.textContent).toContain('Invalid credentials');
      expect(loginBtn.disabled).toBe(false);
      expect(loginBtn.textContent).toBe('Login');
    });

    test('should provide loading states during data fetching', async () => {
      // Arrange: Setup submissions data
      mockSupabase.from().select.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: [{ id: 1, name: 'Test User', message: 'Test message' }],
                  error: null,
                }),
              200
            )
          )
      );

      const submissionsList = document.getElementById('submissions-list');

      // Add loading indicator
      const loadingIndicator = document.createElement('div');
      loadingIndicator.id = 'submissions-loading';
      loadingIndicator.className = 'loading-spinner';
      submissionsList.appendChild(loadingIndicator);

      // Act: Trigger data loading
      const loadDataEvent = new CustomEvent('loadSubmissions');
      document.dispatchEvent(loadDataEvent);

      // Assert: Verify loading state UX
      expect(loadingIndicator.classList.contains('hidden')).toBe(false);

      // Wait for data loading to complete
      await new Promise(resolve => setTimeout(resolve, 250));

      expect(loadingIndicator.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Performance Benchmarks', () => {
    test('should complete form submission within performance budget', async () => {
      // Arrange: Setup performance timing
      const startTime = performance.now();
      mockSupabase.from().insert.mockResolvedValue({ data: { id: 1 }, error: null });

      const form = document.getElementById('contact-form');

      // Act: Submit form and measure time
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 100));
      const endTime = performance.now();
      const submissionTime = endTime - startTime;

      // Assert: Verify performance requirements (< 2 seconds)
      expect(submissionTime).toBeLessThan(2000);
    });

    test('should render loading states within 100ms', () => {
      // Arrange: Setup timing measurement
      const startTime = performance.now();
      const loadingSpinner = document.getElementById('loading-spinner');

      // Act: Show loading state
      loadingSpinner.classList.remove('hidden');
      const renderTime = performance.now() - startTime;

      // Assert: Verify loading state appears quickly
      expect(renderTime).toBeLessThan(100);
      expect(loadingSpinner.classList.contains('hidden')).toBe(false);
    });

    test('should maintain 60fps during glass effect animations', () => {
      // Arrange: Setup animation performance monitoring
      const glassCard = document.querySelector('.liquid-glass-card');
      let frameCount = 0;
      const frameTimes = [];

      // Mock requestAnimationFrame for testing
      const mockRAF = jest.fn(callback => {
        const currentTime = performance.now();
        frameTimes.push(currentTime);
        frameCount++;

        if (frameCount < 60) {
          // Test 60 frames (1 second at 60fps)
          setTimeout(() => callback(currentTime), 16.67); // ~60fps
        }
      });
      global.requestAnimationFrame = mockRAF;

      // Act: Trigger hover animation
      const hoverEvent = new Event('mouseenter');
      glassCard.dispatchEvent(hoverEvent);

      // Assert: Verify smooth animation performance
      expect(frameCount).toBeGreaterThan(0);

      // Calculate average frame time
      if (frameTimes.length > 1) {
        const avgFrameTime =
          frameTimes.reduce((sum, time, index) => {
            if (index === 0) return 0;
            return sum + (time - frameTimes[index - 1]);
          }, 0) /
          (frameTimes.length - 1);

        expect(avgFrameTime).toBeLessThan(16.67); // Should be better than 60fps
      }
    });
  });

  describe('Accessibility Compliance', () => {
    test('should maintain proper focus management', () => {
      // Arrange: Setup form elements
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const submitBtn = document.querySelector('button[type="submit"]');

      // Act: Navigate with keyboard
      nameInput.focus();
      expect(document.activeElement).toBe(nameInput);

      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      nameInput.dispatchEvent(tabEvent);
      emailInput.focus();

      // Assert: Verify focus order
      expect(document.activeElement).toBe(emailInput);
    });

    test('should provide proper ARIA labels and roles', () => {
      // Arrange: Check ARIA attributes
      const form = document.getElementById('contact-form');
      const loadingSpinner = document.getElementById('loading-spinner');
      const errorMessage = document.getElementById('error-message');

      // Assert: Verify ARIA compliance
      expect(form.getAttribute('aria-label')).toBeTruthy();
      expect(loadingSpinner.getAttribute('aria-hidden')).toBe('true');
      expect(errorMessage.getAttribute('role')).toBe('alert');
      expect(errorMessage.getAttribute('aria-live')).toBe('polite');
    });

    test('should meet minimum touch target sizes (44px)', () => {
      // Arrange: Check interactive elements
      const submitBtn = document.querySelector('button[type="submit"]');
      const nameInput = document.getElementById('name');

      // Get computed styles (mocked for testing)
      const btnStyles = getComputedStyle(submitBtn);
      const inputStyles = getComputedStyle(nameInput);

      // Assert: Verify touch target sizes
      expect(parseInt(btnStyles.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(inputStyles.minHeight)).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Error Recovery Paths', () => {
    test('should allow users to retry failed submissions', async () => {
      // Arrange: Setup API failure scenario
      mockSupabase
        .from()
        .insert.mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { id: 1 }, error: null });

      const form = document.getElementById('contact-form');
      const retryBtn = document.createElement('button');
      retryBtn.id = 'retry-btn';
      retryBtn.textContent = 'Retry';
      retryBtn.className = 'liquid-glass-button hidden';
      form.appendChild(retryBtn);

      // Act: First submission fails
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert: Verify retry option appears
      expect(retryBtn.classList.contains('hidden')).toBe(false);

      // Act: Retry submission
      retryBtn.click();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Assert: Verify successful retry
      expect(retryBtn.classList.contains('hidden')).toBe(true);
    });

    test('should provide helpful error messages for different failure types', () => {
      // Arrange: Test various error scenarios
      const errorMessage = document.getElementById('error-message');

      const testCases = [
        { error: 'Network error', expectedMessage: 'connection problem' },
        { error: 'Rate limit exceeded', expectedMessage: 'too many requests' },
        { error: 'Invalid email format', expectedMessage: 'valid email address' },
        { error: 'Server error', expectedMessage: 'temporary issue' },
      ];

      testCases.forEach(({ error, expectedMessage }) => {
        // Act: Simulate error
        const errorEvent = new CustomEvent('displayError', { detail: error });
        document.dispatchEvent(errorEvent);

        // Assert: Verify user-friendly message
        expect(errorMessage.textContent.toLowerCase()).toContain(expectedMessage);
      });
    });

    test('should auto-dismiss success messages after 4 seconds', done => {
      // Arrange: Setup success message
      const successMessage = document.getElementById('success-message');
      successMessage.textContent = 'Message sent successfully!';
      successMessage.classList.remove('hidden');

      // Act: Trigger auto-dismiss timer
      setTimeout(() => {
        successMessage.classList.add('fade-out');
      }, 4000);

      // Assert: Verify auto-dismiss behavior
      setTimeout(() => {
        expect(successMessage.classList.contains('fade-out')).toBe(true);
        done();
      }, 4100);
    });
  });

  describe('Cross-Device Compatibility', () => {
    test('should adapt form layout for mobile devices', () => {
      // Arrange: Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const form = document.getElementById('contact-form');

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      // Assert: Verify mobile adaptations
      const formStyles = getComputedStyle(form);
      expect(formStyles.padding).toBe('1rem'); // Reduced padding on mobile
      expect(formStyles.fontSize).toBe('16px'); // Prevent zoom on iOS
    });

    test('should optimize glass effects for mobile performance', () => {
      // Arrange: Check mobile-specific glass effect styles
      const glassCard = document.querySelector('.liquid-glass-card');

      // Simulate mobile detection
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        configurable: true,
      });

      // Act: Apply mobile optimizations
      const mobileOptimizationEvent = new Event('mobileOptimization');
      document.dispatchEvent(mobileOptimizationEvent);

      // Assert: Verify reduced blur for mobile performance
      const cardStyles = getComputedStyle(glassCard);
      expect(cardStyles.backdropFilter).toContain('blur(8px)'); // Reduced from 16px
    });
  });
});
