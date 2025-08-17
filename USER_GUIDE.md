# HydroCav Website User Guide

## Overview

HydroCav is a professional B2B water treatment website featuring advanced hydrodynamic cavitation technology. This guide covers how to use and maintain the website in production.

## Website Features

### Main Website (index.html)
- **Professional Landing Page** with liquid glass design
- **Contact Form** with real-time validation and Supabase backend
- **Responsive Design** optimized for all devices
- **Accessibility Compliant** (WCAG 2.1 AA standards)
- **Security Features** with XSS/CSRF protection
- **Performance Monitoring** with Core Web Vitals tracking

### Admin Dashboard (admin.html)
- **Submission Management** for contact form entries
- **User Authentication** via Supabase Auth
- **Data Export** (CSV format)
- **Status Tracking** for leads and inquiries

### HydroLoop Product Page (hydroloop.html)
- **Dedicated Product Showcase** for HydroLoop technology
- **Consistent Design Language** with main site
- **Mobile-Optimized** layout

## Using the Website

### Contact Form
1. **Fill Required Fields:**
   - Full Name (2-100 characters)
   - Email Address (valid format required)
   - Company Name (optional, max 100 characters)
   - Message (10-2000 characters)

2. **Real-time Validation:**
   - Character counters show usage
   - Errors auto-fade after 4 seconds
   - Form prevents submission with invalid data

3. **Submission Process:**
   - Loading spinner appears during submission
   - Success animation confirms submission
   - Form automatically resets after success

### Admin Dashboard Access

#### First-Time Setup
1. Navigate to `your-domain.com/admin.html`
2. Click "Sign Up" to create admin account
3. Use email/password to register
4. Login with your credentials

#### Daily Operations
1. **View Submissions:** All contact form entries display in table
2. **Update Status:** Change submission status (new/contacted/closed)
3. **Export Data:** Download submissions as CSV file
4. **Search/Filter:** Find specific submissions quickly

## Maintenance

### Regular Tasks (Weekly)
- [ ] Check contact form functionality
- [ ] Review submission data in admin dashboard
- [ ] Monitor website performance via browser dev tools
- [ ] Verify SSL certificate status

### Monthly Tasks
- [ ] Review error logs (browser console)
- [ ] Check Supabase database usage
- [ ] Test admin dashboard authentication
- [ ] Verify mobile responsiveness

### Quarterly Tasks
- [ ] Update Supabase API keys if needed
- [ ] Review and archive old submissions
- [ ] Performance audit with Lighthouse
- [ ] Security review of admin access

## Troubleshooting

### Contact Form Issues
**Problem:** Form submission fails
- **Check:** Supabase project status at https://supabase.com/dashboard
- **Verify:** Internet connection is stable
- **Solution:** Contact technical support if issue persists

**Problem:** Validation errors won't clear
- **Solution:** Refresh the page and try again
- **Check:** JavaScript is enabled in browser

### Admin Dashboard Issues
**Problem:** Can't login to admin dashboard
- **Check:** Email/password combination is correct
- **Verify:** Account was created successfully
- **Solution:** Use "Sign Up" if account doesn't exist

**Problem:** No submissions showing
- **Check:** RLS policies are active in Supabase
- **Verify:** User is authenticated
- **Solution:** Logout and login again

### Performance Issues
**Problem:** Slow page loading
- **Check:** Internet connection speed
- **Verify:** CDN resources are loading (Tailwind CSS, Google Fonts)
- **Solution:** Clear browser cache and refresh

### Mobile Issues
**Problem:** Layout broken on mobile
- **Check:** Viewport meta tag is present
- **Verify:** Browser is up to date
- **Solution:** Try different mobile browser

## Security Features

### Automatic Protection
- **XSS Protection:** All user inputs are sanitized
- **CSRF Protection:** Forms include security tokens
- **Rate Limiting:** Prevents spam submissions
- **Input Validation:** Multi-layer validation system

### Admin Security
- **Authentication Required:** Admin functions require login
- **Row Level Security:** Database policies protect data
- **Session Management:** Automatic logout for security

## Monitoring & Alerts

### Automatic Monitoring
The website includes comprehensive monitoring:
- **Error Tracking:** JavaScript errors logged automatically
- **Performance Monitoring:** Core Web Vitals tracked
- **Health Monitoring:** Uptime and response time tracking
- **Alert System:** Automatic notifications for issues

### Viewing Monitoring Data
1. Open browser developer tools (F12)
2. Check console for monitoring messages
3. Look for alerts in localStorage: `monitoring_alerts`

## Support

### Technical Issues
- **Database Issues:** Check Supabase dashboard
- **Hosting Issues:** Contact hosting provider
- **Code Issues:** Refer to CLAUDE.md for technical guidance

### Content Updates
- **Text Changes:** Edit index.html directly
- **Images:** Replace files in assets/images/
- **Styling:** Modify assets/css/style.css

### Contact Information
- **Supabase Project:** https://supabase.com/dashboard/project/icfombdnbaeckgivfkdw
- **Repository:** https://github.com/AmbitiousRealism2025/HydroCav_Landing

## Best Practices

### Content Management
- Always test changes on a staging environment first
- Keep regular backups of database content
- Monitor form submissions regularly for business leads

### Performance
- Optimize images before uploading
- Minimize custom CSS/JavaScript additions
- Test on multiple devices and browsers

### Security
- Never share admin credentials
- Use strong passwords for admin accounts
- Monitor for unusual submission patterns

### SEO & Analytics
- Keep meta descriptions updated
- Monitor page load speeds
- Track conversion rates from contact form

---

**Last Updated:** Production Deployment Ready
**Version:** 2.1.0
**Support:** Refer to DEPLOYMENT_CHECKLIST.md for technical deployment guidance