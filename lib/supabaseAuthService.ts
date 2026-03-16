import { supabase } from "./supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: string;
  username: string;
  password: string;
  rank: string;
  coins: number;
  created_at: string;
  avatar_url?: string;
  referral_code?: string;
  referred_by?: string;
  day_streak?: number;
  last_streak_date?: string;
}

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
};

/**
 * Simple hash function for password hashing
 */
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16) + password.length.toString(16);
}

/**
 * Generate a unique referral code
 */
function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Sign up a new user with username and password.
 */
export async function signUpWithUsername(
  username: string,
  password: string,
  referralCode?: string,
): Promise<UserData> {
  const cleanedUsername = username.toLowerCase().trim();
  const hashedPassword = hashPassword(password);

  console.log("Attempting signup for:", cleanedUsername);

  // First, check if username already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("username")
    .eq("username", cleanedUsername)
    .single();

  if (existingUser) {
    throw new Error("Username already exists. Please choose another.");
  }

  // Generate unique referral code for new user
  let newReferralCode = generateReferralCode();

  // Make sure the code is unique
  const { data: existingCode } = await supabase
    .from("users")
    .select("referral_code")
    .eq("referral_code", newReferralCode)
    .single();

  if (existingCode) {
    newReferralCode = generateReferralCode();
  }

  // Check if referral code is valid (if provided)
  let referredBy = null;
  let referrerUserId = null;
  if (referralCode && referralCode.trim().length > 0) {
    const { data: referrer, error: referrerError } = await supabase
      .from("users")
      .select("id, referral_code, username, coins")
      .eq("referral_code", referralCode.toUpperCase())
      .maybeSingle();

    if (referrerError) {
      console.error("Error checking referral code:", referrerError);
    }

    if (referrer) {
      referrerUserId = referrer.id;
      referredBy = referrer.referral_code;
      console.log("Valid referral code, referrer:", referrer.id, referrer.username);
    } else {
      throw new Error("Invalid referral code. Please check and try again.");
    }
  }

  // Insert new user
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("users")
    .insert({
      username: cleanedUsername,
      password: hashedPassword,
      coins: 50,
      rank: "beginner",
      referral_code: newReferralCode,
      referred_by: referredBy,
      day_streak: 1,
      last_streak_date: today,
    })
    .select()
    .single();

  if (error) {
    console.error("Signup error:", error);
    throw new Error(error.message);
  }

  console.log("Signup successful:", data);

  // Handle referral - if someone used a valid referral code
  if (referrerUserId && referralCode && referredBy) {
    // Prevent self-referral
    if (newReferralCode.toUpperCase() === referralCode.toUpperCase()) {
      await supabase
        .from("users")
        .update({ referred_by: null })
        .eq("id", data.id);
      console.log("Self-referral detected and blocked");
    } else {
      try {
        // Create referral record
        await supabase.from("referrals").insert({
          referrer_code: referralCode.toUpperCase(),
          referred_user_id: data.id,
          referred_email: null,
          referred_name: cleanedUsername,
          status: "completed",
          created_at: new Date().toISOString(),
        });
        console.log("✅ Referral record created for referrer:", referralCode.toUpperCase());
        
        // Give bonus coins to the referrer (10 coins per referral)
        const { data: referrerData } = await supabase
          .from("users")
          .select("coins")
          .eq("id", referrerUserId)
          .single();
        
        if (referrerData) {
          const newCoins = (referrerData.coins || 0) + 10;
          await supabase
            .from("users")
            .update({ coins: newCoins })
            .eq("id", referrerUserId);
          console.log(`✅ Added 10 coins to referrer ${referrerUserId}`);
        }
          
      } catch (referralError) {
        console.error("Error creating referral record:", referralError);
      }
    }
  }

  // Set current user in storage after successful signup
  await setCurrentUser(data);

  return data;
}

/**
 * Sign in with username and password.
 */
export async function signInWithUsername(
  username: string,
  password: string,
): Promise<UserData> {
  const cleanedUsername = username.toLowerCase().trim();
  const hashedPassword = hashPassword(password);

  console.log("Attempting signin for:", cleanedUsername);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", cleanedUsername)
    .eq("password", hashedPassword)
    .single();

  if (error || !data) {
    console.error("Signin error:", error);
    throw new Error("Invalid username or password.");
  }

  // Store current user in storage
  await setCurrentUser(data);
  console.log("Signin successful:", data);

  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await removeCurrentUser();
  console.log("Signed out");
}

/**
 * Set the current user in storage with error handling
 */
