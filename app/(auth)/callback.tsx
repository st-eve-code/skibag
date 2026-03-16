import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/userContext";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

// Helper function to fetch user data from Supabase for OAuth users
const fetchUserDataForOAuth = async (userId: string) => {
  try {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userData) {
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email || userData.username + "@skibag.app",
        avatarUri: userData.avatar_url || null,
        rank: userData.rank || "beginner",
        score: userData.coins || 0,
        day_streak: userData.day_streak || 0,
        last_streak_date: userData.last_streak_date || undefined,
      };
    }
    // If no user record exists, create a username from the user ID
    return {
      id: userId,
      username: `User_${userId.substring(0, 6)}`,
      email: userId + "@skibag.app",
      avatarUri: null,
      rank: "beginner",
      score: 0,
      day_streak: 1,
      last_streak_date: undefined,
    };
  } catch (error) {
    console.log("Error fetching user data:", error);
    // Return default user data based on ID
    return {
      id: userId,
      username: `User_${userId.substring(0, 6)}`,
      email: userId + "@skibag.app",
      avatarUri: null,
      rank: "beginner",
      score: 0,
      day_streak: 1,
      last_streak_date: undefined,
    };
  }
};

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const { setUserData } = useUser();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        const url = Linking.parse(initialUrl || "");
        const params = url.queryParams;

        // Check if URL has access token params from OAuth
        if (params?.access_token) {
          // URL contains auth params - set session from URL
          const accessToken = params.access_token as string;
          const refreshToken = (params.refresh_token as string) || "";
          const { data, error: authError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (authError) {
            console.error("Auth callback error:", authError);
            setError(authError.message);
            return;
          }

          if (data.session && data.session.user) {
            // For OAuth users, fetch from Supabase users table
            const userId = data.session.user.id;
            const userData = await fetchUserDataForOAuth(userId);
            setUserData(userData);
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)/login");
          }
        } else {
          // No params, try to get existing session
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session && session.user) {
            // For OAuth users, fetch from Supabase users table
            const userId = session.user.id;
            const userData = await fetchUserDataForOAuth(userId);
            setUserData(userData);
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)/login");
          }
        }
      } catch (e: any) {
        console.error("Callback exception:", e);
        setError(e.message || "Authentication failed");
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Authentication Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5929d4" />
      <Text style={styles.loadingText}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "#f44336",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorMessage: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
