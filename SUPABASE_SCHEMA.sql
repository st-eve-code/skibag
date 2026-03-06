-- ============================================================
-- Skibag Gaming Platform — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────────
-- 0. USERS (Custom Auth Table)
--    Simple username/password storage for custom authentication
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username        TEXT UNIQUE NOT NULL,
  password        TEXT NOT NULL,
  rank            TEXT NOT NULL DEFAULT 'beginner',
  coins           INTEGER NOT NULL DEFAULT 50,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_username_idx ON public.users (username);

-- Disable RLS for users table (simplest for custom auth)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- 1. PROFILES
--    One row per authenticated user.
--    id matches auth.users.id (UUID).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          TEXT UNIQUE NOT NULL,
  display_name      TEXT,
  avatar_url        TEXT,
  rank              TEXT NOT NULL DEFAULT 'beginner',   -- beginner | advanced | pro | legend
  score             INTEGER NOT NULL DEFAULT 0,
  coins             INTEGER NOT NULL DEFAULT 50,        -- welcome bonus
  referral_points   INTEGER NOT NULL DEFAULT 0,
  referral_code     TEXT UNIQUE,                        -- 8-char code shared by this user
  referred_by       TEXT,                               -- referral_code used at signup
  referral_count    INTEGER NOT NULL DEFAULT 0,
  total_coins_earned INTEGER NOT NULL DEFAULT 50,
  roulette_spins    INTEGER NOT NULL DEFAULT 0,
  fcm_token         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────
-- 2. TRANSACTIONS
--    Records every coin / point movement.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,   -- 'welcome_bonus' | 'referral_points' | 'points_to_coins' | 'roulette_win' | 'roulette_loss'
  amount      INTEGER NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'coins',  -- 'coins' | 'points'
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS transactions_user_id_created_at_idx
  ON public.transactions (user_id, created_at DESC);

-- ─────────────────────────────────────────────
-- 3. ROULETTE HISTORY
--    One row per spin.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roulette_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bet_amount  INTEGER NOT NULL,
  multiplier  NUMERIC(4,2) NOT NULL,  -- 0 | 1.5 | 2 | 3 | 5
  payout      INTEGER NOT NULL,
  result      TEXT NOT NULL,          -- 'win' | 'loss'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roulette_history_user_id_created_at_idx
  ON public.roulette_history (user_id, created_at DESC);

-- ─────────────────────────────────────────────
-- 4. NOTIFICATIONS
--    Push notification records.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  type        TEXT,           -- 'referral' | 'reward' | 'tournament' etc.
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_created_at_idx
  ON public.notifications (user_id, created_at DESC);

-- ─────────────────────────────────────────────
-- 5. GAME RATINGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.game_ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id     TEXT NOT NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS game_ratings_game_id_idx
  ON public.game_ratings (game_id, rating);

-- ─────────────────────────────────────────────
-- 6. FEEDBACK
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message     TEXT NOT NULL,
  category    TEXT,           -- 'bug' | 'feature' | 'general'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roulette_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_ratings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback         ENABLE ROW LEVEL SECURITY;

-- profiles: users can read/update their own row; insert handled by trigger below
CREATE POLICY "profiles_select_own"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- transactions: own rows only
CREATE POLICY "transactions_own" ON public.transactions
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- roulette_history: own rows only
CREATE POLICY "roulette_own" ON public.roulette_history
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notifications: own rows only
CREATE POLICY "notifications_own" ON public.notifications
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- game_ratings: anyone can read; own rows for write
CREATE POLICY "game_ratings_read_all" ON public.game_ratings FOR SELECT USING (TRUE);
CREATE POLICY "game_ratings_write_own" ON public.game_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "game_ratings_update_own" ON public.game_ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- feedback: own rows only
CREATE POLICY "feedback_own" ON public.feedback
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGN UP
-- Triggered whenever a new row is inserted into auth.users
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _username TEXT;
  _referral_code TEXT;
BEGIN
  -- Extract username from user metadata (set during signUp)
  _username := NEW.raw_user_meta_data->>'username';

  -- Fallback: derive from email (strip @skibag.app)
  IF _username IS NULL OR _username = '' THEN
    _username := split_part(NEW.email, '@', 1);
  END IF;

  -- Generate a unique 8-char referral code
  _referral_code := upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  INSERT INTO public.profiles (id, username, referral_code, coins, referral_points, rank)
  VALUES (NEW.id, _username, _referral_code, 50, 0, 'beginner')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
