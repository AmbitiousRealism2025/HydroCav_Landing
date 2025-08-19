# GoDaddy Domain to Hostinger Hosting Setup Guide

**Purpose:** Connect your GoDaddy domain to your Hostinger hosting account  
**Current Status:** Website working on temporary URL (seashell-buffalo-751535.hostingersite.com)  
**Goal:** Connect to your business domain for professional appearance  

## 📋 **Pre-Setup Information Gathering**

### **Information You'll Need:**

#### **From GoDaddy:**
- [ ] **Domain Name:** Your registered domain (e.g., hydrocav.com)
- [ ] **GoDaddy Account Access:** Login credentials for domain management
- [ ] **DNS Management Access:** Ability to modify DNS settings

#### **From Hostinger:**
- [ ] **Hostinger Account Access:** Login to your hosting control panel
- [ ] **Name Servers:** Hostinger's name servers for your account
- [ ] **Current Hosting Plan:** Confirm it supports custom domains

#### **Current Website Info:**
- [ ] **Temporary URL:** seashell-buffalo-751535.hostingersite.com
- [ ] **Website Files:** Already uploaded and working perfectly
- [ ] **Database:** Supabase integration working correctly

## 🎯 **Connection Methods Overview**

There are **two main approaches** to connect your domain:

### **Method 1: Change Name Servers (RECOMMENDED)**
- **Pros:** Complete control, all DNS managed at Hostinger, easier long-term management
- **Cons:** All DNS records move to Hostinger (email, subdomains, etc.)
- **Best For:** Full website hosting with Hostinger as primary DNS

### **Method 2: Update DNS Records Only**
- **Pros:** Keep GoDaddy as DNS manager, selective record updates
- **Cons:** More complex setup, manage DNS in two places
- **Best For:** If you have existing email or other services on GoDaddy DNS

## 📖 **Step-by-Step Setup Guide**

---

## **METHOD 1: Change Name Servers (Recommended)**

### **Step 1: Get Hostinger Name Servers**
1. **Login to Hostinger Control Panel**
   - Go to https://hpanel.hostinger.com
   - Login with your Hostinger credentials

2. **Navigate to Domains**
   - Look for "Domains" in the main dashboard
   - Click on your hosting account/domain section

3. **Find Name Servers**
   - Look for "Name Servers" or "DNS Zone"
   - Copy the Hostinger name servers (usually look like):
     - `ns1.dns-parking.com`
     - `ns2.dns-parking.com`
   - **WRITE THESE DOWN** - you'll need them for GoDaddy

### **Step 2: Add Domain to Hostinger**
1. **In Hostinger Control Panel**
   - Look for "Add Domain" or "Manage Domains"
   - Click "Add New Domain"

2. **Enter Your Domain**
   - Type your GoDaddy domain name (e.g., hydrocav.com)
   - Select "Use as primary domain" if this will be your main site
   - Click "Add Domain"

3. **Configure Domain Settings**
   - Point domain to your existing website files
   - Ensure it points to the same directory as your temporary URL

### **Step 3: Change Name Servers in GoDaddy**
1. **Login to GoDaddy Account**
   - Go to https://godaddy.com
   - Sign in to your account

2. **Access Domain Management**
   - Go to "My Products" or "Domain Manager"
   - Find your domain and click "Manage" or "DNS"

3. **Change Name Servers**
   - Look for "Name Servers" or "Nameservers" section
   - Select "Custom" or "I'll use my own nameservers"
   - **Replace GoDaddy name servers with Hostinger's:**
     - Remove existing GoDaddy name servers
     - Add the Hostinger name servers you copied in Step 1
   - **Save Changes**

### **Step 4: Wait for Propagation**
- **Propagation Time:** 24-48 hours (sometimes faster)
- **Check Progress:** Use online DNS checker tools
- **Test Access:** Try accessing your domain periodically

---

## **METHOD 2: Update DNS Records Only**

### **Step 1: Get Hostinger Server Info**
1. **In Hostinger Control Panel**
   - Find your hosting account details
   - Look for "Server Information" or "Account Details"
   - Copy the **IP Address** of your hosting server

