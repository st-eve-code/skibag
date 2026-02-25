import { Games } from "@/constant/games";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const wp = (percentage: number) => (SCREEN_WIDTH / 100) * percentage;
const hp = (percentage: number) => (SCREEN_HEIGHT / 100) * percentage;
const fontScale = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function GamesTab() {
  const router = useRouter();
  const categories = [
    "all",
    "casino",
    "action",
    "football",
    "board",
    "puzzles",
    "arcade",
    "fighting",
    "adventure",
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGame, setSelectedGame] = useState(Games[0]);

  const filteredGames =
    selectedCategory === "all"
      ? Games
      : Games.filter((game) =>
          game.category.toLowerCase().includes(selectedCategory.toLowerCase()),
        );

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
  };

  const navigateToGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
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
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          {/* Featured Banner - Shows selected game image at top */}
          <View style={styles.adBannerContainer}>
            <Image
              source={selectedGame.image}
              // resizeMode="cover"
              style={styles.adBanner}
              // imageStyle={styles.adBannerImage}
            />
              <LinearGradient
                colors={[
                  "rgba(116, 116, 116, 0)",
                  "rgba(44, 44, 44, 0.7)",
                  "rgba(15, 15, 15, 0.98)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.adGradient}
              >
                {/* Game Info */}
                <View style={styles.gameInfo}>
                  <Text style={styles.gameName}>{selectedGame.name}</Text>
                  <Text style={styles.gameCategory}>
                    {selectedGame.category}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons
                      name="star"
                      size={fontScale(16)}
                      color="#FFD700"
                    />
                    <Text style={styles.ratingText}>{selectedGame.rating}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.playButton}
                  // onPress={() => navigateToGame(selectedGame.id)} for now this link should take the user directly to the game
                >
                  <Ionicons
                    name="play"
                    size={fontScale(22)}
                    color="rgb(255, 255, 255)"
                  />
                  <Text style={styles.playText}>Play Now</Text>
                </TouchableOpacity>
              </LinearGradient>
            {/* </Image> */}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "all"
                ? "All Games"
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Games`}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredGames.length} games available
            </Text>
          </View>
          {/* Categories Horizontal Scroll - Under All Games */}
            {/* <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
            >
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryItem,
                    selectedCategory === item && styles.categoryItemActive,
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item && styles.categoryTextActive,
                    ]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView> */}
          {/* Main Content ScrollView */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Games Grid */}
            <View style={styles.gamesGrid}>
              {filteredGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gridGameCard}
                  onPress={() => handleGameClick(game)}
                >
                  <ImageBackground
                    source={game.image}
                    style={styles.gridGameImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <LinearGradient
                      colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
                      style={styles.gridGameGradient}
                    >
                      <Text style={styles.gridGameTitle} numberOfLines={1}>
                        {game.name}
                      </Text>
                      <Text style={styles.gridGameCategory} numberOfLines={1}>
                        {game.category}
                      </Text>
                    </LinearGradient>
                  </ImageBackground>

                  {/* Selected indicator */}
                  {selectedGame.id === game.id && (
                    <View style={styles.selectedOverlay}>
                      <View style={styles.selectedBorder} />
                      <View style={styles.selectedIndicator}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#3a6fe9"
                        />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom padding for tab bar */}
            <View style={{ height: hp(10) }} />
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
  safeArea: {
    flex: 1,
  },

  // Ad Banner Styles
  adBannerContainer: {
    height: hp(32),
    marginHorizontal: -wp(4),
    marginBottom: hp(2),
  },
  adBanner: {
    flex: 1,
    width: "100%",
  },
  adBannerImage: {
    borderBottomLeftRadius: wp(5),
    borderBottomRightRadius: wp(5),
  },
  adGradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "70%",
    justifyContent: "flex-end",
    padding: wp(4),
    borderBottomLeftRadius: wp(5),
    borderBottomRightRadius: wp(5),
  },
  gameInfo: {
    marginBottom: hp(2),
    marginLeft: wp(2.5)
  },
  gameName: {
    color: "white",
    fontSize: fontScale(28),
    fontWeight: "700",
    marginBottom: hp(0.5),
  },
  gameCategory: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: fontScale(14),
    fontWeight: "500",
    marginBottom: hp(0.5),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  ratingText: {
    color: "#FFD700",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    backgroundColor: "#3a7be4fe",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(8),
    marginLeft: wp(2),
    borderRadius: hp(4),
    alignSelf: "flex-start",
  },
  playIcon: {
    backgroundColor: "#3a6fe9c7",
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    textAlign: "center",
    textAlignVertical: "center",
  },
  playText: {
    color: "white",
    fontSize: fontScale(18),
    fontWeight: "600",
  },

  // Main Content Styles
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2.5),
    paddingBottom: hp(3),
  },
  sectionHeader: {
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    color: "white",
    fontWeight: "600",
    marginBottom: hp(0.5),
  },
  sectionSubtitle: {
    fontSize: fontScale(13),
    fontWeight: "500",
    color: "rgba(197, 197, 197, 0.63)",
  },

  // Categories Styles
  categoriesScroll: {
    maxHeight: hp(10),
    marginBottom: hp(3),
  },
  categoriesContent: {
    paddingHorizontal: wp(3),
    gap: wp(2.5),
    alignItems: "center",
  },
  categoryItem: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: "rgba(37, 37, 37, 0.8)",
    borderRadius: hp(2.5),
    justifyContent: "center",
    alignItems: "center",
    height: hp(4.5),
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryItemActive: {
    backgroundColor: "rgb(59, 132, 226)",
    borderColor: "rgb(59, 132, 226)",
  },
  categoryText: {
    color: "white",
    fontSize: fontScale(12),
    fontWeight: "500",
    textAlign: "center",
  },
  categoryTextActive: {
    fontWeight: "600",
  },

  // Games Grid Styles
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: wp(4),
  },
  gridGameCard: {
    width: "47%",
    height: hp(18),
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(3),
    overflow: "hidden",
    position: "relative",
  },
  gridGameImage: {
    flex: 1,
  },
  gridGameGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: wp(2.5),
  },
  gridGameTitle: {
    fontSize: fontScale(14),
    color: "white",
    fontWeight: "600",
    marginBottom: hp(0.2),
  },
  gridGameCategory: {
    fontSize: fontScale(11),
    color: "#a0a0a0",
  },
  // Selected overlay
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: wp(3),
    pointerEvents: "none",
  },
  selectedBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#3a6fe9",
    borderRadius: wp(3),
  },
  selectedIndicator: {
    position: "absolute",
    top: hp(0.8),
    right: wp(2),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 2,
  },
});
