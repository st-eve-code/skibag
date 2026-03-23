-- ============================================================
-- Create Avatar Storage Bucket for Supabase
-- Run this in: Supabase Dashboard → Storage → New bucket
-- OR run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- To create the avatars bucket, you need to do ONE of the following:

-- OPTION 1: Create via Supabase Dashboard UI
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Enter bucket name: "avatars"
-- 4. Check "Public" checkbox
-- 5. Click "Create bucket"

-- OPTION 2: Using Storage API (programmatically)
-- You cannot create buckets via SQL, but you can via the REST API:
-- POST https://bvvosplyvnkdtsiqokoq.supabase.co/storage/v1/bucket
-- Headers: 
--   Authorization: Bearer YOUR_SERVICE_ROLE_KEY
--   Content-Type: application/json
-- Body: { "name": "avatars", "public": true }

-- After creating the bucket, run these SQL policies 
-- to secure the storage:

-- ============================================================
-- STORAGE POLICIES (run in SQL Editor)
-- ============================================================

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatars
CREATE POLICY "Allow users to update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatars
CREATE POLICY "Allow users to delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view avatars (public read)
CREATE POLICY "Allow public to view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow authenticated users to view all avatars
CREATE POLICY "Allow authenticated users to view avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');
