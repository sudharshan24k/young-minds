-- Create payments table for tracking transactions and invoices
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'completed', -- pending, completed, failed
    invoice_number TEXT UNIQUE NOT NULL,
    payment_method TEXT, -- card, upi, etc.
    transaction_id TEXT, -- external gateway ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can view their own payments
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Admins can view all payments (using the public bypass for now, or authenticated admin)
CREATE POLICY "Admins can view all payments"
ON payments FOR SELECT
TO public
USING (true);

-- 3. Insert policy (usually server-side, but allowing public for now for demo/mock)
CREATE POLICY "Enable insert for payments"
ON payments FOR INSERT
TO public
WITH CHECK (true);
