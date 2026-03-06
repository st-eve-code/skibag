import { supabase } from "./supabase";

export interface UserData {
  id: string;
  username: string;
  password: string;
  rank: string;
  coins: number;
  created_at: string;
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
 * Sign up a new user with username and password.
 * Stores credentials directly in the users table.
 */
export async function signUpWithUsername(
  username: string,
  password: string,
): Promise<void> {
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

  // Insert new user
  const { data, error } = await supabase
    .from("users")
    .insert({
      username: cleanedUsername,
      password: hashedPassword,
      coins: 50,
      rank: "beginner",
    })
    .select()
    .single();

  if (error) {
    console.error("Signup error:", error);
    throw new Error(error.message);
  }

  console.log("Signup successful:", data);
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
