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

### Phase III: UI/UX Polish & Feature Enhancement (PLANNED)
**Priority Features for Phase III:**
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

### Workflow Guidelines

**Specialized Agent Utilization (MANDATORY):**
- ALWAYS use specialized subagents for complex tasks when available
- Use TodoWrite tool for multi-step tasks to coordinate agent work
- Launch multiple agents concurrently when possible for optimal performance
- Each agent invocation should have detailed, autonomous task descriptions

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
- **CRITICAL:** Maintain liquid glass aesthetic in ALL UI changes - testimonials disabled due to style mismatch
- Preserve enhanced form validation and accessibility features from Phase 2A
- Follow existing code style (no build process, CDN resources)
- Test all changes across mobile/desktop breakpoints  
- Ensure accessibility standards are maintained (WCAG 2.1 AA compliance)
- Respect auto-fade validation timing (4 seconds) and user motion preferences
- Maintain toast notification system consistency
- **Note:** Testimonials section commented out in index.html - backend structure preserved for Phase III

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