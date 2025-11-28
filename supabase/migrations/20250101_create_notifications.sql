-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Null means global notification
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own notifications or global notifications
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Only system/admins can insert (for now, we'll allow authenticated users to insert for testing/demo purposes if needed, but ideally this is restricted)
-- For this demo, we'll allow authenticated users to insert to simulate system events if needed, or restrict to service role.
-- Let's stick to standard: Users can only see. Admin/System inserts.
-- But for the sake of the "My Submissions" trigger, we might want a trigger function.

-- Create index for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
