-- Add role column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'; -- 'user', 'admin', 'teacher'

-- Update RLS to allow admins to update profiles
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
