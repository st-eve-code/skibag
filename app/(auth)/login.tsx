import OrDivider from "@/app/components/OrDivider";
import SocialAuthButton from "@/app/components/SocialAuthButton";
import { signInWithApple, signInWithGoogle } from "@/lib/context/authService";
import { useTranslation } from "@/lib/context/I18nContext";
import { useUser } from "@/lib/context/userContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { getCurrentUser, signInWithUsername } from "@/lib/services/supabaseAuthService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator, Alert,
    ImageBackground,
    KeyboardAvoidingView, Platform, ScrollView, StatusBar,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { t } = useTranslation();
  const { setUserData, addNotification } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try { setLoading(true); await signInWithGoogle(); }
    catch (e: any) { Alert.alert("Error", e.message || "Failed to sign in with Google"); }
    finally { setLoading(false); }
  };

  const handleAppleSignIn = async () => {
    try { setLoading(true); await signInWithApple(); }
    catch (e: any) { Alert.alert("Error", e.message || "Failed to sign in with Apple"); }
    finally { setLoading(false); }
  };

  const handleLogin = async () => {
    if (!username.trim()) { Alert.alert(t("error"), t("invalid_email")); return; }
    if (!password) { Alert.alert(t("error"), t("password")); return; }
    try {
      setLoginLoading(true);
      await signInWithUsername(username.trim(), password);
      const user = await getCurrentUser();
      if (user) {
        setUserData({
          id: user.id, username: user.username,
          email: user.username + "@skibag.app",
          avatarUri: user.avatar_url || null,
          rank: user.rank || "beginner",
          score: user.coins || 0,
          day_streak: user.day_streak || 0,
          last_streak_date: user.last_streak_date || undefined,
        });
        addNotification("login", `Welcome back, ${user.username}!`, "Great to see you again. Ready to play?");
      }
      setTimeout(() => router.replace("/(tabs)"), 500);
    } catch (e: any) {
      Alert.alert(t("login"), e.message || t("invalid_password"));
    } finally { setLoginLoading(false); }
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("@/assets/images/zane.jpeg")}
        resizeMode="cover"
        style={styles.bg}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(20,8,60,0.75)", "rgba(0,0,0,0.97)"]}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                {/* Title */}
                <View style={styles.header}>
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>Sign in to continue playing</Text>
                </View>

                {/* Form Card */}
                <View style={styles.card}>
                  {/* Username */}
                  <Text style={styles.label}>{t("username")}</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="person-outline" size={fontScale(18)} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("username")}
                      placeholderTextColor="#888"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Password */}
                  <Text style={[styles.label, { marginTop: hp(2) }]}>{t("password")}</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed-outline" size={fontScale(18)} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder={t("password")}
                      placeholderTextColor="#888"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={fontScale(20)} color="#888" />
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loginLoading} activeOpacity={0.85}>
                    <LinearGradient colors={["#7b4fe0", "#5929d4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                      {loginLoading
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={styles.btnText}>{t("login")}</Text>}
                    </LinearGradient>
                  </TouchableOpacity>

                  <OrDivider />

                  <SocialAuthButton provider="google" label={`${t("or_continue_with")} Google`} onPress={handleGoogleSignIn} loading={loading} />
                  {Platform.OS === "ios" && (
                    <SocialAuthButton provider="apple" label={`${t("or_continue_with")} Apple`} onPress={handleAppleSignIn} loading={loading} style={{ marginTop: hp(1.2) }} />
                  )}
                </View>

                {/* Sign up link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>{t("dont_have_account")} </Text>
                  <TouchableOpacity onPress={() => router.push("/signup")}>
                    <Text style={styles.footerLink}>{t("sign_up")}</Text>
                  </TouchableOpacity>
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
  bg: { flex: 1, width: "100%", height: "100%" },
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: wp(6), paddingVertical: hp(4) },

  header: { alignItems: "center", marginBottom: hp(3) },
  title: { fontSize: fontScale(28), fontWeight: "bold", color: "#fff", fontFamily: "Poppins-Bold", letterSpacing: 0.5 },
  subtitle: { fontSize: fontScale(14), color: "rgba(255,255,255,0.6)", marginTop: hp(0.5), fontFamily: "Montserrat-Regular" },

  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: wp(5),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  label: { color: "rgba(255,255,255,0.75)", fontSize: fontScale(13), marginBottom: hp(0.8), fontFamily: "Montserrat-Regular" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: wp(3),
    height: hp(6.5),
  },
  inputIcon: { marginRight: wp(2) },
  input: { flex: 1, color: "#fff", fontSize: fontScale(14), fontFamily: "Montserrat-Regular" },
  eyeBtn: { padding: wp(1) },

  primaryBtn: { marginTop: hp(2.5), borderRadius: 100, overflow: "hidden" },
  btnGradient: { paddingVertical: hp(1.8), alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontSize: fontScale(16), fontWeight: "bold", fontFamily: "Poppins-Bold" },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: hp(3) },
  footerText: { color: "rgba(255,255,255,0.6)", fontSize: fontScale(14), fontFamily: "Montserrat-Regular" },
  footerLink: { color: "#a78bfa", fontSize: fontScale(14), fontWeight: "bold", fontFamily: "Montserrat-Regular" },
});
