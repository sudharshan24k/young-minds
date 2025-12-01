-- Fix RLS Performance Issues
-- This migration addresses two main performance concerns identified by Supabase linter:
-- 1. auth_rls_initplan: Wrap auth.uid() calls to prevent per-row re-evaluation
-- 2. multiple_permissive_policies: Consolidate overlapping policies

-- ============================================================================
-- PART 1: Fix auth.uid() calls - Wrap in subqueries for performance
-- ============================================================================

-- -----------------------------
-- PROFILES TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT 
USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles 
FOR UPDATE 
USING ((select auth.uid()) = id)
WITH CHECK ((select auth.uid()) = id);

-- -----------------------------
-- USER_BADGES TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges" ON user_badges 
FOR SELECT 
USING ((select auth.uid()) = user_id);

-- -----------------------------
-- USER_SKILLS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
CREATE POLICY "Users can view own skills" ON user_skills 
FOR SELECT 
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own skills" ON user_skills;
CREATE POLICY "Users can view their own skills" ON user_skills 
FOR SELECT 
USING ((select auth.uid()) = user_id);

-- -----------------------------
-- NOTIFICATIONS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications 
FOR SELECT 
USING ((select auth.uid()) = user_id OR user_id IS NULL);

-- -----------------------------
-- PAYMENTS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments 
FOR SELECT 
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments" ON payments 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- -----------------------------
-- INVOICES TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices 
FOR SELECT 
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can create invoices" ON invoices;
CREATE POLICY "Authenticated users can create invoices" ON invoices 
FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = user_id);

-- -----------------------------
-- COMMENTS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can create pending comments" ON comments;
CREATE POLICY "Users can create pending comments" ON comments 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Users can read own comments" ON comments;
CREATE POLICY "Users can read own comments" ON comments 
FOR SELECT 
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admin full access for comments" ON comments;
CREATE POLICY "Admin full access for comments" ON comments 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- -----------------------------
-- REACTIONS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can manage own reactions" ON reactions;
CREATE POLICY "Users can manage own reactions" ON reactions 
FOR ALL 
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

-- -----------------------------
-- TEAM_REGISTRATIONS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Users can read own registrations" ON team_registrations;
CREATE POLICY "Users can read own registrations" ON team_registrations 
FOR SELECT 
USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own registrations" ON team_registrations;
CREATE POLICY "Users can create own registrations" ON team_registrations 
FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admin full access for team_registrations" ON team_registrations;
CREATE POLICY "Admin full access for team_registrations" ON team_registrations 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- -----------------------------
-- TEAM_EVENTS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Admin full access for team_events" ON team_events;
CREATE POLICY "Admin full access for team_events" ON team_events 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- -----------------------------
-- TEAMS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Admin full access for teams" ON teams;
CREATE POLICY "Admin full access for teams" ON teams 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- -----------------------------
-- TEAM_MEMBERS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Admin full access for team_members" ON team_members;
CREATE POLICY "Admin full access for team_members" ON team_members 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- -----------------------------
-- WINNERS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Only admins can insert winners" ON winners;
CREATE POLICY "Only admins can insert winners" ON winners 
FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Only admins can update winners" ON winners;
CREATE POLICY "Only admins can update winners" ON winners 
FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Only admins can delete winners" ON winners;
CREATE POLICY "Only admins can delete winners" ON winners 
FOR DELETE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'
    )
);

-- -----------------------------
-- EVENTS TABLE (if not using public bypass)
-- -----------------------------
DROP POLICY IF EXISTS "Admin full access for events" ON events;
CREATE POLICY "Admin full access for events" ON events 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- -----------------------------
-- EMAIL_TEMPLATES TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON email_templates;
CREATE POLICY "Enable read access for authenticated users" ON email_templates
FOR SELECT TO authenticated
USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON email_templates;
CREATE POLICY "Enable insert access for authenticated users" ON email_templates
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON email_templates;
CREATE POLICY "Enable update access for authenticated users" ON email_templates
FOR UPDATE TO authenticated
USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON email_templates;
CREATE POLICY "Enable delete access for authenticated users" ON email_templates
FOR DELETE TO authenticated
USING ((select auth.uid()) IS NOT NULL);

