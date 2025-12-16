-- Remove Gamification Features
-- This migration drops all tables and columns related to the gamification system

-- Drop triggers
DROP TRIGGER IF EXISTS after_submission_approved ON submissions;

-- Drop functions
DROP FUNCTION IF EXISTS trigger_check_badges();
DROP FUNCTION IF EXISTS check_and_award_badges(UUID);

-- Drop tables
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS badges;

-- Drop columns from profiles
ALTER TABLE profiles 
DROP COLUMN IF EXISTS points,
DROP COLUMN IF EXISTS level,
DROP COLUMN IF EXISTS xp,
DROP COLUMN IF EXISTS streak_count;
