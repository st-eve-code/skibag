# Rewards System Documentation

## Overview
The Skibag app features a comprehensive rewards system that includes referral points, coins, and a roulette game. Users can earn rewards by referring friends and use their coins in the roulette game.

## System Components

### 1. Referral Points System

#### How It Works
- Every user gets a **unique 8-character referral code** upon signup
- When a new user signs up using a referral code, the referrer earns **100 points**
- Points are stored in Firestore and tracked in real-time
- Points can be converted to coins at a ratio of **10 points = 1 coin**

#### Implementation Details
```typescript
// Constants
POINTS_PER_REFERRAL = 100
POINTS_TO_COINS_RATIO = 10
WELCOME_BONUS_COINS = 50
```

#### User Flow
1. User A shares their referral code with User B
2. User B enters the code during signup
3. User A receives 100 points automatically
4. User A gets a push notification about the new referral
5. User A can convert points to coins in their profile

### 2. Coins System

#### Earning Coins
Users can earn coins through:
- **Welcome Bonus**: 50 coins when signing up
- **Converting Referral Points**: 10 points = 1 coin
- **Roulette Wins**: Win up to 5x your bet

#### Spending Coins
Users can spend coins on:
- **Roulette Game**: Bet coins to potentially win more
- **Future Features**: In-app purchases, tournament entries, etc.

#### Coin Tracking
- All coin transactions are logged in Firestore
- Users can view transaction history
- Coins balance is synced across devices

### 3. Roulette Game

#### Game Mechanics
- **Bet Range**: Minimum 10 coins per spin
- **Multipliers**: 0x, 1.5x, 2x, 3x, 5x
- **Segments**: 8 segments total
  - 4 segments: 0x (lose)
  - 1 segment: 1.5x
  - 2 segments: 2x
  - 1 segment: 3x
  - 1 segment: 5x (jackpot!)

#### Roulette Segments Configuration
```typescript
[
  { label: '0', multiplier: 0, color: '#22c55e' },
  { label: '2x', multiplier: 2, color: '#3b82f6' },
  { label: '0', multiplier: 0, color: '#ef4444' },
  { label: '1.5x', multiplier: 1.5, color: '#8b5cf6' },
  { label: '0', multiplier: 0, color: '#f59e0b' },
  { label: '3x', multiplier: 3, color: '#3b82f6' },
  { label: '0', multiplier: 0, color: '#ef4444' },
  { label: '5x', multiplier: 5, color: '#22c55e' },
]
```

#### Win Calculation
```typescript
winAmount = betAmount × multiplier
```

#### Example
- User bets 50 coins
- Wheel lands on 3x
- User wins 150 coins (50 × 3)
- Net profit: 100 coins

### 4. Push Notifications

#### Notification Events
Users receive push notifications for:
- **New Referral**: When someone uses their referral code
- **Points Earned**: Notification shows points earned
- **Roulette Win**: Celebration for big wins (optional)

#### Notification Setup
- Uses Firebase Cloud Messaging (FCM)
- Uses Notifee for local notifications
- Notifications work in foreground and background
- Tap notification to navigate to rewards screen

## Firestore Schema

### Users Collection
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  avatarUri: string | null;           // Firebase Storage URL
  rank: string;                       // beginner | advanced | pro | legend
  score: number;
  referralCode: string;               // Unique 8-char code
  referredBy: string | null;          // Referral code used at signup
  referralCount: number;              // Total successful referrals
  referralPoints: number;             // Current points balance
  coins: number;                      // Current coins balance
  totalCoinsEarned: number;           // Lifetime coins earned
  rouletteSpins: number;              // Total roulette spins
  fcmToken: string;                   // For push notifications
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Transactions Collection
```typescript
{
  userId: string;
  type: 'referral_reward' | 'points_to_coins' | 'coin_spent' | 'coin_earned';
  amount: number;                     // Points or coins amount
  pointsSpent?: number;               // For conversion transactions
  coinsEarned?: number;               // For conversion transactions
  description: string;
  createdAt: Timestamp;
}
```

### Roulette History Collection
```typescript
{
  userId: string;
  winAmount: number;
  multiplier: number;                 // 0, 1.5, 2, 3, or 5
  createdAt: Timestamp;
}
```

### Notifications Collection
```typescript
{
  userId: string;
  title: string;
  body: string;
  data: object;
  read: boolean;
  createdAt: Timestamp;
}
```

## API Functions

### Referral System
```typescript
// Get user's referral count
getReferralCount(): Promise<number>

// Validate a referral code
validateReferralCode(code: string): Promise<boolean>
```

### Points & Coins
```typescript
// Get user's points and coins
getUserPointsAndCoins(): Promise<{ referralPoints: number, coins: number }>

// Convert points to coins
convertPointsToCoins(pointsAmount: number): Promise<number>

// Add coins
addCoins(amount: number, description?: string): Promise<void>

// Spend coins
spendCoins(amount: number, description?: string): Promise<void>
```

### Roulette
```typescript
// Play roulette (deducts bet amount)
playRoulette(betAmount: number): Promise<{ success: boolean, message: string }>

// Record a win
recordRouletteWin(winAmount: number, multiplier: number): Promise<void>
```

