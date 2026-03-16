import { signInWithApple, signInWithGoogle } from "@/lib/authService";
import { useTranslation } from "@/lib/I18nContext";
import { getCurrentUser, signInWithUsername } from "@/lib/supabaseAuthService";

import { useUser } from "@/lib/userContext";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const { setUserData, addNotification } = useUser();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Note: OAuth redirect will handle setting user data in callback
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithApple();
      // Note: OAuth redirect will handle setting user data in callback
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in with Apple");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert(t("error"), t("invalid_email"));
      return;
    }
    if (!password) {
      Alert.alert(t("error"), t("password"));
      return;
    }
    try {
      setLoginLoading(true);
      await signInWithUsername(username.trim(), password);

      // Sync user data to UserContext after login
      const user = await getCurrentUser();
      if (user) {
        setUserData({
          id: user.id,
          username: user.username,
          email: user.username + "@skibag.app", // Create fake email since we don't have one
          avatarUri: user.avatar_url || null,
          rank: user.rank || "beginner",
          score: user.coins || 0,
          day_streak: user.day_streak || 0,
          last_streak_date: user.last_streak_date || undefined,
        });

        // Add welcome back notification
        addNotification(
          "login",
          `Welcome back, ${user.username}!`,
          "Great to see you again. Ready to play?",
        );
      }

      // Small delay to ensure userData is set before navigation
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 500);
    } catch (error: any) {
      Alert.alert(t("login"), error.message || t("invalid_password"));
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("@/assets/images/zane.jpeg")}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <LinearGradient
          colors={
            [
              "rgba(255, 255, 255, 0)",
              "rgba(37, 16, 104, 0.68)",
              "rgba(0, 0, 7, 0.99)",
            ] as const
          }
          start={{ x: 0.2, y: 0.3 }}
          end={{ x: 0.1, y: 1 }}
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SafeAreaView
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              paddingHorizontal: 10,
              justifyContent: "center",
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "flex-end",
                }}
                keyboardShouldPersistTaps="handled"
              >
                <View
                  style={{
                    justifyContent: "flex-end",
                    paddingBottom: 80,
                    paddingHorizontal: 25,
                  }}
                >
                  {/* Username Label */}
                  <Text style={styles.label}>{t("username")}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t("username")}
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />

                  {/* Password Label */}
                  <Text style={[styles.label, { marginTop: 20 }]}>
                    {t("password")}
                  </Text>
                  <View
                    style={{
                      position: "relative",
                      width: "100%",
                      marginTop: 8,
                    }}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder={t("password")}
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                      style={{ position: "absolute", right: 15, top: 15 }}
                    >
                      <Text style={{ color: "#555", fontSize: 13 }}>
                        {showPassword ? t("hide_password") : t("show_password")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loginLoading}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {loginLoading ? (
                        <ActivityIndicator
                          size="small"
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                      ) : null}
                      <Text style={styles.loginButtonText}>{t("login")}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* OR Divider */}
                  <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}> OR </Text>
                    <View style={styles.line} />
                  </View>

                  {/* Continue with Google */}
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {loading ? (
                        <ActivityIndicator
                          size="small"
                          color="#000"
                          style={{ marginRight: 10 }}
                        />
                      ) : (
                        <Image
                          source={require("@/assets/logos/google.png")}
                          style={styles.socialLogo}
                        />
                      )}
                      <Text style={styles.socialButtonText}>
                        {t("or_continue_with")} Google
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Continue with Apple - iOS only */}
                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={[styles.socialButton, { marginTop: 10 }]}
                      onPress={handleAppleSignIn}
                      disabled={loading}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {loading ? (
                          <ActivityIndicator
                            size="small"
                            color="#000"
                            style={{ marginRight: 10 }}
                          />
                        ) : (
                          <Image
                            source={require("@/assets/logos/apple.png")}
                            style={styles.socialLogo}
                          />
                        )}
                        <Text style={styles.socialButtonText}>
                          {t("or_continue_with")} Apple
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Sign up link */}
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>
                      {t("dont_have_account")}{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/signup")}>
                      <Text style={styles.signupLink}>{t("sign_up")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#e0e0e0",
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#000",
    width: "100%",
  },
  socialButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  socialLogo: { width: 30, height: 30, marginRight: 10 },
  socialButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat-Regular",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  line: { flex: 1, height: 1, backgroundColor: "#5a5a8076" },
  orText: {
    color: "#b6b6b6d0",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  loginButton: {
    backgroundColor: "#5929d4",
    padding: 16,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
    marginTop: 25,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  signupContainer: {
    alignItems: "center",
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#f0f0f0d0",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  signupLink: {
    color: "#454ef3",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat-Regular",
  },
});
