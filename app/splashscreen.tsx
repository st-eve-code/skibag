import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

// Prevent auto-hide of native splash screen
ExpoSplashScreen.preventAutoHideAsync();

export default function SplashScreenPage() {
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  const logoSource = require("@/assets/logos/logo.png");

  // Hide native splash screen immediately when component mounts
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  // Navigate when fonts are loaded
  useEffect(() => {
    if (hasNavigated) return;

    const fontsReady = fontsLoaded || fontError;

    if (fontsReady) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        console.log("Fonts loaded - navigating!");
        setHasNavigated(true);
        router.replace("/(onboardScreen)");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError, hasNavigated, router]);

  return (
    <View style={styles.container}>
      <Image source={logoSource} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.7,
    height: height * 0.5,
  },
});
