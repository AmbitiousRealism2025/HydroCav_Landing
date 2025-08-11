-- ============================================
-- HydroCav Business Features Database Setup
-- Testimonials, Case Studies, and Newsletter
-- Run this in Supabase SQL Editor after email setup
-- ============================================

-- Step 1: Create testimonials table
CREATE TABLE testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Client Information
    client_name TEXT NOT NULL CHECK (char_length(client_name) >= 2 AND char_length(client_name) <= 100),
    client_title TEXT CHECK (char_length(client_title) <= 100),
    company_name TEXT NOT NULL CHECK (char_length(company_name) >= 2 AND char_length(company_name) <= 150),
    company_website TEXT CHECK (company_website ~ '^https?://.*' OR company_website IS NULL),
    industry TEXT CHECK (char_length(industry) <= 100),
    
    -- Testimonial Content
    testimonial_text TEXT NOT NULL CHECK (char_length(testimonial_text) >= 50 AND char_length(testimonial_text) <= 2000),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Project Details
    project_title TEXT CHECK (char_length(project_title) <= 150),
    project_description TEXT CHECK (char_length(project_description) <= 500),
    results_achieved TEXT CHECK (char_length(results_achieved) <= 500),
    
    -- Media
    client_photo_url TEXT,
    company_logo_url TEXT,
    
    -- Publication Settings
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID, -- Reference to admin user in future
    
    -- Location (optional)
    location TEXT CHECK (char_length(location) <= 100)
);

-- Step 2: Create case studies table
CREATE TABLE case_studies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Information
    title TEXT NOT NULL CHECK (char_length(title) >= 10 AND char_length(title) <= 200),
    subtitle TEXT CHECK (char_length(subtitle) <= 300),
    slug TEXT UNIQUE NOT NULL CHECK (char_length(slug) >= 3 AND char_length(slug) <= 100),
    
    -- Client Information
    client_name TEXT NOT NULL CHECK (char_length(client_name) <= 150),
    industry TEXT NOT NULL CHECK (char_length(industry) <= 100),
    location TEXT CHECK (char_length(location) <= 100),
    
    -- Project Details
    challenge_description TEXT NOT NULL CHECK (char_length(challenge_description) >= 100),
    solution_description TEXT NOT NULL CHECK (char_length(solution_description) >= 100),
    implementation_details TEXT CHECK (char_length(implementation_details) >= 100),
    results_description TEXT NOT NULL CHECK (char_length(results_description) >= 100),
    
    -- Key Metrics
    key_metrics JSONB, -- Store metrics as JSON: {"water_savings": "40%", "cost_reduction": "$50,000", etc.}
    
    -- Media
    featured_image_url TEXT,
    gallery_images JSONB, -- Array of image URLs
    
    -- SEO & Publishing
    meta_description TEXT CHECK (char_length(meta_description) <= 160),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    
    -- Related testimonial
    testimonial_id UUID REFERENCES testimonials(id) ON DELETE SET NULL
);

-- Step 3: Create newsletter subscriptions table
CREATE TABLE newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Subscriber Information
    email TEXT UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    first_name TEXT CHECK (char_length(first_name) <= 50),
    last_name TEXT CHECK (char_length(last_name) <= 50),
    company TEXT CHECK (char_length(company) <= 150),
    industry TEXT CHECK (char_length(industry) <= 100),
    
    -- Subscription Settings
    status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'pending')),
    subscription_source TEXT DEFAULT 'website' CHECK (subscription_source IN ('website', 'contact_form', 'admin', 'import')),
    interests JSONB, -- Array of interests: ["water_treatment", "case_studies", "technology_updates"]
    
    -- Communication Preferences
    frequency_preference TEXT DEFAULT 'monthly' CHECK (frequency_preference IN ('weekly', 'monthly', 'quarterly')),
    
    -- Metadata
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    last_email_sent_at TIMESTAMPTZ,
    email_open_count INTEGER DEFAULT 0,
    email_click_count INTEGER DEFAULT 0,
    
    -- Double opt-in
    confirmation_token TEXT,
    confirmed_at TIMESTAMPTZ,
    
    -- Tracking
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT
);

-- Step 4: Create indexes for performance
-- Testimonials indexes
CREATE INDEX idx_testimonials_published ON testimonials(is_published, display_order) WHERE is_published = true;
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured, display_order) WHERE is_featured = true;
CREATE INDEX idx_testimonials_company ON testimonials(company_name);

-- Case studies indexes
CREATE INDEX idx_case_studies_published ON case_studies(is_published, display_order) WHERE is_published = true;
CREATE INDEX idx_case_studies_featured ON case_studies(is_featured, display_order) WHERE is_featured = true;
CREATE INDEX idx_case_studies_slug ON case_studies(slug) WHERE is_published = true;
CREATE INDEX idx_case_studies_industry ON case_studies(industry);

