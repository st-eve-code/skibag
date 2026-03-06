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
  const [referralCode, setReferralCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(referralCode || undefined);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithApple(referralCode || undefined);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in with Apple");
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeySignIn = async () => {
    if (!username.trim()) {
      Alert.alert("Validation", "Please enter your username.");
      return;
    }
    if (!password) {
      Alert.alert("Validation", "Please enter your password.");
      return;
    }
    try {
      setPasskeyLoading(true);
      await signInWithUsername(username.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Sign In Failed",
        error.message || "Invalid username or password.",
      );
    } finally {
      setPasskeyLoading(false);
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
                    paddingBottom: 60,
                    paddingHorizontal: 20,
                  }}
                >
                  {/* Referral Code Input */}
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        color: "#b6b6b6d0",
                        fontSize: 14,
                        marginBottom: 8,
                        fontFamily: "Montserrat-Regular",
                      }}
                    >
                      Have a referral code? (Optional)
                    </Text>
                    <TextInput
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        padding: 15,
                        borderRadius: 12,
                        fontSize: 14,
                        fontFamily: "Montserrat-Regular",
                        color: "#000",
                      }}
                      placeholder="Enter referral code"
                      placeholderTextColor="#999"
                      value={referralCode}
                      onChangeText={setReferralCode}
                      autoCapitalize="characters"
                      maxLength={8}
                    />
                  </View>

                  {/* signup with google */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: 15,
                      borderRadius: 100,
                      width: "100%",
                      alignItems: "center",
                      opacity: loading ? 0.6 : 1,
                    }}
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
                          style={{ width: 30, height: 30, marginRight: 10 }}
                        />
                      )}
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          fontWeight: "bold",
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        Continue with Google
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* signup with apple */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: 15,
                      borderRadius: 100,
                      width: "100%",
                      alignItems: "center",
                      marginTop: 10,
                      opacity: loading ? 0.6 : 1,
                    }}
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
                          style={{ width: 30, height: 30, marginRight: 10 }}
                        />
                      )}
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          fontWeight: "bold",
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        Continue with Apple
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* OR Divider */}
                  <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}> OR </Text>
                    <View style={styles.line} />
                  </View>

                  {/* Username input */}
                  <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />

                  {/* Password input */}
                  <View
                    style={{
                      position: "relative",
                      width: "100%",
                      marginTop: 10,
                    }}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder="Password"
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

                  {/* Sign in with passkey (username + password) */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#5929d4",
                      padding: 15,
                      borderRadius: 100,
                      width: "100%",
                      alignItems: "center",
                      marginTop: 14,
                      opacity: passkeyLoading ? 0.6 : 1,
                    }}
                    onPress={handlePasskeySignIn}
                    disabled={passkeyLoading}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {passkeyLoading ? (
                        <ActivityIndicator
                          size="small"
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                      ) : null}
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "bold",
                          fontFamily: "Poppins-Bold",
                        }}
                      >
                        Sign in with passkey
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* already have an account */}
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
                      Already have an account ?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/signup")}>
                      <Text
                        style={{
                          color: "#454ef3",
                          fontSize: 14,
                          fontWeight: "bold",
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        Sign up
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
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#000",
    width: "100%",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#5a5a8076",
  },
  orCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  orText: {
    color: "#b6b6b6d0",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