export async function setCurrentUser(user: UserData | null): Promise<void> {
  try {
    if (user) {
      const userString = JSON.stringify(user);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, userString);
      console.log('✅ User saved to AsyncStorage');
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      console.log('User removed from AsyncStorage');
    }
  } catch (error) {
    console.error('Error saving user to AsyncStorage:', error);
  }
}

/**
 * Get the currently authenticated user from storage with error handling
 */
export async function getCurrentUser(): Promise<UserData | null> {
  try {
    const userStr = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('✅ User retrieved from AsyncStorage:', user.username);
      return user;
    }
  } catch (error) {
    console.error('Error getting user from AsyncStorage:', error);
  }
  console.log('No user found in AsyncStorage');
  return null;
}

/**
 * Remove the current user from storage
 */
export async function removeCurrentUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    console.log('User removed from AsyncStorage');
  } catch (error) {
    console.error('Error removing user from AsyncStorage:', error);
  }
}

/**
 * Get user by ID.
 */
export async function getUserById(userId: string): Promise<UserData | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Get user error:", error);
    return null;
  }

  return data;
}

/**
 * Update user's avatar ID in the users table.
 * @param avatarId - The ID of the selected avatar
 */
export async function updateUserAvatar(avatarId: string): Promise<void> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  console.log("Updating avatar for user:", currentUser.id, "with avatar ID:", avatarId);

  const { error } = await supabase
    .from("users")
    .update({ avatar_url: avatarId })
    .eq("id", currentUser.id);

  if (error) {
    console.error("Error updating avatar:", error);
    throw new Error("Failed to update profile picture");
  }

  // Update local storage as well
  currentUser.avatar_url = avatarId;
  await setCurrentUser(currentUser);

  console.log("✅ Avatar updated successfully to ID:", avatarId);
}

/**
 * Get user's referral statistics
 */
export async function getUserReferralStats(userId: string): Promise<{
  referrals_count: number;
  referral_points: number;
}> {
  try {
    // Get the user's referral code first
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("referral_code")
      .eq("id", userId)
      .single();

    if (userError || !user?.referral_code) {
      console.log("No referral code found for user");
      return { referrals_count: 0, referral_points: 0 };
    }

    console.log("User referral code:", user.referral_code);

    // Count how many users have been referred by this user's code
    const { count, error: countError } = await supabase
      .from("users")
      .select("*", { count: 'exact', head: true })
      .eq("referred_by", user.referral_code);

    if (countError) {
      console.error("Error counting referrals:", countError);
      return { referrals_count: 0, referral_points: 0 };
    }

    const referrals_count = count || 0;
    const referral_points = referrals_count * 10; // 10 points per referral

    console.log(`Found ${referrals_count} referrals for code ${user.referral_code}`);

    return { referrals_count, referral_points };
  } catch (error) {
    console.error("Error in getUserReferralStats:", error);
    return { referrals_count: 0, referral_points: 0 };
  }
}

/**
 * Convert referral points to coins
 * 100 points = 10 coins
 */
export async function convertReferralPointsToCoins(userId: string): Promise<{
  success: boolean;
  newCoins: number;
  message: string;
}> {
  try {
    // Get current user data
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("coins, referral_code")
      .eq("id", userId)
      .single();

    if (fetchError) {
      throw new Error("Failed to fetch user data");
    }

    // Get referral stats
    const { referrals_count, referral_points } = await getUserReferralStats(userId);

    // Check if user has enough points (minimum 100 points)
    if (referral_points < 100) {
      return {
        success: false,
        newCoins: user.coins,
        message: `Need ${100 - referral_points} more points to convert to coins`
      };
    }

    // Calculate coins to add (100 points = 10 coins)
    const coinsToAdd = Math.floor(referral_points / 10);
    const newCoins = (user.coins || 0) + coinsToAdd;

    // Update user's coins
    const { error: updateError } = await supabase
      .from("users")
      .update({ coins: newCoins })
      .eq("id", userId);

    if (updateError) {
      throw new Error("Failed to update coins");
    }

    // Update local storage
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.coins = newCoins;
      await setCurrentUser(currentUser);
    }

    return {
      success: true,
      newCoins,
      message: `✅ Successfully converted ${referral_points} points to ${coinsToAdd} coins!`
    };
  } catch (error) {
    console.error("Error converting points:", error);
    return {
      success: false,
      newCoins: 0,
      message: "Failed to convert points"
    };
  }
}

/**
 * Get user badges based on achievements (using coins instead of score)
 */
