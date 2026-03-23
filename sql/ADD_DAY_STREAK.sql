-- Add day_streak column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS day_streak INTEGER DEFAULT 0;

-- Add last_streak_date column to track when the streak was last updated
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE;

-- Add created_at if it doesn't exist (for new users)
-- This should already exist based on the original schema
