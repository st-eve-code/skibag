-- Generate missing unique referral codes for existing users
-- Run this ONCE in Supabase Dashboard → SQL Editor → New Query

-- Ensure column exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Temp function to generate unique code
CREATE OR REPLACE FUNCTION generate_unique_referral_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-char uppercase alphanum (matches app logic)
    new_code := upper(
      substring(
        translate(gen_random_uuid()::text, '-', ''), 1, 8
      )
    );
    
    -- Check uniqueness
    SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = new_code)
    INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Update users WITHOUT code (or short codes)
UPDATE public.users 
SET referral_code = generate_unique_referral_code()
WHERE referral_code IS NULL OR LENGTH(referral_code) < 8;

-- Drop temp function
DROP FUNCTION generate_unique_referral_code();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);

-- Verify
SELECT COUNT(*) as total_users, 
       COUNT(referral_code) as users_with_code,
       COUNT(*) FILTER (WHERE referral_code IS NULL) as missing_codes
FROM public.users;

