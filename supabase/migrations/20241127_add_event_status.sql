-- Migration: Add status and month_year fields to events table
-- Created: 2024-11-27
-- Purpose: Support monthly events with automatic archiving and filtering

-- Add status field to track event lifecycle
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add month_year field for easier filtering and grouping
ALTER TABLE events ADD COLUMN IF NOT EXISTS month_year TEXT;

-- Add constraint to ensure valid status values
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check 
    CHECK (status IN ('draft', 'active', 'archived'));

-- Create index on month_year for efficient filtering
CREATE INDEX IF NOT EXISTS idx_events_month_year ON events(month_year);

-- Create index on status for efficient queries
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Create composite index for common queries (status + start_date)
CREATE INDEX IF NOT EXISTS idx_events_status_dates ON events(status, start_date, end_date);

-- Function to auto-populate month_year from start_date
CREATE OR REPLACE FUNCTION set_event_month_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_date IS NOT NULL THEN
        NEW.month_year := TO_CHAR(NEW.start_date, 'YYYY-MM');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set month_year on insert/update
DROP TRIGGER IF EXISTS trg_set_event_month_year ON events;
CREATE TRIGGER trg_set_event_month_year
    BEFORE INSERT OR UPDATE OF start_date ON events
    FOR EACH ROW
    EXECUTE FUNCTION set_event_month_year();

-- Update existing events to set month_year from existing start_date
UPDATE events 
SET month_year = TO_CHAR(start_date, 'YYYY-MM')
WHERE start_date IS NOT NULL AND month_year IS NULL;

-- Update existing events to set status based on dates
UPDATE events
SET status = CASE
    WHEN end_date < CURRENT_DATE THEN 'archived'
    WHEN start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE THEN 'active'
    WHEN start_date > CURRENT_DATE THEN 'draft'
    ELSE 'active'
END
WHERE status IS NULL OR status = 'active';

-- Add comment to table
COMMENT ON COLUMN events.status IS 'Event status: draft (not yet started), active (currently running), archived (ended)';
COMMENT ON COLUMN events.month_year IS 'Month and year in YYYY-MM format, auto-populated from start_date';
