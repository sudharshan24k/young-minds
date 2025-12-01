-- Fix RLS policies for team events to allow admin INSERT operations
-- The original policy had USING clause but was missing WITH CHECK for INSERT

-- Drop and recreate the admin policy with both USING and WITH CHECK
DROP POLICY IF EXISTS "Admin full access for team_events" ON team_events;

CREATE POLICY "Admin full access for team_events"
ON team_events FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Also fix other team-related tables to ensure consistency
DROP POLICY IF EXISTS "Admin full access for team_registrations" ON team_registrations;

CREATE POLICY "Admin full access for team_registrations"
ON team_registrations FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admin full access for teams" ON teams;

CREATE POLICY "Admin full access for teams"
ON teams FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

DROP POLICY IF EXISTS "Admin full access for team_members" ON team_members;

CREATE POLICY "Admin full access for team_members"
ON team_members FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
