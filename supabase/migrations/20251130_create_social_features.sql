-- Social Features: Comments and Reactions
-- Tables for managing user engagement on submissions

-- 1. Create comments table
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create reactions table
CREATE TABLE reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL, -- 'heart', 'clap', 'star', 'fire', 'high_five'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(submission_id, user_id, reaction_type)
);

-- 3. Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Comments: Public read approved, Users create pending, Admin full access
CREATE POLICY "Public read access for approved comments"
ON comments FOR SELECT
USING (status = 'approved');

CREATE POLICY "Users can create pending comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can read own comments"
ON comments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admin full access for comments"
ON comments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Reactions: Public read, Users manage own
CREATE POLICY "Public read access for reactions"
ON reactions FOR SELECT
USING (true);

CREATE POLICY "Users can manage own reactions"
ON reactions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Indexes for performance
CREATE INDEX idx_comments_submission ON comments(submission_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_reactions_submission ON reactions(submission_id);