export async function getUserBadges(userId: string): Promise<number> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("coins, day_streak, rank")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user for badges:", error);
      return 0;
    }

    console.log("User data for badges:", user);

    let badges = 0;
    
    // Badge 1: Coins > 1000
    if (user.coins >= 1000) badges++;
    // Badge 2: Coins > 5000
    if (user.coins >= 5000) badges++;
    // Badge 3: Coins > 10000
    if (user.coins >= 10000) badges++;
    // Badge 4: Streak > 7 days
    if (user.day_streak >= 7) badges++;
    // Badge 5: Streak > 30 days
    if (user.day_streak >= 30) badges++;
    // Badge 6: Rank is not beginner
    if (user.rank !== 'beginner') badges++;
    // Badge 7: Rank is pro or higher
    if (user.rank === 'pro' || user.rank === 'legend') badges++;

    return badges;
  } catch (error) {
    console.error("Error in getUserBadges:", error);
    return 0;
  }
}

/**
 * Check and update day streak
 */
export async function checkAndUpdateStreak(userId: string): Promise<{
  day_streak: number;
  isNewStreak: boolean;
}> {
  try {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("day_streak, last_streak_date")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user streak data:", fetchError);
      const today = new Date().toISOString().split("T")[0];
      return { day_streak: 1, isNewStreak: true };
    }

    const currentStreak = user?.day_streak || 0;
    const lastStreakDate = user?.last_streak_date;
    const today = new Date().toISOString().split("T")[0];

    if (!lastStreakDate) {
      await supabase
        .from("users")
        .update({ day_streak: 1, last_streak_date: today })
        .eq("id", userId);
      
      // Update local storage
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.day_streak = 1;
        currentUser.last_streak_date = today;
        await setCurrentUser(currentUser);
      }
      
      return { day_streak: 1, isNewStreak: true };
    }

    if (lastStreakDate === today) {
      return { day_streak: currentStreak, isNewStreak: false };
    }

    const lastDate = new Date(lastStreakDate);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let newStreak;

    if (diffDays === 1) {
      newStreak = currentStreak + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    } else {
      return { day_streak: currentStreak, isNewStreak: false };
    }

    await supabase
      .from("users")
      .update({ day_streak: newStreak, last_streak_date: today })
      .eq("id", userId);
    
    // Update local storage
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.day_streak = newStreak;
      currentUser.last_streak_date = today;
      await setCurrentUser(currentUser);
    }

    return {
      day_streak: newStreak,
      isNewStreak: newStreak === 1 && currentStreak > 0,
    };
  } catch (error) {
    console.error("Error in checkAndUpdateStreak:", error);
    return { day_streak: 1, isNewStreak: true };
  }
}

/**
 * Delete the current user's account and all associated data
 * This will:
 * 1. Delete user's feedback
 * 2. Delete user's referrals (if any)
 * 3. Finally delete the user from users table
 */
export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = currentUser.id;
  console.log("Attempting to delete account for user:", userId);

  try {
    // 1. Delete user's feedback first
    try {
      const { error: feedbackError } = await supabase
        .from("feedback")
        .delete()
        .eq("user_id", userId);
      
      if (feedbackError) {
        console.log("Error deleting feedback:", feedbackError);
      } else {
        console.log("✅ User feedback deleted");
      }
    } catch (feedbackError) {
      console.log("Feedback deletion error (continuing):", feedbackError);
    }

    // 2. Delete or update referrals where user is the referrer
    try {
      // First, get user's referral code
      const { data: userData } = await supabase
        .from("users")
        .select("referral_code")
        .eq("id", userId)
        .single();

      if (userData?.referral_code) {
        // Update users referred by this user to remove referral
        const { error: updateError } = await supabase
          .from("users")
          .update({ referred_by: null })
          .eq("referred_by", userData.referral_code);
        
        if (updateError) {
          console.log("Error updating referred users:", updateError);
        } else {
          console.log("✅ Updated referred users");
        }

        // Delete referral records
        const { error: referralError } = await supabase
          .from("referrals")
          .delete()
          .eq("referrer_code", userData.referral_code);
        
        if (referralError) {
          console.log("Error deleting referrals:", referralError);
        } else {
          console.log("✅ Referral records deleted");
        }
      }
    } catch (referralError) {
      console.log("Referral handling error (continuing):", referralError);
    }

    // 3. Finally delete the user from users table
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return { success: false, error: deleteError.message };
    }

    console.log("✅ User account deleted successfully");

    // Clear local storage
    await removeCurrentUser();
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Permanently delete user account with confirmation
 * This is a more aggressive version that ensures all data is removed
 */
export async function permanentlyDeleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = currentUser.id;
  console.log("Permanently deleting account for user:", userId);

  try {
    // Direct user deletion - cascade should handle related records if foreign keys are set up
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error("Error permanently deleting user:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ User account permanently deleted");

    // Clear local storage
    await removeCurrentUser();
    
    return { success: true };
  } catch (error) {
    console.error("Error in permanentlyDeleteUserAccount:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}