### Transactions
```typescript
// Get user's transaction history
getUserTransactions(limit?: number): Promise<Transaction[]>
```

### Notifications
```typescript
// Initialize notification system
initializeNotifications(): Promise<void>

// Request notification permission
requestNotificationPermission(): Promise<boolean>

// Get FCM token
getFCMToken(): Promise<string | null>

// Display local notification
displayLocalNotification(title: string, body: string, data?: any): Promise<void>
```

## User Interface

### Profile Screen
- **Rewards Card**: Displays points and coins
- **Convert Button**: Appears when user has ≥10 points
- **Roulette Button**: Appears when user has ≥10 coins
- **Referral Code**: Copy to clipboard functionality
- **Referral Count**: Shows total successful referrals

### Conversion Modal
- Input field for points amount (multiples of 10)
- Preview of coins to receive
- Validation for minimum and available balance
- Success animation on conversion

### Roulette Screen
- Animated spinning wheel
- Bet amount controls (+/- buttons)
- Quick bet buttons (10, 25, 50, 100)
- Real-time coin balance display
- Win/loss result display
- Smooth animations

## Security Rules

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only modify their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions are read-only for users
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
    }
    
    // Roulette history
    match /rouletteHistory/{historyId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
  }
}
```

### Firebase Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Avatar uploads
    match /avatars/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024 // 5MB limit
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Testing Checklist

### Referral System
- [ ] User receives unique referral code on signup
- [ ] Referral code validation works
- [ ] Invalid code shows error
- [ ] Referrer receives 100 points when code is used
- [ ] Referral count increments correctly
- [ ] Notification sent to referrer

### Points to Coins Conversion
- [ ] Conversion modal opens
- [ ] Input validation (multiples of 10)
- [ ] Insufficient points shows error
- [ ] Conversion calculates correctly (10 points = 1 coin)
- [ ] Points deducted after conversion
- [ ] Coins added after conversion
- [ ] Transaction recorded in Firestore

### Roulette Game
- [ ] Wheel spins smoothly
- [ ] Bet amount adjustable
- [ ] Quick bet buttons work
- [ ] Insufficient coins shows error
- [ ] Coins deducted before spin
- [ ] Win calculation correct
- [ ] Coins added on win
- [ ] Transaction recorded
- [ ] History saved

### Notifications
- [ ] Permission request shows
- [ ] FCM token saved to Firestore
- [ ] Foreground notifications display
- [ ] Background notifications work
- [ ] Notification tap opens app
- [ ] Referral notification triggers correctly

### UI/UX
- [ ] Rewards card displays correct data
- [ ] Convert button shows/hides correctly
- [ ] Roulette button shows/hides correctly
- [ ] Loading states work
- [ ] Error handling shows alerts
- [ ] Success messages display
- [ ] Animations smooth

## Future Enhancements

### Planned Features
1. **Daily Login Bonus**: Reward coins for daily app usage
2. **Achievement System**: Badges for milestones (10 referrals, 100 spins, etc.)
3. **Leaderboard**: Top referrers and roulette winners
4. **Coin Purchases**: Buy coins with real money
5. **More Games**: Slots, poker, blackjack
6. **Withdrawal System**: Convert coins to real rewards
7. **Social Sharing**: Share wins on social media
8. **Tournaments**: Compete with other players
9. **VIP Tiers**: Special perks for top users
10. **Referral Tiers**: Bonus for 5, 10, 50+ referrals

### Analytics to Track
- Total referrals per user
- Conversion rate (points → coins)
- Roulette play frequency
- Average bet amount
- Win/loss ratio
- Coin economy health
- Notification open rate
- User retention

## Monetization Strategy

### Revenue Streams
1. **Coin Purchases**: Sell coin packages
2. **Premium Features**: Ad-free, exclusive games
3. **Subscriptions**: Monthly coin allowance
4. **Sponsored Roulette**: Brand partnerships
5. **Tournament Entry Fees**: Percentage rake

### Coin Packages (Future)
- Starter Pack: 100 coins - $0.99
- Popular Pack: 500 coins - $4.99
- Value Pack: 1,200 coins - $9.99
- Mega Pack: 3,000 coins - $19.99

## Support & Maintenance

### Monitoring
- Track Firestore reads/writes
- Monitor Storage usage
- Check FCM quota
- Review error logs
- Analyze user behavior

### Common Issues
1. **Referral not working**: Check Firestore rules
2. **Coins not updating**: Verify transaction completion
3. **Notifications not received**: Check FCM token and permissions
4. **Roulette spin stuck**: Clear animation state
5. **Conversion fails**: Verify points balance

## Conclusion

The rewards system creates an engaging gamification layer that encourages user acquisition through referrals and provides entertainment through the roulette game. The system is fully integrated with Firebase for real-time updates, secure transactions, and push notifications.

For technical implementation details, see:
- `lib/firestoreService.ts` - Backend logic
- `lib/storageService.ts` - Avatar uploads
- `lib/notificationService.ts` - Push notifications
- `app/(tabs)/profile.tsx` - Rewards UI
- `app/roulette.tsx` - Roulette game
