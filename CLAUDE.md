# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HydroCav is a premium B2B water treatment company website showcasing advanced hydrodynamic cavitation technology. The site uses a liquid glass design aesthetic with glassmorphism effects throughout.

## Technology Stack

- **Frontend:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Backend:** Supabase (PostgreSQL) with Row Level Security
- **Styling:** Liquid glass design system with glassmorphism effects
- **Assets:** Separated CSS (`assets/css/style.css`) and JS (`assets/js/main.js`)
- **Architecture:** Single-page application with responsive design

## Key Commands

### Development
- **Preview:** Open `index.html` directly in browser (no build process required)
- **Database:** Supabase project at https://supabase.com/dashboard/project/icfombdnbaeckgivfkdw
- **Setup Script:** Run `supabase_setup.sql` if database needs recreation
- **Linting:** No linting configuration currently set up
- **Testing:** Contact form tested and operational

### Git Workflow
- **Main branch:** `main` (production)
- **Current branch:** `backend` (development)
- **Commit style:** Conventional commits with detailed descriptions

## Code Architecture

### File Structure
```
HYDROCAV_Website/
├── index.html                              # Main website with Supabase integration
├── assets/
│   ├── css/
│   │   └── style.css                      # Custom styles (glassmorphism, animations)
│   ├── js/
│   │   └── main.js                        # Bubble animations, interactions
│   └── images/
│       └── HydroCav_Logo.PNG              # Company logo
├── supabase_setup.sql                     # Database schema and setup
├── SUPABASE_SETUP_GUIDE.md                # Comprehensive setup guide
├── phase2_backend_implementation_plan.md   # Phase 2 enhancement plan
└── *.md                                   # Documentation files
```

### Design System

**Liquid Glass Components:**
- `.liquid-glass-card` - Main card styling with backdrop blur
- `.liquid-glass-button` - Interactive buttons with glassmorphism
- `.menu-link` - Navigation items with glass effect
- `.bubble` animations - Ambient bubble effects (30 per section)

**Color Palette:**
- Primary: `#319be0` (interactive elements)
- Secondary: `#6bafdc` (section backgrounds)
- Glass effects: `rgba()` with backdrop-filter

### Key Patterns

1. **Bubble Animations:** Created via `main.js` using `createBubbles()` function
2. **Contact Form:** Integrated with Supabase using `handleContactSubmission()` function
3. **Responsive Design:** Tailwind breakpoints (sm, md, lg)
4. **Accessibility:** 48px touch targets, focus states, semantic HTML
5. **Performance:** CDN resources, GPU-accelerated animations

## Backend Integration Status

### Phase 1: Backend Integration ✅ COMPLETED
- **Technology:** Supabase PostgreSQL database
- **Project URL:** https://icfombdnbaeckgivfkdw.supabase.co
- **Database:** `contact_submissions` table with Row Level Security
- **Features:** Contact form submission, validation, user feedback
- **Security:** Anonymous insert-only access, rate limiting ready

### Phase 2A: UX & Accessibility Enhancements ✅ COMPLETED
- **Real-time Validation:** Auto-fade error messages (4-second timeout)
- **Character Counters:** Live feedback for name (100), company (100), message (2000)
- **Loading States:** Spinner animations with "Sending..." feedback
- **Success Animations:** Checkmark feedback with automatic form reset
- **Toast Notifications:** Elegant slide-in system with auto-dismiss
- **WCAG 2.1 AA Compliance:** Skip links, ARIA labels, focus indicators
- **Reduced Motion Support:** Respects user motion preferences
- **Enhanced Accessibility:** Screen reader compatibility, keyboard navigation

### Phase 2B: Backend Enhancements ✅ COMPLETED
- **Admin Dashboard:** Complete submission management interface with Supabase authentication system
- **Authentication System:** Login/signup modal, session management, authenticated RLS policies
- **Data Management:** Full CRUD operations for submissions with status/priority updates
- **Email System:** Automated notifications, auto-responses, and template management
- **Data Export:** CSV export functionality with filtering support
- **Business Features Database:** Complete backend structure for testimonials, case studies, newsletter
- **Security:** Row Level Security policies requiring authentication for admin access

