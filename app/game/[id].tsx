import { Games } from "@/constant/games";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
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

const leaderboard = [
  { rank: 1, name: "ProGamer99", score: 15420 },
  { rank: 2, name: "NightOwl", score: 14850 },
  { rank: 3, name: "ChampionX", score: 13200 },
  { rank: 4, name: "GameMaster", score: 12100 },
  { rank: 5, name: "Speedy", score: 11500 },
];

export default function GameDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const game = Games.find((g) => g.id === id);

  if (!game) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Game not found</Text>
        <TouchableOpacity
          style={styles.backButtonError}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePlay = () => {
    console.log(`Playing ${game.name}`);
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.heroSection}>
              <ImageBackground
                source={game.image}
                resizeMode="cover"
                style={{ flex: 1, height: hp(35) }}
              >
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={fontScale(24)}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton}>
                    <Ionicons
                      name="share-social"
                      size={fontScale(22)}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
                  style={styles.heroGradient}
                >
                  <View style={styles.gameInfo}>
                    <View style={styles.categoryContainer}>
                      {game.category.split(" & ").map((cat, index) => (
                        <View key={index} style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.gameName}>{game.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons
                        name="star"
                        size={fontScale(18)}
                        color="#FFD700"
                      />
                      <Text style={styles.ratingText}>{game.rating}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>

            <View style={styles.playSection}>
              <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                <Ionicons name="play" size={fontScale(28)} color="#fff" />
                <Text style={styles.playButtonText}>PLAY NOW</Text>
              </TouchableOpacity>

              <View style={styles.gameStats}>
                <View style={styles.statItem}>
                  <Ionicons
                    name="download"
                    size={fontScale(18)}
                    color="#a0a0a0"
                  />
                  <Text style={styles.statText}>10K+</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={fontScale(18)} color="#a0a0a0" />
                  <Text style={styles.statText}>Action</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="phone-portrait"
                    size={fontScale(18)}
                    color="#a0a0a0"
                  />
                  <Text style={styles.statText}>Mobile</Text>
                </View>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About Game</Text>
              <Text style={styles.descriptionText}>{game.description}</Text>
            </View>

            <View style={styles.leaderboardSection}>
              <View style={styles.leaderboardHeader}>
                <View style={styles.leaderboardTitleRow}>
                  <Ionicons
                    name="trophy"
                    size={fontScale(18)}
                    color="#FFD700"
                  />
                  <Text style={styles.leaderboardTitle}>Top Players</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.leaderboardList}>
                {leaderboard.map((player) => (
                  <View key={player.rank} style={styles.leaderboardItem}>
                    <View style={styles.rankContainer}>
                      {player.rank <= 3 ? (
                        <Ionicons
                          name="medal"
                          size={fontScale(16)}
                          color={
                            player.rank === 1
                              ? "#FFD700"
                              : player.rank === 2
                                ? "#C0C0C0"
                                : "#CD7F32"
                          }
                        />
                      ) : (
                        <Text style={styles.rankText}>{player.rank}</Text>
                      )}
                    </View>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{player.name}</Text>
                    </View>
                    <Text style={styles.playerScore}>
                      {player.score.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: hp(5) }} />
          </SafeAreaView>
        </View>
      </ScrollView>
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
    backgroundColor: "rgba(12, 12, 12, 0)",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: wp(2.5),
    borderRadius: wp(3),
  },
  shareButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: wp(2.5),
    borderRadius: wp(3),
  },
  scrollContent: {
    paddingHorizontal: wp(4),
  },
  heroSection: {
    height: hp(35),
    marginHorizontal: -wp(4),
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: wp(4),
    height: "100%",
  },
  gameInfo: {
    gap: hp(1),
  },
  categoryContainer: {
    flexDirection: "row",
    gap: wp(2),
    flexWrap: "wrap",
  },
  categoryBadge: {
    backgroundColor: "rgba(59, 132, 226, 0.8)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
  },
  categoryText: {
    color: "#fff",
    fontSize: fontScale(12),
    fontWeight: "600",
  },
  gameName: {
    fontSize: fontScale(32),
    color: "#fff",
    fontWeight: "700",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  ratingText: {
    fontSize: fontScale(18),
    color: "#FFD700",
    fontWeight: "600",
  },
  playSection: {
    marginTop: hp(3),
    alignItems: "center",
    gap: hp(2),
  },
  playButton: {
    backgroundColor: "#3a7be4fe",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(15),
    borderRadius: hp(4),
    shadowColor: "#3a7be4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  playButtonText: {
    color: "#fff",
    fontSize: fontScale(18),
    fontWeight: "700",
  },
  gameStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(8),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  statText: {
    color: "#a0a0a0",
    fontSize: fontScale(12),
  },
  descriptionSection: {
    marginTop: hp(3.5),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    color: "#fff",
    fontWeight: "700",
    marginBottom: hp(1),
  },
  descriptionText: {
    fontSize: fontScale(14),
    color: "#a0a0a0",
    lineHeight: hp(2.5),
  },
  leaderboardSection: {
    marginTop: hp(3.5),
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(4),
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  leaderboardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  leaderboardTitle: {
    fontSize: fontScale(16),
    color: "#fff",
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: fontScale(13),
    color: "#3a7be4",
    fontWeight: "500",
  },
  leaderboardList: {
    gap: hp(1),
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  rankContainer: {
    width: wp(8),
    alignItems: "center",
  },
  rankText: {
    fontSize: fontScale(14),
    color: "#a0a0a0",
    fontWeight: "600",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: fontScale(14),
    color: "#fff",
    fontWeight: "500",
  },
  playerScore: {
    fontSize: fontScale(14),
    color: "#3a7be4",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  errorText: {
    color: "#fff",
    fontSize: fontScale(18),
    marginBottom: hp(2),
  },
  backButtonError: {
    backgroundColor: "#3a7be4",
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
  },
  backButtonText: {
    color: "#fff",
    fontSize: fontScale(16),
  },
});
