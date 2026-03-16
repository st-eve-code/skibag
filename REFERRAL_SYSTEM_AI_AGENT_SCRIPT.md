# 🤖 AI Agent Referral System Implementation Script

## Overview

Implement a complete manual referral system for a React Native Expo app (Skibag) using Supabase as the backend. This system allows users to share referral codes manually, tracks referrals, and includes fraud prevention measures.

---

## 1. Database Structure

### 1.1 Users Table - Add Referral Fields

Run this SQL to add referral columns to your existing users table:

```sql
-- Add referral columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
```

### 1.2 Referrals Table - Track Referrals

```sql
-- Create referrals table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_code ON referrals(referrer_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
```

### 1.3 Referral Rewards Table

```sql
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

CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);
```

---

## 2. Database Functions

### 2.1 Generate Unique Referral Code

```sql
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
    suffix := '';
    FOR i IN 1..5 LOOP
      suffix := suffix || SUBSTRING(chars FROM (RANDOM() * 36)::INTEGER + 1 FOR 1);
    END LOOP;

    code := prefix || suffix;
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists_flag;
    attempts := attempts + 1;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;
```

### 2.2 Validate Referral Code

```sql
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
```

### 2.3 Get Referrer User ID from Code

```sql
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
```

### 2.4 Create Referral Record (with self-referral prevention)

```sql
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
  v_referrer_user_id := get_referrer_from_code(p_referrer_code);

  IF v_referrer_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid referral code';
  END IF;

  -- Prevent self-referral
  IF v_referrer_user_id = p_referred_user_id THEN
    RAISE EXCEPTION 'You cannot use your own referral code';
  END IF;

  -- Check if user already used a referral code
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

  RETURN v_referral_id;
END;
$$ LANGUAGE plpgsql;
```

### 2.5 Complete Referral (when referred user performs action)

```sql
CREATE OR REPLACE FUNCTION complete_referral(p_referred_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_referral_id INTEGER;
  v_referrer_user_id UUID;
  v_status TEXT;
BEGIN
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

  -- Award referrer
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
```

### 2.6 View: User Referral Statistics

```sql
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
```

### 2.7 Auto-generate Referral Code Trigger

```sql
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
```

---

## 3. Frontend Implementation

### 3.1 Signup Form - Add Referral Code Field

Modify `app/(auth)/signup.tsx`:

```tsx
// Add this state
const [referralCode, setReferralCode] = useState("");

// Add validation error
const [errors, setErrors] = useState<{
  username?: string;
  password?: string;
  confirmPassword?: string;
  referralCode?: string;  // Add this
}>({});

// Add referral code input to the form (after password fields):
<Text style={styles.inputLabel}>Referral Code (optional)</Text>
<TextInput
  style={[styles.input, errors.referralCode && styles.inputError]}
  placeholder="Enter referral code"
  placeholderTextColor="#888"
  value={referralCode}
  onChangeText={setReferralCode}
  autoCapitalize="characters"
  maxLength={8}
/>
{errors.referralCode && (
  <Text style={styles.errorText}>{errors.referralCode}</Text>
)}

// Pass referral code to signup function
await signUpWithUsername(username.trim(), password, referralCode);
```

### 3.2 Auth Service - Handle Referral

Modify `lib/supabaseAuthService.ts`:

```typescript
// Add referralCode parameter
export async function signUpWithUsername(
  username: string,
  password: string,
  referralCode: string = "",
) {
  // ... existing signup code ...

  // Generate referral code for new user
  const newReferralCode = generateReferralCode(username);

  // Create user with referral code
  const { data: user, error: userError } = await supabase
    .from("users")
    .insert({
      username: username.toLowerCase(),
      password: hashedPassword,
      referral_code: newReferralCode,
      referred_by: referralCode ? referralCode.toUpperCase() : null,
    })
    .select()
    .single();

  if (userError) throw userError;

  // If referral code was provided, validate and create referral record
  if (referralCode) {
    const upperCode = referralCode.toUpperCase().trim();

    // Prevent self-referral
    if (upperCode === newReferralCode) {
      throw new Error("You cannot use your own referral code");
    }

    // Validate referral code exists
    const { data: referrer } = await supabase
      .from("users")
      .select("id, referral_code")
      .eq("referral_code", upperCode)
      .maybeSingle();

    if (!referrer) {
      throw new Error("Invalid referral code");
    }

    // Check if user already used a referral
    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("id")
      .eq("referred_user_id", user.id)
      .maybeSingle();

    if (!existingReferral) {
      // Create referral record
      await supabase.from("referrals").insert({
        referrer_code: upperCode,
        referrer_user_id: referrer.id,
        referred_user_id: user.id,
        referred_email: user.email,
        referred_name: username,
        status: "pending",
        reward_given: false,
      });
    }
  }

  return user;
}

// Helper function to generate referral code
function generateReferralCode(username: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const prefix = username.substring(0, 3).toUpperCase() || "REF";
  let suffix = "";

  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return prefix + suffix;
}
```

### 3.3 Profile Screen - Display Referral Code

