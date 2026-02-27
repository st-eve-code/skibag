# Quick Start Guide - Skibag Gaming App

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI installed globally
- Firebase project created
- iOS: Xcode and CocoaPods
- Android: Android Studio

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration

#### Download Config Files
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Download `google-services.json` (Android) → place in project root
3. Download `GoogleService-Info.plist` (iOS) → place in project root

#### Update Web Client ID
Open `lib/authService.tsx` and update line 8:
```typescript
webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
```

### 3. Configure Firebase Console

#### Enable Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Google** ✅
3. Enable **Apple** ✅ (for iOS)

#### Set up Firestore Database
1. Go to Firestore Database → Create database
2. Choose production mode or test mode
3. Copy rules from `FIRESTORE_SECURITY_RULES.txt`
4. Create indexes:
   - `users.referralCode` (Ascending)
   - `transactions.userId` + `createdAt` (Descending)
   - `gameRatings.gameId` + `rating` (Ascending)

#### Set up Firebase Storage
1. Go to Storage → Get started
2. Copy rules from `FIREBASE_STORAGE_RULES.txt`

#### Enable Cloud Messaging
1. Go to Cloud Messaging
2. iOS: Upload APNs certificate
3. Android: Verify FCM is enabled

### 4. Build Native Code
```bash
npx expo prebuild --clean
```

### 5. Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

## ✨ Features Available

### 🔐 Authentication
- **Google Sign-In**: Works on iOS, Android, Web
- **Apple Sign-In**: Works on iOS only
- **Referral Codes**: Enter code during signup

### 🎁 Rewards System
- **Welcome Bonus**: 50 coins on signup
- **Referral Points**: 100 points per referral
- **Conversion**: 10 points = 1 coin
- **View in Profile**: Tap Profile tab

### 🎰 Roulette Game
1. Go to Profile tab
2. Ensure you have ≥10 coins
3. Tap "Play Roulette Game"
4. Select bet amount
5. Tap "SPIN" to play

### 📸 Profile Picture
1. Go to Profile tab
2. Tap avatar image or camera icon
3. Choose "Take Photo" or "Choose from Gallery"
4. Image uploads to Firebase Storage
5. Syncs across all devices

### 🔔 Notifications
- Automatically requested on first launch
- Receive alerts for new referrals
- Tap notification to open app

## 🧪 Testing Flow

### Test Referral System
1. **User A**: Sign in with Google
2. **User A**: Go to Profile → copy referral code
3. **User A**: Sign out
4. **User B**: Sign up with referral code
5. **User A**: Sign in → see +100 points
6. **User A**: Receive push notification

### Test Points Conversion
1. Have ≥10 referral points
2. Tap "Convert Points to Coins"
3. Enter amount (e.g., 100)
4. Tap "Convert"
5. See coins increase by 10

### Test Roulette
1. Have ≥10 coins
2. Tap "Play Roulette Game"
3. Select bet amount
4. Tap "SPIN"
5. Watch wheel spin
6. See win/loss result
7. Check updated coin balance

## 📁 Project Structure

```
skibag/
├── app/                        # Screens (file-based routing)
│   ├── (tabs)/                # Main tabs
│   │   └── profile.tsx        # Profile with rewards
│   ├── (auth)/                # Authentication
│   │   └── login.tsx          # Google/Apple sign-in
│   └── roulette.tsx           # Roulette game
├── lib/                        # Core services
│   ├── authService.tsx        # Authentication
│   ├── firestoreService.ts    # Database operations
│   ├── storageService.ts      # File uploads
│   └── notificationService.ts # Push notifications
├── assets/                     # Images, fonts, icons
└── constant/                   # App constants
```

## 🔑 Key API Functions

### Authentication
```typescript
import { signInWithGoogle, signInWithApple, signOut } from '@/lib/authService';

// Sign in with optional referral code
await signInWithGoogle(referralCode);
await signInWithApple(referralCode);

// Sign out
await signOut();
```

### Rewards
```typescript
import { 
  getUserPointsAndCoins, 
  convertPointsToCoins,
  getReferralCount 
} from '@/lib/firestoreService';

// Get balances
const { referralPoints, coins } = await getUserPointsAndCoins();

// Convert points to coins
await convertPointsToCoins(100); // 100 points → 10 coins

// Get referral count
const count = await getReferralCount();
```

### Roulette
```typescript
import { playRoulette, recordRouletteWin } from '@/lib/firestoreService';

// Play (deducts coins)
await playRoulette(50); // Bet 50 coins

// Record win
await recordRouletteWin(150, 3); // Won 150 coins at 3x
```

### Storage
```typescript
import { uploadProfilePicture, deleteProfilePicture } from '@/lib/storageService';

// Upload avatar
const downloadURL = await uploadProfilePicture(localUri);

// Delete old avatar
await deleteProfilePicture(oldPhotoURL);
```

### Notifications
```typescript
import { initializeNotifications, requestNotificationPermission } from '@/lib/notificationService';

// Initialize (auto-called on login)
await initializeNotifications();

// Request permission
const hasPermission = await requestNotificationPermission();
```

## 🐛 Common Issues

### Issue: "No ID token returned from Google"
**Solution**: Update `webClientId` in `lib/authService.tsx` with your Firebase Web Client ID

### Issue: "Permission denied" in Firestore
**Solution**: Copy rules from `FIRESTORE_SECURITY_RULES.txt` to Firebase Console

### Issue: Avatar upload fails
**Solution**: Copy rules from `FIREBASE_STORAGE_RULES.txt` to Firebase Console

### Issue: Notifications not working
**Solution**: 
- iOS: Add APNs certificate in Firebase
- Android: Verify FCM is enabled
- Check permission was granted

### Issue: Referral points not updating
**Solution**: Create Firestore index for `users.referralCode`

## 📚 Documentation

- `README.md` - Project overview and setup
- `FIREBASE_SETUP.md` - Detailed Firebase configuration
- `REWARDS_SYSTEM.md` - Complete rewards system docs
- `IMPLEMENTATION_SUMMARY.md` - What was implemented
- `FIRESTORE_SECURITY_RULES.txt` - Database security rules
- `FIREBASE_STORAGE_RULES.txt` - Storage security rules

## 🎯 Production Deployment

### Before Production
1. ✅ Update all Firebase security rules
2. ✅ Create all required Firestore indexes
3. ✅ Test on physical iOS device
4. ✅ Test on physical Android device
5. ✅ Enable Firebase Analytics
6. ✅ Set up Crashlytics
7. ✅ Configure App Check

### Build for Production
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

## 💡 Tips

- **Development**: Use Expo Go for quick testing (limited features)
- **Full Testing**: Use development build (`npm run ios/android`)
- **Debugging**: Check Firebase Console for real-time data
- **Monitoring**: Watch Firestore usage in Firebase Console
- **Performance**: Monitor Storage bandwidth usage

## 🆘 Support

For issues:
1. Check Firebase Console logs
2. Review error messages in app
3. Verify Firebase config files are present
4. Check Firestore/Storage rules are deployed
5. Ensure indexes are created

## 🎉 You're Ready!

Your Skibag gaming app now has:
- ✅ Google & Apple authentication
- ✅ Referral system with rewards
- ✅ Points to coins conversion
- ✅ Roulette game
- ✅ Profile picture uploads
- ✅ Push notifications
- ✅ Transaction tracking

Start the app and enjoy! 🚀
