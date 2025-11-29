-- Complete fix for Events Table Schema
-- Adds ALL missing columns required by the frontend and admin app

-- 1. Add ALL missing columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS pricing DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS guidelines TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS activity_category TEXT; -- 'express', 'challenge', 'brainy'
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE events ADD COLUMN IF NOT EXISTS month_year TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS date DATE; -- For compatibility
ALTER TABLE events ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'event'; -- For compatibility
ALTER TABLE events ADD COLUMN IF NOT EXISTS formats TEXT; -- Accepted submission formats

-- 2. Add constraints
-- Ensure status is valid
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check 
    CHECK (status IN ('draft', 'active', 'archived', 'upcoming'));

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

-- Sync date with start_date
UPDATE events 
SET date = start_date
WHERE start_date IS NOT NULL AND date IS NULL;

-- Set default type
UPDATE events 
SET type = 'event'
WHERE type IS NULL;

-- Set status based on dates if currently null
UPDATE events
SET status = CASE
    WHEN end_date < CURRENT_DATE THEN 'archived'
    WHEN start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE THEN 'active'
    WHEN start_date > CURRENT_DATE THEN 'upcoming'
    ELSE 'active'
END
WHERE status IS NULL;

-- 5. Triggers
-- Function to auto-populate month_year and sync date
CREATE OR REPLACE FUNCTION set_event_date_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_date IS NOT NULL THEN
        NEW.month_year := TO_CHAR(NEW.start_date, 'YYYY-MM');
        NEW.date := NEW.start_date;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS trg_set_event_date_fields ON events;
CREATE TRIGGER trg_set_event_date_fields
    BEFORE INSERT OR UPDATE OF start_date ON events
    FOR EACH ROW
    EXECUTE FUNCTION set_event_date_fields();
