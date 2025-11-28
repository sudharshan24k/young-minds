-- Add profile customization columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT 'purple',
ADD COLUMN IF NOT EXISTS avatar_preset TEXT;
