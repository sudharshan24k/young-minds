# Supabase Setup Guide

This guide will help you set up the Supabase database for the Young Minds @ Edura platform.

## Prerequisites

- Supabase account (create one at [supabase.com](https://supabase.com))
- Access to your Supabase project dashboard

## Step 1: Execute Database Schema

1. **Open your Supabase project dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project: `dokhowszhsyeqfgqdnkd`

2. **Open the SQL Editor**
   - Click on the **SQL Editor** icon in the left sidebar
   - Click **New Query**

3. **Copy and execute the schema**
   - Open the file `supabase_schema.sql` in your project root
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click **Run** to execute

4. **Verify table creation**
   - Go to **Table Editor** in the sidebar
   - You should see the following tables:
     - `profiles`
     - `events`
     - `brainy_bites`
     - `enrollments`
     - `submissions`
     - `user_skills`
     - `badges`
     - `user_badges`

## Step 2: Configure Storage

1. **Create Storage Bucket**
   - Go to **Storage** in the sidebar
   - Click **New Bucket**
   - Name: `submissions`
   - Public: **Yes** (for public access to approved submissions)
   - Click **Create Bucket**

2. **Set Storage Policies**
   - Click on the `submissions` bucket
   - Go to **Policies** tab
   - Add the following policies:

   **Policy 1: Public Read**
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'submissions' );
   ```

   **Policy 2: Authenticated Upload**
   ```sql
   CREATE POLICY "Authenticated Upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'submissions' AND
     auth.role() = 'authenticated'
   );
   ```

## Step 3: Configure Authentication (Optional)

If you want to enable user authentication:

1. **Go to Authentication** in the sidebar
2. **Enable Email/Password authentication**
   - Settings > Providers > Email
   - Enable Email provider

3. **Configure Email Templates** (Optional)
   - Customize confirmation and password reset emails

## Step 4: Verify Environment Variables

Ensure your `.env` files are configured correctly:

**Main App** (`.env`):
```env
VITE_SUPABASE_URL=https://dokhowszhsyeqfgqdnkd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRva2hvd3N6aHN5ZXFmZ3FkbmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzYzNDYsImV4cCI6MjA3OTQ1MjM0Nn0.krHr3H79VlyjXSMa0H7fR76Jt83iboJcaUJ8CgZT5Pg
```

**Admin App** (`admin/.env`):
```env
VITE_SUPABASE_URL=https://dokhowszhsyeqfgqdnkd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRva2hvd3N6aHN5ZXFmZ3FkbmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzYzNDYsImV4cCI6MjA3OTQ1MjM0Nn0.krHr3H79VlyjXSMa0H7fR76Jt83iboJcaUJ8CgZT5Pg
```

## Step 5: Start Development Servers

**Main App:**
```bash
npm run dev
```

**Admin App:**
```bash
cd admin
npm run dev
```

## Testing the Connection

1. **Test Database Connection**
   - Navigate to the admin dashboard at http://localhost:5173/admin
   - Check the Users page - it should load without errors
   - Check the Submissions page - it should load without errors

2. **Test Enrollment Submission**
   - Navigate to the Enroll page on the main site
   - Fill out and submit the form
   - Verify the enrollment appears in the `enrollments` table in Supabase

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Ensure `.env` files exist in both root and `admin` directories
- Restart the dev server after creating `.env` files

### Error: "relation [table_name] does not exist"
- The database schema hasn't been executed
- Go back to Step 1 and run the SQL schema

### Error: "Storage bucket not found"
- Create the `submissions` bucket in Supabase Storage
- Ensure the bucket is set to public

## Security Notes

- **Row Level Security (RLS)** is enabled on all tables
- The `anon` key is safe for client-side use with RLS enabled
- Never commit `.env` files to version control
- For production, consider using the service role key only on the server-side

## Next Steps

Once setup is complete:
1. ✅ Database tables created
2. ✅ Storage bucket configured
3. ✅ Environment variables set
4. ✅ Both apps can connect to Supabase

You're ready to start using Supabase in your Young Minds platform!
