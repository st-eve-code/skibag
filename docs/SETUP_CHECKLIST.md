# Setup Checklist ✅

Use this checklist to ensure everything is configured correctly.

## 📋 Pre-Development

- [ ] Node.js 18+ installed
- [ ] Expo CLI installed globally: `npm install -g expo-cli`
- [ ] Firebase project created
- [ ] Git repository initialized

## 🔧 Firebase Console Setup

### Authentication
- [ ] Go to Authentication → Sign-in method
- [ ] Enable Google Sign-In
- [ ] Enable Apple Sign-In (for iOS)
- [ ] Copy Web Client ID

### Firestore Database
- [ ] Create Firestore database
- [ ] Copy rules from `FIRESTORE_SECURITY_RULES.txt`
- [ ] Paste rules in Firestore → Rules tab
- [ ] Publish rules
- [ ] Create indexes:
  - [ ] `users` collection: `referralCode` (Ascending)
  - [ ] `transactions` collection: `userId` (Asc) + `createdAt` (Desc)
  - [ ] `gameRatings` collection: `gameId` (Asc) + `rating` (Asc)
  - [ ] `rouletteHistory` collection: `userId` (Asc) + `createdAt` (Desc)

### Firebase Storage
- [ ] Go to Storage → Get started
- [ ] Copy rules from `FIREBASE_STORAGE_RULES.txt`
- [ ] Paste rules in Storage → Rules tab
- [ ] Publish rules

### Cloud Messaging
- [ ] Go to Cloud Messaging
- [ ] iOS: Upload APNs certificate (.p8 file)
- [ ] Android: Verify FCM is enabled
- [ ] Note: FCM works automatically for Android

## 📱 Project Setup

### Files to Download
- [ ] Download `google-services.json` from Firebase Console
- [ ] Place `google-services.json` in project root
- [ ] Download `GoogleService-Info.plist` from Firebase Console
- [ ] Place `GoogleService-Info.plist` in project root

### Code Configuration
- [ ] Open `lib/authService.tsx`
- [ ] Update line 8 with your Web Client ID:
  ```typescript
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  ```

### Dependencies
- [ ] Run `npm install`
- [ ] Verify packages installed:
  - [ ] `@react-native-firebase/app`
  - [ ] `@react-native-firebase/auth`
  - [ ] `@react-native-firebase/firestore`
  - [ ] `@react-native-firebase/storage`
  - [ ] `@react-native-firebase/messaging`
  - [ ] `@notifee/react-native`

### Native Build
- [ ] Run `npx expo prebuild --clean`
- [ ] iOS: Run `cd ios && pod install && cd ..`
- [ ] Verify native folders created: `ios/` and `android/`

## 🧪 Testing

### Authentication
- [ ] Start app: `npm run ios` or `npm run android`
- [ ] Test Google Sign-In without referral code
- [ ] Sign out
- [ ] Get referral code from Profile
- [ ] Sign out
- [ ] Sign up with referral code
- [ ] Verify referrer got 100 points
- [ ] Test Apple Sign-In (iOS only)

### Rewards System
- [ ] Check Profile shows:
  - [ ] Referral Points (should be 0 or 100+)
  - [ ] Coins (should be 50+ from welcome bonus)
  - [ ] Referral code
  - [ ] Referral count
- [ ] If points ≥10, test conversion:
  - [ ] Tap "Convert Points to Coins"
  - [ ] Enter amount (multiples of 10)
  - [ ] Verify conversion works
  - [ ] Check points decreased
  - [ ] Check coins increased

### Roulette Game
- [ ] If coins ≥10, tap "Play Roulette Game"
- [ ] Select bet amount
- [ ] Tap "SPIN"
- [ ] Verify wheel spins
- [ ] Check result shows
- [ ] Verify coins updated correctly
- [ ] Test multiple spins

### Profile Picture
- [ ] Tap avatar in Profile
- [ ] Choose "Take Photo"
- [ ] Grant camera permission
- [ ] Take photo
- [ ] Verify upload progress shows
- [ ] Verify image updates
- [ ] Restart app
- [ ] Verify image persists

### Notifications
- [ ] Grant notification permission when prompted
- [ ] Perform action that triggers notification (e.g., get a referral)
- [ ] Verify notification appears
- [ ] Tap notification
- [ ] Verify app opens

## 🔍 Verification

### Firebase Console Checks
- [ ] Firestore → users collection has documents
- [ ] Each user has `referralCode`, `coins`, `referralPoints`
- [ ] Storage → avatars folder has images
- [ ] Firestore → transactions collection has records
- [ ] Cloud Messaging → Tokens are being saved

### App Checks
- [ ] No console errors on startup
- [ ] Authentication works smoothly
- [ ] All tabs load correctly
- [ ] Profile data persists after app restart
- [ ] Transactions are recorded
- [ ] Images load from Storage

## 🚀 Production Ready

### Security
- [ ] Firestore rules are in production mode
- [ ] Storage rules are in production mode
- [ ] API keys are not committed to git
- [ ] Environment variables configured (if any)

### Performance
- [ ] Test app on physical device
- [ ] Check Firebase quota usage
- [ ] Monitor Storage bandwidth
- [ ] Review Firestore read/write counts

### Optional Enhancements
- [ ] Enable Firebase Analytics
- [ ] Set up Firebase Crashlytics
- [ ] Configure App Check
- [ ] Set up budget alerts in Firebase

## ✅ All Done!

If all checkboxes are checked, your app is ready to use! 🎉

**Next Steps:**
1. Test thoroughly on both iOS and Android
2. Monitor Firebase Console for any issues
3. Review user feedback
4. Plan additional features from `REWARDS_SYSTEM.md`
