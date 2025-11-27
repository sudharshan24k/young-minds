-- Add is_public column to submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
