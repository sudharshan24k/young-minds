-- Update winners table for Hall of Fame workflow

-- 1. Add status column
ALTER TABLE winners 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' 
CHECK (status IN ('draft', 'published'));

-- 2. Fix user_id foreign key to reference profiles instead of auth.users
-- This helps with joins and avoids 400 errors when fetching profile data
ALTER TABLE winners
DROP CONSTRAINT IF EXISTS winners_user_id_fkey;

ALTER TABLE winners
ADD CONSTRAINT winners_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 3. Create index for status
CREATE INDEX IF NOT EXISTS idx_winners_status ON winners(status);
