# Firebase Setup Guide

This guide explains how to properly set up Firebase Authentication and Firestore for the Skibag gaming app.

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com)
- `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) downloaded and placed in project root

## Firebase Configuration

### 1. Enable Authentication Methods

In Firebase Console → Authentication → Sign-in method, enable:
- **Google** (required)
- **Apple** (required for iOS)

### 2. Configure Google Sign-In

1. In Firebase Console → Authentication → Sign-in method → Google
2. Enable the provider
3. Copy the **Web Client ID** 
4. Update `lib/authService.tsx` line 8 with your Web Client ID:
   ```typescript
   webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
   ```

### 3. Configure Apple Sign-In (iOS only)

1. Enable Apple Sign-In in Firebase Console
2. Configure your iOS app in Apple Developer Console
3. Add the capabilities in Xcode

### 4. Firestore Database Setup

#### Create Firestore Database

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose production mode or test mode
4. Select a Cloud Firestore location

#### Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can write their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading referral codes for validation
      allow read: if request.auth != null;
    }
    
    // Feedback collection
    match /feedback/{feedbackId} {
      // Only authenticated users can submit feedback
      allow create: if request.auth != null;
      
      // Users can read their own feedback
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.uid;
      
      // Admins can read all feedback (add admin check if needed)
      allow read: if request.auth != null;
    }
    
    // Game ratings collection
    match /gameRatings/{ratingId} {
      // Anyone can read ratings
      allow read: if request.auth != null;
      
      // Users can only write their own ratings
      allow create, update: if request.auth != null && 
                               request.auth.uid == request.resource.data.uid;
      
      // Users can delete their own ratings
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.uid;
    }
  }
}
```

#### Firestore Indexes

Create the following indexes for better performance:

1. **Collection**: `users`
   - Field: `referralCode` (Ascending)
   - Query scope: Collection

2. **Collection**: `gameRatings`
   - Field: `gameId` (Ascending)
   - Field: `rating` (Ascending)
   - Query scope: Collection

3. **Collection**: `feedback`
   - Field: `uid` (Ascending)
   - Field: `createdAt` (Descending)
   - Query scope: Collection

## Data Structure

### Users Collection (`users/{userId}`)

```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string | null;           // User email
  displayName: string;            // User display name
  photoURL: string | null;        // Profile photo from OAuth
  avatarUri: string | null;       // Custom avatar uploaded by user
  rank: string;                   // beginner | advanced | pro | legend
  score: number;                  // User score/points
  referralCode: string;           // Unique 8-character referral code
  referredBy: string | null;      // Referral code used during signup
  referralCount?: number;         // Number of successful referrals
  createdAt: Timestamp;           // Account creation time
  updatedAt?: Timestamp;          // Last profile update time
}
```

### Feedback Collection (`feedback/{feedbackId}`)

```typescript
{
  uid: string;                    // User who submitted feedback
  email: string | null;           // User email
  displayName: string;            // User display name
  feedback: string;               // Feedback text
  rating: number;                 // 1-5 star rating
  createdAt: Timestamp;           // Submission time
}
```

### Game Ratings Collection (`gameRatings/{userId}_{gameId}`)

```typescript
{
  uid: string;                    // User who rated
  gameId: string;                 // Game identifier
  rating: number;                 // 1-5 star rating
  review: string;                 // Optional review text
  createdAt: Timestamp;           // First rating time
  updatedAt: Timestamp;           // Last update time
}
```

## Features Implemented

### ✅ Authentication
- Google Sign-In with referral code support
- Apple Sign-In with referral code support
- Automatic user profile creation in Firestore
- Sign out functionality
- Account deletion

### ✅ User Profile Management
- Avatar upload and sync with Firestore
- Rank and score tracking
- Profile data persistence
- Real-time profile loading

### ✅ Referral System
- Unique 8-character referral codes
- Referral code validation during signup
- Automatic referral count increment
- Display referral count in profile
- Copy referral code to clipboard

### ✅ Feedback System
- Star rating (1-5 stars)
- Text feedback submission
- User information attached to feedback
- Timestamp tracking

### ✅ Game Rating System
- Rate games with stars
- Optional review text
- Per-user, per-game ratings
- Calculate average ratings
- Update existing ratings

## API Functions

### Authentication (`lib/authService.tsx`)
```typescript
signInWithGoogle(referralCode?: string): Promise<User>
signInWithApple(referralCode?: string): Promise<User>
signOut(): Promise<void>
```

### Firestore Service (`lib/firestoreService.ts`)
```typescript
// User Management
createUserProfile(referralCode?: string): Promise<void>
getUserProfile(): Promise<any | null>
updateUserProfile(updates: object): Promise<void>
deleteUserAccount(): Promise<void>

// Referral System
validateReferralCode(code: string): Promise<boolean>
getReferralCount(): Promise<number>

// Feedback
submitFeedback(feedback: string, rating: number): Promise<void>

// Game Ratings
submitGameRating(gameId: string, rating: number, review?: string): Promise<void>
getUserGameRating(gameId: string): Promise<any | null>
getGameAverageRating(gameId: string): Promise<{average: number, count: number}>
```

## Testing

### Test Authentication
1. Run the app: `npm start`
2. Navigate to login screen
3. Click "Continue with Google" or "Continue with Apple"
4. Check Firestore Console → users collection for new user document

### Test Referral System
1. Sign in with first user
2. Copy referral code from profile screen
3. Sign out
4. Sign in with second user, enter referral code
5. Check first user's profile for incremented referral count

### Test Feedback
1. Go to Profile screen
2. Select star rating (1-5)
3. Enter feedback text
4. Click "Send Feedback"
5. Check Firestore Console → feedback collection

### Test Game Ratings
```typescript
// Example usage in game detail screen
await submitGameRating('game-123', 5, 'Great game!');
const rating = await getUserGameRating('game-123');
const avgRating = await getGameAverageRating('game-123');
```

## Troubleshooting

### Issue: "No ID token returned from Google"
**Solution**: Verify `webClientId` in `authService.tsx` matches your Firebase Web Client ID

### Issue: "Permission denied" in Firestore
**Solution**: Check Firestore security rules are properly configured

### Issue: "Apple Sign-In not working"
**Solution**: Ensure Apple Sign-In is enabled in Firebase and properly configured in Xcode

### Issue: Referral code not working
**Solution**: Ensure Firestore index is created for `referralCode` field in users collection

### Issue: App crashes after login
**Solution**: Run `npx expo prebuild` to regenerate native code with Firebase plugins

## Production Checklist

- [ ] Update Firestore security rules from test mode to production mode
- [ ] Create Firestore indexes for queries
- [ ] Enable App Check for additional security
- [ ] Set up Firebase Analytics
- [ ] Configure Firebase Crashlytics
- [ ] Review and test all authentication flows
- [ ] Test referral system end-to-end
- [ ] Verify feedback submission works
- [ ] Test on both iOS and Android devices
- [ ] Update `webClientId` with production credentials
- [ ] Enable email/password authentication (if needed)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Native Firebase](https://rnfirebase.io/)
- [Google Sign-In Setup](https://rnfirebase.io/auth/social-auth#google)
- [Apple Sign-In Setup](https://rnfirebase.io/auth/social-auth#apple)
