import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Constants for points and coins system
const POINTS_PER_REFERRAL = 100;
const POINTS_TO_COINS_RATIO = 10; // 10 points = 1 coin
const WELCOME_BONUS_COINS = 50;

// ─── Create user profile when they first sign up ─────────────────────────────
export const createUserProfile = async (referralCode?: string) => {
  const user = auth().currentUser;
  if (!user) return;

  const userRef = firestore().collection('users').doc(user.uid);
  const userSnap = await userRef.get();

  // Only create if it doesn't already exist
  if (!userSnap.exists) {
    const newUserData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? 'Player',
      photoURL: user.photoURL ?? null,
      avatarUri: user.photoURL ?? null,
      rank: 'beginner',
      score: 0,
      referralCode: generateReferralCode(),
      referredBy: referralCode ?? null,
      referralCount: 0,
      referralPoints: 0,
      coins: WELCOME_BONUS_COINS, // Welcome bonus
      totalCoinsEarned: WELCOME_BONUS_COINS,
      rouletteSpins: 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(newUserData);

    // If user was referred, increment the referrer's referral count and award points
    if (referralCode) {
      await incrementReferralCount(referralCode);
    }
  }
};

// ─── Get user profile ─────────────────────────────────────────────────────────
export const getUserProfile = async () => {
  const user = auth().currentUser;
  if (!user) return null;

  const userSnap = await firestore().collection('users').doc(user.uid).get();
  return userSnap.data();
};

// ─── Delete user data and account ────────────────────────────────────────────
export const deleteUserAccount = async () => {
  const user = auth().currentUser;
  if (!user) return;

  // Delete user document from Firestore
  await firestore().collection('users').doc(user.uid).delete();

  // Delete the Firebase Auth account
  await user.delete();
};

