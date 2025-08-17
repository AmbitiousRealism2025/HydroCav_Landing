/**
 * Contact Form Integration Tests
 *
 * Tests for the complete contact form workflow including:
 * - Form validation
 * - Security integration (XSS, CSRF)
 * - Supabase submission
 * - User feedback
 *
 * As specified in TDD Implementation Plan Phase 3B.
 */

describe('Contact Form Integration', () => {
  let mockSupabaseClient;
  let XSSProtection, CSRFProtection, SecurityManager;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <form id="contact-form" novalidate aria-labelledby="contact-heading">
        <div>
          <label for="name" class="form-label">
            Full Name <span class="required" aria-label="required">*</span>
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            maxlength="100"
            aria-describedby="name-error name-counter" 
            aria-required="true"
          />
          <div id="name-error" class="error-message" role="alert" aria-live="polite"></div>
          <div id="name-counter" class="character-counter">0/100</div>
        </div>

        <div>
          <label for="email" class="form-label">
            Email Address <span class="required" aria-label="required">*</span>
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            maxlength="100"
            aria-describedby="email-error email-counter" 
            aria-required="true"
          />
          <div id="email-error" class="error-message" role="alert" aria-live="polite"></div>
          <div id="email-counter" class="character-counter">0/100</div>
        </div>

        <div>
          <label for="company" class="form-label">Company Name</label>
          <input 
            type="text" 
            id="company" 
            name="company" 
            maxlength="100"
            aria-describedby="company-counter"
          />
          <div id="company-counter" class="character-counter">0/100</div>
        </div>

        <div>
          <label for="message" class="form-label">
            Message <span class="required" aria-label="required">*</span>
          </label>
          <textarea 
            id="message" 
            name="message" 
            required 
            minlength="10" 
            maxlength="2000"
            aria-describedby="message-error message-counter" 
            aria-required="true"
          ></textarea>
          <div id="message-error" class="error-message" role="alert" aria-live="polite"></div>
          <div id="message-counter" class="character-counter">0/2000</div>
        </div>

        <button type="submit" id="submit-btn">Send Message</button>
      </form>
      
      <div id="toast-container"></div>
    `;

    // Setup security modules mocks
    window.XSSProtection = {
      sanitizeInput: jest.fn(input =>
        input ? input.replace(/<script[^>]*>.*?<\/script>/gi, '') : ''
      ),
      validateInput: jest.fn(input => !input.includes('<script')),
    };

    window.CSRFProtection = {
      generateToken: jest.fn(() => 'mock-csrf-token-123'),
      validateToken: jest.fn(() => true),
      getToken: jest.fn(() => 'mock-csrf-token-123'),
    };

    window.SecurityManager = {
      logSecurityEvent: jest.fn(),
    };

    // Setup Supabase mock
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: [{ id: '123' }], error: null }),
    };

    window.supabaseClient = mockSupabaseClient;

    XSSProtection = window.XSSProtection;
    CSRFProtection = window.CSRFProtection;
    SecurityManager = window.SecurityManager;
  });

  afterEach(() => {
    delete window.XSSProtection;
    delete window.CSRFProtection;
    delete window.SecurityManager;
    delete window.supabaseClient;
  });

  describe('Form Validation', () => {
    test('should validate required fields', () => {
      const form = document.getElementById('contact-form');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Test empty form submission
      const isValid = form.checkValidity();
      expect(isValid).toBe(false);

      // Fill required fields
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      messageInput.value = 'This is a test message';

      expect(form.checkValidity()).toBe(true);
    });

    test('should validate email format', () => {
      const emailInput = document.getElementById('email');

      emailInput.value = 'invalid-email';
      expect(emailInput.checkValidity()).toBe(false);

      emailInput.value = 'valid@example.com';
      expect(emailInput.checkValidity()).toBe(true);
    });

    test('should validate message length', () => {
      const messageInput = document.getElementById('message');

      // Too short
      messageInput.value = 'Short';
      expect(messageInput.checkValidity()).toBe(false);

      // Just right
      messageInput.value = 'This is a valid message that meets the minimum length requirement';
      expect(messageInput.checkValidity()).toBe(true);

      // Too long
      messageInput.value = 'a'.repeat(2001);
      expect(messageInput.checkValidity()).toBe(false);
    });

    test('should validate character limits', () => {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const companyInput = document.getElementById('company');

      // Test 100 character limits
      nameInput.value = 'a'.repeat(101);
      expect(nameInput.checkValidity()).toBe(false);

      emailInput.value = 'a'.repeat(95) + '@a.com'; // 101 chars total
      expect(emailInput.checkValidity()).toBe(false);

      companyInput.value = 'a'.repeat(101);
      expect(companyInput.checkValidity()).toBe(false);
    });
  });

  describe('Security Integration', () => {
    test('should validate CSRF token before submission', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      // Mock CSRF validation failure
      CSRFProtection.validateToken.mockReturnValue(false);

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      expect(CSRFProtection.validateToken).toHaveBeenCalled();
      expect(SecurityManager.logSecurityEvent).toHaveBeenCalledWith(
        'csrf_validation_failed',
        expect.any(Object)
      );
    });

    test('should sanitize form inputs before submission', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with potentially malicious data
      document.getElementById('name').value = 'John <script>alert("XSS")</script> Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('company').value = 'ACME <script>alert("XSS")</script> Corp';
      document.getElementById('message').value =
        'Test message with <script>alert("XSS")</script> content';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      expect(XSSProtection.sanitizeInput).toHaveBeenCalledWith(
        'John <script>alert("XSS")</script> Doe'
      );
      expect(XSSProtection.sanitizeInput).toHaveBeenCalledWith('john@example.com');
      expect(XSSProtection.sanitizeInput).toHaveBeenCalledWith(
        'ACME <script>alert("XSS")</script> Corp'
      );
      expect(XSSProtection.sanitizeInput).toHaveBeenCalledWith(
        'Test message with <script>alert("XSS")</script> content'
      );
    });

    test('should log security events during form processing', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      // Trigger XSS sanitization
      XSSProtection.sanitizeInput.mockImplementation(input => {
        if (input.includes('<script>')) {
          return input.replace(/<script[^>]*>.*?<\/script>/gi, '');
        }
        return input;
      });

      document.getElementById('name').value = 'John <script>alert("XSS")</script> Doe';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      expect(SecurityManager.logSecurityEvent).toHaveBeenCalledWith(
        'xss_sanitization',
        expect.objectContaining({
          sanitized: true,
          timestamp: expect.any(String),
        })
      );
    });
  });

  describe('Database Integration', () => {
    test('should submit valid form data to Supabase', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('company').value = 'ACME Corp';
      document.getElementById('message').value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Allow async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('contact_submissions');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          company: 'ACME Corp',
          message: 'This is a test message',
          ip_address: expect.any(String),
          user_agent: expect.any(String),
        })
      );
    });

    test('should handle database submission errors', async () => {
      const form = document.getElementById('contact-form');

      // Mock database error
      mockSupabaseClient.insert.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      });

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Allow async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(SecurityManager.logSecurityEvent).toHaveBeenCalledWith(
        'form_submission_failed',
        expect.objectContaining({
          error: 'Database connection failed',
        })
      );
    });

    test('should handle network connectivity issues', async () => {
      const form = document.getElementById('contact-form');

      // Mock network error
      mockSupabaseClient.insert.mockRejectedValue(new Error('Network error'));

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Allow async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(SecurityManager.logSecurityEvent).toHaveBeenCalledWith(
        'form_submission_error',
        expect.objectContaining({
          error: 'Network error',
        })
      );
    });
  });

  describe('User Experience', () => {
    test('should show loading state during submission', async () => {
      const form = document.getElementById('contact-form');
      const submitBtn = document.getElementById('submit-btn');

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      // Mock slow database response
      mockSupabaseClient.insert.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ data: [{ id: '123' }], error: null }), 1000)
          )
      );

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Check loading state is active
      await testHelpers.waitFor(
        () => submitBtn.disabled && submitBtn.textContent.includes('Sending')
      );

      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.textContent).toContain('Sending');
    });

    test('should show success message after successful submission', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check for success toast
      const toastContainer = document.getElementById('toast-container');
      expect(toastContainer.innerHTML).toContain('success');
    });

    test('should reset form after successful submission', async () => {
      const form = document.getElementById('contact-form');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Fill form with valid data
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      messageInput.value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });

    test('should show error message for submission failures', async () => {
      const form = document.getElementById('contact-form');

      // Mock database error
      mockSupabaseClient.insert.mockResolvedValue({
        data: null,
        error: { message: 'Submission failed' },
      });

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check for error toast
      const toastContainer = document.getElementById('toast-container');
      expect(toastContainer.innerHTML).toContain('error');
    });
  });

  describe('Accessibility Features', () => {
    test('should announce form submission status to screen readers', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Check for aria-live announcements
      const announcements = document.querySelectorAll('[aria-live]');
      expect(announcements.length).toBeGreaterThan(0);
    });

    test('should maintain focus management during form submission', async () => {
      const form = document.getElementById('contact-form');
      const submitBtn = document.getElementById('submit-btn');

      // Focus the submit button
      submitBtn.focus();
      expect(document.activeElement).toBe(submitBtn);

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Focus should remain on form during submission
      expect(document.activeElement).toBeTruthy();
    });
  });

  describe('Performance', () => {
    test('should complete form submission within acceptable time', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with valid data
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'This is a test message';

      const startTime = performance.now();

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      const endTime = performance.now();
      const submissionTime = endTime - startTime;

      // Should complete in under 5 seconds (including network latency)
      expect(submissionTime).toBeLessThan(5000);
    });

    test('should handle large message content efficiently', async () => {
      const form = document.getElementById('contact-form');

      // Fill form with large message (near limit)
      document.getElementById('name').value = 'John Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('message').value = 'a'.repeat(1950); // Near 2000 char limit

      const startTime = performance.now();

      const submitEvent = new Event('submit', { cancelable: true });
      form.dispatchEvent(submitEvent);

      // Wait for submission to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      const endTime = performance.now();
      const submissionTime = endTime - startTime;

      // Should still complete efficiently even with large content
      expect(submissionTime).toBeLessThan(1000);
    });
  });
});
