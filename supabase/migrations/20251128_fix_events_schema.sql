-- Fix Events Table Schema
-- Adds all missing columns required by the frontend and admin app

-- 1. Add missing columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pricing DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS guidelines TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS activity_category TEXT; -- 'express', 'challenge', 'brainy'
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE events ADD COLUMN IF NOT EXISTS month_year TEXT;

-- 2. Add constraints
-- Ensure status is valid
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check 
    CHECK (status IN ('draft', 'active', 'archived'));

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_month_year ON events(month_year);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_activity_category ON events(activity_category);
CREATE INDEX IF NOT EXISTS idx_events_status_dates ON events(status, start_date, end_date);

-- 4. Data Backfill / Cleanup
-- Set default category if null
UPDATE events SET activity_category = 'general' WHERE activity_category IS NULL;

-- Auto-populate month_year from start_date if available
UPDATE events 
SET month_year = TO_CHAR(start_date, 'YYYY-MM')
WHERE start_date IS NOT NULL AND month_year IS NULL;

-- Set status based on dates if currently null or active (to auto-archive past events)
UPDATE events
SET status = CASE
    WHEN end_date < CURRENT_DATE THEN 'archived'
    WHEN start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE THEN 'active'
    WHEN start_date > CURRENT_DATE THEN 'draft'
    ELSE 'active'
END
WHERE status IS NULL;

-- 5. Triggers
-- Function to auto-populate month_year
CREATE OR REPLACE FUNCTION set_event_month_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_date IS NOT NULL THEN
        NEW.month_year := TO_CHAR(NEW.start_date, 'YYYY-MM');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS trg_set_event_month_year ON events;
CREATE TRIGGER trg_set_event_month_year
    BEFORE INSERT OR UPDATE OF start_date ON events
    FOR EACH ROW
    EXECUTE FUNCTION set_event_month_year();
