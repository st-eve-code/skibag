# 🧪 How to Test All New Features

## Prerequisites
- App is running (`npm run ios` or `npm run android`)
- Firebase rules are deployed
- webClientId is updated

---

## 🎯 Feature Testing Guide

### 1. Test Welcome Bonus & Profile Setup

**Steps:**
1. Open the app
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. App navigates to main screen
5. Tap **"Profile"** tab (bottom right)

**What You Should See:**
- ✅ Your Google profile name
- ✅ Your Google profile picture (or placeholder)
- ✅ **Referral Code** displayed
- ✅ **50 coins** (welcome bonus!)
- ✅ **0 referral points**
- ✅ **0 referrals**

**Screenshot Location:** Profile screen with rewards card at top

---

### 2. Test Referral Code Sharing

**Steps:**
1. In Profile screen, find your referral code
2. Tap the **"Copy"** button next to referral code
3. Should see "Copied to clipboard" message

**What You Should See:**
- ✅ Code copied (8 characters like "A3F8KL92")
- ✅ Toast/alert confirming copy
- ✅ Can paste the code elsewhere

---

### 3. Test Referral System (Earn Points!)

**You need 2 accounts for this test:**

**Account 1 (Referrer):**
1. Sign in and copy referral code
2. Sign out

**Account 2 (New User):**
1. On login screen, you'll see **"Have a referral code? (Optional)"**
2. Enter the referral code from Account 1
3. Click **"Continue with Google"**
4. Sign in with a DIFFERENT Google account
5. Sign out

**Account 1 (Check Rewards):**
1. Sign back in
2. Go to Profile tab

**What You Should See:**
- ✅ **100 referral points** (increased from 0!)
- ✅ **1 referral** count
- ✅ Push notification saying "🎉 New Referral!"

---

### 4. Test Points to Coins Conversion

**Prerequisites:** Have at least 10 referral points

**Steps:**
1. In Profile screen, tap **"Convert Points to Coins"** button
2. Modal opens with input field
3. Enter **"10"** (or any multiple of 10)
4. See preview: "You will receive: 1 coins"
5. Tap **"Convert"**

**What You Should See:**
- ✅ Success alert: "Conversion Successful! 🎉"
- ✅ Points decreased by 10
- ✅ Coins increased by 1
- ✅ Button text updates with new values

**Try Invalid Inputs:**
- Enter "5" → Should show error (not multiple of 10)
- Enter "200" (if you only have 100 points) → Insufficient points error

---

### 5. Test Roulette Game

**Prerequisites:** Have at least 10 coins

**Steps:**
1. In Profile screen, find **"Play Roulette Game"** button
2. Tap the button
3. Roulette screen opens

**What You Should See:**
- ✅ Circular roulette wheel with 8 colored segments
- ✅ Your coin balance in top-right corner
- ✅ Bet amount controls (+/- buttons)
- ✅ Quick bet buttons (10, 25, 50, 100)
- ✅ Big "SPIN" button at bottom

**Play the Game:**
1. Keep default bet of 10 coins
2. Tap **"SPIN"**
3. Watch the wheel spin for 3 seconds
4. See result:
   - **If you won:** Alert shows "🎉 You Won! You won XX coins! (Xx)"
   - **If you lost:** Alert shows "😔 Better Luck Next Time"
5. Check coin balance updated

**Test Multiple Spins:**
- Change bet amount using +/- buttons
- Try quick bet buttons (10, 25, 50, 100)
- Spin multiple times to see different results

---

### 6. Test Profile Picture Upload

**Steps:**
1. In Profile screen, tap your **avatar image** (top center)
2. Sheet opens with 2 options:
   - "Take Photo"
   - "Choose from Gallery"
3. Select **"Choose from Gallery"**
4. Grant permission if asked
5. Select an image

**What You Should See:**
- ✅ **Loading overlay** appears: "Uploading profile picture..."
- ✅ Image uploads (takes 2-5 seconds)
- ✅ Success alert: "Profile picture updated!"
- ✅ New avatar appears immediately
- ✅ Avatar persists after closing and reopening app

**Behind the Scenes:**
- Image uploaded to Firebase Storage
- Old image deleted automatically
- Download URL saved to Firestore

**Verify in Firebase Console:**
1. Go to Storage → avatars folder
2. See your uploaded image file

---

### 7. Test Push Notifications

