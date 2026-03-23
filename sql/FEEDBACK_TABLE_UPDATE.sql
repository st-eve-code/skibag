-- ============================================================
-- Complete SQL Setup for Skibag App
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. Create users table (if not exists)
--    Required for custom username/password auth
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT 'beginner',
  coins INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 2. Fix feedback table - Remove FK constraint
--    This allows feedback without requiring a profile
-- ─────────────────────────────────────────────
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_user_id_fkey;
ALTER TABLE public.feedback ALTER COLUMN user_id DROP NOT NULL;

-- ─────────────────────────────────────────────
-- 3. Fix feedback table RLS policies (if not exists)
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "feedback_own" ON public.feedback;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'feedback_insert_anyone'
    ) THEN
        CREATE POLICY "feedback_insert_anyone" ON public.feedback FOR INSERT WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'feedback_select_anyone'
    ) THEN
        CREATE POLICY "feedback_select_anyone" ON public.feedback FOR SELECT USING (true);
    END IF;
END $$;

-- ─────────────────────────────────────────────
-- 4. Add rating column to feedback table (if not exists)
-- ─────────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'feedback' AND column_name = 'rating'
    ) THEN
        ALTER TABLE public.feedback ADD COLUMN rating SMALLINT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'feedback_rating_check'
    ) THEN
        ALTER TABLE public.feedback ADD CONSTRAINT feedback_rating_check CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$;

-- Verify feedback table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;

