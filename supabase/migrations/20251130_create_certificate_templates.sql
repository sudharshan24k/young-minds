-- Create certificate_templates table
CREATE TABLE certificate_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    layout_type TEXT NOT NULL DEFAULT 'classic', -- 'classic', 'modern', 'elegant', 'playful'
    color_scheme JSONB DEFAULT '{"primary": "#1e40af", "secondary": "#fbbf24", "accent": "#10b981"}'::jsonb,
    preview_image_url TEXT,
    
    -- Default content (can be overridden per event)
    default_title TEXT DEFAULT 'Certificate of Achievement',
    default_message TEXT DEFAULT 'This is to certify that {name} has successfully participated in {event} on {date}.',
    default_footer TEXT DEFAULT 'Keep up the great work!',
    
    -- Design settings
    border_style TEXT DEFAULT 'solid', -- 'solid', 'double', 'decorative', 'none'
    background_pattern TEXT DEFAULT 'none', -- 'none', 'dots', 'lines', 'waves'
    font_family TEXT DEFAULT 'serif', -- 'serif', 'sans-serif', 'cursive'
    
    -- Signature settings
    signature_count INTEGER DEFAULT 1, -- 1 or 2 signatures
    signature_1_title TEXT DEFAULT 'Event Coordinator',
    signature_2_title TEXT,
    
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add certificate fields to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS certificate_template_id UUID REFERENCES certificate_templates(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS certificate_title TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS certificate_message TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS certificate_footer TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS use_template_defaults BOOLEAN DEFAULT true;

-- Enable RLS
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- Policies for certificate_templates
CREATE POLICY "Public can view certificate templates" ON certificate_templates FOR SELECT USING (true);
CREATE POLICY "Admins can manage certificate templates" ON certificate_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default templates
INSERT INTO certificate_templates (name, description, layout_type, color_scheme, default_title, default_message, default_footer, border_style, background_pattern, font_family, is_default)
VALUES 
(
    'Classic Certificate',
    'Traditional certificate design with elegant borders',
    'classic',
    '{"primary": "#1e40af", "secondary": "#fbbf24", "accent": "#10b981"}'::jsonb,
    'Certificate of Achievement',
    'This is to certify that {name} has successfully participated in {event} and demonstrated excellent {category} skills.',
    'Presented on {date}',
    'double',
    'none',
    'serif',
    true
),
(
    'Modern Certificate',
    'Clean and contemporary design with vibrant colors',
    'modern',
    '{"primary": "#7c3aed", "secondary": "#ec4899", "accent": "#06b6d4"}'::jsonb,
    'Outstanding Achievement',
    'Congratulations to {name} for exceptional participation in {event}!',
    'Keep shining bright! • {date}',
    'solid',
    'dots',
    'sans-serif',
    false
),
(
    'Elegant Certificate',
    'Sophisticated design with decorative elements',
    'elegant',
    '{"primary": "#0f172a", "secondary": "#d4af37", "accent": "#475569"}'::jsonb,
    'Certificate of Excellence',
    'It is hereby certified that {name} has completed {event} with distinction.',
    'Awarded this day of {date}',
    'decorative',
    'waves',
    'serif',
    false
),
(
    'Playful Certificate',
    'Fun and colorful design perfect for young achievers',
    'playful',
    '{"primary": "#f97316", "secondary": "#a855f7", "accent": "#22c55e"}'::jsonb,
    '🌟 Super Star Certificate 🌟',
    'Awesome job, {name}! You rocked {event} and showed amazing {category} talent!',
    'You''re a star! ⭐ {date}',
    'solid',
    'dots',
    'cursive',
    false
);

-- Create index for faster lookups
CREATE INDEX idx_events_certificate_template ON events(certificate_template_id);
CREATE INDEX idx_certificate_templates_default ON certificate_templates(is_default);
