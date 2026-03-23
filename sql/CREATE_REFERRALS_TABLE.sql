-- Create referrals table to track referral signups
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_code TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email TEXT,
  referred_name TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert referrals (from the signup page)
CREATE POLICY "Allow insert referrals" ON referrals
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow only referrer to read their referrals
CREATE POLICY "Allow read own referrals" ON referrals
  FOR SELECT TO authenticated
  USING (referrer_code IN (
    SELECT referral_code FROM users WHERE id = auth.uid()
  ));

-- Create index for faster lookups by referrer_code
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_code ON referrals(referrer_code);

-- Create index for faster lookups by referred_user_id
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
