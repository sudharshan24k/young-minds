-- Update submissions table for enhanced workflow

-- 1. Fix user_id foreign key to reference profiles
-- This resolves the 400 error when joining with profiles
ALTER TABLE submissions
DROP CONSTRAINT IF EXISTS submissions_user_id_fkey;

ALTER TABLE submissions
ADD CONSTRAINT submissions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- 2. Clean up duplicate submissions (keep the latest one)
DELETE FROM submissions
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
        ROW_NUMBER() OVER (partition BY user_id, event_id ORDER BY created_at DESC) as rnum
        FROM submissions
    ) t
    WHERE t.rnum > 1
);

-- 3. Enforce single submission per event per user
ALTER TABLE submissions
ADD CONSTRAINT submissions_user_event_unique UNIQUE (user_id, event_id);

-- 3. Add admin_grade column (1-10 scale)
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS admin_grade INTEGER CHECK (admin_grade >= 1 AND admin_grade <= 10);

-- 4. Create index for grading queries
CREATE INDEX IF NOT EXISTS idx_submissions_grade ON submissions(admin_grade);
