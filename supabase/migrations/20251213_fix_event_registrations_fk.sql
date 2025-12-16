-- Fix event_registrations foreign key to point to profiles instead of auth.users
-- This allows joining with profiles table in frontend queries

ALTER TABLE event_registrations
DROP CONSTRAINT IF EXISTS event_registrations_user_id_fkey;

-- First ensure all user_ids in event_registrations exist in profiles to avoid FK violations
-- (This is a safety step, though profiles should exist if triggers are working)
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'user'
FROM auth.users
WHERE id IN (SELECT user_id FROM event_registrations)
AND id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Now update the foreign key
ALTER TABLE event_registrations
ADD CONSTRAINT event_registrations_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;
