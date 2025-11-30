-- Achievement System: Enhanced Badges with Automatic Unlocking
-- This migration adds rarity, collections, and automatic milestone badges

-- 1. Enhance badges table with new fields
ALTER TABLE badges ADD COLUMN IF NOT EXISTS badge_type TEXT DEFAULT 'special';
ALTER TABLE badges ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common';
ALTER TABLE badges ADD COLUMN IF NOT EXISTS collection_name TEXT;
ALTER TABLE badges ADD COLUMN IF NOT EXISTS unlock_criteria JSONB;
ALTER TABLE badges ADD COLUMN IF NOT EXISTS auto_unlock BOOLEAN DEFAULT FALSE;
ALTER TABLE badges ADD COLUMN IF NOT EXISTS icon_url TEXT;
ALTER TABLE badges ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Add constraints for badge_type and rarity
ALTER TABLE badges DROP CONSTRAINT IF EXISTS badges_badge_type_check;
ALTER TABLE badges ADD CONSTRAINT badges_badge_type_check 
    CHECK (badge_type IN ('milestone', 'special', 'collection'));

ALTER TABLE badges DROP CONSTRAINT IF EXISTS badges_rarity_check;
ALTER TABLE badges ADD CONSTRAINT badges_rarity_check 
    CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'));

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_badges_rarity ON badges(rarity);
CREATE INDEX IF NOT EXISTS idx_badges_collection ON badges(collection_name);
CREATE INDEX IF NOT EXISTS idx_badges_auto_unlock ON badges(auto_unlock) WHERE auto_unlock = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_badges_user_badge ON user_badges(user_id, badge_id);

