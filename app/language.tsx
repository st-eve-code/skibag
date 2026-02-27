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

const languages = [
  { id: 1, name: "English", code: "en", flag: "🇺🇸" },
  { id: 2, name: "Spanish", code: "es", flag: "🇪🇸" },
  { id: 3, name: "French", code: "fr", flag: "🇫🇷" },
  { id: 4, name: "German", code: "de", flag: "🇩🇪" },
  { id: 5, name: "Italian", code: "it", flag: "🇮🇹" },
  { id: 6, name: "Portuguese", code: "pt", flag: "🇵🇹" },
  { id: 7, name: "Russian", code: "ru", flag: "🇷🇺" },
  { id: 8, name: "Japanese", code: "ja", flag: "🇯🇵" },
  { id: 9, name: "Korean", code: "ko", flag: "🇰🇷" },
  { id: 10, name: "Chinese", code: "zh", flag: "🇨🇳" },
  { id: 11, name: "Hindi", code: "hi", flag: "🇮🇳" },
  { id: 12, name: "Arabic", code: "ar", flag: "🇸🇦" },
];

export default function LanguageSelection() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleContinue = () => {
    router.back();
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
            <Text style={styles.headerTitle}>Select Language</Text>
            <View style={{ width: wp(10) }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.languageList}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.languageItem,
                    selectedLanguage === language.code &&
                      styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <View style={styles.languageLeft}>
                    <Text style={styles.flag}>{language.flag}</Text>
                    <Text style={styles.languageName}>{language.name}</Text>
                  </View>
                  {selectedLanguage === language.code && (
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
});
