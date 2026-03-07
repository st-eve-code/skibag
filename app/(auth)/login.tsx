import { signInWithApple, signInWithGoogle } from "@/lib/authService";
import { signInWithUsername } from "@/lib/supabaseAuthService";
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
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
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
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in with Apple");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert("Validation", "Please enter your username.");
      return;
    }
    if (!password) {
      Alert.alert("Validation", "Please enter your password.");
      return;
    }
    try {
      setLoginLoading(true);
      await signInWithUsername(username.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "Invalid username or password.",
      );
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
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />

                  {/* Password Label */}
                  <Text style={[styles.label, { marginTop: 20 }]}>
                    Password
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
                      placeholder="Enter your password"
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
                        {showPassword ? "Hide" : "Show"}
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
                      <Text style={styles.loginButtonText}>Login</Text>
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
                        Continue with Google
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
                          Continue with Apple
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Sign up link */}
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>
                      Don&apos;t have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/signup")}>
                      <Text style={styles.signupLink}>Sign up</Text>
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
