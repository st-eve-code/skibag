import React from "react";
import { ImageBackground, StatusBar, StyleSheet, View } from "react-native";

interface ScreenBackgroundProps {
  children: React.ReactNode;
  overlayOpacity?: number;
}

export default function ScreenBackground({
  children,
  overlayOpacity = 0.75,
}: ScreenBackgroundProps) {
  return (
    <ImageBackground
      source={require("@/assets/images/bg3.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(12, 12, 12, ${overlayOpacity})` },
        ]}
      >
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1 },
});
