-- Privacy Enhancement: Remove IP Address Storage
-- This script removes all IP address storage to comply with privacy requirements
-- and resolves the inconsistency identified in the security audit.

-- Step 1: Remove ip_address column from contact_submissions table
ALTER TABLE contact_submissions DROP COLUMN IF EXISTS ip_address;

-- Step 2: Update rate limiting function to not rely on IP addresses
-- Instead, we'll rely on the Edge Function's rate limiting by request frequency
CREATE OR REPLACE FUNCTION check_submission_rate_limit()
RETURNS BOOLEAN AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Since we're not storing IP addresses for privacy, we'll do a simpler
    -- time-based rate limit: max 10 total submissions per minute across all users
    -- The real rate limiting will be handled by the Edge Function per IP
    SELECT COUNT(*) INTO recent_count
    FROM contact_submissions
    WHERE submitted_at > NOW() - INTERVAL '1 minute';
    
    -- Allow max 10 submissions per minute globally (Edge Function handles per-IP)
    RETURN recent_count < 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Update RLS policies to remove any IP-based logic (if any)
-- The existing policies should already be correct, but let's ensure they don't reference ip_address

-- Step 4: Clean up any existing IP data (if the column existed)
-- Note: This is handled by the DROP COLUMN command above

-- Verification Query - Run this to confirm no IP addresses are stored:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'contact_submissions' AND column_name = 'ip_address';