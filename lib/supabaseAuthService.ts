import { supabase } from "./supabase";

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
}

// Store current logged in user in memory
let currentUser: UserData | null = null;

/**
 * Simple hash function for password hashing
 * Note: In production, use a proper bcrypt library server-side
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
 * Stores credentials directly in the users table.
 * @param referralCode - Optional referral code from another user
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
    // Generate another code if collision
    newReferralCode = generateReferralCode();
  }

  // Check if referral code is valid (if provided)
  let referredBy = null;
  if (referralCode) {
    const { data: referrer } = await supabase
      .from("users")
      .select("id")
      .eq("referral_code", referralCode)
      .single();

    if (referrer) {
      referredBy = referrer.id;
      console.log("Valid referral code, referrer:", referrer.id);
    }
  }

  // Insert new user
  const { data, error } = await supabase
    .from("users")
    .insert({
      username: cleanedUsername,
      password: hashedPassword,
      coins: 50,
      rank: "beginner",
      referral_code: newReferralCode,
      referred_by: referredBy,
    })
    .select()
    .single();

  if (error) {
    console.error("Signup error:", error);
    throw new Error(error.message);
  }

  console.log("Signup successful:", data);

  // Set current user in memory after successful signup
  currentUser = data;

  return data;
}

/**
 * Sign in with username and password.
 * Verifies credentials against stored data.
 */
export async function signInWithUsername(
  username: string,
  password: string,
): Promise<UserData> {
  const cleanedUsername = username.toLowerCase().trim();
  const hashedPassword = hashPassword(password);

  console.log("Attempting signin for:", cleanedUsername);

  // Find user with matching username and password
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

  // Store current user
  currentUser = data;
  console.log("Signin successful:", data);

  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  currentUser = null;
  console.log("Signed out");
}

/**
 * Get the currently authenticated user.
 */
export async function getCurrentUser(): Promise<UserData | null> {
  return currentUser;
}

/**
 * Get the current user ID (needed for profile uploads).
 */
export function getCurrentUserId(): string | null {
  return currentUser?.id || null;
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
 * Update user's avatar URL in the users table.
 * @param avatarUrl - The public URL of the uploaded avatar
 */
export async function updateUserAvatar(avatarUrl: string): Promise<void> {
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("id", currentUser.id);

  if (error) {
    console.error("Error updating avatar:", error);
    throw new Error("Failed to update profile picture");
  }

  // Update local currentUser as well
  currentUser.avatar_url = avatarUrl;

  console.log("Avatar updated successfully");
}

/**
 * Get user's avatar URL from the users table.
 */
export async function getUserAvatar(): Promise<string | null> {
  if (!currentUser) {
    return null;
  }

  // Return from local cache if available
  return currentUser.avatar_url || null;
}

/**
 * Delete the current user's account.
 * Removes the user from the users table and clears local session.
 */
export async function deleteUserAccount(): Promise<void> {
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = currentUser.id;

  // Delete the user from the users table
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account");
  }

  // Clear local session
  currentUser = null;

  console.log("Account deleted successfully");
}
