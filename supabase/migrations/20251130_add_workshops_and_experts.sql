-- Add Workshops, Q&A Sessions, and Expert Features
-- This migration extends the events table to support multiple event types
-- and adds expert/creator information for workshops and Q&A sessions

-- 1. Add event type and expert fields to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'competition';
ALTER TABLE events ADD COLUMN IF NOT EXISTS expert_name TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expert_title TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expert_bio TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expert_image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;

-- 2. Add constraint for event_type
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_type_check;
ALTER TABLE events ADD CONSTRAINT events_event_type_check 
    CHECK (event_type IN ('competition', 'workshop', 'qna_session'));

-- 3. Add expert attribution to submissions for expert feedback
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS feedback_expert_name TEXT;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_events_featured_month ON events(is_featured, month_year, activity_category) WHERE is_featured = TRUE;

-- 5. Backfill existing events as 'competition' type
UPDATE events 
SET event_type = 'competition' 
WHERE event_type IS NULL;

-- 6. Create function to ensure only one featured event per category per month
CREATE OR REPLACE FUNCTION enforce_single_featured_per_category_month()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_featured = TRUE THEN
        -- Unfeatured any existing featured event in the same category and month
        UPDATE events 
        SET is_featured = FALSE 
        WHERE is_featured = TRUE 
          AND activity_category = NEW.activity_category 
          AND month_year = NEW.month_year
          AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for featured event enforcement
DROP TRIGGER IF EXISTS trg_enforce_single_featured ON events;
CREATE TRIGGER trg_enforce_single_featured
    BEFORE INSERT OR UPDATE OF is_featured ON events
    FOR EACH ROW
    WHEN (NEW.is_featured = TRUE)
    EXECUTE FUNCTION enforce_single_featured_per_category_month();

-- 8. Add comments for documentation
COMMENT ON COLUMN events.event_type IS 'Type of event: competition, workshop, or qna_session';
COMMENT ON COLUMN events.expert_name IS 'Name of expert/creator leading the workshop or Q&A';
COMMENT ON COLUMN events.expert_title IS 'Professional title of the expert (e.g., Professional Artist, NASA Scientist)';
COMMENT ON COLUMN events.expert_bio IS 'Biography and credentials of the expert';
COMMENT ON COLUMN events.expert_image_url IS 'URL to expert profile picture';
COMMENT ON COLUMN events.video_url IS 'URL to recorded workshop video (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN events.is_featured IS 'Whether this event/creator is featured for the month';
COMMENT ON COLUMN events.registration_required IS 'Whether participants need to register for this event';
COMMENT ON COLUMN events.max_participants IS 'Maximum number of participants (for Q&A sessions)';
COMMENT ON COLUMN submissions.feedback_expert_name IS 'Name of expert who provided the feedback';
