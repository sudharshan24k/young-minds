-- Add guidelines column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS guidelines TEXT;

-- Update existing rows to have guidelines same as description if guidelines is null
UPDATE events SET guidelines = description WHERE guidelines IS NULL;
