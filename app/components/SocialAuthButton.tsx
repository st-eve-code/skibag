import { Image } from "expo-image";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SocialAuthButtonProps {
  provider: "google" | "apple";
  label: string;
  onPress: () => void;
  loading?: boolean;
  style?: object;
}

const logos: Record<string, any> = {
  google: require("@/assets/logos/google.png"),
  apple: require("@/assets/logos/apple.png"),
};

export default function SocialAuthButton({
  provider,
  label,
  onPress,
  loading = false,
  style,
}: SocialAuthButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" style={styles.loader} />
        ) : (
          <Image source={logos[provider]} style={styles.logo} />
        )}
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  inner: { flexDirection: "row", alignItems: "center" },
  logo: { width: 30, height: 30, marginRight: 10 },
  loader: { marginRight: 10 },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat-Regular",
  },
});
