# Remediation Guide for HydroCav Website

This document provides detailed recommendations and code examples to address the critical vulnerabilities and code quality issues identified in the Pre-Deployment Code Review Report.

## 1. Fixing the Critical XSS Vulnerability

The current implementation uses a weak, custom sanitization function for most form fields. This must be replaced with a robust method.

### Step 1.1: Remove the Flawed Sanitizer

In `assets/js/xss-protection.js`, delete the entire `sanitizeFormInput` function. It is insecure and should not be used.

**DELETE this function:**

```javascript
// assets/js/xss-protection.js

  sanitizeFormInput(input) {
    if (typeof input !== 'string') {
      return '';
    }

    // Remove any HTML tags and scripts
    let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    clean = clean.replace(/<[^>]+>/g, '');

    // Remove dangerous patterns
    clean = clean.replace(/javascript:/gi, '');
    clean = clean.replace(/on\w+\s*=/gi, '');
    clean = clean.replace(/data:text\/html/gi, '');

    // Trim and normalize whitespace
    clean = clean.trim().replace(/\s+/g, ' ');

    return clean;
  }
```

### Step 1.2: Use Proper Sanitizers in security.js

In `assets/js/security.js`, modify the `sanitizeFormData` function to use the correct sanitizers. The default should be `sanitizeText`, which properly encodes HTML entities.

**MODIFY this function in assets/js/security.js:**

**FROM:**
```javascript
// assets/js/security.js

  sanitizeFormData(formData) {
    const sanitized = {};

    for (const [key, value] of formData.entries()) {
      // ... (skip csrf_token)

      const fieldType = this.getFieldType(key);

      switch (fieldType) {
        case 'email':
          sanitized[key] = xssProtection.sanitizeEmail(value);
          break;
        case 'url':
          sanitized[key] = xssProtection.sanitizeURL(value);
          break;
        case 'html':
          sanitized[key] = xssProtection.sanitizeHTML(value);
          break;
        default:
          // THIS IS THE VULNERABLE PART
          sanitized[key] = xssProtection.sanitizeFormInput(value);
      }
    }
    return sanitized;
  }
```

**TO:**
```javascript
// assets/js/security.js

  sanitizeFormData(formData) {
    const sanitized = {};

    for (const [key, value] of formData.entries()) {
      // ... (skip csrf_token)

      const fieldType = this.getFieldType(key);

      switch (fieldType) {
        case 'email':
          sanitized[key] = xssProtection.sanitizeEmail(value);
          break;
        case 'url':
          sanitized[key] = xssProtection.sanitizeURL(value);
          break;
        case 'html':
          // Use DOMPurify for fields intended to contain safe HTML
          sanitized[key] = xssProtection.sanitizeHTML(value);
          break;
        default:
          // THIS IS THE FIX: Use proper HTML entity encoding for all other text fields.
          // This prevents any HTML from being rendered.
          sanitized[key] = xssProtection.sanitizeText(value);
      }
    }
    return sanitized;
  }
```

## 2. Fixing the Critical CSRF Vulnerability

This requires creating a Supabase Edge Function to validate the token on the server side before the data is inserted into the database.

### Step 2.1: Create a Supabase Edge Function

In your Supabase project, create a new Edge Function. For example, `supabase/functions/contact-form/index.ts`.

This is a sample implementation of the Edge Function:

```typescript
// supabase/functions/contact-form/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Create a Supabase admin client to bypass RLS for validation
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Get CSRF tokens from header and cookie
    const clientToken = req.headers.get('X-CSRF-Token')
    const cookieToken = getCookie(req, 'csrf_cookie')

    // 3. VALIDATE THE TOKEN
    if (!clientToken || !cookieToken || clientToken !== cookieToken) {
      return new Response(JSON.stringify({ error: 'CSRF validation failed' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. If validation passes, proceed with the insert
    const body = await req.json()

    // 5. Create a user-level client to interact with the database
    // This client will respect RLS policies
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data, error } = await supabaseClient
      .from('contact_submissions')
      .insert({
        name: body.name,
        email: body.email,
        company: body.company,
        message: body.message,
        // The RLS policy will handle the rate limiting using the client's IP
      })
      .select()

    if (error) {
      throw error
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// Helper function to parse cookies
function getCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.get('Cookie')
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=')
    if (key === name) {
      return value
    }
  }
  return null
}
```

### Step 2.2: Update Client-Side Code to Call the Edge Function

The client-side form submission logic must be updated to call this new Edge Function instead of inserting into the database directly.

In `index.html` (or its refactored JS file), modify `handleContactSubmission`:

```javascript
// In handleContactSubmission function...

// Replace the direct Supabase insert
// const { data, error } = await supabaseClient.from(...).insert(...)

// With a call to the new Edge Function
const { data, error } = await supabaseClient.functions.invoke('contact-form', {
  body: submission, // The sanitized data object
})

if (error) {
  // ... handle error
}
// ... handle success
```

## 3. Improving Code Quality and Performance

### Step 3.1: Refactor Inline JavaScript

All JavaScript code inside `<script>` tags in `index.html` and `admin.html` should be moved to external files.

Example for `index.html`:

1. Create a new file: `assets/js/contact-form.js`.
2. Move all the JavaScript from the bottom of `index.html` (e.g., `ToastManager`, `handleContactSubmission`, etc.) into this new file.
3. In `index.html`, replace the inline script with a single line:

```html
<!-- index.html -->
...
<script src="assets/js/main.js"></script>
<script src="assets/js/contact-form.js"></script>
...
</body>
</html>
```

### Step 3.2: Add Subresource Integrity (SRI) Hashes

For every `<script>` and `<link>` tag that loads from a CDN, add an `integrity` attribute.

Example:

```html
<!-- FROM -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- TO (get the correct hash for the library version) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" 
        integrity="sha384-some-hash-value-for-this-specific-file" 
        crossorigin="anonymous"></script>
```

You can generate SRI hashes using online tools like [srihash.org](https://srihash.org).

## 4. Hardening the Content Security Policy (CSP)

After refactoring all inline JavaScript (Step 3.1), you can make the CSP much more effective by removing `'unsafe-inline'`.

In `assets/js/xss-protection.js`, modify `setContentSecurityPolicy`:

**FROM:**
```javascript
// assets/js/xss-protection.js
  cspMeta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
    // ...
  ].join('; ');
```

**TO (after removing all inline scripts):**
```javascript
// assets/js/xss-protection.js
  cspMeta.content = [
    "default-src 'self'",
    "script-src 'self' https://cdn.jsdelivr.net https://unpkg.com", // 'unsafe-inline' REMOVED
    // ...
  ].join('; ');
```

This change will prevent any inline scripts from executing, providing a powerful defense against XSS.