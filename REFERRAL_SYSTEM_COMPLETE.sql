-- =====================================================
-- COMPLETE REFERRAL SYSTEM IMPLEMENTATION
-- =====================================================

-- 1. USERS TABLE - Add referral fields if they don't exist
-- =====================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);

-- 2. REFERRALS TABLE - Enhanced tracking
-- =====================================================
-- Drop existing table if it exists and recreate with enhanced structure
DROP TABLE IF EXISTS referrals;

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_code TEXT NOT NULL,
  referrer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_email TEXT,
  referred_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'blocked')),
  reward_given BOOLEAN DEFAULT FALSE,
  reward_amount INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
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
  USING (
    referrer_code IN (
      SELECT referral_code FROM users WHERE id = auth.uid()
    )
    OR referrer_user_id = auth.uid()
    OR referred_user_id = auth.uid()
  );

-- Allow referrer to update their referrals
CREATE POLICY "Allow update own referrals" ON referrals
  FOR UPDATE TO authenticated
  USING (
    referrer_code IN (
      SELECT referral_code FROM users WHERE id = auth.uid()
    )
    OR referrer_user_id = auth.uid()
  );

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_code ON referrals(referrer_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- 3. REFERRAL REWARDS TABLE - Track rewards
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_rewards (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
  referral_id INTEGER REFERENCES referrals(id) ON DELETE SET NULL,
  reward_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'points',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own rewards
CREATE POLICY "Allow read own rewards" ON referral_rewards
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Allow service role to insert rewards
CREATE POLICY "Allow insert rewards" ON referral_rewards
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);

-- 4. REFERRAL LIMITS TABLE - Prevent abuse
-- =====================================================
CREATE TABLE IF NOT EXISTS referral_limits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  max_referrals INTEGER DEFAULT 50,
  current_referrals INTEGER DEFAULT 0,
  reward_blocked BOOLEAN DEFAULT FALSE,
  block_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE referral_limits ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own limits
CREATE POLICY "Allow read own limits" ON referral_limits
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Create index
CREATE INDEX IF NOT EXISTS idx_referral_limits_user_id ON referral_limits(user_id);

-- 5. FUNCTION: Generate unique referral code
-- =====================================================
CREATE OR REPLACE FUNCTION generate_referral_code(username TEXT)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  prefix TEXT;
  suffix TEXT;
  attempts INTEGER := 0;
  exists_flag BOOLEAN := TRUE;
BEGIN
  -- Generate prefix from username (first 3 letters, uppercase)
  prefix := UPPER(LEFT(username, 3));
  IF prefix IS NULL OR prefix = '' THEN
    prefix := 'REF';
  END IF;
  
  -- Keep generating until we find a unique code
  WHILE exists_flag AND attempts < 100 LOOP
    -- Generate random 5-character suffix
    suffix := '';
    FOR i IN 1..5 LOOP
      suffix := suffix || SUBSTRING(chars FROM (RANDOM() * 36)::INTEGER + 1 FOR 1);
    END LOOP;
    
    code := prefix || suffix;
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists_flag;
    
    IF NOT exists_flag THEN
      SELECT EXISTS(SELECT 1 FROM referrals WHERE referrer_code = code) INTO exists_flag;
    END IF;
    
    attempts := attempts + 1;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- 6. FUNCTION: Validate referral code
-- =====================================================
CREATE OR REPLACE FUNCTION validate_referral_code(p_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  valid BOOLEAN := FALSE;
BEGIN
  IF p_code IS NULL OR LENGTH(TRIM(p_code)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE referral_code = UPPER(TRIM(p_code))
  ) INTO valid;
  
  RETURN valid;
END;
$$ LANGUAGE plpgsql;

-- 7. FUNCTION: Get referrer user ID from code
-- =====================================================
CREATE OR REPLACE FUNCTION get_referrer_from_code(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  referrer_id UUID;
BEGIN
  SELECT id INTO referrer_id
  FROM users
  WHERE referral_code = UPPER(TRIM(p_code))
  LIMIT 1;
  
  RETURN referrer_id;
END;
$$ LANGUAGE plpgsql;

-- 8. FUNCTION: Create referral record
-- =====================================================
CREATE OR REPLACE FUNCTION create_referral_record(
  p_referrer_code TEXT,
  p_referred_user_id UUID,
  p_referred_email TEXT DEFAULT NULL,
  p_referred_name TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_referrer_user_id UUID;
  v_referral_id INTEGER;
BEGIN
  -- Get referrer's user ID from code
  v_referrer_user_id := get_referrer_from_code(p_referrer_code);
  
  IF v_referrer_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid referral code';
  END IF;
  
  -- Prevent self-referral
  IF v_referrer_user_id = p_referred_user_id THEN
    RAISE EXCEPTION 'You cannot use your own referral code';
  END IF;
  
  -- Check if this user was already referred
  IF EXISTS (
    SELECT 1 FROM referrals 
    WHERE referred_user_id = p_referred_user_id
  ) THEN
    RAISE EXCEPTION 'You have already used a referral code';
  END IF;
  
  -- Insert referral record
  INSERT INTO referrals (
    referrer_code,
    referrer_user_id,
    referred_user_id,
    referred_email,
    referred_name,
    status,
    reward_given
  ) VALUES (
    UPPER(TRIM(p_referrer_code)),
    v_referrer_user_id,
    p_referred_user_id,
    p_referred_email,
    p_referred_name,
    'pending',
    FALSE
  )
  RETURNING id INTO v_referral_id;
  
  -- Update referrer's referred_by count (optional)
  -- This can be used for analytics
  
  RETURN v_referral_id;
END;
$$ LANGUAGE plpgsql;

-- 9. FUNCTION: Complete referral (when referred user performs action)
-- =====================================================
CREATE OR REPLACE FUNCTION complete_referral(p_referred_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_referral_id INTEGER;
  v_referrer_user_id UUID;
  v_status TEXT;
BEGIN
  -- Get pending referral for this user
  SELECT id, referrer_user_id, status
  INTO v_referral_id, v_referrer_user_id, v_status
  FROM referrals
  WHERE referred_user_id = p_referred_user_id
    AND status = 'pending'
  LIMIT 1;
  
  IF v_referral_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update referral status
  UPDATE referrals
  SET status = 'completed',
      reward_given = TRUE,
      completed_at = NOW()
  WHERE id = v_referral_id;
  
  -- Award referrer (this would typically be done by the application)
  -- Insert reward record
  INSERT INTO referral_rewards (
    user_id,
    referral_id,
    reward_type,
    reward_amount,
    currency
  ) VALUES (
    v_referrer_user_id,
    v_referral_id,
    'referral_completion',
    100,
    'points'
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 10. VIEW: User referral statistics
-- =====================================================
CREATE OR REPLACE VIEW user_referral_stats AS
SELECT 
  u.id as user_id,
  u.username,
  u.referral_code,
  COUNT(r.id) as total_referrals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as successful_referrals,
  COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_referrals,
  COUNT(CASE WHEN r.reward_given = TRUE THEN 1 END) as rewards_given,
  COALESCE(SUM(CASE WHEN r.reward_given = TRUE THEN rr.reward_amount ELSE 0 END), 0) as total_rewards_earned
FROM users u
LEFT JOIN referrals r ON r.referrer_code = u.referral_code
LEFT JOIN referral_rewards rr ON rr.referral_id = r.id
GROUP BY u.id, u.username, u.referral_code;

-- 11. Insert default referral limit for existing users (optional)
-- =====================================================
INSERT INTO referral_limits (user_id, max_referrals, current_referrals)
SELECT id, 50, 0
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM referral_limits WHERE user_id = users.id
);

-- 12. Create trigger to auto-generate referral code on user creation
-- =====================================================
CREATE OR REPLACE FUNCTION set_referral_code_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_referral_code(COALESCE(NEW.username, 'USER'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_referral_code_trigger ON users;
CREATE TRIGGER set_referral_code_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code_on_insert();

-- =====================================================
-- END OF REFERRAL SYSTEM IMPLEMENTATION
-- =====================================================

-- Test queries (run these to verify):
-- SELECT * FROM user_referral_stats;
-- SELECT validate_referral_code('A7K9P3Q2');
-- SELECT generate_referral_code('jack');
