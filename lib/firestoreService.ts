import { supabase } from "./supabase";

// Constants for points and coins system
const POINTS_PER_REFERRAL = 100;
const POINTS_TO_COINS_RATIO = 10; // 10 points = 1 coin
const WELCOME_BONUS_COINS = 50;

// ─── Helper: get current user id ─────────────────────────────────────────────
const getCurrentUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("User not authenticated");
  return data.user.id;
};

// ─── Create user profile when they first sign up ─────────────────────────────
export const createUserProfile = async (referralCode?: string) => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  const user = data.user;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existing) {
    const referralCodeGenerated = generateReferralCode();
    await supabase.from("profiles").insert({
      id: user.id,
      username:
        user.user_metadata?.username ?? user.email?.split("@")[0] ?? "Player",
      display_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      rank: "beginner",
      score: 0,
      referral_code: referralCodeGenerated,
      referred_by: referralCode ?? null,
      referral_count: 0,
      referral_points: 0,
      coins: WELCOME_BONUS_COINS,
      total_coins_earned: WELCOME_BONUS_COINS,
      roulette_spins: 0,
    });

    if (referralCode) {
      await incrementReferralCount(referralCode);
    }
  }
};

// ─── Get user profile ─────────────────────────────────────────────────────────
export const getUserProfile = async () => {
  const uid = await getCurrentUserId();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uid)
    .single();
  return data;
};

// ─── Delete user data and account ────────────────────────────────────────────
export const deleteUserAccount = async () => {
  const uid = await getCurrentUserId();
  await supabase.from("profiles").delete().eq("id", uid);
  await supabase.auth.admin.deleteUser(uid); // requires service role key in server context
};

// ─── Submit feedback ──────────────────────────────────────────────────────────
export const submitFeedback = async (feedback: string, rating: number) => {
  const uid = await getCurrentUserId();
  await supabase.from("feedback").insert({
    user_id: uid,
    message: feedback,
    category: "general",
  });
};

// ─── Submit game rating ───────────────────────────────────────────────────────
export const submitGameRating = async (
  gameId: string,
  rating: number,
  review?: string,
) => {
  const uid = await getCurrentUserId();
  await supabase.from("game_ratings").upsert(
    {
      user_id: uid,
      game_id: gameId,
      rating,
      review: review ?? "",
    },
    { onConflict: "user_id,game_id" },
  );
};

// ─── Get user's game rating ───────────────────────────────────────────────────
export const getUserGameRating = async (gameId: string) => {
  const uid = await getCurrentUserId();
  const { data } = await supabase
    .from("game_ratings")
    .select("*")
    .eq("user_id", uid)
    .eq("game_id", gameId)
    .single();
  return data;
};

// ─── Get average game rating ──────────────────────────────────────────────────
export const getGameAverageRating = async (gameId: string) => {
  const { data } = await supabase
    .from("game_ratings")
    .select("rating")
    .eq("game_id", gameId);

  if (!data || data.length === 0) return { average: 0, count: 0 };

  const total = data.reduce((sum, row) => sum + row.rating, 0);
  return { average: total / data.length, count: data.length };
};

// ─── Apply referral code (increment referrer's count and award points) ───────
const incrementReferralCount = async (referralCode: string) => {
  try {
    const { data: referrer } = await supabase
      .from("profiles")
      .select("id, referral_count, referral_points")
      .eq("referral_code", referralCode.toUpperCase())
      .single();

    if (!referrer) return;

    await supabase
      .from("profiles")
      .update({
        referral_count: referrer.referral_count + 1,
        referral_points: referrer.referral_points + POINTS_PER_REFERRAL,
      })
      .eq("id", referrer.id);

    await supabase.from("transactions").insert({
      user_id: referrer.id,
      type: "referral_reward",
      amount: POINTS_PER_REFERRAL,
      currency: "points",
      description: "Referral bonus points",
    });
  } catch (error) {
    console.error("Error incrementing referral count:", error);
  }
};

// ─── Get referral count ───────────────────────────────────────────────────────
export const getReferralCount = async () => {
  const uid = await getCurrentUserId();
  const { data } = await supabase
    .from("profiles")
    .select("referral_count")
    .eq("id", uid)
    .single();
  return data?.referral_count ?? 0;
};

// ─── Get user's points and coins ──────────────────────────────────────────────
export const getUserPointsAndCoins = async () => {
  const uid = await getCurrentUserId();
  const { data } = await supabase
    .from("profiles")
    .select("referral_points, coins")
    .eq("id", uid)
    .single();
  return {
    referralPoints: data?.referral_points ?? 0,
    coins: data?.coins ?? 0,
  };
};

