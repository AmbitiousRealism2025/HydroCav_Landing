# Supabase Edge Functions Deployment Guide

## CRITICAL: CSRF Server-Side Validation

This Edge Function provides the **CRITICAL** server-side CSRF validation that was missing from the original implementation. Without this, the entire CSRF protection mechanism was useless.

## Prerequisites

1. **Supabase CLI**: Install the Supabase CLI
   ```bash
   npm install -g supabase
   ```

2. **Authentication**: Login to Supabase
   ```bash
   supabase login
   ```

3. **Link Project**: Link to your Supabase project
   ```bash
   supabase link --project-ref icfombdnbaeckgivfkdw
   ```

## Deployment Steps

### 1. Deploy the Contact Form Edge Function

```bash
# From the project root directory
supabase functions deploy contact-form
```

### 2. Set Environment Variables (if needed)

The Edge Function automatically has access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database operations

No additional configuration needed!

### 3. Test the Edge Function

```bash
# Test with curl (replace with your actual Supabase URL)
curl -X POST https://icfombdnbaeckgivfkdw.supabase.co/functions/v1/contact-form \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: test-token-12345678901234567890123456789012" \
  -H "Cookie: csrf_token=test-token-12345678901234567890123456789012" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "message": "Test message"
  }'
```

### 4. Verify CSRF Protection

The Edge Function will reject requests that:
- Don't have a CSRF token in the header
- Don't have a matching CSRF token in the cookie
- Have tokens that don't match
- Have tokens shorter than 32 characters

## Security Features Implemented

1. **CSRF Validation**: Double-submit cookie pattern with server-side validation
2. **Rate Limiting**: 5 requests per minute per IP address
3. **Input Sanitization**: HTML entity encoding to prevent XSS
4. **Email Validation**: Proper email format validation
5. **Length Limits**: Enforced maximum lengths for all fields

## Monitoring

View Edge Function logs:
```bash
supabase functions logs contact-form
```

## Rollback Plan

If issues occur, you can temporarily revert to direct database access:

1. **Revert client code**: Change `security.js` back to direct insert
2. **Monitor**: Check error logs for issues
3. **Fix**: Address any Edge Function problems
4. **Redeploy**: Deploy fixed Edge Function

## Important Notes

⚠️ **CRITICAL**: This Edge Function is essential for security. The application is vulnerable to CSRF attacks without it.

⚠️ **Testing**: Always test in a staging environment first before deploying to production.

⚠️ **Monitoring**: Set up alerts for Edge Function failures to catch issues early.

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Check that the Edge Function is deployed and the URL is correct
2. **CSRF Validation Failures**: Ensure cookies are being sent with `credentials: 'include'`
3. **Rate Limiting**: The function limits to 5 submissions per minute per IP
4. **Database Errors**: Check that the service role key has proper permissions

### Debug Mode

To enable detailed logging, check the Edge Function logs:
```bash
supabase functions logs contact-form --tail
```

## Next Steps

After deploying this Edge Function:

1. ✅ Test contact form submission with CSRF validation
2. ✅ Monitor Edge Function logs for errors
3. ✅ Set up alerting for Edge Function failures
4. ✅ Document the new security architecture
5. ✅ Update any other forms to use Edge Functions

## Security Impact

**Before**: Client-side CSRF protection only (completely bypassable)
**After**: Server-side CSRF validation (secure against CSRF attacks)

This fixes the **CRITICAL** security vulnerability identified in the security audit.