Modify `app/(tabs)/profile.tsx`:

```tsx
// Add state for referral stats
const [referralStats, setReferralStats] = useState({
  totalReferrals: 0,
  successfulReferrals: 0,
  pendingReferrals: 0,
});

// Fetch referral stats
const fetchReferralStats = async () => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('status')
      .eq('referrer_code', user?.referral_code);

    if (error) throw error;

    const total = referrals?.length || 0;
    const successful = referrals?.filter(r => r.status === 'completed').length || 0;
    const pending = referrals?.filter(r => r.status === 'pending').length || 0;

    setReferralStats({ totalReferrals: total, successfulReferrals: successful, pendingReferrals: pending });
  } catch (error) {
    console.log('Error fetching referral stats:', error);
  }
};

// Copy referral code function
const copyReferralCode = () => {
  if (user?.referral_code) {
    Clipboard.setString(user.referral_code);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  }
};

// Add to profile UI:
<View style={styles.referralSection}>
  <Text style={styles.sectionTitle}>Your Referral Code</Text>
  <View style={styles.referralCodeBox}>
    <Text style={styles.referralCode}>{user?.referral_code || 'N/A'}</Text>
    <TouchableOpacity onPress={copyReferralCode} style={styles.copyButton}>
      <Ionicons name="copy" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
  <Text style={styles.referralHint}>Share this code with friends!</Text>
</View>

// Add referral stats display:
<View style={styles.referralStats}>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{referralStats.totalReferrals}</Text>
    <Text style={styles.statLabel}>Total</Text>
  </View>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{referralStats.successfulReferrals}</Text>
    <Text style={styles.statLabel}>Successful</Text>
  </View>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{referralStats.pendingReferrals}</Text>
    <Text style={styles.statLabel}>Pending</Text>
  </View>
</View>
```

### 3.4 Referral Reward Trigger

When the referred user performs their first action (purchase, deposit, etc.), call:

```typescript
export async function completeReferral(userId: string) {
  // Call the database function
  const { error } = await supabase.rpc("complete_referral", {
    p_referred_user_id: userId,
  });

  if (error) {
    console.log("Error completing referral:", error);
    return false;
  }

  return true;
}
```

---

## 4. Complete Example Flow

### Step 1: User Signs Up

- User creates account with username "jack" and password
- System generates referral code: "JAC4X2K9"
- User's row in users table:
  ```
  id: 1
  username: jack
  referral_code: JAC4X2K9
  referred_by: NULL
  ```

### Step 2: User Shares Code

- Jack shares "JAC4X2K9" with Mary

### Step 3: New User Signs Up with Referral

- Mary enters referral code "JAC4X2K9"
- System validates the code exists
- System prevents self-referral
- Mary's account is created with her own code: "MAR7Z3P2"
- Referral record is created
- Mary's row in users table:
  ```
  id: 2
  username: mary
  referral_code: MAR7Z3P2
  referred_by: JAC4X2K9
  ```

### Step 4: Referral Record Created

```
referrals table:
id: 1
referrer_code: JAC4X2K9
referrer_user_id: 1
referred_user_id: 2
status: pending
reward_given: false
```

### Step 5: Mary Performs First Action

- Mary makes first purchase/deposit
- System calls `complete_referral(mary_user_id)`
- Referral status updated to "completed"
- Jack receives reward (100 points)
- Reward record created

---

## 5. Testing Queries

```sql
-- Test referral code generation
SELECT generate_referral_code('jack');
-- Result: JAC4X2K9

-- Test referral code validation
SELECT validate_referral_code('JAC4X2K9');
-- Result: true

SELECT validate_referral_code('INVALID');
-- Result: false

-- Get user referral stats
SELECT * FROM user_referral_stats WHERE user_id = 'user-uuid-here';

-- Get all referrals for a user
SELECT * FROM referrals
WHERE referrer_code = 'JAC4X2K9'
ORDER BY created_at DESC;

-- Manually complete a referral (for testing)
SELECT complete_referral('referred-user-uuid');
```

---

## 6. Summary Checklist

- [ ] Run SQL to add referral columns to users table
- [ ] Create referrals table with RLS policies
- [ ] Create referral_rewards table
- [ ] Create database functions (generate, validate, create referral, complete referral)
- [ ] Create trigger for auto-generating referral codes
- [ ] Update signup form to include referral code input
- [ ] Update auth service to handle referral code validation
- [ ] Update profile screen to show referral code with copy button
- [ ] Add referral statistics to profile screen
- [ ] Implement referral reward trigger on first action
- [ ] Test the complete flow

---

## 7. Key Rules Implemented

1. **Referral Code Generation**: 8 characters (3-letter prefix + 5 random chars)
2. **Self-Referral Prevention**: Users cannot use their own code
3. **Code Validation**: Invalid codes are rejected
4. **One Referral Per User**: Each user can only use one referral code
5. **Delayed Rewards**: Rewards given only after first action
6. **Referral Tracking**: Complete history in referrals table

---

_This script was created for the Skibag app referral system implementation._
