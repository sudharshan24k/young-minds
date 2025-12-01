-- Create Event Registrations Table (for Workshops)
CREATE TABLE event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
    payment_status TEXT DEFAULT 'free', -- 'pending', 'paid', 'free'
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, event_id) -- Prevent duplicate registrations
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policies

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations" ON event_registrations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can register themselves
CREATE POLICY "Users can register themselves" ON event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations" ON event_registrations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
