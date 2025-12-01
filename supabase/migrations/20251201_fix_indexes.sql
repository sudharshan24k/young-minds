-- Fix Database Indexes
-- This migration addresses performance issues identified by Supabase linter:
-- 1. unindexed_foreign_keys: Add indexes to foreign keys
-- 2. unused_index: Remove indexes that are not being used

-- ============================================================================
-- PART 1: Add Missing Indexes (Unindexed Foreign Keys)
-- ============================================================================

-- comments table
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- email_logs table
CREATE INDEX IF NOT EXISTS idx_email_logs_template_id ON email_logs(template_id);

-- enrollments table
CREATE INDEX IF NOT EXISTS idx_enrollments_parent_id ON enrollments(parent_id);

-- invoices table
CREATE INDEX IF NOT EXISTS idx_invoices_enrollment_id ON invoices(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);

-- payments table
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- reactions table
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);

-- submissions table
CREATE INDEX IF NOT EXISTS idx_submissions_event_id ON submissions(event_id);

-- team_registrations table
CREATE INDEX IF NOT EXISTS idx_team_registrations_user_id ON team_registrations(user_id);

-- user_badges table
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);

-- winners table
CREATE INDEX IF NOT EXISTS idx_winners_event_id ON winners(event_id);
CREATE INDEX IF NOT EXISTS idx_winners_submission_id ON winners(submission_id);

-- ============================================================================
-- PART 2: Remove Unused Indexes
-- ============================================================================

-- winners table
DROP INDEX IF EXISTS idx_winners_category;

-- team_members table
DROP INDEX IF EXISTS idx_team_members_team;
DROP INDEX IF EXISTS idx_team_members_user;

-- submissions table
DROP INDEX IF EXISTS idx_submissions_grade;

-- notifications table
DROP INDEX IF EXISTS idx_notifications_created_at;

-- comments table
DROP INDEX IF EXISTS idx_comments_submission;
DROP INDEX IF EXISTS idx_comments_status;

-- reactions table
DROP INDEX IF EXISTS idx_reactions_submission;

-- events table
DROP INDEX IF EXISTS idx_events_certificate_template;
DROP INDEX IF EXISTS idx_events_status;
DROP INDEX IF EXISTS idx_events_event_type;
DROP INDEX IF EXISTS idx_events_is_featured;
DROP INDEX IF EXISTS idx_events_featured_month;

-- certificate_templates table
DROP INDEX IF EXISTS idx_certificate_templates_default;

-- badges table
DROP INDEX IF EXISTS idx_badges_type;
DROP INDEX IF EXISTS idx_badges_rarity;
DROP INDEX IF EXISTS idx_badges_collection;
DROP INDEX IF EXISTS idx_badges_auto_unlock;

-- teams table
DROP INDEX IF EXISTS idx_teams_event;
