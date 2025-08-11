-- ============================================
-- HydroCav Email Notification System Setup
-- Run this in Supabase SQL Editor after admin dashboard
-- ============================================

-- Step 1: Create email notifications table
CREATE TABLE email_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES contact_submissions(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('new_submission', 'status_change', 'auto_response')),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create admin notification settings table
CREATE TABLE admin_notification_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Insert default notification settings
INSERT INTO admin_notification_settings (setting_key, setting_value, description) VALUES
('admin_email', 'admin@hydrocav.com', 'Primary admin email for notifications'),
('notify_new_submissions', 'true', 'Send email for new submissions'),
('notify_status_changes', 'false', 'Send email for status changes'),
('auto_response_enabled', 'true', 'Send auto-response to submitters'),
('email_template_new_submission_subject', 'New Contact Submission from HydroCav Website', 'Subject for new submission notifications'),
('email_template_auto_response_subject', 'Thank you for contacting HydroCav', 'Subject for auto-response emails');

-- Step 4: Create function to get notification setting
CREATE OR REPLACE FUNCTION get_notification_setting(key_name TEXT)
RETURNS TEXT AS $$
DECLARE
    setting_value TEXT;
BEGIN
    SELECT ans.setting_value INTO setting_value
    FROM admin_notification_settings ans
    WHERE ans.setting_key = key_name;
    
    RETURN COALESCE(setting_value, '');
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create function to send email notification
CREATE OR REPLACE FUNCTION send_email_notification(
    p_submission_id UUID,
    p_type TEXT,
    p_recipient TEXT,
    p_subject TEXT,
    p_body TEXT
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO email_notifications (
        submission_id,
        notification_type,
        recipient_email,
        subject,
        body,
        status
    ) VALUES (
        p_submission_id,
        p_type,
        p_recipient,
        p_subject,
        p_body,
        'pending'
    ) RETURNING id INTO notification_id;
    
    -- In a real implementation, this would trigger the email sending process
    -- For now, we'll mark as sent immediately
    UPDATE email_notifications 
    SET status = 'sent', sent_at = NOW()
    WHERE id = notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create function to generate admin notification email
CREATE OR REPLACE FUNCTION generate_admin_notification(p_submission_id UUID)
RETURNS VOID AS $$
DECLARE
    submission RECORD;
    admin_email TEXT;
    subject TEXT;
    body TEXT;
BEGIN
    -- Get submission details
    SELECT * INTO submission
    FROM contact_submissions
    WHERE id = p_submission_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Get admin email and check if notifications are enabled
    admin_email := get_notification_setting('admin_email');
    
    IF get_notification_setting('notify_new_submissions') = 'true' AND admin_email != '' THEN
        subject := get_notification_setting('email_template_new_submission_subject');
        
        body := format(
            'New contact form submission received on HydroCav website.

Contact Details:
- Name: %s
- Email: %s
- Company: %s
- Submitted: %s

Message:
%s

You can view and manage this submission in the admin dashboard:
https://your-domain.com/admin.html

Best regards,
HydroCav Website System',
            submission.name,
            submission.email,
            COALESCE(submission.company, 'Not provided'),
            to_char(submission.submitted_at, 'YYYY-MM-DD HH24:MI:SS'),
            submission.message
        );
        
        PERFORM send_email_notification(
            p_submission_id,
            'new_submission',
            admin_email,
            subject,
            body
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create function to generate auto-response email
CREATE OR REPLACE FUNCTION generate_auto_response(p_submission_id UUID)
RETURNS VOID AS $$
DECLARE
    submission RECORD;
    subject TEXT;
    body TEXT;
BEGIN
    -- Get submission details
    SELECT * INTO submission
    FROM contact_submissions
    WHERE id = p_submission_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Check if auto-response is enabled
    IF get_notification_setting('auto_response_enabled') = 'true' THEN
        subject := get_notification_setting('email_template_auto_response_subject');
        
        body := format(
            'Dear %s,

Thank you for contacting HydroCav regarding our hydrodynamic cavitation water treatment solutions.

We have received your message and will respond within 24 hours during business days. A member of our team will review your inquiry and provide you with detailed information about how our technology can benefit your specific application.

Your Message:
"%s"

In the meantime, feel free to explore our website to learn more about our innovative water treatment technology and successful case studies.

Best regards,
The HydroCav Team

---
HydroCav - Advanced Water Treatment Solutions
Email: info@hydrocav.com
Website: https://hydrocav.com

This is an automated response. Please do not reply to this email.',
            submission.name,
            left(submission.message, 200) || CASE WHEN length(submission.message) > 200 THEN '...' ELSE '' END
        );
        
        PERFORM send_email_notification(
            p_submission_id,
            'auto_response',
            submission.email,
            subject,
            body
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger function for new submissions
CREATE OR REPLACE FUNCTION handle_new_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate admin notification
    PERFORM generate_admin_notification(NEW.id);
    
    -- Generate auto-response
    PERFORM generate_auto_response(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Create trigger for new submissions
DROP TRIGGER IF EXISTS trigger_new_contact_submission ON contact_submissions;
CREATE TRIGGER trigger_new_contact_submission
    AFTER INSERT ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_contact_submission();

-- Step 10: Create trigger function for status changes
CREATE OR REPLACE FUNCTION handle_submission_status_change()
RETURNS TRIGGER AS $$
DECLARE
    admin_email TEXT;
    subject TEXT;
    body TEXT;
BEGIN
    -- Only trigger if status actually changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Check if status change notifications are enabled
    IF get_notification_setting('notify_status_changes') = 'true' THEN
        admin_email := get_notification_setting('admin_email');
        
        IF admin_email != '' THEN
            subject := format('HydroCav Submission Status Changed: %s → %s', OLD.status, NEW.status);
            
            body := format(
                'A contact submission status has been updated.

Contact: %s (%s)
Company: %s
Previous Status: %s
New Status: %s
Updated: %s

Message Preview:
%s

View full details in admin dashboard:
https://your-domain.com/admin.html

Best regards,
HydroCav Website System',
                NEW.name,
                NEW.email,
                COALESCE(NEW.company, 'Not provided'),
                OLD.status,
                NEW.status,
                to_char(NEW.submitted_at, 'YYYY-MM-DD HH24:MI:SS'),
                left(NEW.message, 150) || CASE WHEN length(NEW.message) > 150 THEN '...' ELSE '' END
            );
            
            PERFORM send_email_notification(
                NEW.id,
                'status_change',
                admin_email,
                subject,
                body
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create trigger for status changes
DROP TRIGGER IF EXISTS trigger_submission_status_change ON contact_submissions;
CREATE TRIGGER trigger_submission_status_change
    AFTER UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION handle_submission_status_change();

-- Step 12: Create indexes for email notifications
CREATE INDEX idx_email_notifications_submission_id ON email_notifications(submission_id);
CREATE INDEX idx_email_notifications_type ON email_notifications(notification_type);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_email_notifications_sent_at ON email_notifications(sent_at DESC);

-- Step 13: Enable RLS for email tables
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notification_settings ENABLE ROW LEVEL SECURITY;

-- Step 14: Create RLS policies for admin access
CREATE POLICY "Admin access to email notifications" ON email_notifications
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin access to notification settings" ON admin_notification_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Step 15: Create view for email notification analytics
CREATE VIEW email_notification_stats AS
SELECT 
    notification_type,
    status,
    COUNT(*) as count,
    MIN(created_at) as first_sent,
    MAX(created_at) as last_sent
FROM email_notifications
GROUP BY notification_type, status;

-- Step 16: Create function to update notification settings
CREATE OR REPLACE FUNCTION update_notification_setting(
    p_key TEXT,
    p_value TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_notification_settings (setting_key, setting_value, updated_at)
    VALUES (p_key, p_value, NOW())
    ON CONFLICT (setting_key) 
    DO UPDATE SET 
        setting_value = p_value,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Email System Setup Complete
-- ============================================

-- To enable actual email sending, you would need to:
-- 1. Set up a Supabase Edge Function for email delivery
-- 2. Configure an email service (SendGrid, Mailgun, etc.)
-- 3. Update the send_email_notification function to call the Edge Function
--
-- For now, emails are logged in the email_notifications table
-- and can be reviewed in the admin dashboard