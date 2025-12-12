-- Fix Event Deletion Issues
-- 1. Ensure submissions are deleted when an event is deleted
ALTER TABLE submissions
DROP CONSTRAINT IF EXISTS submissions_event_id_fkey;

ALTER TABLE submissions
ADD CONSTRAINT submissions_event_id_fkey
FOREIGN KEY (event_id)
REFERENCES events(id)
ON DELETE CASCADE;

-- 2. Ensure RLS allows admins to delete events
-- (Drop first to avoid collision if it exists but is broken)
DROP POLICY IF EXISTS "Admins can delete events" ON events;

CREATE POLICY "Admins can delete events"
ON events FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 3. Just in case: event_registrations (should be CASCADE already, but reinforcing)
ALTER TABLE event_registrations
DROP CONSTRAINT IF EXISTS event_registrations_event_id_fkey;

ALTER TABLE event_registrations
ADD CONSTRAINT event_registrations_event_id_fkey
FOREIGN KEY (event_id)
REFERENCES events(id)
ON DELETE CASCADE;
