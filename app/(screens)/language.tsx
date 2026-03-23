import { useTranslation } from "@/lib/context/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const router = useRouter();
  const { t, setLanguage, language } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  // Set initial language from context
  useEffect(() => {
    setSelectedLanguage(language);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [language]);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleContinue = () => {
    // Save the selected language
    setLanguage(selectedLanguage);
    router.back();
  };

  // Get current language name from translation
  const getCurrentLanguageName = () => {
    const lang = languages.find((l) => l.code === selectedLanguage);
    return lang ? t(lang.name) : "English";
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={require("@/assets/images/bg3.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.loadingText}>Loading...</Text>
          </SafeAreaView>
        </View>
      </ImageBackground>
    );
  }

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
            <Text style={styles.headerTitle}>{t("select_language")}</Text>
            <View style={{ width: wp(10) }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Current Selection Display */}
            <View style={styles.currentSelection}>
              <Text style={styles.currentSelectionLabel}>
                {t("current_language")}
              </Text>
              <View style={styles.currentSelectionBox}>
                <Text style={styles.currentFlag}>
                  {languages.find((l) => l.code === selectedLanguage)?.flag}
                </Text>
                <Text style={styles.currentLanguageName}>
                  {getCurrentLanguageName()}
                </Text>
              </View>
            </View>

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
                      size={fontScale(24)}
                      color="#4fc3f7"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>{t("continue")}</Text>
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
  currentSelection: {
    marginBottom: hp(3),
  },
  currentSelectionLabel: {
    fontSize: fontScale(14),
    color: "#9e9e9e",
    marginBottom: hp(1),
  },
  currentSelectionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 132, 226, 0.2)",
    borderWidth: 1,
    borderColor: "#3b48b9",
    borderRadius: wp(3),
    padding: wp(3),
  },
  currentFlag: {
    fontSize: fontScale(24),
    marginRight: wp(2),
  },
  currentLanguageName: {
    fontSize: fontScale(16),
    color: "#ffffff",
    fontWeight: "600",
  },
  languageList: {
    gap: hp(1.5),
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(4),
    borderWidth: 2,
    borderColor: "transparent",
  },
  languageItemSelected: {
    borderColor: "rgba(79, 195, 247, 0.6)",
    backgroundColor: "rgba(79, 195, 247, 0.15)",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  flag: {
    fontSize: fontScale(28),
  },
  languageName: {
    fontSize: fontScale(16),
    color: "#ffffff",
    fontWeight: "500",
  },
  continueButton: {
    backgroundColor: "rgba(59, 132, 226, 0.8)",
    paddingVertical: hp(1.8),
    borderRadius: wp(3),
    alignItems: "center",
    marginTop: hp(4),
  },
  continueButtonText: {
    fontSize: fontScale(16),
    color: "#ffffff",
    fontWeight: "600",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: fontScale(18),
    textAlign: "center",
    marginTop: hp(40),
  },
});
