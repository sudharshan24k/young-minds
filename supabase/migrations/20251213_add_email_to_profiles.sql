-- Add email column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Backfill email from auth.users (requires permission to read auth.users)
-- Note: In Supabase, direct access to auth.users is often restricted for security.
-- However, running this as a migration in the dashboard or via admin client works.
-- If running via RLS-restricted client, this might fail, but migrations usually run as postgres/admin.

DO $$
BEGIN
    -- Update existing profiles with emails from auth.users
    UPDATE public.profiles
    SET email = au.email
    FROM auth.users au
    WHERE public.profiles.id = au.id
    AND public.profiles.email IS NULL;
END $$;

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
