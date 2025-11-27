-- Add profile_picture_url to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Create winners table
CREATE TABLE IF NOT EXISTS winners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    category TEXT NOT NULL, -- e.g., 'art', 'music', 'storytelling'
    prize_type TEXT NOT NULL, -- 'first', 'second', 'peoples_choice', 'participation'
    month INTEGER NOT NULL, -- 1-12
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, submission_id, prize_type)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_winners_month_year ON winners(year, month);
CREATE INDEX IF NOT EXISTS idx_winners_category ON winners(category);
CREATE INDEX IF NOT EXISTS idx_winners_user ON winners(user_id);

-- Enable RLS
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Policies for winners table
CREATE POLICY "Winners are viewable by everyone"
    ON winners FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert winners"
    ON winners FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can update winners"
    ON winners FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete winners"
    ON winners FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create storage bucket for profile pictures if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile pictures
CREATE POLICY "Profile pictures are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile picture"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-pictures' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own profile picture"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-pictures' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own profile picture"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-pictures' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
