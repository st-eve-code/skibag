-- Add referral_code column to users table
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
