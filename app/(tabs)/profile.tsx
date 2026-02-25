import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const referralCode = "GAME2024XYZ";

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("Copied!", "Referral code copied to clipboard");
  };

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

      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <View
            style={{
              alignItems: "flex-start",
              marginVertical: 10,
              alignSelf: "center",
            }}
          >
            <Text style={styles.text}>Profile</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* GENERAL SECTION */}
            <Text style={styles.sectionLabel}>General</Text>

            <View style={styles.card}>
              {/* Email Address */}
              <View style={styles.emailContainer}>
                <Text style={styles.emailLabel}>Email address:</Text>
                <Text style={styles.emailValue}>johndoe@gmail.com</Text>
              </View>

              {/* Language */}
              <View style={styles.buttonSpacing}>
                <Pressable style={styles.actionButton}>
                  <View style={styles.buttonContent}>
                    <Ionicons name="globe" size={24} color={"#ffffff"} />
                    <Text style={styles.buttonText}>Select Language</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={26}
                    color={"rgb(216, 216, 216)"}
                  />
                </Pressable>
              </View>

              {/* Privacy Policy */}
              <View style={styles.buttonSpacing}>
                <Pressable style={styles.actionButton}>
                  <View style={styles.buttonContent}>
                    <Ionicons name="key" size={24} color={"#ffffff"} />
                    <Text style={styles.buttonText}>Privacy Policy</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={26}
                    color={"rgb(216, 216, 216)"}
                  />
                </Pressable>
              </View>

              {/* Terms of Use */}
              <View style={styles.buttonSpacing}>
                <Pressable style={styles.actionButton}>
                  <View style={styles.buttonContent}>
                    <Ionicons name="flag" size={20} color={"#ffffff"} />
                    <Text style={styles.buttonText}>Terms of use</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={26}
                    color={"rgb(216, 216, 216)"}
                  />
                </Pressable>
              </View>

              {/* Referral Code Section */}
              <View style={styles.referralSection}>
                <Text style={styles.referralTitle}>Your Referral Code</Text>
                <View style={styles.referralCodeContainer}>
                  <View style={styles.codeBox}>
                    <Ionicons
                      name="gift"
                      size={20}
                      color={"#f59e0b"}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.codeText}>{referralCode}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={copyToClipboard}
                    style={styles.copyButton}
                  >
                    <Ionicons name="copy-outline" size={20} color={"#ffffff"} />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.referralSubtext}>
                  Share with friends to earn rewards
                </Text>
              </View>

              {/* Rating Section */}
              <View style={styles.ratingSection}>
                <Text style={styles.ratingTitle}>Rate Us</Text>
                <View style={styles.starsRow}>
                  <Ionicons name="star" size={24} color={"#f3893d"} />
                  <Ionicons name="star" size={24} color={"#f3893d"} />
                  <Ionicons name="star" size={24} color={"#f3893d"} />
                  <Ionicons name="star" size={24} color={"#e1e1e1ee"} />
                  <Ionicons name="star" size={24} color={"#e1e1e1ee"} />
                </View>

                {/* Feedback */}
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackTitle}>Feedback</Text>
                  <TextInput
                    placeholder="Enter your feedback"
                    placeholderTextColor={"rgb(169, 169, 167)"}
                    style={styles.feedbackInput}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                  />
                  <Button mode="outlined" style={styles.feedbackButton}>
                    <Text style={{ color: "white" }}>Send Feedback</Text>
                  </Button>
                </View>
              </View>
            </View>

            {/* ACCOUNT SECTION */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
              Account
            </Text>

            <View style={styles.accountCard}>
              {/* Delete Account */}
              <Pressable style={styles.deleteButton}>
                <View style={styles.buttonContent}>
                  <Ionicons name="trash" size={32} color={"#ffffff"} />
                  <Text style={styles.deleteButtonText}>Delete Account</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={26}
                  color={"rgb(216, 216, 216)"}
                />
              </Pressable>

              {/* Logout */}
              <Pressable style={styles.logoutButton}>
                <View style={styles.buttonContent}>
                  <Ionicons name="log-out" size={32} color={"#5a5a5a"} />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={26}
                  color={"rgb(26, 26, 26)"}
                />
              </Pressable>
            </View>

            <View style={{ height: 80 }} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(12, 12, 12, 0.75)",
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 15,
    alignItems: "flex-start",
    paddingBottom: 40,
  },

  // Section Labels
  sectionLabel: {
    color: "#b0b0b0e4",
    fontSize: 16,
    marginBottom: 4,
  },

  // Main Card
  card: {
    backgroundColor: "rgba(18, 18, 18, 0.05)",
    width: "100%",
    marginTop: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 12,
    borderRightColor: "rgba(23, 23, 23, 0.24)",
  },

  // Email Container
  emailContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 4,
  },
  emailLabel: {
    fontSize: 16,
    color: "#757575",
    fontWeight: "500",
  },
  emailValue: {
    fontSize: 14,
    color: "rgba(180, 180, 180, 0.87)",
    fontWeight: "400",
  },

  // Action Buttons
  buttonSpacing: {
    marginTop: 12,
  },
  actionButton: {
    width: "100%",
    backgroundColor: "#3b48b9",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#ffffff",
  },

  // Referral Code Section
  referralSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#757575",
    marginBottom: 12,
  },
  referralCodeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  codeBox: {
    flex: 1,
    backgroundColor: "rgba(59, 72, 185, 0.2)",
    borderWidth: 1,
    borderColor: "#3b48b9",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  codeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: "#3b48b9",
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  copyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  referralSubtext: {
    fontSize: 12,
    color: "rgba(180, 180, 180, 0.7)",
    marginTop: 8,
  },

  // Rating Section
  ratingSection: {
    marginTop: 14,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#707070",
  },
  starsRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },

  // Feedback
  feedbackContainer: {
    marginTop: 15,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#707070",
    marginBottom: 10,
  },
  feedbackInput: {
    borderRadius: 10,
    marginBottom: 12,
  },
  feedbackButton: {
    marginTop: 4,
  },

  // Account Card
  accountCard: {
    backgroundColor: "rgba(59, 59, 58, 0.17)",
    width: "100%",
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 20,
  },

  // Delete Button
  deleteButton: {
    width: "100%",
    backgroundColor: "#aa2323",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgb(255, 62, 62)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Logout Button
  logoutButton: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgba(255, 255, 255, 0.04)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1b1b1b",
  },
});
