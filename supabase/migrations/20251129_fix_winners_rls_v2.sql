-- Fix RLS policies for winners table (V2 - Robust Fix)

-- 1. Enable RLS
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON winners;
DROP POLICY IF EXISTS "Admins can manage winners" ON winners;
DROP POLICY IF EXISTS "Authenticated users can insert winners" ON winners;
DROP POLICY IF EXISTS "Only admins can insert winners" ON winners;
DROP POLICY IF EXISTS "Enable read access for all users" ON winners;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON winners;
DROP POLICY IF EXISTS "Enable update for users based on email" ON winners;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON winners;

-- 3. Create simple, permissive policies

-- Allow EVERYONE to view winners (Public Read)
CREATE POLICY "Public read winners"
ON winners FOR SELECT
TO public
USING (true);

-- Allow ANY Authenticated user to Insert/Update/Delete
-- (In a production app, you would restrict this to specific admin IDs or roles)
CREATE POLICY "Authenticated users full access"
ON winners FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