-- 4. Function to check and award milestone badges
CREATE OR REPLACE FUNCTION check_and_award_badges(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_submissions INTEGER;
    art_submissions INTEGER;
    writing_submissions INTEGER;
    stem_submissions INTEGER;
    badge_record RECORD;
BEGIN
    -- Get submission counts
    SELECT COUNT(*) INTO total_submissions
    FROM submissions
    WHERE user_id = target_user_id AND status = 'approved';
    
    -- Art submissions (art, express_yourself categories)
    SELECT COUNT(*) INTO art_submissions
    FROM submissions
    WHERE user_id = target_user_id 
      AND status = 'approved'
      AND category IN ('art', 'express_yourself', 'drawing', 'painting');
    
    -- Writing submissions
    SELECT COUNT(*) INTO writing_submissions
    FROM submissions
    WHERE user_id = target_user_id 
      AND status = 'approved'
      AND category IN ('writing', 'creative_writing', 'poetry', 'story');
    
    -- STEM submissions
    SELECT COUNT(*) INTO stem_submissions
    FROM submissions
    WHERE user_id = target_user_id 
      AND status = 'approved'
      AND category IN ('stem', 'science', 'math', 'coding', 'experiment');
    
    -- Check all auto-unlock badges
    FOR badge_record IN 
        SELECT id, unlock_criteria 
        FROM badges 
        WHERE auto_unlock = TRUE
    LOOP
        -- Check if user already has this badge
        IF NOT EXISTS (
            SELECT 1 FROM user_badges 
            WHERE user_id = target_user_id AND badge_id = badge_record.id
        ) THEN
            -- Check unlock criteria
            IF badge_record.unlock_criteria IS NOT NULL THEN
                -- Total submission milestones
                IF badge_record.unlock_criteria->>'type' = 'submission_count' AND
                   badge_record.unlock_criteria->>'category' IS NULL THEN
                    IF total_submissions >= (badge_record.unlock_criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id)
                        VALUES (target_user_id, badge_record.id);
                    END IF;
                
                -- Category-specific milestones
                ELSIF badge_record.unlock_criteria->>'type' = 'submission_count' AND
                      badge_record.unlock_criteria->>'category' = 'art' THEN
                    IF art_submissions >= (badge_record.unlock_criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id)
                        VALUES (target_user_id, badge_record.id);
                    END IF;
                
                ELSIF badge_record.unlock_criteria->>'type' = 'submission_count' AND
                      badge_record.unlock_criteria->>'category' = 'writing' THEN
                    IF writing_submissions >= (badge_record.unlock_criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id)
                        VALUES (target_user_id, badge_record.id);
                    END IF;
                
                ELSIF badge_record.unlock_criteria->>'type' = 'submission_count' AND
                      badge_record.unlock_criteria->>'category' = 'stem' THEN
                    IF stem_submissions >= (badge_record.unlock_criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id)
                        VALUES (target_user_id, badge_record.id);
                    END IF;
                END IF;
            END IF;
        END IF;
    END LOOP;
END;
$$;

-- 5. Trigger to check badges after submission approval
CREATE OR REPLACE FUNCTION trigger_check_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only check badges when submission is approved
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        PERFORM check_and_award_badges(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_submission_approved ON submissions;
CREATE TRIGGER after_submission_approved
    AFTER INSERT OR UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_check_badges();

-- 6. Seed initial milestone badges

-- Total Submission Milestones
INSERT INTO badges (name, description, icon, badge_type, rarity, auto_unlock, unlock_criteria, sort_order)
VALUES 
('First Steps', 'Submitted your first creation! The journey begins.', 'Star', 'milestone', 'common', TRUE, 
 '{"type": "submission_count", "count": 1}'::jsonb, 1),
 
('Getting Started', 'Five submissions and counting! You''re on a roll.', 'Zap', 'milestone', 'common', TRUE,
 '{"type": "submission_count", "count": 5}'::jsonb, 2),
 
('Dedicated Creator', 'Ten amazing submissions! Your dedication shines.', 'Trophy', 'milestone', 'rare', TRUE,
 '{"type": "submission_count", "count": 10}'::jsonb, 3),
 
('Prolific Artist', 'Twenty-five submissions! You''re truly prolific.', 'Star', 'milestone', 'epic', TRUE,
 '{"type": "submission_count", "count": 25}'::jsonb, 4),
 
('Master Creator', 'Fifty submissions! You''re a master of your craft.', 'Trophy', 'milestone', 'epic', TRUE,
 '{"type": "submission_count", "count": 50}'::jsonb, 5),
 
('Legend', 'ONE HUNDRED submissions! You are a true legend!', 'Trophy', 'milestone', 'legendary', TRUE,
 '{"type": "submission_count", "count": 100}'::jsonb, 6)

ON CONFLICT DO NOTHING;

-- Artist Series
INSERT INTO badges (name, description, icon, badge_type, rarity, collection_name, auto_unlock, unlock_criteria, sort_order)
VALUES 
('Artist Beginner', 'Created 5 amazing artworks!', 'Palette', 'collection', 'common', 'Artist Series', TRUE,
 '{"type": "submission_count", "count": 5, "category": "art"}'::jsonb, 10),
 
('Artist Pro', 'Ten artistic masterpieces! You''re a pro.', 'Palette', 'collection', 'rare', 'Artist Series', TRUE,
 '{"type": "submission_count", "count": 10, "category": "art"}'::jsonb, 11),
 
('Artist Master', 'Twenty-five artworks! True mastery achieved.', 'Palette', 'collection', 'epic', 'Artist Series', TRUE,
 '{"type": "submission_count", "count": 25, "category": "art"}'::jsonb, 12)

ON CONFLICT DO NOTHING;

-- Writer Series
INSERT INTO badges (name, description, icon, badge_type, rarity, collection_name, auto_unlock, unlock_criteria, sort_order)
VALUES 
('Writer''s Path', 'Five written pieces! The pen is yours.', 'Heart', 'collection', 'common', 'Writer Series', TRUE,
 '{"type": "submission_count", "count": 5, "category": "writing"}'::jsonb, 20),
 
('Wordsmith', 'Ten written works! You craft words beautifully.', 'Heart', 'collection', 'rare', 'Writer Series', TRUE,
 '{"type": "submission_count", "count": 10, "category": "writing"}'::jsonb, 21),
 
('Literary Star', 'Twenty-five stories and poems! A literary star!', 'Heart', 'collection', 'epic', 'Writer Series', TRUE,
 '{"type": "submission_count", "count": 25, "category": "writing"}'::jsonb, 22)

ON CONFLICT DO NOTHING;

-- STEM Champion Series
INSERT INTO badges (name, description, icon, badge_type, rarity, collection_name, auto_unlock, unlock_criteria, sort_order)
VALUES 
('STEM Explorer', 'Five STEM projects! Science is awesome.', 'Zap', 'collection', 'common', 'STEM Champion', TRUE,
 '{"type": "submission_count", "count": 5, "category": "stem"}'::jsonb, 30),
 
('STEM Expert', 'Ten STEM submissions! You''re an expert.', 'Zap', 'collection', 'rare', 'STEM Champion', TRUE,
 '{"type": "submission_count", "count": 10, "category": "stem"}'::jsonb, 31),
 
('STEM Champion', 'Twenty-five STEM projects! A true champion!', 'Zap', 'collection', 'epic', 'STEM Champion', TRUE,
 '{"type": "submission_count", "count": 25, "category": "stem"}'::jsonb, 32)

ON CONFLICT DO NOTHING;

-- 7. Run initial badge check for all existing users
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT DISTINCT id FROM auth.users LOOP
        PERFORM check_and_award_badges(user_record.id);
    END LOOP;
END $$;

-- 8. Add comments for documentation
COMMENT ON COLUMN badges.badge_type IS 'Type of badge: milestone (auto-unlock), special (manual), or collection (category-specific)';
COMMENT ON COLUMN badges.rarity IS 'Badge rarity: common, rare, epic, legendary';
COMMENT ON COLUMN badges.collection_name IS 'Collection grouping (e.g., Artist Series, STEM Champion)';
COMMENT ON COLUMN badges.unlock_criteria IS 'JSON criteria for auto-unlock: {"type": "submission_count", "count": 10, "category": "art"}';
COMMENT ON COLUMN badges.auto_unlock IS 'Whether badge automatically unlocks when criteria are met';
COMMENT ON COLUMN badges.icon_url IS 'URL to custom badge icon image';
COMMENT ON COLUMN badges.sort_order IS 'Display order for badges';
