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

export default function PrivacyPolicy() {
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
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <View style={{ width: wp(10) }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.policyCard}>
              <Text style={styles.policyTitle}>Privacy Policy</Text>
              <Text style={styles.policyDate}>Last updated: January 2024</Text>

              <View style={styles.policyContent}>
                <Text style={styles.policySectionTitle}>
                  1. Information We Collect
                </Text>
                <Text style={styles.policyText}>
                  We collect information you provide directly to us, including
                  when you create an account, participate in tournaments, or
                  contact us. This may include your name, email address, gaming
                  statistics, and device information.
                </Text>

                <Text style={styles.policySectionTitle}>
                  2. How We Use Your Information
                </Text>
                <Text style={styles.policyText}>
                  We use the information we collect to provide, maintain, and
                  improve our services, to communicate with you about
                  tournaments and events, and to comply with legal obligations.
                </Text>

                <Text style={styles.policySectionTitle}>
                  3. Information Sharing
                </Text>
                <Text style={styles.policyText}>
                  We may share your information with tournament organizers,
                  other players (in leaderboards), and service providers who
                  assist us in operating our platform. We do not sell your
                  personal information.
                </Text>

                <Text style={styles.policySectionTitle}>4. Data Security</Text>
                <Text style={styles.policyText}>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </Text>

                <Text style={styles.policySectionTitle}>5. Your Rights</Text>
                <Text style={styles.policyText}>
                  You have the right to access, update, or delete your personal
                  information at any time. You may also opt-out of certain data
                  collection practices, though this may affect your experience.
                </Text>

                <Text style={styles.policySectionTitle}>6. Contact Us</Text>
                <Text style={styles.policyText}>
                  If you have any questions about this Privacy Policy, please
                  contact us through our support channels.
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
                I agree to the Privacy Policy
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
