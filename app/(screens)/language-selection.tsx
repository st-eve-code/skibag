import { useTranslation } from "@/lib/context/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ImageBackground, StatusBar, StyleSheet,
    Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const languages = [
  { id: "en", name: "English", native: "English", flag: "🇺🇸" },
  { id: "fr", name: "French", native: "Français", flag: "🇫🇷" },
];

export default function LanguageSelection() {
  const { t, setLanguage, language } = useTranslation();
  const [selected, setSelected] = useState(language || "en");

  const handleContinue = () => {
    setLanguage(selected);
    router.replace("/(onboardScreen)");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg3.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(5,5,20,0.92)", "rgba(0,0,0,0.98)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.content}>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.globeIcon}>
                <Ionicons name="globe-outline" size={fontScale(36)} color="#a78bfa" />
              </View>
              <Text style={styles.title}>{t("select_language")}</Text>
              <Text style={styles.subtitle}>Choose your preferred language to continue</Text>
            </View>

            {/* Language options */}
            <View style={styles.list}>
              {languages.map(lang => {
                const isSelected = selected === lang.id;
                return (
                  <TouchableOpacity
                    key={lang.id}
                    style={[styles.langItem, isSelected && styles.langItemActive]}
                    onPress={() => setSelected(lang.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.langLeft}>
                      <Text style={styles.flag}>{lang.flag}</Text>
                      <View>
                        <Text style={styles.langName}>{lang.name}</Text>
                        <Text style={styles.langNative}>{lang.native}</Text>
                      </View>
                    </View>
                    <View style={[styles.radio, isSelected && styles.radioActive]}>
                      {isSelected && <Ionicons name="checkmark" size={fontScale(16)} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Continue button */}
            <TouchableOpacity onPress={handleContinue} activeOpacity={0.85} style={styles.continueBtn}>
              <LinearGradient
                colors={["#7b4fe0", "#5929d4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueBtnGradient}
              >
                <Text style={styles.continueBtnText}>{t("continue")}</Text>
                <Ionicons name="arrow-forward" size={fontScale(18)} color="#fff" style={{ marginLeft: wp(2) }} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Skip */}
            <TouchableOpacity onPress={() => router.replace("/(onboardScreen)")} style={styles.skipBtn}>
              <Text style={styles.skipText}>{t("skip")}</Text>
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: wp(7),
  },

  header: { alignItems: "center", marginBottom: hp(5) },
  globeIcon: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: "rgba(167,139,250,0.12)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
  },
  title: {
    fontSize: fontScale(26),
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: hp(0.8),
  },
  subtitle: {
    fontSize: fontScale(13),
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },

  list: { gap: hp(1.8), marginBottom: hp(5) },

  langItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: wp(4),
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  langItemActive: {
    borderColor: "#7b4fe0",
    backgroundColor: "rgba(123,79,224,0.12)",
  },
  langLeft: { flexDirection: "row", alignItems: "center", gap: wp(4) },
  flag: { fontSize: fontScale(38) },
  langName: { fontSize: fontScale(17), fontWeight: "600", color: "#fff", fontFamily: "Poppins-Bold" },
  langNative: { fontSize: fontScale(12), color: "rgba(255,255,255,0.45)", marginTop: 2, fontFamily: "Montserrat-Regular" },

  radio: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: {
    backgroundColor: "#7b4fe0",
    borderColor: "#7b4fe0",
  },

  continueBtn: { borderRadius: 100, overflow: "hidden", marginBottom: hp(2) },
  continueBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.9),
  },
  continueBtnText: { fontSize: fontScale(16), fontWeight: "bold", color: "#fff", fontFamily: "Poppins-Bold" },

  skipBtn: { alignItems: "center", paddingVertical: hp(1) },
  skipText: { fontSize: fontScale(14), color: "rgba(255,255,255,0.4)", fontFamily: "Montserrat-Regular" },
});