-- Newsletter indexes
CREATE INDEX idx_newsletter_status ON newsletter_subscriptions(status);
CREATE INDEX idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email) WHERE status = 'subscribed';

-- Step 5: Enable RLS for all tables
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies

-- Testimonials policies
CREATE POLICY "Public read published testimonials" ON testimonials
    FOR SELECT TO anon, authenticated
    USING (is_published = true);

CREATE POLICY "Admin full access to testimonials" ON testimonials
    FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- Case studies policies
CREATE POLICY "Public read published case studies" ON case_studies
    FOR SELECT TO anon, authenticated
    USING (is_published = true);

CREATE POLICY "Admin full access to case studies" ON case_studies
    FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- Newsletter policies
CREATE POLICY "Allow newsletter subscriptions" ON newsletter_subscriptions
    FOR INSERT TO anon
    WITH CHECK (
        email IS NOT NULL 
        AND status = 'subscribed'
        AND subscription_source = 'website'
    );

CREATE POLICY "Admin full access to newsletter" ON newsletter_subscriptions
    FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- Step 7: Create functions for business logic

-- Function to generate case study slug
CREATE OR REPLACE FUNCTION generate_case_study_slug(title_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(title_text, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update testimonial timestamps
CREATE OR REPLACE FUNCTION update_testimonial_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update case study timestamps
CREATE OR REPLACE FUNCTION update_case_study_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    
    -- Auto-generate slug if not provided
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = generate_case_study_slug(NEW.title);
    END IF;
    
    -- Set published timestamp when first published
    IF NEW.is_published = true AND OLD.is_published = false THEN
        NEW.published_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create triggers
CREATE TRIGGER trigger_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_testimonial_timestamp();

CREATE TRIGGER trigger_case_studies_updated_at
    BEFORE UPDATE ON case_studies
    FOR EACH ROW
    EXECUTE FUNCTION update_case_study_timestamp();

-- Step 9: Insert sample data for development

-- Sample testimonials
INSERT INTO testimonials (
    client_name, client_title, company_name, company_website, industry,
    testimonial_text, rating, project_title, results_achieved,
    is_featured, is_published, display_order, location
) VALUES 
(
    'Sarah Johnson', 'Environmental Manager', 'Pacific Manufacturing Inc', 
    'https://pacificmfg.com', 'Manufacturing',
    'HydroCav''s hydrodynamic cavitation technology completely transformed our wastewater treatment process. We achieved a 45% reduction in treatment time and 30% cost savings within the first six months. The system is remarkably efficient and reliable.',
    5, 'Industrial Wastewater Treatment Optimization', 
    '45% reduction in treatment time, 30% cost savings, 99.2% contaminant removal efficiency',
    true, true, 1, 'Seattle, WA'
),
(
    'Dr. Michael Chen', 'Chief Technology Officer', 'AquaTech Solutions',
    'https://aquatech-solutions.com', 'Water Treatment',
    'The technical expertise and innovation that HydroCav brings to water treatment is exceptional. Their cavitation technology solved problems that traditional methods couldn''t address. Outstanding results and professional service.',
    5, 'Municipal Water Treatment Enhancement',
    'Improved water quality by 40%, reduced chemical usage by 25%',
    true, true, 2, 'Austin, TX'
),
(
    'Lisa Rodriguez', 'Operations Director', 'GreenTech Industries',
    null, 'Renewable Energy',
    'Working with HydroCav has been a game-changer for our sustainability goals. The energy efficiency of their cavitation systems is impressive, and the environmental impact reduction exceeded our expectations.',
    4, 'Sustainable Water Processing System',
    '35% energy reduction, zero harmful emissions',
    false, true, 3, 'Portland, OR'
);

-- Sample case studies
INSERT INTO case_studies (
    title, subtitle, slug, client_name, industry, location,
    challenge_description, solution_description, implementation_details, results_description,
    key_metrics, is_featured, is_published, display_order,
    meta_description, testimonial_id
) VALUES 
(
    'Transforming Industrial Wastewater Treatment with Advanced Cavitation Technology',
    'How Pacific Manufacturing achieved 45% efficiency improvement and significant cost savings',
    'pacific-manufacturing-wastewater-transformation',
    'Pacific Manufacturing Inc', 'Manufacturing', 'Seattle, WA',
    'Pacific Manufacturing was struggling with outdated wastewater treatment systems that were costly to operate and couldn''t meet new environmental regulations. The existing chemical treatment process was time-consuming, expensive, and produced secondary waste streams that required additional handling.',
    'HydroCav implemented a comprehensive hydrodynamic cavitation system tailored to Pacific Manufacturing''s specific wastewater composition. The solution included custom-designed cavitation chambers, intelligent process controls, and real-time monitoring systems to optimize treatment efficiency.',
    'The implementation was completed in phases over 8 weeks to minimize disruption to operations. Our team worked closely with Pacific Manufacturing''s engineers to integrate the new system with existing infrastructure. Comprehensive training was provided to the operations team, and 24/7 support was available during the transition period.',
    'The results exceeded expectations with immediate improvements in treatment efficiency, cost reduction, and environmental compliance. The system now operates at 99.2% contaminant removal efficiency while using 30% less energy than the previous solution.',
    '{"treatment_time_reduction": "45%", "cost_savings": "30%", "efficiency": "99.2%", "energy_reduction": "30%", "chemical_usage_reduction": "60%"}',
    true, true, 1,
    'Learn how Pacific Manufacturing achieved 45% efficiency improvement in wastewater treatment using HydroCav''s advanced cavitation technology.',
    (SELECT id FROM testimonials WHERE client_name = 'Sarah Johnson' LIMIT 1)
),
(
    'Municipal Water Treatment Enhancement: Austin''s Success Story',
    'Advanced cavitation technology improves water quality while reducing chemical dependency',
    'austin-municipal-water-treatment-enhancement',
    'City of Austin Water Department', 'Municipal Water Treatment', 'Austin, TX',
    'The City of Austin needed to upgrade their water treatment facility to handle increasing demand while meeting stricter quality standards. Traditional chlorination methods were becoming insufficient, and the city wanted to reduce chemical usage for environmental and cost reasons.',
    'HydroCav designed a hybrid treatment system combining hydrodynamic cavitation with optimized chemical processes. The solution provided superior pathogen elimination while significantly reducing chemical requirements and improving overall water quality.',
    'Implementation required careful coordination with city operations to ensure uninterrupted water service. The project was executed in stages, with comprehensive testing at each phase. Advanced monitoring systems were installed to provide real-time quality assurance and system optimization.',
    'The upgraded system now delivers consistently higher water quality with 40% improvement in key metrics. Chemical usage was reduced by 25%, resulting in significant cost savings and reduced environmental impact. Citizen satisfaction with water quality increased by 35%.',
    '{"water_quality_improvement": "40%", "chemical_reduction": "25%", "cost_savings": "$125000", "citizen_satisfaction": "+35%", "pathogen_elimination": "99.9%"}',
    true, true, 2,
    'Discover how Austin''s water treatment facility improved quality by 40% while reducing chemical usage by 25% with HydroCav technology.',
    (SELECT id FROM testimonials WHERE client_name = 'Dr. Michael Chen' LIMIT 1)
);

-- Sample newsletter subscriptions
INSERT INTO newsletter_subscriptions (
    email, first_name, last_name, company, industry, 
    subscription_source, interests, frequency_preference
) VALUES 
('john.doe@example.com', 'John', 'Doe', 'Industrial Solutions Corp', 'Manufacturing', 
 'website', '["water_treatment", "case_studies"]', 'monthly'),
('sarah.tech@waterworks.com', 'Sarah', 'Tech', 'WaterWorks Inc', 'Water Treatment', 
 'website', '["technology_updates", "case_studies"]', 'monthly'),
('mike.green@ecotech.com', 'Mike', 'Green', 'EcoTech Solutions', 'Environmental Services', 
 'contact_form', '["water_treatment", "technology_updates"]', 'quarterly');

-- Step 10: Create views for frontend consumption

-- View for published testimonials with rating stats
CREATE VIEW published_testimonials AS
SELECT 
    t.*,
    CASE 
        WHEN t.company_website IS NOT NULL THEN true 
        ELSE false 
    END as has_website
FROM testimonials t
WHERE t.is_published = true
ORDER BY t.display_order, t.created_at DESC;

-- View for published case studies with preview
CREATE VIEW published_case_studies AS
SELECT 
    cs.*,
    left(cs.challenge_description, 200) as challenge_preview,
    left(cs.solution_description, 200) as solution_preview,
    CASE 
        WHEN cs.testimonial_id IS NOT NULL THEN true 
        ELSE false 
    END as has_testimonial
FROM case_studies cs
WHERE cs.is_published = true
ORDER BY cs.display_order, cs.created_at DESC;

-- View for newsletter subscription stats
CREATE VIEW newsletter_stats AS
SELECT 
    COUNT(*) as total_subscribers,
    COUNT(*) FILTER (WHERE status = 'subscribed') as active_subscribers,
    COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed,
    COUNT(*) FILTER (WHERE subscribed_at > NOW() - INTERVAL '30 days') as new_this_month,
    AVG(email_open_count) as avg_open_rate,
    string_agg(DISTINCT industry, ', ') as top_industries
FROM newsletter_subscriptions;

-- ============================================
-- Business Features Setup Complete
-- ============================================

-- Next steps:
-- 1. Add testimonials section to main website
-- 2. Create case studies pages
-- 3. Add newsletter signup form
-- 4. Integrate with admin dashboard for content management