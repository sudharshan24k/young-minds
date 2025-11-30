-- Team Events System
-- Tables for managing team-based events, registrations, and team formation

-- 1. Create team_events table
CREATE TABLE team_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    start_date DATE,
    end_date DATE,
    registration_deadline DATE,
    min_team_size INTEGER DEFAULT 2,
    max_team_size INTEGER DEFAULT 5,
    status TEXT DEFAULT 'upcoming', -- 'upcoming', 'open', 'closed', 'active', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create team_registrations table (individual students registering for an event)
CREATE TABLE team_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES team_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'placed', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- 3. Create teams table
CREATE TABLE teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES team_events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create team_members table (linking users to teams)
CREATE TABLE team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'member', 'leader'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(team_id, user_id)
);

-- 5. Enable Row Level Security
ALTER TABLE team_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- team_events: Public read, Admin write
CREATE POLICY "Public read access for team_events"
ON team_events FOR SELECT
USING (true);

CREATE POLICY "Admin full access for team_events"
ON team_events FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- team_registrations: Users read/create own, Admin full access
CREATE POLICY "Users can read own registrations"
ON team_registrations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
ON team_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access for team_registrations"
ON team_registrations FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- teams: Public read (or restricted to participants), Admin full access
CREATE POLICY "Public read access for teams"
ON teams FOR SELECT
USING (true);

CREATE POLICY "Admin full access for teams"
ON teams FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- team_members: Public read (or restricted), Admin full access
CREATE POLICY "Public read access for team_members"
ON team_members FOR SELECT
USING (true);

CREATE POLICY "Admin full access for team_members"
ON team_members FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 7. Indexes for performance
CREATE INDEX idx_team_events_status ON team_events(status);
CREATE INDEX idx_team_registrations_event_user ON team_registrations(event_id, user_id);
CREATE INDEX idx_teams_event ON teams(event_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
