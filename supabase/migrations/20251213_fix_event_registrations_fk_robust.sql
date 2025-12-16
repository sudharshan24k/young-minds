-- Robust fix for event_registrations foreign key
-- 1. Backfill missing profiles from auth.users
-- 2. Remove orphan registrations (records pointing to non-existent users)
-- 3. Update the foreign key to use specific name for stability

-- Step 1: Backfill missing profiles
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'user'
FROM auth.users
WHERE id IN (SELECT user_id FROM event_registrations)
AND id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Clean up orphans (Safe deletion for integrity)
DELETE FROM event_registrations
WHERE user_id NOT IN (SELECT id FROM profiles);

-- Step 3: Fix Foreign Key
ALTER TABLE event_registrations
DROP CONSTRAINT IF EXISTS event_registrations_user_id_fkey;

ALTER TABLE event_registrations
ADD CONSTRAINT event_registrations_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Step 4: Verify permissions (just in case)
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON event_registrations TO authenticated;
