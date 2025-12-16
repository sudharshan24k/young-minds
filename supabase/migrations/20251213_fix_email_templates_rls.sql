-- Fix RLS policies for email_templates to allow admin access
-- This migration replaces restrictive policies with permissive ones for authenticated users (admins)

-- 1. Email Templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON email_templates;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON email_templates;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON email_templates;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON email_templates;

-- Create comprehensive policy
CREATE POLICY "Admins can manage email templates" ON email_templates
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. Email Logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON email_logs;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON email_logs;

-- Create comprehensive policy
CREATE POLICY "Admins can manage email logs" ON email_logs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
