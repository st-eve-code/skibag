import Slides from "@/constant/onboardSlides";
import { useTranslation } from "@/lib/context/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated, Dimensions, FlatList, ImageBackground,
    StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const isLast = currentIndex === Slides.length - 1;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (isLast) {
      router.push("/(auth)/signup");
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleSkip = () => router.push("/(auth)/signup");

  const renderSlide = ({ item, index }: { item: typeof Slides[0]; index: number }) => (
    <ImageBackground
      source={item.backgroundImage}
      style={{ width, height: "100%" }}
      resizeMode="cover"
    >
      {/* Gradient only covers the bottom ~45% so the image stays visible */}
      <LinearGradient
        colors={["transparent", "transparent", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.92)", "#000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.45, 0.65, 0.82, 1]}
        style={styles.slideGradient}
      >
        <View style={styles.slideContent}>
          {/* Slide counter */}
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{index + 1} / {Slides.length}</Text>
          </View>

          <Text style={styles.slideTitle}>{t(item.titleKey)}</Text>
          <Text style={styles.slideDesc}>{t(item.descriptionKey)}</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Skip button */}
      {!isLast && (
        <SafeAreaView style={styles.skipWrapper}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="chevron-forward" size={fontScale(14)} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      <FlatList
        ref={flatListRef}
        data={Slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {Slides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: "clamp" });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: "clamp" });
            return (
              <Animated.View
                key={index}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: index === currentIndex ? "#a78bfa" : "#fff" }]}
              />
            );
          })}
        </View>

        {/* CTA Button */}
        {isLast ? (
          <TouchableOpacity onPress={handleNext} style={styles.getStartedBtn} activeOpacity={0.85}>
            <LinearGradient colors={["#7b4fe0", "#5929d4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.getStartedGradient}>
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={fontScale(18)} color="#fff" style={{ marginLeft: wp(2) }} />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.85}>
            <View style={styles.nextBtnInner}>
              <Ionicons name="arrow-forward" size={fontScale(22)} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  skipWrapper: { position: "absolute", top: 0, right: wp(4), zIndex: 10 },
  skipBtn: { flexDirection: "row", alignItems: "center", paddingVertical: hp(1), paddingHorizontal: wp(2), gap: wp(1) },
  skipText: { color: "rgba(255,255,255,0.7)", fontSize: fontScale(14), fontFamily: "Montserrat-Regular" },

  slideGradient: { flex: 1, justifyContent: "flex-end" },
  slideContent: { paddingHorizontal: wp(6), paddingBottom: hp(18) },

  counterBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  counterText: { color: "rgba(255,255,255,0.7)", fontSize: fontScale(12), fontFamily: "Montserrat-Regular" },

  slideTitle: {
    color: "#fff",
    fontSize: fontScale(30),
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    lineHeight: fontScale(38),
    marginBottom: hp(1.2),
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  slideDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: fontScale(14),
    fontFamily: "Montserrat-Regular",
    lineHeight: fontScale(22),
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  bottomBar: {
    position: "absolute",
    bottom: hp(5),
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(6),
  },

  dotsRow: { flexDirection: "row", alignItems: "center", gap: wp(1.5) },
  dot: { height: 8, borderRadius: 4 },

  nextBtn: {},
  nextBtnInner: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: "rgba(89,41,212,0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.4)",
  },

  getStartedBtn: { borderRadius: 100, overflow: "hidden" },
  getStartedGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(6),
  },
  getStartedText: { color: "#fff", fontSize: fontScale(16), fontWeight: "bold", fontFamily: "Poppins-Bold" },
});
