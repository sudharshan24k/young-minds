-- Add is_paid column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;

-- Update existing events
-- If pricing > 0, set is_paid to true
UPDATE events SET is_paid = true WHERE pricing > 0;
