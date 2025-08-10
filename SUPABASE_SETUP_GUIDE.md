# Supabase Setup Guide for HydroCav Website

**Purpose:** Step-by-step guide to create and configure Supabase for the HydroCav contact form backend.  
**Time Required:** ~30 minutes  
**Cost:** Free (Supabase free tier)

---

## 📋 Prerequisites

- Email address or GitHub account for signup
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Access to the `supabase_setup.sql` file (already created in your project)

---

## 🚀 Part 1: Account Creation

### Step 1: Navigate to Supabase

1. Open your browser and go to: **https://supabase.com**
2. Click the **"Start your project"** button (top right)

### Step 2: Create Your Account

**Option A: GitHub Sign-up (Recommended)**
- Click **"Continue with GitHub"**
- Authorize Supabase to access your GitHub account
- Complete any additional profile information

**Option B: Email Sign-up**
- Click **"Continue with Email"**
- Enter your email address
- Create a strong password
- Verify your email (check inbox for verification link)

### Step 3: Complete Profile (if prompted)

- **First Name:** Your name
- **Company:** HydroCav (or your company name)
- **Role:** Developer/Owner (select appropriate)

---

## 🏗️ Part 2: Project Creation

### Step 1: Create New Organization (First Time Only)

If this is your first project:
1. Click **"Create new organization"**
2. **Organization Name:** Your company/personal name
3. **Plan:** Free (pre-selected)
4. Click **"Create organization"**

### Step 2: Create Your Project

1. Click **"New project"** button
2. Fill in project details:

   **Project Settings:**
   - **Name:** `hydrocav-landing`
   - **Database Password:** 
     - Click **"Generate a password"** button
     - **IMPORTANT:** Copy and save this password securely!
     - You'll need it for direct database access later
   - **Region:** Select closest to your users
     - US West (Oregon) - for West Coast US
     - US East (N. Virginia) - for East Coast US
     - Europe (Frankfurt) - for European users
     - Asia (Singapore) - for Asian users
   - **Pricing Plan:** Free (should be pre-selected)

3. Click **"Create new project"**

### Step 3: Wait for Project Provisioning

- A loading screen will appear with "Setting up your project..."
- This typically takes **1-2 minutes**
- You'll see fun facts about Supabase while waiting
- Once complete, you'll be redirected to your project dashboard

---

## 🔑 Part 3: Collect API Credentials

### Step 1: Navigate to API Settings

1. In your project dashboard, look at the left sidebar
2. Click **Settings** (gear icon at bottom)
3. Click **API** in the settings submenu

### Step 2: Copy Your Credentials

You'll see several values. Copy these two:

1. **Project URL:**
   - Label: "Project URL"
   - Format: `https://xxxxxxxxxxxxxx.supabase.co`
   - This is your project's unique endpoint

2. **Anon/Public Key:**
   - Label: "anon public"
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)
   - This is safe to use in frontend code

**Save these in a temporary text file like this:**
```
SUPABASE PROJECT CREDENTIALS
============================
Project URL: https://your-project-id.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Part 4: Database Setup

### Step 1: Open SQL Editor

1. In the left sidebar, click **SQL Editor**
2. You'll see a code editor interface

### Step 2: Create New Query

1. Click **"New query"** button (+ icon)
2. Optional: Name your query "Contact Form Setup"

### Step 3: Run Database Setup

1. Open the file `supabase_setup.sql` from your project
2. Copy ALL the contents
3. Paste into the SQL Editor
4. Click **"Run"** button (or press `Cmd+Enter` on Mac, `Ctrl+Enter` on Windows)

### Step 4: Verify Success

**Expected Result:**
- Message: "Success. No rows returned" (or similar)
- The last query should show a table with columns like:
  - `column_name`: id, name, email, company, message, etc.
  - `data_type`: uuid, text, timestamptz, etc.

**If you see errors:**
- Check that you copied the entire SQL file
- Make sure you're in the SQL Editor tab
- Try running the commands in smaller chunks

---

## ✅ Part 5: Verification

### Step 1: Check Table Creation

1. Click **Table Editor** in the left sidebar
2. You should see `contact_submissions` in the tables list
3. Click on it to view the table structure

### Step 2: Verify Security

1. Click **Authentication** in the left sidebar
2. Click **Policies** tab
3. You should see two policies:
   - "Allow anonymous contact submissions"
   - "Allow admin full access"

### Step 3: Test RLS is Working

1. Go back to **SQL Editor**
2. Run this query:
   ```sql
   SELECT * FROM contact_submissions;
   ```
3. **Expected:** You should get an error or empty result
4. This confirms Row Level Security is active ✅

---

## 📝 Part 6: Save Your Credentials

Create a file called `supabase_credentials.txt` (keep this private!):

```
SUPABASE CREDENTIALS - HYDROCAV PROJECT
========================================
Date Created: [Today's Date]
Project Name: hydrocav-landing

PUBLIC CREDENTIALS (Safe for Frontend):
----------------------------------------
Project URL: [Your Project URL]
Anon Key: [Your Anon Key]

PRIVATE CREDENTIALS (Keep Secret):
-----------------------------------
Database Password: [Your Database Password]

Dashboard URL: https://app.supabase.com/project/[your-project-id]

NOTES:
------
- Anon key is safe to use in frontend JavaScript
- Database password is for direct database access only
- Never commit this file to Git
```

---

## 🎯 Next Steps

Once you've completed all steps above:

1. **Share with Claude Code:**
   - Provide your Project URL
   - Provide your Anon Key
   - These will be added to your `index.html`

2. **Frontend Integration:**
   - Claude Code will implement the JavaScript code
   - Add form submission handlers
   - Test the complete integration

3. **Testing:**
   - Submit test messages through your form
   - View submissions in Supabase dashboard
   - Verify rate limiting works

---

## 🆘 Troubleshooting

### Can't create account?
- Try using a different browser
- Clear cookies and cache
- Use alternative sign-up method (GitHub vs Email)

### Project creation fails?
- Try a different region
- Ensure project name has no special characters
- Refresh and try again

### SQL commands fail?
- Run commands in smaller batches
- Check for copy/paste errors
- Ensure you're in SQL Editor, not Query Builder

### Can't find API keys?
- Settings → API (in left sidebar)
- Look for "anon public" key
- Project URL is at the top of the API page

---

## 📚 Additional Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Supabase Dashboard:** https://app.supabase.com
- **Support:** https://supabase.com/support

---

## ✨ Success Checklist

Before proceeding to frontend integration, verify:

- [ ] Supabase account created
- [ ] Project "hydrocav-landing" created
- [ ] Project URL copied and saved
- [ ] Anon Key copied and saved
- [ ] Database password saved securely
- [ ] SQL setup script executed successfully
- [ ] Table `contact_submissions` visible in Table Editor
- [ ] RLS policies visible in Authentication → Policies

---

*Guide prepared for HydroCav Website Backend Implementation*  
*Last Updated: August 2025*