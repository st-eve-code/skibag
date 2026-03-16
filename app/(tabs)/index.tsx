import { Games } from "@/constant/games";
import { useTranslation } from "@/lib/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { supabase } from "@/lib/supabase";
import {
  checkAndUpdateStreak,
  getCurrentUser,
} from "@/lib/supabaseAuthService";
import { useUser } from "@/lib/userContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Rank image mapping
const getRankImage = (rank: string) => {
  const rankImages: { [key: string]: any } = {
    beginner: require("@/assets/ranks/beginner.png"),
    advanced: require("@/assets/ranks/advanced.png"),
    inter: require("@/assets/ranks/inter.png"),
    pro: require("@/assets/ranks/pro.png"),
    legend: require("@/assets/ranks/legend.png"),
    crown1: require("@/assets/ranks/crown1.png"),
    crown2: require("@/assets/ranks/crown2.png"),
    top: require("@/assets/ranks/top.png"),
    second: require("@/assets/ranks/second.png"),
    last: require("@/assets/ranks/last.png"),
  };
  return rankImages[rank] || rankImages["beginner"];
};

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { userData, unreadCount, setUserData } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Single fetch function with useCallback
  const fetchUserData = useCallback(async () => {
    try {
      console.log("Fetching user data...");
      
      // First try to get user from custom auth service
      const currentUser = await getCurrentUser();
      if (currentUser?.username) {
        console.log("User found in storage:", currentUser.username);
        setUserData({
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.username + "@skibag.app",
          avatarUri: currentUser.avatar_url || null,
          rank: currentUser.rank || "beginner",
          score: currentUser.coins || 0,
          day_streak: currentUser.day_streak || 0,
          last_streak_date: currentUser.last_streak_date || undefined,
        });

        // Check and update streak in background
        try {
          const streakResult = await checkAndUpdateStreak(currentUser.id);
          if (streakResult.isNewStreak) {
            setUserData((prev) => ({
              ...prev,
              day_streak: streakResult.day_streak,
              last_streak_date: new Date().toISOString().split("T")[0],
            }));
          }
        } catch (streakError) {
          console.log("Error checking streak:", streakError);
        }
        return;
      }

      // Fallback: try Supabase auth session
      console.log("No user in storage, checking Supabase session...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log("Supabase session found for user:", session.user.id);
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          console.log("User data from Supabase:", userData.username);
          setUserData({
            id: userData.id,
            username: userData.username,
            email: userData.email || session.user.email,
            avatarUri: userData.avatar_url || null,
            rank: userData.rank || "beginner",
            score: userData.coins || 0,
            day_streak: userData.day_streak || 0,
            last_streak_date: userData.last_streak_date || undefined,
          });

          // Check and update streak
          try {
            const streakResult = await checkAndUpdateStreak(userData.id);
            if (streakResult.isNewStreak) {
              setUserData((prev) => ({
                ...prev,
                day_streak: streakResult.day_streak,
                last_streak_date: new Date().toISOString().split("T")[0],
              }));
            }
          } catch (streakError) {
            console.log("Error checking streak:", streakError);
          }
        }
      } else {
        console.log("No active session found");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
      console.log("Loading complete, userData:", userData);
    }
  }, [setUserData]);

  // Initial fetch on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      console.log("Auth state changed, refetching user data...");
      fetchUserData();
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  // Get first letter of username for avatar
  const avatarLetter = userData?.username 
    ? userData.username.charAt(0).toUpperCase() 
    : "";

  console.log("Rendering with avatarLetter:", avatarLetter, "userData:", userData);

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
      image: require("@/assets/images/mufa.jpeg"),
      titleKey: "special_offer",
      subtitleKey: "get_100_bonus",
    },
    {
      id: "banner2",
      image: require("@/assets/images/modern.jpeg"),
      titleKey: "weekend_special",
      subtitleKey: "double_rewards",
    },
    {
      id: "banner3",
      image: require("@/assets/images/race.jpeg"),
      titleKey: "new_games",
      subtitleKey: "try_latest",
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
  const cardAspectRatio = 3.2 / 4;

  // Show loading indicator while fetching user data
  if (isLoading) {
    return (
      <ImageBackground
        source={require("@/assets/images/bg3.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={[styles.overlay, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#5929d4" />
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
                  <Text style={styles.avatarText}>
                    {avatarLetter}
                  </Text>
                </View>
                <Ionicons name="flash" size={fontScale(16)} color="#ffffff" />
                <Text style={styles.balanceText}>{userData?.score || 0}</Text>
              </View>
              <View style={styles.rankContainer}>
                <Image
                  source={getRankImage(userData?.rank || "beginner")}
                  style={{ width: wp(10), height: hp(5) }}
                />
                <Text style={styles.balanceText}>{userData?.score || 0}</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push("/notifications")}>
                  <Ionicons
                    name="notifications"
                    size={fontScale(22)}
                    color="#fff"
                  />
                  {unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationText}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Ionicons
                    name="flame"
                    size={fontScale(22)}
                    color="#ff6969da"
                  />
                  <Text
                    style={{ color: "white", fontSize: 14, fontWeight: "500" }}
                  >
                    {userData?.day_streak || 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Spacing */}
              <View style={styles.spacer} />

              {/* Free Spin Card */}
              <TouchableOpacity style={styles.freeSpinCard} activeOpacity={0.9}>
                <View style={styles.freeSpinContent}>
                  <View style={styles.freeSpinIconContainer}>
                    <Image
                      source={require("@/assets/images/spin.png")}
                      style={{ width: 70, height: 70 }}
                    />
                  </View>
                  <View style={styles.freeSpinTextContainer}>
                    <Text style={styles.freeSpinTitle}>
                      {t("free_spin_available")}
                    </Text>
                    <Text style={styles.freeSpinSubtitle}>
                      {t("tap_to_claim")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.freeSpinButton}
                    activeOpacity={0.9}
                    onPress={() => router.push("/roulette")}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={fontScale(18)}
                      color="#fff"
                    />
                  </TouchableOpacity>
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
                    <Text style={styles.bannerBadgeText}>{t("promo")}</Text>
                  </View>

                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0)", "rgba(0, 0, 0, 0.85)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.bannerGradient}
                  >
                    <Text style={styles.bannerTitle}>
                      {t(banners[currentBanner].titleKey)}
                    </Text>
                    <Text style={styles.bannerSubtitle}>
                      {t(banners[currentBanner].subtitleKey)}
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Ionicons
                      name="gift"
                      size={fontScale(20)}
                      color="#FFD700"
                    />
                    <Text style={styles.sectionTitle}>{t("bonus_games")}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={navigateToAllGames}
                  >
                    <Text style={styles.viewAllText}>{t("view_all")}</Text>
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
                        style={styles.featuredBonusImage}
                        imageStyle={{ borderRadius: wp(3) }}
                      >
                        {/*bonus badge */}
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
                        style={styles.smallGameImage}
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
                <Text style={styles.sectionTitle}>{t("all_games")}</Text>
                <Text
                  style={{ color: "white", fontSize: 15, fontWeight: "400" }}
                >
                  {t("all_games_desc")}
                </Text>

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

                {/* Bottom Padding */}
                <View style={styles.bottomPadding} />
              </View>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
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
  rankContainer: {
    backgroundColor: "#00000000",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    height: hp(4.5),
    marginLeft: -60,
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
  headerRight: { flexDirection: "row", alignItems: "center", gap: wp(6) },
  notificationBadge: {
    position: "absolute",
    top: -hp(0.5),
    right: -wp(1.5),
    backgroundColor: "rgba(252, 66, 66, 0.96)",
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

  // Scroll Content
  scrollContent: { paddingHorizontal: wp(4), paddingBottom: hp(3) },
  spacer: { height: hp(1), marginBottom: hp(1) },
  bottomPadding: { height: hp(5) },

  // Free Spin Card
  freeSpinCard: {
    backgroundColor: "rgba(59, 132, 226, 0.25)",
    borderRadius: wp(4),
    padding: wp(3.5),
  },
  freeSpinContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  freeSpinIconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  freeSpinTextContainer: {
    flex: 1,
    marginLeft: wp(2),
  },
  freeSpinTitle: {
    color: "white",
    fontSize: fontScale(14),
    fontWeight: "bold",
  },
  freeSpinSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: fontScale(12),
    marginTop: 2,
  },
  freeSpinButton: {
    backgroundColor: "#5929d4",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  // Banner
  bannerContainer: {
    marginHorizontal: wp(0),
  },
  bannerImage: {
    width: "100%",
  },
  bannerBadge: {
    position: "absolute",
    top: wp(2),
    left: wp(2),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bannerBadgeText: {
    color: "white",
    fontSize: fontScale(10),
    fontWeight: "600",
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: wp(3),
    borderBottomLeftRadius: wp(3),
    borderBottomRightRadius: wp(3),
  },
  bannerTitle: {
    color: "white",
    fontSize: fontScale(18),
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: fontScale(12),
    marginTop: 2,
  },
  bannerDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(1),
    gap: wp(1),
  },
  bannerDot: {
    width: wp(2),
    height: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  bannerDotActive: {
    backgroundColor: "#5929d4",
  },

  // Section
  section: {
    marginTop: hp(1),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  sectionTitle: {
    color: "white",
    fontSize: fontScale(16),
    fontWeight: "bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: fontScale(12),
  },
  horizontalGamesList: {
    paddingRight: wp(4),
    gap: wp(3),
  },
  featuredBonusCard: {
    width: wp(42),
    height: wp(42),
  },
  featuredBonusImage: {
    width: "100%",
    height: "100%",
  },
  bonusBadge: {
    position: "absolute",
    top: wp(2),
    left: wp(2),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bonusBadgeText: {
    color: "#FFD700",
    fontSize: fontScale(10),
    fontWeight: "600",
  },
  featuredBonusTitle: {
    color: "white",
    fontSize: fontScale(14),
    fontWeight: "bold",
  },
  smallGameCard: {
    width: wp(42),
    height: wp(42),
  },
  smallGameImage: {
    width: "100%",
    height: "100%",
  },
  smallGameTitle: {
    color: "white",
    fontSize: fontScale(11),
    fontWeight: "600",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    justifyContent: "flex-end",
    padding: wp(2),
    borderBottomLeftRadius: wp(3),
    borderBottomRightRadius: wp(3),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: fontScale(10),
    fontWeight: "600",
  },
  ratingTextSmall: {
    color: "#FFD700",
    fontSize: fontScale(9),
    fontWeight: "600",
  },

  // Games Grid
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: hp(2),
  },
  gridGameCard: {
    width: wp(29),
    height: hp(18),
    marginBottom: hp(2),
  },
  gridGameImage: {
    width: "100%",
    height: "100%",
  },
  gridGameTitle: {
    color: "white",
    fontSize: fontScale(12),
    fontWeight: "bold",
  },
  gridGameCategory: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: fontScale(10),
    marginTop: 2,
  },
});