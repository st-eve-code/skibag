import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfUse() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    setAgreed(!agreed);
  };

  const handleContinue = () => {
    if (agreed) {
      router.back();
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg3.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={["top"]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={fontScale(24)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Terms of Use</Text>
            <View style={{ width: wp(10) }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.policyCard}>
              <Text style={styles.policyTitle}>Terms of Use</Text>
              <Text style={styles.policyDate}>Last updated: January 2024</Text>

              <View style={styles.policyContent}>
                <Text style={styles.policySectionTitle}>
                  1. Acceptance of Terms
                </Text>
                <Text style={styles.policyText}>
                  By accessing and using our platform, you accept and agree to
                  be bound by the terms and provision of this agreement.
                </Text>

                <Text style={styles.policySectionTitle}>
                  2. User Eligibility
                </Text>
                <Text style={styles.policyText}>
                  You must be at least 13 years of age to use our services. By
                  using our platform, you represent and warrant that you meet
                  this requirement.
                </Text>

                <Text style={styles.policySectionTitle}>
                  3. Account Responsibilities
                </Text>
                <Text style={styles.policyText}>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. You agree to notify us immediately of any
                  unauthorized use.
                </Text>

                <Text style={styles.policySectionTitle}>
                  4. Tournament Rules
                </Text>
                <Text style={styles.policyText}>
                  All tournament participants must adhere to fair play
                  principles. Cheating, hacking, or any form of unfair advantage
                  will result in immediate disqualification and account
                  termination.
                </Text>

                <Text style={styles.policySectionTitle}>
                  5. Prohibited Conduct
                </Text>
                <Text style={styles.policyText}>
                  You agree not to: (a) violate any applicable laws or
                  regulations; (b) infringe upon the rights of others; (c)
                  upload or transmit viruses or malicious code; (d) engage in
                  harassment, abuse, or harmful behavior.
                </Text>

                <Text style={styles.policySectionTitle}>
                  6. Intellectual Property
                </Text>
                <Text style={styles.policyText}>
                  All content, trademarks, and intellectual property on our
                  platform are owned by us or our licensors. You may not copy,
                  reproduce, or distribute any content without our prior written
                  consent.
                </Text>

                <Text style={styles.policySectionTitle}>
                  7. Limitation of Liability
                </Text>
                <Text style={styles.policyText}>
                  We shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  or inability to use our services.
                </Text>

                <Text style={styles.policySectionTitle}>
                  8. Changes to Terms
                </Text>
                <Text style={styles.policyText}>
                  We reserve the right to modify these terms at any time. Your
                  continued use of the platform after changes are posted
                  constitutes acceptance of the modified terms.
                </Text>
              </View>
            </View>

            {/* Agreement Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleAgree}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && (
                  <Ionicons
                    name="checkmark"
                    size={fontScale(16)}
                    color="#ffffff"
                  />
                )}
              </View>
              <Text style={styles.checkboxText}>
                I agree to the Terms of Use
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !agreed && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!agreed}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(2.5),
  },
  backButton: {
    backgroundColor: "rgba(78, 78, 78, 0.4)",
    padding: wp(2.5),
    borderRadius: wp(3),
  },
  headerTitle: {
    fontSize: fontScale(20),
    color: "#ffffff",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: wp(4.5),
    paddingBottom: hp(4),
  },
  policyCard: {
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(4),
  },
  policyTitle: {
    fontSize: fontScale(22),
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: hp(0.5),
  },
  policyDate: {
    fontSize: fontScale(12),
    color: "#a0a0a0",
    marginBottom: hp(2),
  },
  policyContent: {
    gap: hp(1.5),
  },
  policySectionTitle: {
    fontSize: fontScale(16),
    color: "#4fc3f7",
    fontWeight: "600",
    marginTop: hp(1),
  },
  policyText: {
    fontSize: fontScale(14),
    color: "#e0e0e0",
    lineHeight: fontScale(20),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    marginTop: hp(3),
  },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(1.5),
    borderWidth: 2,
    borderColor: "#a0a0a0",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4fc3f7",
    borderColor: "#4fc3f7",
  },
  checkboxText: {
    fontSize: fontScale(14),
    color: "#ffffff",
    flex: 1,
  },
  continueButton: {
    backgroundColor: "rgba(59, 132, 226, 0.8)",
    paddingVertical: hp(1.8),
    borderRadius: wp(3),
    alignItems: "center",
    marginTop: hp(3),
  },
  continueButtonDisabled: {
    backgroundColor: "rgba(78, 78, 78, 0.4)",
  },
  continueButtonText: {
    fontSize: fontScale(16),
    color: "#ffffff",
    fontWeight: "600",
  },
});
