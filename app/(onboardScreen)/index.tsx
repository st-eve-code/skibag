import Slides from "@/constant/onboardSlides";
import { useTranslation } from "@/lib/I18nContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const { width } = Dimensions.get("window");

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleGetStarted = () => {
    router.push("/(auth)/signup");
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderSlide = ({
    item,
    index,
  }: {
    item: (typeof Slides)[0];
    index: number;
  }) => (
    <ImageBackground
      source={item.backgroundImage}
      style={{
        width: width,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={item.gradient as string[]}
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
          <View style={{ flex: 1 }} />
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingBottom: 130,
              paddingHorizontal: 20,
            }}
          >
            {/* Title with button on last slide */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 32,
                  fontWeight: "bold",
                  fontFamily: "Poppins-Bold",
                  flex: 1,
                }}
              >
                {t(item.titleKey)}
              </Text>

              {/* Arrow button - only on last slide */}
              {index === Slides.length - 1 && (
                <TouchableOpacity
                  style={{
                    overflow: "hidden",
                    borderRadius: 50,
                    marginLeft: 16,
                  }}
                  onPress={handleGetStarted}
                >
                  <BlurView
                    intensity={50}
                    tint="dark"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <Ionicons name="arrow-forward" size={25} color="white" />
                  </BlurView>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{
                color: "white",
                fontSize: 18,
                marginTop: 9,
                fontFamily: "Montserrat-Regular",
              }}
            >
              {t(item.descriptionKey)}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Skip button - only show if not on last slide */}
      {currentIndex < Slides.length - 1 && (
        <SafeAreaView
          style={{
            position: "absolute",
            top: 0,
            right: 20,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleGetStarted}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontFamily: "Montserrat-Regular",
                opacity: 0.8,
              }}
            >
              {t("skip")}
            </Text>
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
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Three dots indicator */}
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: 30,
        }}
      >
        {Slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={{
                width: dotWidth,
                height: 10,
                borderRadius: 5,
                backgroundColor: "white",
                marginHorizontal: 5,
                opacity,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
