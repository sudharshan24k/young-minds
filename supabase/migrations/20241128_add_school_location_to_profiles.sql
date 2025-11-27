-- Add school_name and city columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
