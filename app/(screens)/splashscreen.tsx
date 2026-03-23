import { useUser } from "@/lib/context/userContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { getCurrentUser } from "@/lib/services/supabaseAuthService";
import { useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

// Keep native splash visible until we're ready
ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export default function SplashScreenPage() {
  const router = useRouter();
  const { setUserData } = useUser();
  const progress = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  // Animate logo in + loading bar
  useEffect(() => {
    // Logo fade + scale in
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
    ]).start();

    // Loading bar fills once
    Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();
  }, []);

  // Auth check + navigation
  useEffect(() => {
    const run = async () => {
      // Hide native splash immediately
      await ExpoSplashScreen.hideAsync().catch(() => {});

      // Wait for animation to feel complete
      await new Promise(r => setTimeout(r, 2400));

      try {
        const user = await getCurrentUser();
        if (user) {
          // Pre-populate context so home screen doesn't flash empty state
          setUserData({
            id: user.id,
            username: user.username,
            avatarUri: user.avatar_url || null,
            rank: user.rank || "beginner",
            score: user.coins || 0,
            day_streak: user.day_streak || 0,
            last_streak_date: user.last_streak_date || undefined,
          });
          router.replace("/(tabs)");
        } else {
          router.replace("/language-selection");
        }
      } catch {
        router.replace("/language-selection");
      }
    };

    run();
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: "center" }}>
        <Image
          source={require("@/assets/logos/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.appNameRow}>
          <View style={styles.nameDot} />
          <View style={styles.nameDot} />
          <View style={styles.nameDot} />
        </View>
      </Animated.View>

      {/* Loading bar */}
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>

      <Text style={styles.tagline}>Play. Compete. Win.</Text>
    </View>
  );
}

import { Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: wp(55),
    height: wp(35),
  },
  appNameRow: {
    flexDirection: "row",
    gap: wp(1.5),
    marginTop: hp(1),
  },
  nameDot: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    backgroundColor: "#5929d4",
  },
  barTrack: {
    width: wp(45),
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: hp(5),
  },
  barFill: {
    height: "100%",
    backgroundColor: "#7b4fe0",
    borderRadius: 2,
  },
  tagline: {
    color: "rgba(255,255,255,0.3)",
    fontSize: fontScale(12),
    marginTop: hp(1.5),
    letterSpacing: 2,
    fontFamily: "Montserrat-Regular",
  },
});
