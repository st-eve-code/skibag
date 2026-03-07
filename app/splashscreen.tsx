import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

// Prevent auto-hide of native splash screen
ExpoSplashScreen.preventAutoHideAsync();

export default function SplashScreenPage() {
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  const logoSource = require("@/assets/logos/logo.png");

  // Loading bar animation - fills from left to right, then resets
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [progress]);

  // Hide native splash screen when fonts are ready
  useEffect(() => {
    const fontsReady = fontsLoaded || fontError;
    if (fontsReady) {
      const timer = setTimeout(() => {
        ExpoSplashScreen.hideAsync();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  // Navigate when fonts are loaded
  useEffect(() => {
    if (hasNavigated) return;

    const fontsReady = fontsLoaded || fontError;

    if (fontsReady) {
      const timer = setTimeout(() => {
        setHasNavigated(true);
        router.replace("/(onboardScreen)");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError, hasNavigated, router]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["5%", "95%"],
  });

  return (
    <View style={styles.container}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingBar, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.55,
    height: width * 0.35,
  },
  loadingContainer: {
    width: width * 0.4,
    height: 2,
    backgroundColor: "#222222",
    borderRadius: 1,
    overflow: "hidden",
    marginTop: 40,
  },
  loadingBar: {
    height: "100%",
    backgroundColor: "#5929d4",
    borderRadius: 1,
  },
});