**Prerequisites:** Using a physical device (notifications don't work well in simulators)

**Steps:**
1. First launch → App requests notification permission
2. Tap **"Allow"**
3. Complete a referral (see Test #3 above)
4. Wait a few seconds

**What You Should See:**
- ✅ Notification appears: "🎉 New Referral!"
- ✅ Body text: "You earned 100 points! Someone used your referral code."
- ✅ Tap notification → App opens

**Test Background Notifications:**
1. Close the app (swipe away)
2. Have someone use your referral code
3. Notification should appear even when app is closed

---

### 8. Verify Data in Firebase Console

**Check Firestore:**
1. Go to: Firebase Console → Firestore Database
2. Open `users` collection
3. Find your user document (by email)

**What You Should See:**
```javascript
{
  uid: "xxxxx",
  email: "your-email@gmail.com",
  displayName: "Your Name",
  avatarUri: "https://firebasestorage.googleapis.com/...",
  rank: "beginner",
  score: 0,
  referralCode: "A3F8KL92",
  referredBy: null,
  referralCount: 1,           // ← Number of referrals
  referralPoints: 90,         // ← After conversion
  coins: 61,                  // ← 50 welcome + 1 converted + 10 won
  totalCoinsEarned: 61,
  rouletteSpins: 1,
  fcmToken: "xxxxx",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Check Transactions:**
1. Open `transactions` collection
2. See records of:
   - Referral rewards (+100 points)
   - Point conversions (-10 points, +1 coin)
   - Roulette bets (-10 coins)
   - Roulette wins (+15 coins)

**Check Storage:**
1. Go to: Firebase Console → Storage
2. Open `avatars` folder
3. See your uploaded profile pictures

---

## 🎮 Complete User Journey Test

**The Full Experience (15 minutes):**

1. **Sign Up**
   - Open app
   - Sign in with Google
   - ✅ See 50 coins welcome bonus

2. **Get Referrals**
   - Copy referral code
   - Have 2 friends sign up with your code
   - ✅ Earn 200 points total

3. **Convert Points**
   - Convert 100 points → 10 coins
   - ✅ Now have 60 coins total

4. **Upload Avatar**
   - Change profile picture
   - ✅ See uploaded to Firebase Storage

5. **Play Roulette**
   - Bet 10 coins, spin the wheel
   - Win 30 coins (if lucky 3x!)
   - Bet 50 coins, spin again
   - ✅ See balance updating

6. **Check History**
   - Go to Firebase Console
   - View all transactions
   - ✅ See complete audit trail

---

## 📊 What to Look For

### In the App:
- ✅ Smooth animations
- ✅ No crashes or errors
- ✅ Data persists after closing app
- ✅ Real-time updates
- ✅ Loading states during uploads
- ✅ Error messages for invalid inputs

### In Firebase Console:
- ✅ Users collection has all fields
- ✅ Transactions collection logs everything
- ✅ Storage has uploaded images
- ✅ Roulette history records spins
- ✅ Notifications collection has alerts

---

## 🐛 Common Issues & Solutions

### Issue: "No ID token returned from Google"
**Solution:** Update `webClientId` in `lib/authService.tsx`

### Issue: "Permission denied" errors in Firestore
**Solution:** Deploy security rules from `FIRESTORE_SECURITY_RULES.txt`

### Issue: Avatar upload fails
**Solution:** Deploy storage rules from `FIREBASE_STORAGE_RULES.txt`

### Issue: Don't see 50 coins after signup
**Solution:** Check Firestore rules allow user creation, check console for errors

### Issue: Convert button doesn't show
**Solution:** Need at least 10 referral points first

### Issue: Roulette button doesn't show
**Solution:** Need at least 10 coins first

### Issue: Notifications not working
**Solution:** 
- Must use physical device (not simulator)
- Check permission was granted
- Verify FCM is set up in Firebase Console

---

## 📱 Recommended Test Devices

**Best Experience:**
- ✅ Physical iPhone (iOS 13+) - For Apple Sign-In & notifications
- ✅ Physical Android device (Android 8+) - For full features
- ⚠️ iOS Simulator - Works but no notifications or camera
- ⚠️ Android Emulator - Works but limited notifications

---

## 🎉 Success Checklist

After testing, you should have:
- [ ] Signed in with Google
- [ ] Received 50 coins welcome bonus
- [ ] Copied your referral code
- [ ] Got 100 points from a referral
- [ ] Received referral notification
- [ ] Converted 10 points to 1 coin
- [ ] Uploaded a profile picture
- [ ] Played roulette at least once
- [ ] Saw your coin balance update
- [ ] Verified data in Firebase Console

---

## 🚀 Ready to Test?

1. Make sure Firebase is configured (see top of this file)
2. Run: `npm run ios` or `npm run android`
3. Follow the tests above in order
4. Have fun! 🎮

---

**Questions?** Check `QUICK_START.md` or `SETUP_CHECKLIST.md`
