-- ============================================
-- HydroCav Contact Form Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create the contact_submissions table
CREATE TABLE contact_submissions (
    -- Primary identification
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Contact form fields (matching current HTML form)
    name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    email TEXT NOT NULL CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    company TEXT CHECK (char_length(company) <= 100),
    message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 2000),
    
    -- Metadata for tracking and security
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    
    -- Future-proofing fields
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    notes TEXT,
    
    -- Soft delete capability for Phase 2
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Step 2: Create indexes for efficient queries
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status) WHERE deleted_at IS NULL;

-- Step 3: Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Step 4: Create rate limiting function
CREATE OR REPLACE FUNCTION check_submission_rate_limit()
RETURNS BOOLEAN AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Check submissions from same IP in last 5 minutes
    SELECT COUNT(*) INTO recent_count
    FROM contact_submissions
    WHERE ip_address = inet_client_addr()
    AND submitted_at > NOW() - INTERVAL '5 minutes';
    
    -- Allow max 3 submissions per IP per 5 minutes
    RETURN recent_count < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create RLS policies
-- Policy 1: Allow anonymous users to insert new submissions only
CREATE POLICY "Allow anonymous contact submissions" ON contact_submissions
    FOR INSERT 
    TO anon 
    WITH CHECK (
        -- Ensure required fields are present
        name IS NOT NULL 
        AND email IS NOT NULL 
        AND message IS NOT NULL
        -- Prevent setting admin fields
        AND status = 'new'
        AND deleted_at IS NULL
        -- Rate limiting check
        AND check_submission_rate_limit()
    );

-- Policy 2: Allow authenticated users (admin) full access for Phase 2
CREATE POLICY "Allow admin full access" ON contact_submissions
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Step 6: Test the setup (optional)
-- This will fail due to RLS (which is good - means security is working!)
-- SELECT * FROM contact_submissions;

-- To verify the table was created successfully:
-- Check the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position;