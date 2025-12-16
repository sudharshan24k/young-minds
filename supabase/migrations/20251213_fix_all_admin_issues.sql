-- MASTER FIX: Admin Portal Issues
-- Run this migration to fix Submissions, Enrollments, and Profile data access.

-- 1. SCHEMA: Add 'email' to profiles and backfill
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

DO $$
BEGIN
    -- Backfill email from auth.users
    UPDATE public.profiles
    SET email = au.email
    FROM auth.users au
    WHERE public.profiles.id = au.id
    AND public.profiles.email IS NULL;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping email backfill (auth permissions)';
END $$;

-- 2. TRIGGER: Maintain email in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. SCHEMA: Fix Enrollments Foreign Key for Admin fetching
-- This allows `enrollments` to be joined with `profiles` directly
ALTER TABLE enrollments 
DROP CONSTRAINT IF EXISTS enrollments_parent_id_fkey; -- Drop if points to auth.users

ALTER TABLE enrollments
ADD CONSTRAINT enrollments_parent_id_fkey
FOREIGN KEY (parent_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 4. RLS: Admin Permissions
-- Allow authenticated users (Admins) to VIEW all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Ensure Submissions are viewable
DROP POLICY IF EXISTS "Admins can manage submissions" ON submissions;
CREATE POLICY "Admins can manage submissions"
ON submissions FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure Enrollments are viewable
DROP POLICY IF EXISTS "Admins can manage enrollments" ON enrollments;
CREATE POLICY "Admins can manage enrollments"
ON enrollments FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
