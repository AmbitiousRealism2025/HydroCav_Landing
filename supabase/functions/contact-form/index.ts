/**
 * Supabase Edge Function: Contact Form with CSRF Validation
 * 
 * CRITICAL SECURITY: This Edge Function provides server-side CSRF validation
 * that was missing in the original implementation. Without this, the entire
 * CSRF protection mechanism was useless.
 * 
 * Security Flow:
 * 1. Validate CSRF token from header against cookie
 * 2. Sanitize and validate input data
 * 3. Check rate limiting
 * 4. Insert into database with proper authorization
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Rate limiting storage (in-memory for Edge Function)
const rateLimiter = new Map<string, number[]>();

/**
 * Helper function to parse cookies from request
 */
function getCookie(req: Request, name: string): string | null {
  const cookieHeader = req.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Validate CSRF token using double-submit cookie pattern
 * CRITICAL: This is the server-side validation that was missing
 */
function validateCSRFToken(headerToken: string | null, cookieToken: string | null): boolean {
  // Both tokens must exist
  if (!headerToken || !cookieToken) {
    console.error('CSRF validation failed: Missing tokens');
    return false;
  }
  
  // Tokens must match
  if (headerToken !== cookieToken) {
    console.error('CSRF validation failed: Token mismatch');
    return false;
  }
  
  // Token must have minimum length (security requirement)
  if (headerToken.length < 32) {
    console.error('CSRF validation failed: Token too short');
    return false;
  }
  
  return true;
}

/**
 * Check rate limiting for contact form submissions
 */
function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowSize = 60000; // 1 minute window
  const maxRequests = 5; // Max 5 requests per minute
  
  // Get existing requests for this client
  const requests = rateLimiter.get(clientId) || [];
  
  // Filter to only recent requests within the window
  const recentRequests = requests.filter(time => now - time < windowSize);
  
  // Check if limit exceeded
  if (recentRequests.length >= maxRequests) {
    console.warn(`Rate limit exceeded for client: ${clientId}`);
    return false;
  }
  
  // Add current request and update storage
  recentRequests.push(now);
  rateLimiter.set(clientId, recentRequests);
  
  // Clean up old entries periodically
  if (rateLimiter.size > 1000) {
    const oldestAllowed = now - windowSize;
    for (const [key, times] of rateLimiter.entries()) {
      const validTimes = times.filter(t => t > oldestAllowed);
      if (validTimes.length === 0) {
        rateLimiter.delete(key);
      } else {
        rateLimiter.set(key, validTimes);
      }
    }
  }
  
  return true;
}

/**
 * Sanitize string input to prevent XSS
 */
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Trim and limit length
  let sanitized = input.trim().substring(0, maxLength);
  
  // HTML entity encoding (prevents XSS)
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
}

/**
 * Validate email format
 */
function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  const email = input.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email;
}

/**
 * Sanitize and validate contact form data
 */
function sanitizeFormData(data: any) {
  return {
    name: sanitizeString(data.name, 100),
    email: sanitizeEmail(data.email),
    company: sanitizeString(data.company, 100),
    message: sanitizeString(data.message, 2000),
    created_at: new Date().toISOString(),
    ip_address: null, // We don't store IP for privacy
    user_agent: null, // We don't store user agent for privacy
    status: 'new',
    priority: 'medium'
  };
}

// Main Edge Function handler
serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  try {
    // CRITICAL SECURITY STEP 1: CSRF Token Validation
    const csrfHeaderToken = req.headers.get('X-CSRF-Token');
    const csrfCookieToken = getCookie(req, 'csrf_token');
    
    if (!validateCSRFToken(csrfHeaderToken, csrfCookieToken)) {
      console.error('CSRF validation failed for request');
      return new Response(
        JSON.stringify({ 
          error: 'CSRF validation failed',
          details: 'Invalid or missing CSRF token'
        }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('CSRF validation passed');
    
    // STEP 2: Parse and validate request body
    const body = await req.json();
    
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // STEP 3: Rate limiting check
    const clientId = req.headers.get('CF-Connecting-IP') || 
                    req.headers.get('X-Forwarded-For') || 
                    'unknown';
    
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          details: 'Please wait before submitting again'
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // STEP 4: Sanitize and validate form data
    let sanitizedData;
    try {
      sanitizedData = sanitizeFormData(body);
    } catch (validationError: any) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed',
          details: validationError.message
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // STEP 5: Create Supabase client with service role for database insertion
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // STEP 6: Insert into database
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert(sanitizedData)
      .select()
      .single();
    
    if (error) {
      console.error('Database insertion error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to submit contact form',
          details: error.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // STEP 7: Return success response
    console.log(`Contact form submitted successfully: ${data.id}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Contact form submitted successfully',
        id: data.id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error: any) {
    console.error('Unexpected error in contact form Edge Function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});