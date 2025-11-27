-- Create Events Table
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'competition', 'workshop', 'general'
    date DATE,
    description TEXT,
    formats TEXT, -- Comma-separated list of allowed formats
    icon TEXT, -- Icon name from Lucide
    color TEXT, -- Tailwind color class
    skills TEXT[], -- Array of skills rewarded (e.g., ['Creativity', 'Logic'])
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Brainy Bites Table
CREATE TABLE brainy_bites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'video', 'article'
    url TEXT, -- For videos
    content TEXT, -- For articles
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Enrollments Table
CREATE TABLE enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES auth.users(id), -- Linked to parent if logged in
    child_name TEXT NOT NULL,
    child_age INTEGER NOT NULL,
    grade TEXT NOT NULL,
    city TEXT NOT NULL,
    parent_contact TEXT NOT NULL,
    activity_type TEXT NOT NULL, -- 'express', 'challenge', 'brainy'
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'confirmed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Submissions Table
CREATE TABLE submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Linked to the user who submitted
    event_id UUID REFERENCES events(id), -- Optional, can be null for general submissions
    category TEXT NOT NULL, -- 'art', 'writing', 'video', 'stem', 'express_yourself'
    description TEXT,
    reflection TEXT,
    file_url TEXT,
    participant_name TEXT, -- Can be linked to a user table in future
    votes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Profiles Table (Linked to Auth Users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create User Skills Table
CREATE TABLE user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, skill) -- Ensure one record per skill per user
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE brainy_bites ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Create Policies (Secured for Production)
-- Events: Everyone can read
CREATE POLICY "Public events are viewable by everyone" ON events FOR SELECT USING (true);

-- Brainy Bites: Everyone can read
CREATE POLICY "Public brainy bites are viewable by everyone" ON brainy_bites FOR SELECT USING (true);

-- Enrollments: 
-- Public can insert (for guest enrollments)
CREATE POLICY "Public can enroll" ON enrollments FOR INSERT WITH CHECK (true);
-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = parent_id);

-- Submissions: 
-- Authenticated users can insert
CREATE POLICY "Authenticated users can submit" ON submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- Public can view approved submissions (for gallery)
CREATE POLICY "Public can view approved submissions" ON submissions FOR SELECT USING (status = 'approved');
-- Users can view their own submissions (regardless of status)
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);

-- Profiles: Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Skills:
-- Users can view their own skills
CREATE POLICY "Users can view own skills" ON user_skills FOR SELECT USING (auth.uid() = user_id);

-- NOTE: Public UPDATE on submissions (for voting) has been removed for security.
-- To implement secure voting, use a Postgres Function (RPC) to increment votes atomically.

-- ADMIN POLICIES (Authenticated Users)
-- Grants full access to logged-in users (Admins)
CREATE POLICY "Admins can manage events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage brainy_bites" ON brainy_bites FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage enrollments" ON enrollments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage submissions" ON submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage user_skills" ON user_skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Badges Table
CREATE TABLE badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Icon name from Lucide
    criteria TEXT, -- Description of how to earn
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create User Badges Table
CREATE TABLE user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_id)
);

-- Update Profiles Table (Add Gamification Fields)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_date DATE;

-- Enable RLS for new tables
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for Badges
CREATE POLICY "Public badges are viewable by everyone" ON badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage badges" ON badges FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies for User Badges
CREATE POLICY "Public user badges are viewable by everyone" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage user badges" ON user_badges FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RPC Function to Check Daily Login Streak
CREATE OR REPLACE FUNCTION check_daily_login()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    user_profile profiles%ROWTYPE;
    today DATE := CURRENT_DATE;
    yesterday DATE := CURRENT_DATE - 1;
    result json;
BEGIN
    current_user_id := auth.uid();
    
    -- Get user profile
    SELECT * INTO user_profile FROM profiles WHERE id = current_user_id;
    
    IF user_profile.last_login_date = today THEN
        -- Already logged in today, do nothing
        result := json_build_object('status', 'already_logged_in', 'streak', user_profile.streak_count, 'xp_gained', 0);
    ELSIF user_profile.last_login_date = yesterday THEN
        -- Logged in yesterday, increment streak
        UPDATE profiles 
        SET streak_count = streak_count + 1,
            last_login_date = today,
            xp = xp + 10 -- 10 XP for daily login
        WHERE id = current_user_id;
        result := json_build_object('status', 'streak_continued', 'streak', user_profile.streak_count + 1, 'xp_gained', 10);
    ELSE
        -- Streak broken or first login
        UPDATE profiles 
        SET streak_count = 1,
            last_login_date = today,
            xp = xp + 10
        WHERE id = current_user_id;
        result := json_build_object('status', 'streak_reset', 'streak', 1, 'xp_gained', 10);
    END IF;
    
    RETURN result;
END;
$$;

-- Storage Bucket Policy (You need to create a bucket named 'submissions' in the dashboard)
-- This SQL doesn't create the bucket, but sets up the policy if you run it in the SQL editor
-- INSERT INTO storage.buckets (id, name) VALUES ('submissions', 'submissions');
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'submissions' );
-- CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'submissions' );
-- Create Invoices Table
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Linked to parent
    enrollment_id UUID REFERENCES enrollments(id), -- Linked to enrollment
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'paid', -- 'paid', 'pending', 'failed'
    invoice_number TEXT NOT NULL UNIQUE,
    details JSONB, -- Stores snapshot of student/event details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own invoices
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert (for the mock payment flow)
CREATE POLICY "Authenticated users can create invoices" ON invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Add role column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'; -- 'user', 'admin', 'teacher'

-- Update RLS to allow admins to update profiles
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
