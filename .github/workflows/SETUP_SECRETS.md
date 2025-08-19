# GitHub Actions Secrets Setup for Hostinger Deployment

## Required GitHub Secrets

You need to add these secrets to your GitHub repository for the automated deployment to work.

### 1. Navigate to GitHub Secrets
1. Go to your repository: https://github.com/AmbitiousRealism2025/HydroCav_Landing
2. Click on **Settings** (in the repository, not your profile)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** for each secret below

### 2. FTP Credentials (Required)

Add these three FTP secrets:

#### `FTP_SERVER`
- **Name:** FTP_SERVER
- **Value:** Your Hostinger FTP hostname (usually something like: ftp.yourdomain.com or IP address)
- **Example:** `ftp.hydrocav.com` or `154.56.xxx.xxx`

#### `FTP_USERNAME`
- **Name:** FTP_USERNAME  
- **Value:** Your FTP username from Hostinger
- **Example:** `u123456789` (usually starts with 'u' followed by numbers)

#### `FTP_PASSWORD`
- **Name:** FTP_PASSWORD
- **Value:** Your FTP password from Hostinger
- **⚠️ Important:** This is your FTP password, not your Hostinger account password

### 3. Supabase Credentials (Required for Build)

Add these two Supabase secrets:

#### `SUPABASE_URL`
- **Name:** SUPABASE_URL
- **Value:** `https://icfombdnbaeckgivfkdw.supabase.co`

#### `SUPABASE_ANON_KEY`
- **Name:** SUPABASE_ANON_KEY
- **Value:** Your Supabase anon/public key
- **Current Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZm9tYmRuYmFlY2tnaXZma2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzA1MjIsImV4cCI6MjA3MDQwNjUyMn0.6E7SSsyQpmkpyiHQLLMzKSXL9S8bHMY4THeW_iiSFlw`

## Where to Find Your FTP Credentials in Hostinger

1. **Login to Hostinger** control panel
2. Navigate to **Files** → **FTP Accounts**
3. You'll see:
   - **FTP Hostname** (use this for FTP_SERVER)
   - **FTP Username** (use this for FTP_USERNAME)
   - **FTP Password** (click "Show" or reset if needed)

## Testing the Workflow

After adding all secrets:

1. **Manual Test:**
   - Go to the **Actions** tab in your GitHub repository
   - Click on "Deploy to Hostinger via FTP"
   - Click "Run workflow" → "Run workflow" (on main branch)
   - Watch the deployment progress

2. **Automatic Deployment:**
   - Every push to the `main` branch will trigger deployment
   - Check the Actions tab to monitor deployment status

## Troubleshooting

### If FTP connection fails:
- Verify FTP credentials in Hostinger panel
- Check if FTP server allows external connections
- Try using IP address instead of hostname
- Ensure no special characters in password that need escaping

### If build fails:
- Check Supabase credentials are correctly set
- Verify npm packages are up to date
- Check the Actions log for specific error messages

## Security Notes

- ✅ Secrets are encrypted and never exposed in logs
- ✅ Only repository administrators can view/edit secrets
- ✅ Secrets are not accessible in pull requests from forks
- ⚠️ Never commit credentials directly in code

## Success Indicators

When working correctly, you'll see:
- ✅ Green checkmark in Actions tab
- ✅ "Successfully deployed to Hostinger!" message
- ✅ Website updates live within 1-2 minutes of push
- ✅ All files in dist/ uploaded to public_html/

---

**Need Help?** Check the Actions tab for detailed logs of each deployment step.