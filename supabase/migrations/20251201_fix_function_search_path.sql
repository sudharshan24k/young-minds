-- Security Fix: Function Search Path Mutable
-- This migration adds explicit search_path settings to all functions
-- to prevent search_path manipulation attacks
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- Fix 1: handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Fix 2: set_event_month_year function
CREATE OR REPLACE FUNCTION set_event_month_year()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.start_date IS NOT NULL THEN
        NEW.month_year := TO_CHAR(NEW.start_date, 'YYYY-MM');
    END IF;
    RETURN NEW;
END;
$$;

-- Fix 3: enforce_single_featured_per_category_month function
CREATE OR REPLACE FUNCTION enforce_single_featured_per_category_month()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

-- Fix 4: check_daily_login function
CREATE OR REPLACE FUNCTION check_daily_login()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    current_user_id UUID;
    user_profile profiles%ROWTYPE;
    today DATE := CURRENT_DATE;
    yesterday DATE := CURRENT_DATE - 1;
    result json;
BEGIN
    current_user_id := auth.uid();
    
    -- Get user profile
    SELECT * INTO user_profile FROM profiles WHERE id = current_user_id;
    
    IF user_profile.last_login_date = today THEN
        -- Already logged in today, do nothing
        result := json_build_object('status', 'already_logged_in', 'streak', user_profile.streak_count, 'xp_gained', 0);
    ELSIF user_profile.last_login_date = yesterday THEN
        -- Logged in yesterday, increment streak
        UPDATE profiles 
        SET streak_count = streak_count + 1,
            last_login_date = today,
            xp = xp + 10 -- 10 XP for daily login
        WHERE id = current_user_id;
        result := json_build_object('status', 'streak_continued', 'streak', user_profile.streak_count + 1, 'xp_gained', 10);
    ELSE
        -- Streak broken or first login
        UPDATE profiles 
        SET streak_count = 1,
            last_login_date = today,
            xp = xp + 10
        WHERE id = current_user_id;
        result := json_build_object('status', 'streak_reset', 'streak', 1, 'xp_gained', 10);
    END IF;
    
    RETURN result;
END;
$$;

-- Fix 5: set_event_date_fields function (if exists in other migrations)
-- Note: This might be a duplicate of set_event_month_year
CREATE OR REPLACE FUNCTION set_event_date_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.start_date IS NOT NULL THEN
        NEW.month_year := TO_CHAR(NEW.start_date, 'YYYY-MM');
    END IF;
    RETURN NEW;
END;
$$;

-- Fix 6: check_and_award_badges function
CREATE OR REPLACE FUNCTION check_and_award_badges(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix 7: trigger_check_badges function
CREATE OR REPLACE FUNCTION trigger_check_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    -- Only check badges when submission is approved
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        PERFORM check_and_award_badges(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION handle_new_user() IS 'Trigger function to create profile on user signup - search_path hardened';
COMMENT ON FUNCTION set_event_month_year() IS 'Auto-populate month_year from start_date - search_path hardened';
COMMENT ON FUNCTION enforce_single_featured_per_category_month() IS 'Ensure only one featured event per category/month - search_path hardened';
COMMENT ON FUNCTION check_daily_login() IS 'Track daily login streaks and award XP - search_path hardened';
COMMENT ON FUNCTION set_event_date_fields() IS 'Set event date fields - search_path hardened';
COMMENT ON FUNCTION check_and_award_badges(UUID) IS 'Check and award milestone badges - search_path hardened';
COMMENT ON FUNCTION trigger_check_badges() IS 'Trigger to check badges after submission - search_path hardened';
