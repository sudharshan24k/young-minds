# 🚀 Quick Start Guide - Supabase Integration

## ⚡ Deploy Database (5 minutes)

### Step 1: Execute SQL Schema
1. Go to: https://supabase.com/dashboard/project/dokhowszhsyeqfgqdnkd
2. Click **SQL Editor** → **New Query**
3. Copy all content from `supabase_schema.sql`
4. Paste and click **Run**

### Step 2: Create Storage Bucket
1. Go to **Storage** in sidebar
2. Click **New Bucket**
3. Name: `submissions`
4. Public: **Yes**
5. Click **Create**

### Step 3: Start Apps
```bash
# Main App
npm run dev

# Admin App (in new terminal)
cd admin
npm run dev
```

## ✅ Verify Setup

1. **Main App** (http://localhost:5173)
   - Navigate to Gallery → Should load without errors
   - Go to Enroll → Fill and submit form

2. **Admin App** (http://localhost:5173/admin or configured port)
   - Check Dashboard → See statistics
   - View Submissions → Approve some submissions
   - Check Enrollments → See your test enrollment

3. **Supabase Dashboard**
   - Check `enrollments` table → Your test data
   - Check `submissions` table → See submissions

## 🎯 You're Done!

Your Young Minds platform is now fully connected to Supabase! 🎉

---

**Need help?** See [SUPABASE_SETUP.md](file:///Users/sudharshanvenkatraman/Desktop/youngminds/SUPABASE_SETUP.md) for detailed instructions.
