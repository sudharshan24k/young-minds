-- Add new columns to events table for Monthly Event System
ALTER TABLE events ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pricing DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS guidelines TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS activity_category TEXT; -- 'express', 'challenge', 'brainy'

-- Update existing events to have a default category if needed
UPDATE events SET activity_category = 'general' WHERE activity_category IS NULL;