### **Step 2: Update A Records in GoDaddy**
1. **In GoDaddy DNS Management**
   - Go to DNS settings for your domain
   - Look for "A Records" section

2. **Update Main Domain (A Record)**
   - **Type:** A
   - **Name:** @ (this represents your main domain)
   - **Value:** Hostinger server IP address
   - **TTL:** 1 hour (3600 seconds)

3. **Update WWW Subdomain (A Record)**
   - **Type:** A  
   - **Name:** www
   - **Value:** Hostinger server IP address
   - **TTL:** 1 hour (3600 seconds)

### **Step 3: Add Domain in Hostinger**
1. **Follow Steps 2 from Method 1**
   - Add your domain to Hostinger hosting account
   - Configure to point to your website files

---

## 🔍 **Verification & Testing**

### **DNS Propagation Checking**
Use these tools to check if changes have propagated:
- **WhatsMyDNS.net:** https://www.whatsmydns.net
- **DNS Checker:** https://dnschecker.org
- **Command Line:** `nslookup yourdomain.com`

### **Website Testing Checklist**
Once your domain is connected:
- [ ] **Main Domain:** yourdomain.com loads your website
- [ ] **WWW Subdomain:** www.yourdomain.com also works  
- [ ] **HTTPS/SSL:** Secure connection working
- [ ] **Contact Form:** Still submitting to Supabase correctly
- [ ] **Admin Access:** Footer logo click still works for admin.html
- [ ] **All Features:** Liquid glass effects and animations working

## ⚠️ **Important Considerations**

### **SSL Certificate**
- **Hostinger:** Usually provides free SSL certificates
- **Setup:** May need to enable SSL for your new domain
- **Verification:** Ensure https:// works after domain connection

### **Email Services**
- **If using GoDaddy Email:** Method 2 (DNS records) preserves email
- **If switching to Hostinger:** Method 1 is simpler, but configure email separately
- **No Email:** Either method works fine

### **Backup Plan**
- **Keep temporary URL:** Don't delete it until domain is 100% working
- **Test thoroughly:** Verify all functionality before announcing new domain
- **Have rollback:** Know how to revert changes if needed

## 📞 **Troubleshooting Common Issues**

### **Domain Not Loading**
- **Check propagation:** DNS changes can take 24-48 hours
- **Clear cache:** Clear browser cache and try incognito mode
- **Check name servers:** Verify they're pointing to Hostinger

### **Website Shows Different Content**
- **Check domain configuration:** Ensure domain points to correct directory
- **File permissions:** Verify file permissions are correct
- **Cache issues:** May be serving cached version

### **SSL/HTTPS Issues**  
- **Enable SSL in Hostinger:** Look for SSL certificate settings
- **Force HTTPS:** Configure redirects if needed
- **Mixed content:** Ensure all resources load over HTTPS

## 📋 **Post-Setup Tasks**

### **Once Domain is Working:**
- [ ] **Update Supabase settings** if domain restrictions exist
- [ ] **Update any hardcoded URLs** in your code
- [ ] **Set up email forwarding** if needed
- [ ] **Configure analytics** for new domain
- [ ] **Update business listings** with new URL
- [ ] **Test all functionality** thoroughly

### **SEO Considerations:**
- [ ] **Set up 301 redirects** from temporary URL to new domain
- [ ] **Update Google Search Console** with new domain
- [ ] **Verify no broken links** or resources
- [ ] **Update social media links** to new domain

---

## 🎯 **Next Steps**

1. **Gather Information:**
   - Get your GoDaddy domain name
   - Access both GoDaddy and Hostinger accounts
   - Choose connection method (Method 1 recommended)

2. **Follow Guide:**
   - Work through chosen method step by step
   - Take screenshots of settings for reference
   - Don't rush - double-check each step

3. **Test & Verify:**
   - Wait for propagation
   - Test all website functionality
   - Verify everything works before announcing

4. **Get Help if Needed:**
   - Both GoDaddy and Hostinger have support chat
   - Document any issues encountered
   - Have backup plan ready

---

**Ready to proceed when you have your domain information!** 

Once you gather your GoDaddy domain details and access both accounts, we can walk through the specific steps for your setup.