### Phase 2B: Frontend Features Status
- **✅ Contact Form:** Enhanced with validation, accessibility, and backend integration
- **✅ Admin Dashboard:** Full authentication and submission management
- **⚠️ Testimonials Section:** Disabled - does not match liquid glass design aesthetic
- **📋 Phase III:** Testimonials moved to UI/UX Polish & Feature Enhancement phase

### Phase III: Security Framework Implementation ✅ COMPLETED
**Security Integration Completed:**
- **✅ Security Module Architecture:** Complete security module system with XSS, CSRF, and centralized logging
- **✅ Contact Form Security:** Integrated XSS protection and CSRF validation with form submission workflow
- **✅ Admin Dashboard Security:** Full security integration for authentication, data management, and admin operations
- **✅ Jest Testing Framework:** 72 comprehensive test cases covering security, integration, and functionality testing
- **✅ TDD Methodology:** Complete Test-Driven Development framework established for all future development

**Security Modules Implemented:**
```
assets/js/
├── secure-config.js        # Centralized security configuration
├── xss-protection.js       # XSS input sanitization and validation  
├── csrf-protection.js      # CSRF token generation and validation
└── security.js            # Security event logging and monitoring
```

**Security Features Active:**
- **XSS Protection:** All user inputs sanitized before processing
- **CSRF Protection:** Token validation for all form submissions
- **Security Logging:** Comprehensive event tracking for all security-related actions
- **Input Validation:** Multi-layer validation (client + server + security modules)
- **Admin Security:** Enhanced authentication workflows with security monitoring

### Phase IV: UI/UX Polish & Feature Enhancement (NEXT)
**Priority Features for Phase IV:**
- **Security Testing Validation:** Execute comprehensive security test suite and achieve 80% coverage target
- **Testimonials Section Redesign:** Implement testimonials with proper liquid glass design aesthetic
  - Issue: Current implementation uses non-matching card styles and color schemes
  - Solution: Redesign with consistent glassmorphism effects, proper backdrop-blur, and liquid glass cards
  - Backend: Database structure already exists and functional via admin dashboard
  - Frontend: Complete redesign needed for visual consistency
- **Case Studies Enhancement:** Polish case studies preview with liquid glass styling
- **Newsletter Integration:** Enhance newsletter signup to match overall design system
- **Mobile Experience:** Optimize testimonials for mobile liquid glass responsiveness
- **Animation Consistency:** Ensure bubble animations and transitions match main site

## Important Notes

### 🧪 **TEST-DRIVEN DEVELOPMENT (TDD) METHODOLOGY - MANDATORY FOR ALL DEVELOPMENT**

**⚠️ CRITICAL:** ALL new code development MUST follow Test-Driven Development principles. This is a non-negotiable requirement for maintaining code quality, security, and reliability.

📋 **Quick Reference:** See `TDD_QUICK_REFERENCE.md` for streamlined TDD workflow guide

#### **TDD Protocol (RED-GREEN-REFACTOR)**

**1. 🔴 RED Phase - Write Failing Tests First**
```bash
# ALWAYS start with failing tests
npm test -- --watch  # Run tests in watch mode during development
```
- Write test cases BEFORE implementing any functionality
- Tests should describe the expected behavior clearly
- Ensure tests fail initially (Red phase)
- Use the comprehensive test suite in `/tests/` directory

**2. 🟢 GREEN Phase - Write Minimal Code to Pass**
- Implement only the minimum code needed to make tests pass
- Focus on functionality, not optimization
- Ensure ALL tests pass before proceeding

**3. 🔄 REFACTOR Phase - Improve Code Quality**
- Refactor code while keeping tests green
- Improve performance, readability, maintainability
- Run tests continuously during refactoring

#### **Jest Testing Framework - FULLY CONFIGURED ✅**

**Test Structure:**
```
tests/
├── setup.js                    # Global test configuration
├── unit/                       # Unit tests for individual modules
├── integration/                # Integration tests for workflows
├── security/                   # Security vulnerability tests
└── e2e/                       # End-to-end tests (planned)
```

**Available Test Commands:**
```bash
npm test                        # Run all tests
npm run test:watch             # Watch mode for active development  
npm run test:coverage          # Generate coverage reports
```

