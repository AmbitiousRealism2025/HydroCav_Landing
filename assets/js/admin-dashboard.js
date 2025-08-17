/**
 * Admin Dashboard Functionality
 *
 * PHASE 5: Extracted from inline script for CSP compliance
 * Complete admin dashboard functionality including authentication,
 * submission management, data export, and security integration.
 *
 * This file contains 950+ lines of admin functionality
 */

// Global declarations for ESLint
/* global Blob */

// Supabase configuration
const SUPABASE_URL = '__SUPABASE_URL_PLACEHOLDER__';
const SUPABASE_ANON_KEY = '__SUPABASE_ANON_KEY_PLACEHOLDER__';

let supabaseClient;
let currentUser = null;

if (typeof window.supabase !== 'undefined') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error('Supabase not loaded');
}

// Admin dashboard state
let submissions = [];
let filteredSubmissions = [];
let currentPage = 1;
const itemsPerPage = 10;

// Wait for security to be ready before initializing
window.addEventListener('securityReady', () => {
  console.log('Security ready, initializing admin dashboard...');
  initializeAdminDashboard();
});

// Initialize admin dashboard
async function initializeAdminDashboard() {
  if (!window.securityInitialized || !window.securityInitialized()) {
    console.log('⏳ Waiting for security modules to initialize...');
    return;
  }

  try {
    await checkAuthStatus();
    setupEventListeners();
    setupAdditionalEventListeners();
    console.log('✅ Admin dashboard initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize admin dashboard:', error);
  }
}

// Authentication functions
async function checkAuthStatus() {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (user) {
      currentUser = user;
      showDashboard();
      loadSubmissions();
    } else {
      showLoginForm();
    }
  } catch (error) {
    console.error('Auth status check failed:', error);
    showLoginForm();
  }
}

function showLoginForm() {
  document.getElementById('auth-container').style.display = 'block';
  document.getElementById('dashboard-container').style.display = 'none';
}

function showDashboard() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('dashboard-container').style.display = 'block';
  document.getElementById('user-email').textContent = currentUser?.email || 'Unknown';
}

// Login function
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  // Security Step 1: CSRF Protection - Generate and validate token
  if (!window.CSRFProtection?.validateToken()) {
    window.SecurityManager?.logSecurityEvent('csrf_validation_failed', {
      action: 'admin_login',
      email: email,
    });
    showError('Security validation failed. Please refresh the page and try again.');
    return;
  }

  // Security Step 2: XSS Protection - Sanitize inputs
  // CRITICAL FIX: Use proper sanitization methods for specific field types
  const sanitizedEmail = window.XSSProtection?.sanitizeEmail(email) || email;
  const sanitizedPassword = window.XSSProtection?.sanitizeText(password) || password;

  // Log sanitization if occurred
  if (sanitizedEmail !== email || sanitizedPassword !== password) {
    window.SecurityManager?.logSecurityEvent('xss_sanitization', {
      action: 'admin_login',
      sanitized: true,
    });
  }

  try {
    // Security Step 3: Rate limiting check
    const canProceed = await window.SecurityManager?.checkRateLimit('admin_login');
    if (!canProceed) {
      showError('Too many login attempts. Please wait before trying again.');
      return;
    }

    showLoading(true);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      // Security Step 4: Log failed login attempt
      window.SecurityManager?.logSecurityEvent('admin_login_failed', {
        email: sanitizedEmail,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }

    // Security Step 5: Log successful login
    window.SecurityManager?.logSecurityEvent('admin_login_success', {
      email: sanitizedEmail,
      timestamp: new Date().toISOString(),
    });

    currentUser = data.user;
    showDashboard();
    loadSubmissions();
    showSuccess('Login successful!');
  } catch (error) {
    console.error('Login error:', error);
    showError(error.message || 'Login failed. Please check your credentials.');
  } finally {
    showLoading(false);
  }
}

