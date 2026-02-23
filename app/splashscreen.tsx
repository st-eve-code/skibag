import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

// Prevent auto-hide of native splash screen
ExpoSplashScreen.preventAutoHideAsync();

export default function SplashScreenPage() {
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  const videoSource = require("@/assets/splashscreenvideo/loading.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  // Hide native splash screen immediately when component mounts
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  // Track when video ends
  useEffect(() => {
    const checkVideoStatus = setInterval(() => {
      // Video has ended when it's not playing and has progressed
      if (!player.playing && player.currentTime > 0 && player.currentTime >= player.duration - 0.1) {
        setVideoEnded(true);
        clearInterval(checkVideoStatus);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(checkVideoStatus);
  }, [player.playing, player.currentTime, player.duration]);

  // Navigate when BOTH video ended AND fonts loaded
  useEffect(() => {
    if (hasNavigated) return;

    const fontsReady = fontsLoaded || fontError;

    if (videoEnded && fontsReady) {
      console.log("Video ended and fonts loaded - navigating!");
      setHasNavigated(true);
      router.replace("/(onboardScreen)");
    } else if (videoEnded) {
      console.log("Video ended, waiting for fonts...");
    } else if (fontsReady) {
      console.log("Fonts ready, waiting for video...");
    }
  }, [videoEnded, fontsLoaded, fontError, hasNavigated]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: width,
    height: height,
  },
});