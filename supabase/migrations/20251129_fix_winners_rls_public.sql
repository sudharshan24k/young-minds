-- Fix RLS policies for winners table to allow PUBLIC access
-- (Required because the Admin Portal is currently bypassing Supabase Auth)

-- 1. Enable RLS (or keep it enabled)
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON winners;
DROP POLICY IF EXISTS "Admins can manage winners" ON winners;
DROP POLICY IF EXISTS "Authenticated users can insert winners" ON winners;
DROP POLICY IF EXISTS "Authenticated users full access" ON winners;
DROP POLICY IF EXISTS "Public read winners" ON winners;

-- 3. Create a permissive policy for PUBLIC access
-- This allows the "admin-bypass" user (who is technically anonymous) to manage winners
CREATE POLICY "Public full access"
ON winners FOR ALL
TO public
USING (true)
WITH CHECK (true);
