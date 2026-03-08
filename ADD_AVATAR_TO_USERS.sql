-- Add avatar_url column to users table
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update any existing users with NULL avatar_url
UPDATE public.users SET avatar_url = NULL WHERE avatar_url IS NULL;
