import { signInWithApple, signInWithGoogle } from "@/lib/authService";
import { useTranslation } from "@/lib/I18nContext";
import { getCurrentUser, signUpWithUsername } from "@/lib/supabaseAuthService";
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

export default function Signup() {
  const { t } = useTranslation();
  const { setUserData, addNotification } = useUser();
  const [loading, setLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // Get referral code from manual input only
  const [referralCode, setReferralCode] = useState("");

  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
    referralCode?: string;
  }>({});

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  // ─── Password rules ──────────────────────────────────────────────────────────
  const passwordRules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  // ─── Validate form ───────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim() || username.trim().length < 3) {
      newErrors.username = t("username_min_length");
    }
    if (!isPasswordValid) {
      newErrors.password = t("password_requirements");
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("passwords_dont_match");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!validate()) return;
    try {
      setSignupLoading(true);
      // Use manual referral code from input field only
      await signUpWithUsername(username.trim(), password, referralCode);

      // Sync user data to UserContext after signup
      const user = await getCurrentUser();
      if (user) {
        setUserData({
          id: user.id,
          username: user.username,
          email: user.username + "@skibag.app",
          avatarUri: user.avatar_url || null,
          rank: user.rank || "beginner",
          score: user.coins || 0,
          day_streak: user.day_streak || 1,
          last_streak_date: user.last_streak_date || undefined,
        });

        // Add welcome notification
        addNotification(
          "signup",
          `Welcome, ${user.username}!`,
          "Your account has been created successfully. Enjoy the game!",
        );
      }

      // Small delay to ensure userData is set before navigation
      setTimeout(() => {
        // Navigate immediately after successful signup
        router.replace("/(tabs)");
      }, 500);
    } catch (e: any) {
      Alert.alert(t("error"), e.message || t("signup_error"));
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Note: OAuth redirect will handle setting user data in callback
    } catch (e: any) {
      Alert.alert(t("error"), t("google_signin_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    try {
      setLoading(true);
      await signInWithApple();
      // Note: OAuth redirect will handle setting user data in callback
    } catch (e: any) {
      Alert.alert(t("error"), t("apple_signin_error"));
    } finally {
      setLoading(false);
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
        source={require("@/assets/images/domino.jpeg")}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <LinearGradient
          colors={
            [
              "rgba(255, 255, 255, 0)",
              "rgba(37, 16, 104, 0.78)",
              "rgba(0, 0, 0, 0.99)",
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
                    paddingBottom: 60,
                    paddingHorizontal: 20,
                  }}
                >
                  {/* Loading Indicator */}
                  {loading && (
                    <ActivityIndicator
                      size="large"
                      color="#fff"
                      style={{ marginBottom: 20 }}
                    />
                  )}

                  {/* ── Username ── */}
                  <Text style={styles.label}>{t("username")}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.username ? styles.inputError : null,
                    ]}
                    placeholder="e.g. juniorXXX237"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={(v) => {
                      setUsername(v);
                      setErrors((e) => ({ ...e, username: undefined }));
                    }}
                    autoCapitalize="none"
                  />
                  {errors.username ? (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  ) : null}

                  {/* ── Password ── */}
                  <Text style={[styles.label, { marginTop: 12 }]}>
                    {t("password")}
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[
                        styles.input,
                        { flex: 1 },
                        errors.password ? styles.inputError : null,
                      ]}
                      placeholder={t("password")}
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={(v) => {
                        setPassword(v);
                        setErrors((e) => ({ ...e, password: undefined }));
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                      style={styles.eyeBtn}
                    >
                      <Text style={styles.eyeText}>
                        {showPassword ? t("hide_password") : t("show_password")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}

                  {/* Password strength hints */}
                  {password.length > 0 && (
                    <View style={styles.rulesBox}>
                      {[
                        {
                          label: t("min_8_chars"),
                          ok: passwordRules.minLength,
                        },
                        {
                          label: t("uppercase"),
                          ok: passwordRules.hasUppercase,
                        },
                        {
                          label: t("lowercase"),
                          ok: passwordRules.hasLowercase,
                        },
                        { label: t("number"), ok: passwordRules.hasNumber },
                        {
                          label: t("special_char"),
                          ok: passwordRules.hasSpecial,
                        },
                      ].map((r, i) => (
                        <Text
                          key={i}
                          style={[
                            styles.ruleText,
                            { color: r.ok ? "#4caf50" : "#f44336" },
                          ]}
                        >
                          {r.ok ? "✓" : "✗"} {r.label}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* ── Confirm Password ── */}
                  <Text style={[styles.label, { marginTop: 12 }]}>
                    {t("confirm_password")}
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[
                        styles.input,
                        { flex: 1 },
                        errors.confirmPassword ? styles.inputError : null,
                      ]}
                      placeholder={t("confirm_password")}
                      placeholderTextColor="#999"
                      value={confirmPassword}
                      onChangeText={(v) => {
                        setConfirmPassword(v);
                        setErrors((e) => ({
                          ...e,
                          confirmPassword: undefined,
                        }));
                      }}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm((v) => !v)}
                      style={styles.eyeBtn}
                    >
                      <Text style={styles.eyeText}>
                        {showConfirm ? t("hide_password") : t("show_password")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  ) : confirmPassword.length > 0 &&
                    password === confirmPassword ? (
                    <Text style={[styles.errorText, { color: "#4caf50" }]}>
                      ✓ {t("passwords_match")}
                    </Text>
                  ) : null}

                  {/* ── Referral Code (Optional) ── */}
                  <Text style={[styles.label, { marginTop: 12 }]}>
                    {t("referral_code_optional")}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.referralCode ? styles.inputError : null,
                    ]}
                    placeholder={t("referral_code_optional")}
                    placeholderTextColor="#999"
                    value={referralCode}
                    onChangeText={(v) => {
                      setReferralCode(v.toUpperCase());
                      setErrors((e) => ({ ...e, referralCode: undefined }));
                    }}
                    autoCapitalize="characters"
                    maxLength={8}
                  />
                  {errors.referralCode ? (
                    <Text style={styles.errorText}>{errors.referralCode}</Text>
                  ) : referralCode.length > 0 ? (
                    <Text style={[styles.errorText, { color: "#4caf50" }]}>
                      ✓ {t("share_code")}
                    </Text>
                  ) : null}

                  {/* ── Sign Up Button ── */}
                  <TouchableOpacity
                    style={[
                      styles.purpleBtn,
                      { marginTop: 18, opacity: signupLoading ? 0.6 : 1 },
                    ]}
                    onPress={handleSignup}
                    disabled={signupLoading}
                  >
                    {signupLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.lightBtnText}>
                        {t("create_account")}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Google */}
                  <TouchableOpacity
                    style={styles.whiteBtn}
                    onPress={handleGoogle}
                    disabled={loading}
                  >
                    <Image
                      source={require("@/assets/logos/google.png")}
                      style={styles.logo}
                    />
                    <Text style={styles.darkBtnText}>
                      {t("or_continue_with")} Google
                    </Text>
                  </TouchableOpacity>

                  {/* Apple — iOS only */}
                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={[styles.whiteBtn, { marginTop: 10 }]}
                      onPress={handleApple}
                      disabled={loading}
                    >
                      <Image
                        source={require("@/assets/logos/apple.png")}
                        style={styles.logo}
                      />
                      <Text style={styles.darkBtnText}>
                        {t("or_continue_with")} Apple
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* OR Divider */}
                  <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}> OR </Text>
                    <View style={styles.line} />
                  </View>

                  {/* Already have account */}
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: 20,
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: "#f0f0f0d0",
                        fontSize: 14,
                        fontFamily: "Montserrat-Regular",
                      }}
                    >
                      {t("already_have_account")}{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/login")}>
                      <Text
                        style={{
                          color: "#454ef3",
                          fontSize: 14,
                          fontWeight: "bold",
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        {t("login")}
                      </Text>
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
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#000",
    width: "100%",
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Montserrat-Regular",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  eyeText: {
    color: "#555",
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  rulesBox: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  ruleText: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    marginBottom: 2,
  },
  whiteBtn: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  purpleBtn: {
    backgroundColor: "#5929d4",
    padding: 15,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
  },
  logo: { width: 30, height: 30, marginRight: 10 },
  darkBtnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat-Regular",
  },
  lightBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#5a5a8076" },
  orText: {
    color: "#b6b6b6d0",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
