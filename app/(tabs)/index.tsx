import { Games } from "@/constant/games";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const wp = (percentage: number) => (SCREEN_WIDTH / 100) * percentage;
const hp = (percentage: number) => (SCREEN_HEIGHT / 100) * percentage;
const fontScale = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function Index() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const filteredGames =
    selectedCategory === "all"
      ? Games
      : Games.filter((game) =>
          game.category.toLowerCase().includes(selectedCategory.toLowerCase()),
        );

  const bonusGames = Games;

  const banners = [
    {
      id: "banner1",
      image: require("@/assets/images/bg1.jpg"),
      title: "Special Offer",
      subtitle: "Get 100% bonus on first deposit",
    },
    {
      id: "banner2",
      image: require("@/assets/images/bg2.jpg"),
      title: "Weekend Special",
      subtitle: "Double your rewards this weekend",
    },
    {
      id: "banner3",
      image: require("@/assets/images/bg4.jpg"),
      title: "New Games",
      subtitle: "Try our latest additions",
    },
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const navigateToGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  const navigateToAllGames = () => {
    router.push("/all-games");
  };

  const bannerAspectRatio = 16 / 9;
  const cardAspectRatio = 3 / 4;

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
        <View style={styles.container}>
          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.balanceContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>J</Text>
                </View>
                <Ionicons name="flash" size={fontScale(16)} color="#ffffff" />
                <Text style={styles.balanceText}>5000</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push("/notifications")}>
                  <Ionicons
                    name="notifications"
                    size={fontScale(26)}
                    color="#fff"
                  />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>1</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                  <Ionicons
                    name="menu"
                    size={fontScale(26)}
                    color="#ffffffda"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Quick Info Section */}
              <View style={styles.quickInfoSection}>
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>Hello,</Text>
                  <Text style={styles.userName}>John Doe</Text>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.statBox}>
                    <Ionicons
                      name="trophy"
                      size={fontScale(16)}
                      color="#FFD700"
                    />
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Wins</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Ionicons
                      name="flame"
                      size={fontScale(16)}
                      color="#ff6b6b"
                    />
                    <Text style={styles.statValue}>7</Text>
                    <Text style={styles.statLabel}>Days</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Ionicons
                      name="star"
                      size={fontScale(16)}
                      color="#3a7be4"
                    />
                    <Text style={styles.statValue}>450</Text>
                    <Text style={styles.statLabel}>Points</Text>
                  </View>
                </View>
              </View>

              {/* Spacing */}
              <View style={styles.spacer} />

              {/* Free Spin Card */}
              <TouchableOpacity style={styles.freeSpinCard} activeOpacity={0.9}>
                <View style={styles.freeSpinContent}>
                  <View style={styles.freeSpinIconContainer}>
                    <Ionicons
                      name="refresh-circle"
                      size={fontScale(36)}
                      color="#FFD700"
                    />
                  </View>
                  <View style={styles.freeSpinTextContainer}>
                    <Text style={styles.freeSpinTitle}>
                      Free Spin Available!
                    </Text>
                    <Text style={styles.freeSpinSubtitle}>
                      Tap to claim your daily spin
                    </Text>
                  </View>
                  <View style={styles.freeSpinButton}>
                    <Ionicons
                      name="arrow-forward"
                      size={fontScale(18)}
                      color="#fff"
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Spacing */}
              <View style={styles.spacer} />

              {/* Banner Section */}
              <View style={styles.bannerContainer}>
                <ImageBackground
                  source={banners[currentBanner].image}
                  resizeMode="cover"
                  borderRadius={wp(3)}
                  style={[
                    styles.bannerImage,
                    { aspectRatio: bannerAspectRatio },
                  ]}
                >
                  <View style={styles.bannerBadge}>
                    <Ionicons
                      name="flame"
                      size={fontScale(12)}
                      color="rgb(236, 87, 32)"
                    />
                    <Text style={styles.bannerBadgeText}>PROMO</Text>
                  </View>

                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0)", "rgba(0, 0, 0, 0.85)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.bannerGradient}
                  >
                    <Text style={styles.bannerTitle}>
                      {banners[currentBanner].title}
                    </Text>
                    <Text style={styles.bannerSubtitle}>
                      {banners[currentBanner].subtitle}
                    </Text>
                    <View style={styles.bannerDots}>
                      {banners.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.bannerDot,
                            currentBanner === index && styles.bannerDotActive,
                          ]}
                        />
                      ))}
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>

              {/* Spacing */}
              <View style={styles.spacer} />

              {/* Bonus Games Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Bonus Games</Text>
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={navigateToAllGames}
                  >
                    <Text style={styles.viewAllText}>View all</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={fontScale(12)}
                      color="#eaeaea"
                    />
                  </TouchableOpacity>
                </View>

                {/* Horizontal Scroll */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalGamesList}
                >
                  {/* Featured Bonus Card - Larger */}
                  {bonusGames.length > 0 && (
                    <TouchableOpacity
                      style={styles.featuredBonusCard}
                      onPress={() => navigateToGame(bonusGames[0].id)}
                    >
                      <ImageBackground
                        source={bonusGames[0].image}
                        resizeMode="cover"
                        style={[
                          styles.featuredBonusImage,
                          { aspectRatio: cardAspectRatio },
                        ]}
                        imageStyle={{ borderRadius: wp(3) }}
                      >
                        <View style={styles.bonusBadge}>
                          <Ionicons
                            name="gift"
                            size={fontScale(10)}
                            color="#FFD700"
                          />
                          <Text style={styles.bonusBadgeText}>Bonus</Text>
                        </View>
                        <LinearGradient
                          colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.9)"]}
                          style={styles.cardGradient}
                        >
                          <Text style={styles.featuredBonusTitle}>
                            {bonusGames[0].name}
                          </Text>
                          <View style={styles.ratingContainer}>
                            <Ionicons
                              name="star"
                              size={fontScale(12)}
                              color="#FFD700"
                            />
                            <Text style={styles.ratingText}>
                              {bonusGames[0].rating}
                            </Text>
                          </View>
                        </LinearGradient>
                      </ImageBackground>
                    </TouchableOpacity>
                  )}

                  {/* Other Bonus Cards */}
                  {bonusGames.slice(1, 7).map((game) => (
                    <TouchableOpacity
                      key={game.id}
                      style={styles.smallGameCard}
                      onPress={() => navigateToGame(game.id)}
                    >
                      <ImageBackground
                        source={game.image}
                        resizeMode="cover"
                        style={[
                          styles.smallGameImage,
                          { aspectRatio: cardAspectRatio },
                        ]}
                        imageStyle={{ borderRadius: wp(3) }}
                      >
                        <LinearGradient
                          colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
                          style={styles.cardGradient}
                        >
                          <Text style={styles.smallGameTitle} numberOfLines={1}>
                            {game.name}
                          </Text>
                          <View style={styles.ratingContainer}>
                            <Ionicons
                              name="star"
                              size={fontScale(10)}
                              color="#FFD700"
                            />
                            <Text style={styles.ratingTextSmall}>
                              {game.rating}
                            </Text>
                          </View>
                        </LinearGradient>
                      </ImageBackground>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Spacing */}
              <View style={styles.spacer} />

              {/* All Games Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === "all"
                    ? "All Games"
                    : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Games`}
                </Text>

                {/* Categories */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
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
                          selectedCategory === item &&
                            styles.categoryTextActive,
                        ]}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Games Grid */}
                <View style={styles.gamesGrid}>
                  {filteredGames.map((game) => (
                    <TouchableOpacity
                      key={game.id}
                      style={styles.gridGameCard}
                      onPress={() => navigateToGame(game.id)}
                    >
                      <ImageBackground
                        source={game.image}
                        resizeMode="cover"
                        style={[
                          styles.gridGameImage,
                          { aspectRatio: cardAspectRatio },
                        ]}
                        imageStyle={{ borderRadius: wp(3) }}
                      >
                        <LinearGradient
                          colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.85)"]}
                          style={styles.cardGradient}
                        >
                          <Text style={styles.gridGameTitle} numberOfLines={1}>
                            {game.name}
                          </Text>
                          <Text
                            style={styles.gridGameCategory}
                            numberOfLines={1}
                          >
                            {game.category}
                          </Text>
                        </LinearGradient>
                      </ImageBackground>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bottom Padding */}
              <View style={styles.bottomPadding} />
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(12, 12, 12, 0.8)" },
  container: { flex: 1 },
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  balanceContainer: {
    backgroundColor: "#3a7be4fe",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    height: hp(4.5),
    paddingHorizontal: wp(2),
    borderRadius: hp(2.5),
  },
  avatar: {
    height: hp(3.5),
    width: hp(3.5),
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#353636", fontSize: fontScale(18), fontWeight: "bold" },
  balanceText: { color: "white", fontSize: fontScale(15), fontWeight: "600" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: wp(3) },
  notificationBadge: {
    position: "absolute",
    top: -hp(0.5),
    right: -wp(1.5),
    backgroundColor: "rgba(237, 81, 81, 0.96)",
    height: hp(1.8),
    width: hp(1.8),
    borderRadius: hp(0.9),
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: fontScale(9),
    fontWeight: "bold",
  },
  menuButton: {
    backgroundColor: "rgb(59, 132, 226)",
    padding: wp(2),
    borderRadius: wp(2),
  },

  // Scroll Content
  scrollContent: { paddingHorizontal: wp(4), paddingBottom: hp(3) },
  spacer: { height: hp(2.5) },
  bottomPadding: { height: hp(5) },

  // Quick Info Section
  quickInfoSection: {
    backgroundColor: "rgba(42, 42, 42, 0.6)",
    borderRadius: wp(4),
    padding: wp(4),
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: wp(1),
    marginBottom: hp(1.5),
  },
  welcomeText: { fontSize: fontScale(13), color: "#a0a0a0" },
  userName: { fontSize: fontScale(18), color: "white", fontWeight: "700" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statBox: { alignItems: "center", gap: hp(0.3) },
  statDivider: {
    width: 1,
    height: hp(4),
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  statValue: { fontSize: fontScale(16), color: "white", fontWeight: "700" },
  statLabel: { fontSize: fontScale(10), color: "#a0a0a0" },

  // Free Spin Card
  freeSpinCard: {
    backgroundColor: "rgba(59, 132, 226, 0.25)",
    borderRadius: wp(4),
    padding: wp(3.5),
    borderWidth: 1,
    borderColor: "rgba(59, 132, 226, 0.4)",
  },
  freeSpinContent: { flexDirection: "row", alignItems: "center" },
  freeSpinIconContainer: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  freeSpinTextContainer: { flex: 1, marginLeft: wp(3) },
  freeSpinTitle: {
    fontSize: fontScale(15),
    color: "#FFD700",
    fontWeight: "700",
  },
  freeSpinSubtitle: {
    fontSize: fontScale(11),
    color: "#a0a0a0",
    marginTop: hp(0.3),
  },
  freeSpinButton: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#3a7be4",
    justifyContent: "center",
    alignItems: "center",
  },

  // Banner
  bannerContainer: { width: "100%" },
  bannerImage: { width: "100%", borderRadius: wp(3), overflow: "hidden" },
  bannerBadge: {
    position: "absolute",
    top: hp(1.2),
    left: wp(3),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.8),
    backgroundColor: "#ffffffdd",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
  },
  bannerBadgeText: {
    color: "rgb(60, 60, 60)",
    fontSize: fontScale(10),
    fontWeight: "600",
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "65%",
    justifyContent: "flex-end",
    padding: wp(3.5),
  },
  bannerTitle: { color: "#fff", fontSize: fontScale(20), fontWeight: "700" },
  bannerSubtitle: {
    color: "rgb(191, 191, 191)",
    fontSize: fontScale(12),
    marginTop: hp(0.3),
  },
  bannerDots: { flexDirection: "row", gap: wp(1.5), marginTop: hp(1) },
  bannerDot: {
    width: wp(1.8),
    height: hp(0.4),
    borderRadius: hp(0.2),
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  bannerDotActive: { backgroundColor: "#fff" },

  // Section
  section: { marginBottom: hp(1) },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  sectionTitle: { fontSize: fontScale(18), color: "white", fontWeight: "700" },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.8),
    backgroundColor: "#4e4e4e4a",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.7),
    borderRadius: hp(1.5),
  },
  viewAllText: { fontSize: fontScale(11), color: "#eaeaea", fontWeight: "500" },

  // Horizontal Games List
  horizontalGamesList: { gap: wp(3), paddingVertical: hp(0.5) },
  featuredBonusCard: { width: wp(48), overflow: "hidden", borderRadius: wp(3) },
  featuredBonusImage: { width: "100%" },
  featuredBonusTitle: {
    fontSize: fontScale(15),
    color: "white",
    fontWeight: "700",
    marginBottom: hp(0.3),
  },
  smallGameCard: { width: wp(35), overflow: "hidden", borderRadius: wp(3) },
  smallGameImage: { width: "100%" },
  smallGameTitle: {
    fontSize: fontScale(13),
    color: "white",
    fontWeight: "600",
  },

  // Card Gradient & Rating
  cardGradient: { flex: 1, justifyContent: "flex-end", padding: wp(2.5) },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.5),
    marginTop: hp(0.3),
  },
  ratingText: { fontSize: fontScale(12), color: "#FFD700", fontWeight: "600" },
  ratingTextSmall: {
    fontSize: fontScale(10),
    color: "#FFD700",
    fontWeight: "600",
  },
  bonusBadge: {
    position: "absolute",
    top: hp(1),
    right: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.5),
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: hp(1),
  },
  bonusBadgeText: {
    color: "#FFD700",
    fontSize: fontScale(9),
    fontWeight: "600",
  },

  // Categories
  categoriesContent: { gap: wp(2), marginTop: hp(1.5), paddingRight: wp(4) },
  categoryItem: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    backgroundColor: "rgba(37, 37, 37, 0.8)",
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryItemActive: {
    backgroundColor: "rgb(59, 132, 226)",
    borderColor: "rgb(59, 132, 226)",
  },
  categoryText: { color: "white", fontSize: fontScale(11), fontWeight: "500" },
  categoryTextActive: { fontWeight: "600" },

  // Games Grid
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(3),
    marginTop: hp(2),
    justifyContent: "space-between",
  },
  gridGameCard: { width: "47.5%", overflow: "hidden", borderRadius: wp(3) },
  gridGameImage: { width: "100%" },
  gridGameTitle: { fontSize: fontScale(13), color: "white", fontWeight: "600" },
  gridGameCategory: {
    fontSize: fontScale(10),
    color: "#a0a0a0",
    marginTop: hp(0.2),
  },
});
