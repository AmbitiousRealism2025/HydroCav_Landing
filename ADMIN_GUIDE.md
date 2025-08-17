# HydroCav Admin Dashboard Guide

## Quick Start

### Initial Setup
1. Navigate to `/admin.html`
2. Click "Sign Up" to create your admin account
3. Use a secure email and strong password
4. Login with your new credentials

### Dashboard Overview
The admin dashboard provides complete management of contact form submissions with real-time data and export capabilities.

## Features

### Submission Management
- **View All Submissions:** Complete list with timestamps and status
- **Status Updates:** Mark submissions as new/contacted/closed
- **Priority Levels:** Set high/medium/low priority for follow-up
- **Search & Filter:** Find specific submissions quickly
- **Export Data:** Download submissions as CSV files

### Authentication System
- **Secure Login:** Supabase Auth with email/password
- **Session Management:** Automatic logout for security
- **Row Level Security:** Database policies protect sensitive data

## Daily Operations

### Processing New Submissions
1. **Login** to admin dashboard
2. **Review** new submissions (marked with "new" status)
3. **Update Status** after contacting prospects:
   - `contacted` - Initial contact made
   - `in_progress` - Active discussion
   - `closed` - Completed/converted
4. **Set Priority** for follow-up timing
5. **Add Notes** for team coordination

### Data Export
1. Click **"Export CSV"** button
2. File downloads automatically
3. Open in Excel/Google Sheets for analysis
4. Data includes: Name, Email, Company, Message, Status, Timestamp

### Regular Maintenance
- **Daily:** Review new submissions
- **Weekly:** Update submission statuses
- **Monthly:** Export data for analysis
- **Quarterly:** Archive old submissions

## Security Guidelines

### Password Security
- Use minimum 12 characters
- Include uppercase, lowercase, numbers, symbols
- Don't reuse passwords from other accounts
- Change password every 90 days

### Access Control
- Only create accounts for authorized personnel
- Logout when finished each session
- Don't share login credentials
- Report suspicious activity immediately

### Data Protection
- Contact information is confidential business data
- Only export data for legitimate business purposes
- Store exported files securely
- Delete exported files after use

## Troubleshooting

### Login Issues
**Can't access admin dashboard:**
1. Verify correct URL: `/admin.html`
2. Check email/password combination
3. Ensure account was created successfully
4. Try different browser or clear cache

**"Invalid credentials" error:**
1. Use exact email address from registration
2. Check for typos in password
3. Use "Sign Up" if account doesn't exist
4. Contact technical support if issues persist

### Data Issues
**No submissions visible:**
1. Verify you're logged in successfully
2. Check if any submissions exist (test contact form)
3. Refresh page to reload data
4. Check browser console for errors

**Export not working:**
1. Ensure popup blockers are disabled
2. Check browser download settings
3. Try different browser
4. Contact technical support

### Performance Issues
**Dashboard loading slowly:**
1. Check internet connection
2. Clear browser cache
3. Close other browser tabs
4. Try incognito/private browsing mode

## Advanced Features

### Filtering Submissions
- **By Status:** View only new/contacted/closed submissions
- **By Date:** Filter submissions by date range
- **By Company:** Search for specific company inquiries
- **By Priority:** Focus on high-priority leads

### Bulk Operations
- **Status Updates:** Update multiple submissions at once
- **Priority Setting:** Set priority for multiple entries
- **Bulk Export:** Export filtered data sets

### Email Integration
*Note: Full email integration requires additional setup*
- Template responses for common inquiries
- Automated follow-up reminders
- Email tracking integration

## Database Management

### Backup Procedures
- Supabase automatically backs up data
- Manual export recommended weekly
- Store exports in secure location
- Test restore procedures quarterly

### Data Retention
- Keep active submissions indefinitely
- Archive closed submissions annually
- Export historical data before archiving
- Follow company data retention policies

## Team Coordination

### Multi-User Access
- Each team member needs individual account
- Use consistent status naming conventions
- Coordinate priority assignments
- Regular team meetings to review submissions

### Workflow Management
1. **New Submissions:** Assigned to team lead
2. **Initial Contact:** Sales team member assigned
3. **Follow-up:** Track in calendar system
4. **Conversion:** Update to closed status

### Reporting
- Weekly submission count reports
- Monthly conversion rate analysis
- Quarterly lead source evaluation
- Annual database health review

## API Access (Advanced)

### Direct Database Access
- Supabase provides SQL editor access
- Use for complex queries and reports
- Requires technical knowledge
- Follow security best practices

### Integration Options
- CRM system integration possible
- API keys available in Supabase dashboard
- Custom integrations require development
- Contact technical team for setup

## Support & Resources

### Technical Support
- **Database Issues:** Supabase dashboard tools
- **Application Bugs:** Check browser console
- **Access Problems:** Verify authentication status
- **Performance Issues:** Test different browsers

### Documentation
- **User Guide:** Complete website usage instructions
- **Deployment Checklist:** Technical deployment guidance
- **CLAUDE.md:** Technical development documentation

### Emergency Procedures
- **System Down:** Check Supabase status page
- **Data Loss:** Contact technical support immediately
- **Security Breach:** Change passwords, review access logs
- **Critical Bug:** Document error and contact support

---

**Dashboard URL:** `/admin.html`
**Database:** Supabase Project `icfombdnbaeckgivfkdw`
**Support:** Contact technical team for advanced features
**Last Updated:** Production Deployment Ready