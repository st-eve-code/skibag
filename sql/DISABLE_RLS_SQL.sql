-- Run this in Supabase Dashboard → SQL Editor to fix the 406 error

-- Disable RLS for users table (required for custom auth to work)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

