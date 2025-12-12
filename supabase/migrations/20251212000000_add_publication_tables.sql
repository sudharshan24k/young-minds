-- Create Publications Table
CREATE TABLE IF NOT EXISTS publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    guidelines TEXT,
    cost DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'draft', -- 'draft', 'active', 'closed'
    max_entries INTEGER DEFAULT 50,
    max_pages_per_entry INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Publication Topics Table
CREATE TABLE IF NOT EXISTS publication_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    assigned_user_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'open', -- 'open', 'assigned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Publication Submissions Table
CREATE TABLE IF NOT EXISTS publication_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    topic_id UUID REFERENCES publication_topics(id),
    file_url TEXT,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    status TEXT DEFAULT 'pending_submission', -- 'pending_submission', 'pending', 'approved', 'rejected'
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(publication_id, user_id)
);

-- Enable RLS
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Publications
DROP POLICY IF EXISTS "Public can view active publications" ON publications;
CREATE POLICY "Public can view active publications" ON publications FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage publications" ON publications;
CREATE POLICY "Admins can manage publications" ON publications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Topics
DROP POLICY IF EXISTS "Public can view topics" ON publication_topics;
CREATE POLICY "Public can view topics" ON publication_topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage topics" ON publication_topics;
CREATE POLICY "Admins can manage topics" ON publication_topics FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can create topics" ON publication_topics;
CREATE POLICY "Authenticated users can create topics" ON publication_topics FOR INSERT TO authenticated WITH CHECK (true);

-- Submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON publication_submissions;
CREATE POLICY "Users can view own submissions" ON publication_submissions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all submissions" ON publication_submissions;
CREATE POLICY "Admins can view all submissions" ON publication_submissions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can create submissions" ON publication_submissions;
CREATE POLICY "Authenticated users can create submissions" ON publication_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own submissions" ON publication_submissions;
CREATE POLICY "Users can update own submissions" ON publication_submissions FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update submissions" ON publication_submissions;
CREATE POLICY "Admins can update submissions" ON publication_submissions FOR UPDATE TO authenticated USING (true); -- Allow admins to approve/reject