// ─── Convert referral points to coins ─────────────────────────────────────────
export const convertPointsToCoins = async (pointsAmount: number) => {
  if (pointsAmount < POINTS_TO_COINS_RATIO) {
    throw new Error(
      `Minimum ${POINTS_TO_COINS_RATIO} points required to convert`,
    );
  }
  if (pointsAmount % POINTS_TO_COINS_RATIO !== 0) {
    throw new Error(`Points must be in multiples of ${POINTS_TO_COINS_RATIO}`);
  }

  const uid = await getCurrentUserId();
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_points, coins, total_coins_earned")
    .eq("id", uid)
    .single();

  if (!profile || profile.referral_points < pointsAmount) {
    throw new Error("Insufficient points");
  }

  const coinsToAdd = pointsAmount / POINTS_TO_COINS_RATIO;

  await supabase
    .from("profiles")
    .update({
      referral_points: profile.referral_points - pointsAmount,
      coins: profile.coins + coinsToAdd,
      total_coins_earned: profile.total_coins_earned + coinsToAdd,
    })
    .eq("id", uid);

  await supabase.from("transactions").insert({
    user_id: uid,
    type: "points_to_coins",
    amount: coinsToAdd,
    currency: "coins",
    description: `Converted ${pointsAmount} points to ${coinsToAdd} coins`,
  });

  return coinsToAdd;
};

// ─── Spend coins ──────────────────────────────────────────────────────────────
export const spendCoins = async (
  amount: number,
  description: string = "Game purchase",
) => {
  const uid = await getCurrentUserId();
  const { data: profile } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", uid)
    .single();

  if (!profile || profile.coins < amount) throw new Error("Insufficient coins");

  await supabase
    .from("profiles")
    .update({ coins: profile.coins - amount })
    .eq("id", uid);

  await supabase.from("transactions").insert({
    user_id: uid,
    type: "coin_spent",
    amount: -amount,
    currency: "coins",
    description,
  });
};

// ─── Add coins ────────────────────────────────────────────────────────────────
export const addCoins = async (
  amount: number,
  description: string = "Coins earned",
) => {
  const uid = await getCurrentUserId();
  const { data: profile } = await supabase
    .from("profiles")
    .select("coins, total_coins_earned")
    .eq("id", uid)
    .single();

  if (!profile) throw new Error("Profile not found");

  await supabase
    .from("profiles")
    .update({
      coins: profile.coins + amount,
      total_coins_earned: profile.total_coins_earned + amount,
    })
    .eq("id", uid);

  await supabase.from("transactions").insert({
    user_id: uid,
    type: "coin_earned",
    amount,
    currency: "coins",
    description,
  });
};

// ─── Get user transactions ────────────────────────────────────────────────────
export const getUserTransactions = async (limit: number = 20) => {
  const uid = await getCurrentUserId();
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
};

// ─── Play roulette game ───────────────────────────────────────────────────────
export const playRoulette = async (betAmount: number) => {
  await spendCoins(betAmount, "Roulette spin");

  const uid = await getCurrentUserId();
  const { data: profile } = await supabase
    .from("profiles")
    .select("roulette_spins")
    .eq("id", uid)
    .single();

  await supabase
    .from("profiles")
    .update({
      roulette_spins: (profile?.roulette_spins ?? 0) + 1,
    })
    .eq("id", uid);

  return { success: true, message: "Roulette spin initiated" };
};

// ─── Record roulette win ──────────────────────────────────────────────────────
export const recordRouletteWin = async (
  winAmount: number,
  multiplier: number,
) => {
  const uid = await getCurrentUserId();
  await addCoins(winAmount, `Roulette win (${multiplier}x)`);

  await supabase.from("roulette_history").insert({
    user_id: uid,
    bet_amount: 0,
    multiplier,
    payout: winAmount,
    result: "win",
  });
};

// ─── Validate referral code ──────────────────────────────────────────────────
export const validateReferralCode = async (code: string): Promise<boolean> => {
  if (!code || code.trim().length === 0) return false;
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", code.toUpperCase())
    .single();
  return !!data;
};

// ─── Update user profile ──────────────────────────────────────────────────────
export const updateUserProfile = async (updates: {
  avatar_url?: string | null;
  rank?: string;
  score?: number;
  display_name?: string;
}) => {
  const uid = await getCurrentUserId();
  await supabase.from("profiles").update(updates).eq("id", uid);
};

// ─── Generate a random referral code ─────────────────────────────────────────
const generateReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
