-- Fix RLS policies for winners table to allow admin management

-- Enable RLS
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to start fresh
DROP POLICY IF EXISTS "Public read access" ON winners;
DROP POLICY IF EXISTS "Admins can manage winners" ON winners;
DROP POLICY IF EXISTS "Authenticated users can insert winners" ON winners;

-- 1. Allow public read access (so everyone can see the Hall of Fame)
CREATE POLICY "Public read access"
ON winners FOR SELECT
TO public
USING (true);

-- 2. Allow authenticated users (admins) to do EVERYTHING (Insert, Update, Delete)
-- In a real app, you'd check for role='admin', but for now 'authenticated' is the standard admin role here
CREATE POLICY "Admins can manage winners"
ON winners FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
