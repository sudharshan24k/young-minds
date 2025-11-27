-- Allow public read/write access to admin tables
-- WARNING: This removes security for these tables. Use only for local/dev environments.

-- Events
DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Public can manage events" ON events FOR ALL USING (true) WITH CHECK (true);

-- Brainy Bites
DROP POLICY IF EXISTS "Admins can manage brainy_bites" ON brainy_bites;
CREATE POLICY "Public can manage brainy_bites" ON brainy_bites FOR ALL USING (true) WITH CHECK (true);

-- Enrollments
DROP POLICY IF EXISTS "Admins can manage enrollments" ON enrollments;
CREATE POLICY "Public can manage enrollments" ON enrollments FOR ALL USING (true) WITH CHECK (true);

-- Submissions
DROP POLICY IF EXISTS "Admins can manage submissions" ON submissions;
CREATE POLICY "Public can manage submissions" ON submissions FOR ALL USING (true) WITH CHECK (true);

-- User Skills
DROP POLICY IF EXISTS "Admins can manage user_skills" ON user_skills;
CREATE POLICY "Public can manage user_skills" ON user_skills FOR ALL USING (true) WITH CHECK (true);

-- Profiles (Read only for public, update for admin actions if needed)
-- Note: Profiles usually linked to auth.users, but we can allow public read
CREATE POLICY "Public can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can update all profiles" ON profiles FOR UPDATE USING (true);

-- Badges
DROP POLICY IF EXISTS "Admins can manage badges" ON badges;
CREATE POLICY "Public can manage badges" ON badges FOR ALL USING (true) WITH CHECK (true);

-- User Badges
DROP POLICY IF EXISTS "Admins can manage user badges" ON user_badges;
CREATE POLICY "Public can manage user badges" ON user_badges FOR ALL USING (true) WITH CHECK (true);

-- Invoices
DROP POLICY IF EXISTS "Admins can view all invoices" ON invoices;
CREATE POLICY "Public can manage invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
