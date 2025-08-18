# Edge Function Deployment Instructions

## Manual Deployment Steps Required

The CSRF validation Edge Function is ready for deployment but requires manual steps due to CLI authentication requirements.

## Files Ready for Deployment

✅ **Edge Function Code**: `supabase/functions/contact-form/index.ts`  
✅ **CORS Configuration**: `supabase/functions/_shared/cors.ts`  
✅ **Function Configuration**: `supabase/functions/contact-form/config.toml`

## Deployment Steps

### Option 1: Via Supabase Dashboard (Recommended)

1. **Access Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/icfombdnbaeckgivfkdw
   - Navigate to: Edge Functions → Create Function

2. **Create New Function**
   - Function name: `contact-form`
   - Copy the entire contents of `supabase/functions/contact-form/index.ts`
   - Paste into the dashboard editor

3. **Deploy Function**
   - Click "Deploy Function"
   - Function will be available at: `https://icfombdnbaeckgivfkdw.supabase.co/functions/v1/contact-form`

### Option 2: Via CLI (Alternative)

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to project
supabase link --project-ref icfombdnbaeckgivfkdw

# 4. Deploy function
supabase functions deploy contact-form
```

## Environment Variables Required

The Edge Function requires these environment variables to be set in your Supabase project:

- `SUPABASE_URL` (automatically available)
- `SUPABASE_SERVICE_ROLE_KEY` (automatically available)

## Testing the Deployment

After deployment, test the function:

```javascript
// Test request
const response = await fetch('https://icfombdnbaeckgivfkdw.supabase.co/functions/v1/contact-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'your-csrf-token-here'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    message: 'Test message'
  })
});
```

## Security Impact

Once deployed, this Edge Function will:

✅ **Enable Server-Side CSRF Validation** - Critical security requirement  
✅ **Complete Multi-Layer Security Architecture** - XSS + CSRF + CSP protection  
✅ **Provide Production-Ready Security** - Enterprise-grade protection

## Client-Side Integration

The contact form is already updated to use this Edge Function:
- File: `assets/js/contact-form.js`
- Function: `handleContactSubmission()`
- Endpoint: Will automatically use the deployed function URL

## Next Steps After Deployment

1. **Update Contact Form URL** (if needed):
   ```javascript
   // In assets/js/contact-form.js
   const response = await fetch('https://icfombdnbaeckgivfkdw.supabase.co/functions/v1/contact-form', {
     // ... rest of the request
   });
   ```

2. **Test Production Security**:
   - Submit test contact form
   - Verify CSRF protection works
   - Check admin dashboard displays submissions

3. **Monitor Function Performance**:
   - Check Supabase Dashboard → Edge Functions → Logs
   - Verify no errors in production

## Status

🔄 **Awaiting Manual Deployment** - All code ready, manual deployment required due to CLI authentication limitations

---

**Priority**: 🚨 **CRITICAL - FIRST TASK ON RETURN**  
**Impact**: Enables full CSRF protection for production security  
**Next Action**: Deploy via Supabase Dashboard (Option 1)
**Documentation Updated**: All project docs now reflect pending deployment status

## Return to Work Checklist

When returning to work, complete these steps in order:

1. ✅ **Deploy Edge Function** (this file)
2. ✅ **Test CSRF Protection** (verify end-to-end)  
3. ✅ **Update Status Documentation** (mark as completed)
4. ✅ **Proceed with Production Deployment** (full security active)