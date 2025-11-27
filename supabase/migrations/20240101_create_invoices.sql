-- Create Invoices Table
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Linked to parent
    enrollment_id UUID REFERENCES enrollments(id), -- Linked to enrollment
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'paid', -- 'paid', 'pending', 'failed'
    invoice_number TEXT NOT NULL UNIQUE,
    details JSONB, -- Stores snapshot of student/event details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own invoices
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert (for the mock payment flow)
CREATE POLICY "Authenticated users can create invoices" ON invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