**Coverage Requirements:**
- **Minimum Coverage:** 80% for statements, branches, functions, lines
- **Security Tests:** Mandatory for all user-facing functionality
- **Integration Tests:** Required for form submissions, API calls
- **Performance Tests:** Required for animations, large data processing

#### **TDD Implementation Rules**

**🚨 MANDATORY RULES:**

1. **No Code Without Tests:** Never write production code without corresponding tests
2. **Test First:** Always write tests before implementation
3. **Security Focus:** Every user input must have XSS/CSRF protection tests
4. **Performance Validation:** Test performance requirements (e.g., <100ms response times)
5. **Accessibility Testing:** Validate WCAG 2.1 AA compliance in tests

**Test Categories Required:**
- ✅ **Unit Tests:** Individual function/module testing
- ✅ **Integration Tests:** Component workflow testing
- ✅ **Security Tests:** XSS, CSRF, input validation testing
- ✅ **Performance Tests:** Timing and memory usage validation
- ✅ **Accessibility Tests:** ARIA, focus management, screen reader testing

#### **Security Testing Requirements**

**🔒 Every feature MUST include:**
- XSS protection validation tests
- CSRF token validation tests  
- Input sanitization verification
- Authentication/authorization testing (where applicable)
- Error handling and edge case testing

**Example Test Pattern:**
```javascript
describe('Feature Implementation', () => {
  describe('Security', () => {
    test('should validate CSRF token');
    test('should sanitize XSS attempts'); 
    test('should handle authentication');
  });
  
  describe('Functionality', () => {
    test('should perform core function');
    test('should handle edge cases');
  });
  
  describe('Performance', () => {
    test('should complete within time limits');
  });
});
```

#### **Test-First Development Workflow**

**For ANY new feature/fix:**

1. **📝 Write Test Cases** (`testbot-beta` agent)
   - Unit tests for individual functions
   - Integration tests for user workflows
   - Security tests for vulnerability prevention
   - Performance tests for timing requirements

2. **🔴 Verify Tests Fail** (`validator` agent)
   - Run tests to ensure they fail initially
   - Confirm test coverage is comprehensive

3. **⚡ Implement Code** (`codebot-alpha` agent)
   - Write minimal code to make tests pass
   - Focus on functionality first, optimization later

4. **🟢 Validate All Tests Pass** (`validator` agent)
   - Ensure 100% test pass rate
   - Verify coverage thresholds are met

5. **🔄 Refactor & Optimize** (`codemaster-alpha` agent)
   - Improve code quality while keeping tests green
   - Optimize performance if needed

6. **📚 Document Changes** (`scribe` agent)
   - Update documentation with new functionality
   - Include test coverage metrics

#### **Specialized Agent TDD Integration**

**Enhanced Task-Agent Mapping with TDD:**
- **`testbot-beta`**: Write ALL tests before implementation begins
- **`codebot-alpha`**: Implement code to satisfy failing tests
- **`validator`**: Validate tests pass and verify implementation
- **`codemaster-alpha`**: Refactor and optimize while maintaining green tests
- **`design-reviewer`**: Review UI/UX changes with accessibility testing
- **`nexus`**: Coordinate TDD workflow across multiple agents
- **`scribe`**: Document TDD process and test coverage results

#### **TDD Quality Gates**

**🚪 No code progression without:**
- ✅ All tests passing (100% pass rate)
- ✅ Coverage thresholds met (≥80%)
- ✅ Security tests included and passing
- ✅ Performance benchmarks satisfied
- ✅ Accessibility tests validated

**Failure Response Protocol:**
- 🔴 **Red State:** Continue development until tests pass
- 🚫 **Coverage Below 80%:** Add tests before proceeding  
- ⚠️ **Security Test Failure:** STOP - fix security issues immediately
- 🐌 **Performance Test Failure:** Optimize before feature completion

### Workflow Guidelines

**Specialized Agent Utilization (MANDATORY):**
- ALWAYS use specialized subagents for complex tasks when available
- Use TodoWrite tool for multi-step tasks to coordinate agent work
- Launch multiple agents concurrently when possible for optimal performance
- Each agent invocation should have detailed, autonomous task descriptions
- **NEW:** Always include TDD workflow in agent task descriptions

