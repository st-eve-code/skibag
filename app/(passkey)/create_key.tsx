import { signUpWithUsername } from "@/lib/supabaseAuthService";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateKey() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
  });

  const passwordRules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isConfirmMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const isUsernameValid = username.trim().length >= 3;
  const isFormValid = isUsernameValid && isPasswordValid && isConfirmMatch;

  const getUsernameError = () => {
    if (!touched.username) return "";
    if (username.trim().length === 0) return "Username is required";
    if (username.trim().length < 3)
      return "Username must be at least 3 characters";
    return "";
  };

  const getPasswordError = () => {
    if (!touched.password || password.length === 0) return "";
    if (!passwordRules.minLength)
      return "Password must be at least 8 characters";
    if (!passwordRules.hasUppercase)
      return "Password must contain at least one uppercase letter";
    if (!passwordRules.hasLowercase)
      return "Password must contain at least one lowercase letter";
    if (!passwordRules.hasNumber)
      return "Password must contain at least one number";
    if (!passwordRules.hasSpecial)
      return "Password must contain at least one special character";
    return "";
  };

  const getConfirmPasswordError = () => {
    if (!touched.confirmPassword || confirmPassword.length === 0) return "";
    if (!isConfirmMatch) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async () => {
    setTouched({ username: true, password: true, confirmPassword: true });
    if (!isFormValid) return;
    try {
      setSubmitting(true);
      await signUpWithUsername(username.trim(), password);
      Alert.alert(
        "Account Created",
        "Your account has been created! Please sign in.",
        [{ text: "OK", onPress: () => router.push("/(auth)/login") }],
      );
    } catch (e: any) {
      Alert.alert(
        "Sign Up Failed",
        e.message || "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/star.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[
          "rgba(66, 126, 148, 0.07)",
          "rgba(37, 60, 103, 0.36)",
          "rgba(7, 22, 55, 0.83)",
          "rgb(7, 12, 40)",
        ]}
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
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 2,
                  marginTop: 50,
                  paddingHorizontal: 20,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#ffffff",
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  Welcome back gamer, let us get your passkey ready!
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ffffffb0",
                    marginBottom: 24,
                    textAlign: "center",
                  }}
                >
                  Create your account credentials below.
                </Text>

                <View style={{ width: "100%", marginTop: 10 }}>
                  {/* Username */}
                  <TextInput
                    label="Username"
                    placeholder="e.g. juniorXXX237"
                    autoCapitalize="none"
                    mode="outlined"
                    value={username}
                    onChangeText={setUsername}
                    onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                    style={styles.input}
                    outlineColor="#ffffff50"
                    activeOutlineColor="#0c499e"
                    textColor="#000000"
                    error={!!getUsernameError()}
                  />
                  {!!getUsernameError() && (
                    <HelperText type="error" visible style={styles.helperText}>
                      {getUsernameError()}
                    </HelperText>
                  )}

                  {/* Password */}
                  <TextInput
                    label="Password"
                    placeholder="Enter password"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    style={styles.input}
                    outlineColor="#ffffff50"
                    activeOutlineColor="#0c499e"
                    textColor="#000000"
                    error={!!getPasswordError()}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword((v) => !v)}
                        color="#555"
                      />
                    }
                  />
                  {!!getPasswordError() && (
                    <HelperText type="error" visible style={styles.helperText}>
                      {getPasswordError()}
                    </HelperText>
                  )}

                  {/* Password strength indicators */}
                  {touched.password && password.length > 0 && (
                    <View style={styles.rulesContainer}>
                      {[
                        {
                          label: "At least 8 characters",
                          valid: passwordRules.minLength,
                        },
                        {
                          label: "One uppercase letter (A-Z)",
                          valid: passwordRules.hasUppercase,
                        },
                        {
                          label: "One lowercase letter (a-z)",
                          valid: passwordRules.hasLowercase,
                        },
                        {
                          label: "One number (0-9)",
                          valid: passwordRules.hasNumber,
                        },
                        {
                          label: "One special character (!@#$...)",
                          valid: passwordRules.hasSpecial,
                        },
                      ].map((rule, i) => (
                        <View key={i} style={styles.ruleRow}>
                          <Text
                            style={[
                              styles.ruleDot,
                              { color: rule.valid ? "#4caf50" : "#f44336" },
                            ]}
                          >
                            {rule.valid ? "✓" : "✗"}
                          </Text>
                          <Text
                            style={[
                              styles.ruleText,
                              { color: rule.valid ? "#4caf50" : "#f44336" },
                            ]}
                          >
                            {rule.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Confirm Password */}
                  <TextInput
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, confirmPassword: true }))
                    }
                    style={styles.input}
                    outlineColor="#ffffff50"
                    activeOutlineColor="#0c499e"
                    textColor="#000000"
                    error={!!getConfirmPasswordError()}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? "eye-off" : "eye"}
                        onPress={() => setShowConfirmPassword((v) => !v)}
                        color="#555"
                      />
                    }
                  />
                  {!!getConfirmPasswordError() && (
                    <HelperText type="error" visible style={styles.helperText}>
                      {getConfirmPasswordError()}
                    </HelperText>
                  )}
                  {touched.confirmPassword && isConfirmMatch && (
                    <HelperText
                      type="info"
                      visible
                      style={[styles.helperText, { color: "#4caf50" }]}
                    >
                      ✓ Passwords match
                    </HelperText>
                  )}

                  {/* Submit */}
                  <Button
                    mode="contained"
                    buttonColor="#3d579a"
                    textColor="#ffffff"
                    style={{ width: "100%", paddingVertical: 8, marginTop: 10 }}
                    onPress={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={{ fontSize: 15 }}>
                        Create a unique passkey
                      </Text>
                    )}
                  </Button>

                  {/* OR Divider */}
                  <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}> OR </Text>
                    <View style={styles.line} />
                  </View>

                  {/* Continue with Google */}
                  <TouchableOpacity style={styles.socialBtn}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={require("@/assets/logos/google.png")}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                      />
                      <Text style={styles.socialBtnText}>
                        Continue with Google
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Continue with Apple */}
                  <TouchableOpacity
                    style={[
                      styles.socialBtn,
                      { marginTop: 20, marginBottom: 40 },
                    ]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={require("@/assets/logos/apple.png")}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                      />
                      <Text style={styles.socialBtnText}>
                        Continue with Apple
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    marginBottom: 4,
    backgroundColor: "#ffffff",
  },
  helperText: {
    marginBottom: 8,
    fontSize: 12,
  },
  rulesContainer: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  ruleDot: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 6,
    width: 16,
  },
  ruleText: {
    fontSize: 12,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ffffff76",
  },
  orText: {
    color: "#ffffffd0",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  socialBtn: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
  },
  socialBtnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat-Regular",
  },
});
