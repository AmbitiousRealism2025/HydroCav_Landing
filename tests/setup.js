/**
 * Jest Test Setup File
 *
 * Global setup for all Jest tests in the HydroCav website project.
 * This file runs before each test suite and sets up the testing environment.
 */

// Mock DOM APIs that may not be available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
);

// Mock localStorage and sessionStorage with working implementations
const createStorageMock = () => {
  const storage = {};
  return {
    getItem: jest.fn(key => storage[key] || null),
    setItem: jest.fn((key, value) => {
      storage[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete storage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }),
    data: storage,
  };
};

const localStorageMock = createStorageMock();
global.localStorage = localStorageMock;

const sessionStorageMock = createStorageMock();
global.sessionStorage = sessionStorageMock;

// Setup for Supabase mocking
global.supabase = {
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  }),
};

// Global test helpers
global.testHelpers = {
  // Create a mock HTML element
  createMockElement: (tag = 'div', attributes = {}) => {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
      element.setAttribute(key, attributes[key]);
    });
    return element;
  },

  // Create a mock form with fields
  createMockForm: (fields = {}) => {
    const form = document.createElement('form');
    Object.keys(fields).forEach(name => {
      const input = document.createElement('input');
      input.name = name;
      input.value = fields[name];
      form.appendChild(input);
    });
    return form;
  },

  // Simulate user input
  simulateInput: (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  },

  // Simulate form submission
  simulateSubmit: form => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  },

  // Wait for async operations
  waitFor: (callback, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          const result = callback();
          if (result) {
            resolve(result);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(check, 10);
          }
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  },
};

// Reset mocks before each test
beforeEach(() => {
  if (fetch.mockClear) fetch.mockClear();
  if (localStorageMock.getItem.mockClear) localStorageMock.getItem.mockClear();
  if (localStorageMock.setItem.mockClear) localStorageMock.setItem.mockClear();
  if (localStorageMock.removeItem.mockClear) localStorageMock.removeItem.mockClear();
  if (localStorageMock.clear.mockClear) localStorageMock.clear.mockClear();
  if (sessionStorageMock.getItem.mockClear) sessionStorageMock.getItem.mockClear();
  if (sessionStorageMock.setItem.mockClear) sessionStorageMock.setItem.mockClear();
  if (sessionStorageMock.removeItem.mockClear) sessionStorageMock.removeItem.mockClear();
  if (sessionStorageMock.clear.mockClear) sessionStorageMock.clear.mockClear();

  // Clear document body
  document.body.innerHTML = '';

  // Reset window object
  delete window.SecurityManager;
  delete window.XSSProtection;
  delete window.CSRFProtection;
  delete window.SecureConfig;
});
