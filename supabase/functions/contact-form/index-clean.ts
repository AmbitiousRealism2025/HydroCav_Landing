import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Get CSRF tokens
    const headerToken = req.headers.get('X-CSRF-Token')
    const cookieHeader = req.headers.get('Cookie')
    let cookieToken = null
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';')
      for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=')
        if (key === 'csrf_token') {
          cookieToken = decodeURIComponent(value)
          break
        }
      }
    }

    // Validate CSRF tokens
    if (!headerToken || !cookieToken || headerToken !== cookieToken || headerToken.length < 32) {
      return new Response(
        JSON.stringify({ error: 'CSRF validation failed' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body = await req.json()
    
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize inputs
    const sanitizeString = (input, maxLength) => {
      if (typeof input !== 'string') return ''
      let clean = input.trim().substring(0, maxLength)
      clean = clean.replace(/&/g, '&amp;')
      clean = clean.replace(/</g, '&lt;')
      clean = clean.replace(/>/g, '&gt;')
      clean = clean.replace(/"/g, '&quot;')
      clean = clean.replace(/'/g, '&#x27;')
      clean = clean.replace(/\//g, '&#x2F;')
      return clean
    }

    const sanitizeEmail = (input) => {
      if (typeof input !== 'string') return ''
      const email = input.trim().toLowerCase()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format')
      }
      return email
    }

    // Prepare data
    let sanitizedData
    try {
      sanitizedData = {
        name: sanitizeString(body.name, 100),
        email: sanitizeEmail(body.email),
        company: sanitizeString(body.company, 100),
        message: sanitizeString(body.message, 2000),
        submitted_at: new Date().toISOString(),
        status: 'new',
        priority: 'normal'
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(sanitizedData)
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to submit contact form', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Contact form submitted successfully', id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})