**Task-Agent Mapping:**
- **`scribe`**: Documentation creation/updates, README files, API guides, troubleshooting docs
- **`codebot-alpha`**: Core application logic, architecture setup, foundational coding tasks
- **`validator`**: Testing execution, exploratory testing, feature verification, debugging
- **`testbot-beta`**: Automated testing framework, integration tests, E2E tests
- **`design-reviewer`**: UI/UX analysis, visual component review, accessibility audits
- **`codemaster-alpha`**: Complex architectural review, advanced software engineering
- **`nexus`**: Task coordination, dependency management, project status monitoring
- **`general-purpose`**: Research, file searching, keyword searches, complex multi-step tasks

**Multi-Agent Coordination Examples:**
- Database issues: `validator` → `codebot-alpha` → `scribe`
- New features: `nexus` → `codebot-alpha` + `design-reviewer` → `testbot-beta` → `scribe`
- Complex debugging: `general-purpose` → `validator` → `codemaster-alpha` → `scribe`

**Direct Implementation Exceptions (use sparingly):**
- Single-line fixes or trivial changes
- Immediate emergency hotfixes
- Simple configuration updates

### Development Guidelines

#### **Security-First Development (MANDATORY)**
- **🔒 CRITICAL:** ALL user inputs MUST use security modules for XSS protection
- **🛡️ CSRF Protection:** ALL form submissions require CSRF token validation  
- **📊 Security Logging:** ALL security events must be logged via SecurityManager
- **🧪 Security Testing:** Every security feature requires corresponding test coverage
- **⚠️ Input Validation:** Multi-layer validation (XSS → CSRF → Database) for all user data
- **🔐 Authentication:** Admin functions require proper authentication and security monitoring

**Security Module Integration Pattern:**
```javascript
// 1. CSRF Validation (always first)
if (!window.CSRFProtection?.validateToken()) {
    window.SecurityManager?.logSecurityEvent('csrf_validation_failed', {...});
    return; // Stop processing
}

// 2. XSS Sanitization  
const sanitizedData = window.XSSProtection?.sanitizeInput(userData) || userData;

// 3. Security Event Logging
window.SecurityManager?.logSecurityEvent('action_completed', {...});
```

#### **Design & Accessibility Guidelines**
- **CRITICAL:** Maintain liquid glass aesthetic in ALL UI changes - testimonials disabled due to style mismatch
- Preserve enhanced form validation and accessibility features from Phase 2A
- Follow existing code style (no build process, CDN resources)
- Test all changes across mobile/desktop breakpoints  
- Ensure accessibility standards are maintained (WCAG 2.1 AA compliance)
- Respect auto-fade validation timing (4 seconds) and user motion preferences
- Maintain toast notification system consistency
- **Note:** Testimonials section commented out in index.html - backend structure preserved for Phase IV

### Supabase Configuration
- **Project ID:** icfombdnbaeckgivfkdw
- **Database Schema:** Use `supabase_setup.sql` for recreation
- **Contact Form Handler:** `handleContactSubmission()` function in index.html
- **Admin Dashboard:** Located at `admin.html` with full authentication system
- **Authentication:** Supabase Auth with email/password, RLS policies enforce access control
- **Security:** Anonymous users can insert contact forms, authenticated users have full admin access
- **Form Validation:** Client-side validation before database submission

### Admin Dashboard Usage
- **Access:** Navigate to `admin.html` → create account via "Sign Up" → login with credentials
- **Features:** View/edit submissions, export CSV, manage email settings, status tracking
- **Authentication:** Uses Supabase Auth - separate from Supabase dashboard credentials
- **Data Security:** RLS policies require authentication for viewing/editing submission data
- **Required SQL:** Ensure "Allow admin full access" policy is active for authenticated users

### Troubleshooting
- If contact form fails, check Supabase project status
- If admin dashboard shows "Error loading submissions," verify RLS policies are applied
- For "Invalid API key" error, ensure API key matches between index.html and admin.html
- Use browser DevTools Console to debug JavaScript errors
- Verify RLS policies are active in Supabase dashboard
- Check database connection with simple SELECT query in SQL Editor