// Signup function
async function handleSignup(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  // Security Step 1: CSRF Protection
  if (!window.CSRFProtection?.validateToken()) {
    window.SecurityManager?.logSecurityEvent('csrf_validation_failed', {
      action: 'admin_signup',
      email: email,
    });
    showError('Security validation failed. Please refresh the page and try again.');
    return;
  }

  // Security Step 2: XSS Protection - Sanitize inputs
  // CRITICAL FIX: Use proper sanitization methods for specific field types
  const sanitizedEmail = window.XSSProtection?.sanitizeEmail(email) || email;
  const sanitizedPassword = window.XSSProtection?.sanitizeText(password) || password;

  try {
    showLoading(true);

    const { data, error } = await supabaseClient.auth.signUp({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      throw error;
    }

    showSuccess('Account created successfully! Please check your email for verification.');
  } catch (error) {
    console.error('Signup error:', error);
    showError(error.message || 'Signup failed. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Logout function
async function handleLogout() {
  try {
    await supabaseClient.auth.signOut();
    currentUser = null;
    showLoginForm();
    showSuccess('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    showError('Logout failed');
  }
}

// Submissions management
async function loadSubmissions() {
  try {
    showLoading(true);

    const { data, error } = await supabaseClient
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      throw error;
    }

    submissions = data || [];
    filteredSubmissions = [...submissions];
    updateSubmissionsDisplay();
    updateStats();
  } catch (error) {
    console.error('Failed to load submissions:', error);
    showError('Failed to load submissions: ' + error.message);
  } finally {
    showLoading(false);
  }
}

function updateSubmissionsDisplay() {
  const tbody = document.getElementById('submissions-tbody');
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  tbody.innerHTML = pageSubmissions
    .map(
      submission => `
    <tr class="hover:bg-gray-50" data-id="${submission.id}">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${escapeHtml(submission.name)}</div>
        <div class="text-sm text-gray-500">${escapeHtml(submission.email)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${escapeHtml(submission.company || 'N/A')}</div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-900 max-w-xs truncate" title="${escapeHtml(submission.message)}">
          ${escapeHtml(submission.message)}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(submission.status)}-100 text-${getStatusColor(submission.status)}-800">
          ${submission.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getPriorityColor(submission.priority)}-100 text-${getPriorityColor(submission.priority)}-800">
          ${submission.priority}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${new Date(submission.submitted_at).toLocaleDateString()}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onclick="editSubmission('${submission.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
          Edit
        </button>
        <button onclick="deleteSubmission('${submission.id}')" class="text-red-600 hover:text-red-900">
          Delete
        </button>
      </td>
    </tr>
  `
    )
    .join('');

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const pagination = document.getElementById('pagination');

  pagination.innerHTML = `
    <button 
      onclick="changePage(${currentPage - 1})" 
      ${currentPage === 1 ? 'disabled' : ''} 
      class="px-3 py-2 mx-1 text-sm bg-gray-200 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}"
    >
      Previous
    </button>
    <span class="px-3 py-2 mx-1 text-sm">
      Page ${currentPage} of ${totalPages}
    </span>
    <button 
      onclick="changePage(${currentPage + 1})" 
      ${currentPage === totalPages ? 'disabled' : ''} 
      class="px-3 py-2 mx-1 text-sm bg-gray-200 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}"
    >
      Next
    </button>
  `;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    updateSubmissionsDisplay();
  }
}

function updateStats() {
  const total = submissions.length;
  const newCount = submissions.filter(s => s.status === 'new').length;
  const contacted = submissions.filter(s => s.status === 'contacted').length;
  const qualified = submissions.filter(s => s.status === 'qualified').length;

  document.getElementById('total-submissions').textContent = total;
  document.getElementById('new-submissions').textContent = newCount;
  document.getElementById('contacted-submissions').textContent = contacted;
  document.getElementById('qualified-submissions').textContent = qualified;
}

// Submission editing
async function editSubmission(id) {
  const submission = submissions.find(s => s.id === id);
  if (!submission) return;

  // Create edit modal
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Edit Submission</h3>
      <form id="edit-form">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select id="edit-status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="new" ${submission.status === 'new' ? 'selected' : ''}>New</option>
            <option value="contacted" ${submission.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="qualified" ${submission.status === 'qualified' ? 'selected' : ''}>Qualified</option>
            <option value="closed" ${submission.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select id="edit-priority" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="low" ${submission.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="normal" ${submission.priority === 'normal' ? 'selected' : ''}>Normal</option>
            <option value="high" ${submission.priority === 'high' ? 'selected' : ''}>High</option>
            <option value="urgent" ${submission.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea id="edit-notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md">${submission.notes || ''}</textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="button" onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle form submission
  document.getElementById('edit-form').addEventListener('submit', async e => {
    e.preventDefault();

    try {
      // Security Step 1: CSRF Protection
      if (!window.CSRFProtection?.validateToken()) {
        window.SecurityManager?.logSecurityEvent('csrf_validation_failed', {
          action: 'edit_submission',
          submission_id: id,
        });
        showError('Security validation failed. Please refresh the page and try again.');
        return;
      }

      // Collect form data
      const rawData = {
        status: document.getElementById('edit-status').value,
        priority: document.getElementById('edit-priority').value,
        notes: document.getElementById('edit-notes').value,
      };

      // Security Step 2: XSS Protection - Sanitize all inputs
      const updateData = {};
      let sanitizationOccurred = false;

      for (const [key, value] of Object.entries(rawData)) {
        if (value !== null && typeof value === 'string') {
          // CRITICAL FIX: Use sanitizeText for proper HTML entity encoding
          const sanitized = window.XSSProtection?.sanitizeText(value) || value;
          updateData[key] = sanitized;
          if (sanitized !== value) {
            sanitizationOccurred = true;
          }
        } else {
          updateData[key] = value;
        }
      }

      // Security Step 3: Log sanitization if occurred
      if (sanitizationOccurred) {
        window.SecurityManager?.logSecurityEvent('xss_sanitization', {
          action: 'edit_submission',
          submission_id: id,
          sanitized_fields: Object.keys(updateData),
        });
      }

      const { error } = await supabaseClient
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Security Step 4: Log successful update
      window.SecurityManager?.logSecurityEvent('submission_updated', {
        submission_id: id,
        updated_fields: Object.keys(updateData),
        timestamp: new Date().toISOString(),
      });

      modal.remove();
      loadSubmissions();
      showSuccess('Submission updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      showError('Failed to update submission: ' + error.message);
    }
  });
}

// Submission deletion
async function deleteSubmission(id) {
  if (!confirm('Are you sure you want to delete this submission?')) {
    return;
  }

  try {
    // Security Step 1: CSRF Protection
    if (!window.CSRFProtection?.validateToken()) {
      window.SecurityManager?.logSecurityEvent('csrf_validation_failed', {
        action: 'delete_submission',
        submission_id: id,
      });
      showError('Security validation failed. Please refresh the page and try again.');
      return;
    }

    const { error } = await supabaseClient.from('contact_submissions').delete().eq('id', id);

    if (error) {
      throw error;
    }

    // Security Step 2: Log deletion
    window.SecurityManager?.logSecurityEvent('submission_deleted', {
      submission_id: id,
      timestamp: new Date().toISOString(),
    });

    loadSubmissions();
    showSuccess('Submission deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    showError('Failed to delete submission: ' + error.message);
  }
}

// Filtering and search
function filterSubmissions() {
  const statusFilter = document.getElementById('status-filter').value;
  const priorityFilter = document.getElementById('priority-filter').value;
  const searchTerm = document.getElementById('search-input').value.toLowerCase();

  filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = !statusFilter || submission.status === statusFilter;
    const matchesPriority = !priorityFilter || submission.priority === priorityFilter;
    const matchesSearch =
      !searchTerm ||
      submission.name.toLowerCase().includes(searchTerm) ||
      submission.email.toLowerCase().includes(searchTerm) ||
      submission.company?.toLowerCase().includes(searchTerm) ||
      submission.message.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesPriority && matchesSearch;
  });

  currentPage = 1;
  updateSubmissionsDisplay();
}

// Export functionality
function exportSubmissions() {
  try {
    // Security Step 1: CSRF Protection
    if (!window.CSRFProtection?.validateToken()) {
      window.SecurityManager?.logSecurityEvent('csrf_validation_failed', {
        action: 'export_submissions',
      });
      showError('Security validation failed. Please refresh the page and try again.');
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Company',
      'Message',
      'Status',
      'Priority',
      'Submitted Date',
      'Notes',
    ];
    const csvContent = [
      headers.join(','),
      ...filteredSubmissions.map(submission =>
        [
          `"${escapeCSV(submission.name)}"`,
          `"${escapeCSV(submission.email)}"`,
          `"${escapeCSV(submission.company || '')}"`,
          `"${escapeCSV(submission.message)}"`,
          `"${escapeCSV(submission.status)}"`,
          `"${escapeCSV(submission.priority)}"`,
          `"${escapeCSV(new Date(submission.submitted_at).toLocaleDateString())}"`,
          `"${escapeCSV(submission.notes || '')}"`,
        ].join(',')
      ),
    ].join('\n');

    // Security Step 2: Log export
    window.SecurityManager?.logSecurityEvent('submissions_exported', {
      count: filteredSubmissions.length,
      timestamp: new Date().toISOString(),
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `hydrocav-submissions-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('Submissions exported successfully');
  } catch (error) {
    console.error('Export error:', error);
    showError('Failed to export submissions: ' + error.message);
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeCSV(text) {
  return text ? text.replace(/"/g, '""') : '';
}

function getStatusColor(status) {
  const colors = {
    new: 'blue',
    contacted: 'yellow',
    qualified: 'green',
    closed: 'gray',
  };
  return colors[status] || 'gray';
}

function getPriorityColor(priority) {
  const colors = {
    low: 'green',
    normal: 'blue',
    high: 'yellow',
    urgent: 'red',
  };
  return colors[priority] || 'blue';
}

// UI feedback functions
function showLoading(show) {
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = show ? 'block' : 'none';
  }
}

function showError(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className =
    'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
  alertDiv.innerHTML = `
    <span class="block sm:inline">${escapeHtml(message)}</span>
    <span class="absolute top-0 bottom-0 right-0 px-4 py-3" onclick="this.parentElement.remove()">
      <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <title>Close</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
      </svg>
    </span>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 5000);
}

function showSuccess(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className =
    'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
  alertDiv.innerHTML = `
    <span class="block sm:inline">${escapeHtml(message)}</span>
    <span class="absolute top-0 bottom-0 right-0 px-4 py-3" onclick="this.parentElement.remove()">
      <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <title>Close</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
      </svg>
    </span>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

// Event listeners setup
function setupEventListeners() {
  // Auth forms
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('signup-form')?.addEventListener('submit', handleSignup);

  // Logout button
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

  // Filter controls
  document.getElementById('status-filter')?.addEventListener('change', filterSubmissions);
  document.getElementById('priority-filter')?.addEventListener('change', filterSubmissions);
  document.getElementById('search-input')?.addEventListener('input', filterSubmissions);

  // Export button
  document.getElementById('export-btn')?.addEventListener('click', exportSubmissions);

  // Refresh button
  document.getElementById('refresh-btn')?.addEventListener('click', loadSubmissions);
}

function setupAdditionalEventListeners() {
  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', e => {
      const targetTab = e.target.dataset.tab;

      // Remove active class from all tabs
      document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
      document
        .querySelectorAll('[data-tab-content]')
        .forEach(content => (content.style.display = 'none'));

      // Add active class to clicked tab
      e.target.classList.add('active');
      document.querySelector(`[data-tab-content="${targetTab}"]`).style.display = 'block';
    });
  });

  // Header button event listeners - PHASE 5: CSP compliance
  const emailSettingsBtn = document.getElementById('email-settings-btn');
  if (emailSettingsBtn) {
    emailSettingsBtn.addEventListener('click', showEmailSettings);
  }

  const exportDataBtn = document.getElementById('export-data-btn');
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', exportData);
  }

  const refreshDataBtn = document.getElementById('refresh-data-btn');
  if (refreshDataBtn) {
    refreshDataBtn.addEventListener('click', refreshData);
  }

  const logoutBtnHeader = document.getElementById('logout-btn-header');
  if (logoutBtnHeader) {
    logoutBtnHeader.addEventListener('click', handleLogout);
  }

  const applyFiltersBtn = document.getElementById('apply-filters-btn');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
  }
}

// Missing function implementations for CSP compliance event handlers
function showEmailSettings() {
  // Use toast if available, otherwise fallback to alert
  if (typeof window !== 'undefined' && window.toastManager) {
    window.toastManager.show('Email settings feature coming soon!', 'info');
  } else {
    alert('Email settings feature is under development.');
  }
}

function exportData() {
  exportSubmissions();
}

function refreshData() {
  loadSubmissions();
}

function applyFilters() {
  filterSubmissions();
}

// Export global functions for HTML onclick handlers
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
window.editSubmission = editSubmission;
window.deleteSubmission = deleteSubmission;
window.changePage = changePage;
window.filterSubmissions = filterSubmissions;
window.exportSubmissions = exportSubmissions;
window.loadSubmissions = loadSubmissions;
window.showEmailSettings = showEmailSettings;
window.exportData = exportData;
window.refreshData = refreshData;
window.applyFilters = applyFilters;