// ─── Submit feedback ──────────────────────────────────────────────────────────
export const submitFeedback = async (feedback: string, rating: number) => {
  const user = auth().currentUser;
  if (!user) return;

  await firestore().collection('feedback').add({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? 'Anonymous',
    feedback,
    rating,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

// ─── Submit game rating ───────────────────────────────────────────────────────
export const submitGameRating = async (gameId: string, rating: number, review?: string) => {
  const user = auth().currentUser;
  if (!user) return;

  const ratingRef = firestore()
    .collection('gameRatings')
    .doc(`${user.uid}_${gameId}`);

  await ratingRef.set({
    uid: user.uid,
    gameId,
    rating,
    review: review ?? '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
};

// ─── Get user's game rating ───────────────────────────────────────────────────
export const getUserGameRating = async (gameId: string) => {
  const user = auth().currentUser;
  if (!user) return null;

  const ratingSnap = await firestore()
    .collection('gameRatings')
    .doc(`${user.uid}_${gameId}`)
    .get();

  return ratingSnap.data();
};

// ─── Get average game rating ──────────────────────────────────────────────────
export const getGameAverageRating = async (gameId: string) => {
  const ratingsSnap = await firestore()
    .collection('gameRatings')
    .where('gameId', '==', gameId)
    .get();

  if (ratingsSnap.empty) return { average: 0, count: 0 };

  let total = 0;
  ratingsSnap.forEach(doc => {
    total += doc.data().rating;
  });

  return {
    average: total / ratingsSnap.size,
    count: ratingsSnap.size,
  };
};

// ─── Apply referral code (increment referrer's count and award points) ───────
const incrementReferralCount = async (referralCode: string) => {
  try {
    const usersRef = firestore().collection('users');
    const querySnapshot = await usersRef.where('referralCode', '==', referralCode).get();
    
    if (!querySnapshot.empty) {
      const referrerDoc = querySnapshot.docs[0];
      await referrerDoc.ref.update({
        referralCount: firestore.FieldValue.increment(1),
        referralPoints: firestore.FieldValue.increment(POINTS_PER_REFERRAL),
      });

      // Create a transaction record
      await firestore().collection('transactions').add({
        userId: referrerDoc.id,
        type: 'referral_reward',
        amount: POINTS_PER_REFERRAL,
        description: 'Referral bonus points',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error incrementing referral count:', error);
  }
};

// ─── Get referral count ───────────────────────────────────────────────────────
export const getReferralCount = async () => {
  const user = auth().currentUser;
  if (!user) return 0;

  const userSnap = await firestore().collection('users').doc(user.uid).get();
  const data = userSnap.data();
  return data?.referralCount ?? 0;
};

// ─── Get user's points and coins ──────────────────────────────────────────────
export const getUserPointsAndCoins = async () => {
  const user = auth().currentUser;
  if (!user) return { referralPoints: 0, coins: 0 };

  const userSnap = await firestore().collection('users').doc(user.uid).get();
  const data = userSnap.data();
  return {
    referralPoints: data?.referralPoints ?? 0,
    coins: data?.coins ?? 0,
  };
};

// ─── Convert referral points to coins ─────────────────────────────────────────
export const convertPointsToCoins = async (pointsAmount: number) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  if (pointsAmount < POINTS_TO_COINS_RATIO) {
    throw new Error(`Minimum ${POINTS_TO_COINS_RATIO} points required to convert`);
  }

  if (pointsAmount % POINTS_TO_COINS_RATIO !== 0) {
    throw new Error(`Points must be in multiples of ${POINTS_TO_COINS_RATIO}`);
  }

  const userRef = firestore().collection('users').doc(user.uid);
  const userSnap = await userRef.get();
  const currentPoints = userSnap.data()?.referralPoints ?? 0;

  if (currentPoints < pointsAmount) {
    throw new Error('Insufficient points');
  }

  const coinsToAdd = pointsAmount / POINTS_TO_COINS_RATIO;

  // Use transaction to ensure atomicity
  await firestore().runTransaction(async (transaction) => {
    transaction.update(userRef, {
      referralPoints: firestore.FieldValue.increment(-pointsAmount),
      coins: firestore.FieldValue.increment(coinsToAdd),
      totalCoinsEarned: firestore.FieldValue.increment(coinsToAdd),
    });
  });

  // Create transaction record
  await firestore().collection('transactions').add({
    userId: user.uid,
    type: 'points_to_coins',
    pointsSpent: pointsAmount,
    coinsEarned: coinsToAdd,
    description: `Converted ${pointsAmount} points to ${coinsToAdd} coins`,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return coinsToAdd;
};

// ─── Spend coins (for roulette or other games) ────────────────────────────────
export const spendCoins = async (amount: number, description: string = 'Game purchase') => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = firestore().collection('users').doc(user.uid);
  const userSnap = await userRef.get();
  const currentCoins = userSnap.data()?.coins ?? 0;

  if (currentCoins < amount) {
    throw new Error('Insufficient coins');
  }

  await userRef.update({
    coins: firestore.FieldValue.increment(-amount),
  });

  // Create transaction record
  await firestore().collection('transactions').add({
    userId: user.uid,
    type: 'coin_spent',
    amount: -amount,
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

// ─── Add coins (from roulette win or purchases) ───────────────────────────────
export const addCoins = async (amount: number, description: string = 'Coins earned') => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = firestore().collection('users').doc(user.uid);
  await userRef.update({
    coins: firestore.FieldValue.increment(amount),
    totalCoinsEarned: firestore.FieldValue.increment(amount),
  });

  // Create transaction record
  await firestore().collection('transactions').add({
    userId: user.uid,
    type: 'coin_earned',
    amount,
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

// ─── Get user transactions ────────────────────────────────────────────────────
export const getUserTransactions = async (limit: number = 20) => {
  const user = auth().currentUser;
  if (!user) return [];

  const transactionsSnap = await firestore()
    .collection('transactions')
    .where('userId', '==', user.uid)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return transactionsSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ─── Play roulette game ───────────────────────────────────────────────────────
export const playRoulette = async (betAmount: number) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  // Spend coins for the spin
  await spendCoins(betAmount, 'Roulette spin');

  const userRef = firestore().collection('users').doc(user.uid);
  await userRef.update({
    rouletteSpins: firestore.FieldValue.increment(1),
  });

  // The actual roulette logic and win calculation should be handled
  // in the roulette component and then call addCoins if user wins
  
  return {
    success: true,
    message: 'Roulette spin initiated',
  };
};

// ─── Record roulette win ──────────────────────────────────────────────────────
export const recordRouletteWin = async (winAmount: number, multiplier: number) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  await addCoins(winAmount, `Roulette win (${multiplier}x)`);

  // Create roulette history record
  await firestore().collection('rouletteHistory').add({
    userId: user.uid,
    winAmount,
    multiplier,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

// ─── Validate referral code ──────────────────────────────────────────────────
export const validateReferralCode = async (code: string): Promise<boolean> => {
  if (!code || code.trim().length === 0) return false;
  
  const usersRef = firestore().collection('users');
  const querySnapshot = await usersRef.where('referralCode', '==', code.toUpperCase()).get();
  
  return !querySnapshot.empty;
};

// ─── Update user profile (avatar, rank, score) ───────────────────────────────
export const updateUserProfile = async (updates: {
  avatarUri?: string | null;
  rank?: string;
  score?: number;
  displayName?: string;
}) => {
  const user = auth().currentUser;
  if (!user) return;

  const userRef = firestore().collection('users').doc(user.uid);
  await userRef.update({
    ...updates,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

// ─── Generate a random referral code ─────────────────────────────────────────
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};