import OrDivider from "@/app/components/OrDivider";
import SocialAuthButton from "@/app/components/SocialAuthButton";
import { signInWithApple, signInWithGoogle } from "@/lib/context/authService";
import { useTranslation } from "@/lib/context/I18nContext";
import { useUser } from "@/lib/context/userContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { getCurrentUser, signUpWithUsername } from "@/lib/services/supabaseAuthService";
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

export default function Signup() {
  const { t } = useTranslation();
  const { setUserData, addNotification } = useUser();
  const [loading, setLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string; password?: string; confirmPassword?: string; referralCode?: string;
  }>({});

  const passwordRules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim() || username.trim().length < 3) newErrors.username = t("username_min_length");
    if (!isPasswordValid) newErrors.password = t("password_requirements");
    if (password !== confirmPassword) newErrors.confirmPassword = t("passwords_dont_match");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      setSignupLoading(true);
      await signUpWithUsername(username.trim(), password, referralCode);
      const user = await getCurrentUser();
      if (user) {
        setUserData({
          id: user.id, username: user.username,
          email: user.username + "@skibag.app",
          avatarUri: user.avatar_url || null,
          rank: user.rank || "beginner",
          score: user.coins || 0,
          day_streak: user.day_streak || 1,
          last_streak_date: user.last_streak_date || undefined,
        });
        addNotification("signup", `Welcome, ${user.username}!`, "Your account has been created successfully. Enjoy the game!");
      }
      setTimeout(() => router.replace("/(tabs)"), 500);
    } catch (e: any) {
      Alert.alert(t("error"), e.message || t("signup_error"));
    } finally { setSignupLoading(false); }
  };

  const handleGoogle = async () => {
    try { setLoading(true); await signInWithGoogle(); }
    catch (e: any) { Alert.alert(t("error"), t("google_signin_error")); }
    finally { setLoading(false); }
  };

  const handleApple = async () => {
    try { setLoading(true); await signInWithApple(); }
    catch (e: any) { Alert.alert(t("error"), t("apple_signin_error")); }
    finally { setLoading(false); }
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("@/assets/images/domino.jpeg")}
        resizeMode="cover"
        style={styles.bg}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.05)", "rgba(20,8,60,0.8)", "rgba(0,0,0,0.98)"]}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                {/* Title */}
                <View style={styles.header}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>Join thousands of players today</Text>
                </View>

                {/* Form Card */}
                <View style={styles.card}>
                  {/* Username */}
                  <Text style={styles.label}>{t("username")}</Text>
                  <View style={[styles.inputRow, errors.username ? styles.inputError : null]}>
                    <Ionicons name="person-outline" size={fontScale(18)} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. juniorXXX237"
                      placeholderTextColor="#666"
                      value={username}
                      onChangeText={v => { setUsername(v); setErrors(e => ({ ...e, username: undefined })); }}
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

                  {/* Password */}
                  <Text style={[styles.label, { marginTop: hp(1.5) }]}>{t("password")}</Text>
                  <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
                    <Ionicons name="lock-closed-outline" size={fontScale(18)} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder={t("password")}
                      placeholderTextColor="#666"
                      value={password}
                      onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: undefined })); }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={fontScale(20)} color="#888" />
                    </TouchableOpacity>
                  </View>
                  {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                  {/* Password strength */}
                  {password.length > 0 && (
                    <View style={styles.rulesBox}>
                      {[
                        { label: t("min_8_chars"), ok: passwordRules.minLength },
                        { label: t("uppercase"), ok: passwordRules.hasUppercase },
                        { label: t("lowercase"), ok: passwordRules.hasLowercase },
                        { label: t("number"), ok: passwordRules.hasNumber },
                        { label: t("special_char"), ok: passwordRules.hasSpecial },
                      ].map((r, i) => (
                        <View key={i} style={styles.ruleRow}>
                          <Ionicons name={r.ok ? "checkmark-circle" : "close-circle"} size={fontScale(13)} color={r.ok ? "#4caf50" : "#f44336"} />
                          <Text style={[styles.ruleText, { color: r.ok ? "#4caf50" : "#f44336" }]}> {r.label}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Confirm Password */}
                  <Text style={[styles.label, { marginTop: hp(1.5) }]}>{t("confirm_password")}</Text>
                  <View style={[styles.inputRow, errors.confirmPassword ? styles.inputError : null]}>
                    <Ionicons name="shield-checkmark-outline" size={fontScale(18)} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder={t("confirm_password")}
                      placeholderTextColor="#666"
                      value={confirmPassword}
                      onChangeText={v => { setConfirmPassword(v); setErrors(e => ({ ...e, confirmPassword: undefined })); }}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                      <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={fontScale(20)} color="#888" />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword
                    ? <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    : confirmPassword.length > 0 && password === confirmPassword
                      ? <Text style={[styles.errorText, { color: "#4caf50" }]}>✓ {t("passwords_match")}</Text>
                      : null}

                  {/* Referral Code */}
                  <Text style={[styles.label, { marginTop: hp(1.5) }]}>{t("referral_code_optional")}</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="gift-outline" size={fontScale(18)} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("referral_code_optional")}
                      placeholderTextColor="#666"
                      value={referralCode}
                      onChangeText={v => { setReferralCode(v.toUpperCase()); setErrors(e => ({ ...e, referralCode: undefined })); }}
                      autoCapitalize="characters"
                      maxLength={8}
                    />
                  </View>
                  {referralCode.length > 0 && <Text style={[styles.errorText, { color: "#4caf50" }]}>✓ {t("share_code")}</Text>}

                  {/* Sign Up Button */}
                  <TouchableOpacity style={[styles.primaryBtn, { opacity: signupLoading ? 0.7 : 1 }]} onPress={handleSignup} disabled={signupLoading} activeOpacity={0.85}>
                    <LinearGradient colors={["#7b4fe0", "#5929d4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                      {signupLoading
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <Text style={styles.btnText}>{t("create_account")}</Text>}
                    </LinearGradient>
                  </TouchableOpacity>

                  <OrDivider />

                  <SocialAuthButton provider="google" label={`${t("or_continue_with")} Google`} onPress={handleGoogle} loading={loading} />
                  {Platform.OS === "ios" && (
                    <SocialAuthButton provider="apple" label={`${t("or_continue_with")} Apple`} onPress={handleApple} loading={loading} style={{ marginTop: hp(1.2) }} />
                  )}
                </View>

                {/* Login link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>{t("already_have_account")} </Text>
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.footerLink}>{t("login")}</Text>
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

  header: { alignItems: "center", marginBottom: hp(2.5) },
  title: { fontSize: fontScale(26), fontWeight: "bold", color: "#fff", fontFamily: "Poppins-Bold", letterSpacing: 0.5 },
  subtitle: { fontSize: fontScale(13), color: "rgba(255,255,255,0.55)", marginTop: hp(0.5), fontFamily: "Montserrat-Regular" },

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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: wp(3),
    height: hp(6.5),
  },
  inputError: { borderColor: "#f44336" },
  inputIcon: { marginRight: wp(2) },
  input: { flex: 1, color: "#fff", fontSize: fontScale(14), fontFamily: "Montserrat-Regular" },
  eyeBtn: { padding: wp(1) },
  errorText: { color: "#f44336", fontSize: fontScale(11), marginTop: hp(0.4), fontFamily: "Montserrat-Regular" },

  rulesBox: { backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 10, padding: wp(3), marginTop: hp(1) },
  ruleRow: { flexDirection: "row", alignItems: "center", marginBottom: hp(0.3) },
  ruleText: { fontSize: fontScale(11), fontFamily: "Montserrat-Regular" },

  primaryBtn: { marginTop: hp(2.5), borderRadius: 100, overflow: "hidden" },
  btnGradient: { paddingVertical: hp(1.8), alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontSize: fontScale(16), fontWeight: "bold", fontFamily: "Poppins-Bold" },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: hp(3) },
  footerText: { color: "rgba(255,255,255,0.6)", fontSize: fontScale(14), fontFamily: "Montserrat-Regular" },
  footerLink: { color: "#a78bfa", fontSize: fontScale(14), fontWeight: "bold", fontFamily: "Montserrat-Regular" },
});
