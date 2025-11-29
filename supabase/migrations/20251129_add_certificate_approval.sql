-- Add certificate_approved column to submissions and winners tables
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS certificate_approved BOOLEAN DEFAULT false;
ALTER TABLE winners ADD COLUMN IF NOT EXISTS certificate_approved BOOLEAN DEFAULT false;
