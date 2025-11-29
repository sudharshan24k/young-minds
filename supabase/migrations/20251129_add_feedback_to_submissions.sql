-- Add admin_feedback column to submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS admin_feedback TEXT;
