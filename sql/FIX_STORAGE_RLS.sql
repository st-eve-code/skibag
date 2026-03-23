-- Fix Storage RLS for custom authentication
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing policies first (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes to avatars" ON storage.objects;

-- Create a policy that allows all authenticated users to upload to avatars bucket
CREATE POLICY "Allow authenticated uploads to avatars"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated updates to avatars"
ON storage.objects FOR UPDATE
TO authenticated, anon
USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated deletes to avatars"
ON storage.objects FOR DELETE
TO authenticated, anon
USING (bucket_id = 'avatars');

-- Make sure public read access exists
DROP POLICY IF EXISTS "Allow public to view avatars" ON storage.objects;
CREATE POLICY "Allow public to view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow authenticated users to view avatars" ON storage.objects;
CREATE POLICY "Allow authenticated users to view avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');
