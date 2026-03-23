import * as WebBrowser from "expo-web-browser";
import { supabase } from "../services/supabase";

/**
 * Configure Google Sign-In (no-op stub — kept for API compatibility).
 * Google OAuth is handled via Supabase's OAuth flow.
 */
export const configureGoogle = () => {
  // No configuration needed — Supabase handles OAuth providers
};

/**
 * Sign in with Google via Supabase OAuth.
 * Opens the browser for Google authentication.
 */
export const signInWithGoogle = async (
  _referralCode?: string,
): Promise<void> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "skibag://auth/callback",
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    throw new Error(error.message);
  }

  if (data.url) {
    // Open the OAuth URL in a browser
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      "skibag://auth/callback",
    );

    if (result.type !== "success") {
      console.log("OAuth cancelled or failed:", result);
    }
  }
};

/**
 * Sign in with Apple via Supabase OAuth.
 * Opens the browser for Apple authentication (iOS only).
 */
export const signInWithApple = async (
  _referralCode?: string,
): Promise<void> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: "skibag://auth/callback",
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    console.error("Apple OAuth error:", error);
    throw new Error(error.message);
  }

  if (data.url) {
    // Open the OAuth URL in a browser
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      "skibag://auth/callback",
    );

    if (result.type !== "success") {
      console.log("OAuth cancelled or failed:", result);
    }
  }
};

/**
 * Sign out the current user.
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
