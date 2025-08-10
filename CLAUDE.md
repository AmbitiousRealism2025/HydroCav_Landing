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

### Phase 2: Planned Enhancements
- **Admin Dashboard:** Submission management interface
- **Email System:** Automated notifications and auto-responses
- **Enhanced Security:** Rate limiting, CAPTCHA integration
- **Data Export:** CSV/Excel export functionality
- **Business Features:** Testimonials, case studies, newsletter
- **Timeline:** 12-week implementation (see `phase2_backend_implementation_plan.md`)

## Important Notes

### Development Guidelines
- Maintain liquid glass aesthetic in all UI changes
- Preserve single-file architecture unless expanding to multi-page
- Follow existing code style (no build process, CDN resources)
- Test all changes across mobile/desktop breakpoints
- Ensure accessibility standards are maintained (WCAG compliance)

### Supabase Configuration
- **Project ID:** icfombdnbaeckgivfkdw
- **Database Schema:** Use `supabase_setup.sql` for recreation
- **Contact Form Handler:** `handleContactSubmission()` function in index.html
- **Security:** RLS policies active - anonymous users can insert but not read
- **Form Validation:** Client-side validation before database submission

### Troubleshooting
- If contact form fails, check Supabase project status
- Use browser DevTools Console to debug JavaScript errors
- Verify RLS policies are active in Supabase dashboard
- Check database connection with simple SELECT query in SQL Editor