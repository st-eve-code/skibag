-- Run this in Supabase SQL Editor to create users table and disable RLS

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT 'beginner',
  coins INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disable RLS for users table (required for custom auth to work)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Verify the table was created
SELECT * FROM public.users LIMIT 5;

