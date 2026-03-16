import { useTranslation } from "@/lib/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

// Supported languages
const languages = [
  { id: 1, name: "english", code: "en", flag: "🇺🇸" },
  { id: 2, name: "french", code: "fr", flag: "🇫🇷" },
];

export default function LanguageSelection() {
  const { t, setLanguage, language } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(language || "en");

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleContinue = () => {
    // Save the selected language
    setLanguage(selectedLanguage);
    // Navigate to onboarding
    router.replace("/(onboardScreen)");
  };

  // Get current language name from translation
  const getCurrentLanguageName = (code: string) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? t(lang.name) : "English";
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{t("select_language")}</Text>
              <Text style={styles.subtitle}>
                Choose your preferred language
              </Text>
            </View>

            {/* Language List */}
            <View style={styles.languageList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.languageItem,
                    selectedLanguage === lang.code &&
                      styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <View style={styles.languageLeft}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                    <Text style={styles.languageName}>{t(lang.name)}</Text>
                  </View>
                  {selectedLanguage === lang.code && (
                    <Ionicons
                      name="checkmark-circle"
                      size={fontScale(28)}
                      color="#4fc3f7"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>{t("continue")}</Text>
            </TouchableOpacity>

            {/* Skip Option */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.replace("/(onboardScreen)")}
            >
              <Text style={styles.skipButtonText}>{t("skip")}</Text>
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
    backgroundColor: "rgba(12, 12, 12, 0.85)",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(6),
    paddingTop: hp(10),
    paddingBottom: hp(4),
  },
  header: {
    alignItems: "center",
    marginBottom: hp(6),
  },
  title: {
    fontSize: fontScale(28),
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: hp(1),
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontScale(14),
    color: "#9e9e9e",
    textAlign: "center",
  },
  languageList: {
    gap: hp(2),
    marginBottom: hp(6),
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(5),
    borderWidth: 2,
    borderColor: "transparent",
  },
  languageItemSelected: {
    borderColor: "rgba(79, 195, 247, 0.8)",
    backgroundColor: "rgba(79, 195, 247, 0.15)",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
  },
  flag: {
    fontSize: fontScale(36),
  },
  languageName: {
    fontSize: fontScale(18),
    color: "#ffffff",
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#3b84c9",
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: "center",
    marginBottom: hp(2),
  },
  continueButtonText: {
    fontSize: fontScale(16),
    color: "#ffffff",
    fontWeight: "600",
  },
  skipButton: {
    paddingVertical: hp(1.5),
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: fontScale(14),
    color: "#9e9e9e",
    fontWeight: "500",
  },
});