-- -----------------------------
-- EMAIL_LOGS TABLE
-- -----------------------------
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON email_logs;
CREATE POLICY "Enable read access for authenticated users" ON email_logs
FOR SELECT TO authenticated
USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON email_logs;
CREATE POLICY "Enable insert access for authenticated users" ON email_logs
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) IS NOT NULL);

-- ============================================================================
-- PART 2: Consolidate Multiple Permissive Policies
-- ============================================================================

-- Note: For submissions and enrollments, we're keeping "Public full access" 
-- and "Public can manage" policies as they appear to be intentional workarounds
-- for the admin portal. Other redundant policies will be removed.

-- -----------------------------
-- BADGES TABLE
-- Consolidate: "Public badges are viewable by everyone", 
--              "Public can manage badges", 
--              "Public read access for badges"
-- -----------------------------
DROP POLICY IF EXISTS "Public badges are viewable by everyone" ON badges;
DROP POLICY IF EXISTS "Public can manage badges" ON badges;
-- Keep this one as the consolidated policy:
-- "Public read access for badges" already exists

-- -----------------------------
-- COMMENTS TABLE
-- Keep only non-overlapping policies
-- We already updated "Admin full access" above, and it covers all operations
-- -----------------------------
-- The policies are now:
-- 1. "Public read access for approved comments" - for public/anon
-- 2. "Users can create pending comments" - for creating comments (optimized above)
-- 3. "Users can read own comments" - for reading own comments (optimized above)
-- 4. "Admin full access for comments" - for admins (optimized above)
-- These are actually fine as they serve different purposes

-- -----------------------------
-- PROFILES TABLE
-- Consolidate overlapping UPDATE policies
-- Currently: "Public can update all profiles", "Users can update own profile", 
--            "Admins can update all profiles"
-- -----------------------------
DROP POLICY IF EXISTS "Public can update all profiles" ON profiles;
-- This seems like it shouldn't exist - public shouldn't update all profiles
-- Keep "Users can update own profile" (already updated above) and admin policy
-- The admin policy "Admins can update all profiles" has USING (true) which is too permissive
-- Let's make it check for admin role:
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles 
FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
);

-- Also consolidate SELECT policies
DROP POLICY IF EXISTS "Public can view all profiles" ON profiles;
-- Just keep a single policy for viewing all profiles
CREATE POLICY "Public can view all profiles" ON profiles 
FOR SELECT 
USING (true);
-- This allows anyone to view any profile, plus users can view own via the other policy

-- -----------------------------
-- CERTIFICATE_TEMPLATES TABLE
-- The two policies serve different purposes, but admin check can be optimized
-- -----------------------------
DROP POLICY IF EXISTS "Admins can manage certificate templates" ON certificate_templates;
CREATE POLICY "Admins can manage certificate templates" ON certificate_templates 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (select auth.uid()) AND role = 'admin'
    )
);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profile information with optimized RLS policies';
COMMENT ON TABLE user_badges IS 'User badge achievements with optimized RLS policies';
COMMENT ON TABLE user_skills IS 'User skills tracking with optimized RLS policies';
COMMENT ON TABLE notifications IS 'User notifications with optimized RLS policies';
COMMENT ON TABLE payments IS 'Payment records with optimized RLS policies';
COMMENT ON TABLE invoices IS 'Invoice records with optimized RLS policies';
COMMENT ON TABLE comments IS 'Submission comments with optimized RLS policies';
COMMENT ON TABLE reactions IS 'Submission reactions with optimized RLS policies';
COMMENT ON TABLE team_registrations IS 'Team event registrations with optimized RLS policies';
COMMENT ON TABLE team_events IS 'Team events with optimized RLS policies';
COMMENT ON TABLE teams IS 'Teams with optimized RLS policies';
COMMENT ON TABLE team_members IS 'Team member records with optimized RLS policies';
COMMENT ON TABLE winners IS 'Contest winners with optimized RLS policies';
COMMENT ON TABLE events IS 'Events with optimized RLS policies';
COMMENT ON TABLE email_templates IS 'Email templates with optimized RLS policies';
COMMENT ON TABLE email_logs IS 'Email logs with optimized RLS policies';
COMMENT ON TABLE badges IS 'Achievement badges with consolidated RLS policies';
COMMENT ON TABLE certificate_templates IS 'Certificate templates with optimized RLS policies';
