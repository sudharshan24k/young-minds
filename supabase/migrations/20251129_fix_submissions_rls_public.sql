-- Fix RLS policies for submissions table to allow PUBLIC access
-- (Required because the Admin Portal is currently bypassing Supabase Auth)

-- 1. Enable RLS (or keep it enabled)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON submissions;
DROP POLICY IF EXISTS "Admins can manage submissions" ON submissions;
DROP POLICY IF EXISTS "Authenticated users can insert submissions" ON submissions;
DROP POLICY IF EXISTS "Authenticated users full access" ON submissions;
DROP POLICY IF EXISTS "Public read submissions" ON submissions;
DROP POLICY IF EXISTS "Public full access" ON submissions;

-- 3. Create a permissive policy for PUBLIC access
-- This allows the "admin-bypass" user (who is technically anonymous) to manage submissions
CREATE POLICY "Public full access"
ON submissions FOR ALL
TO public
USING (true)
WITH CHECK (true);
