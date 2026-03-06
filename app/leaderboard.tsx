import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LeaderboardType = "global";

interface LeaderboardEntry {
  id: number;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  wins: number;
  isCurrentUser?: boolean;
}

const globalLeaderboard: LeaderboardEntry[] = [
  { id: 1, rank: 1, name: "ProGamer99", avatar: "P", score: 15420, wins: 234 },
  { id: 2, rank: 2, name: "DragonKing", avatar: "D", score: 14850, wins: 198 },
  {
    id: 3,
    rank: 3,
    name: "ShadowHunter",
    avatar: "S",
    score: 13200,
    wins: 176,
  },
  { id: 4, rank: 4, name: "CyberNinja", avatar: "C", score: 12100, wins: 156 },
  { id: 5, rank: 5, name: "GameMaster", avatar: "G", score: 11500, wins: 142 },
  { id: 6, rank: 6, name: "ElitePlayer", avatar: "E", score: 10800, wins: 128 },
  { id: 7, rank: 7, name: "StarHunter", avatar: "S", score: 9900, wins: 115 },
  { id: 8, rank: 8, name: "PhantomX", avatar: "P", score: 9200, wins: 108 },
  { id: 9, rank: 9, name: "ThunderBolt", avatar: "T", score: 8500, wins: 98 },
  { id: 10, rank: 10, name: "IceStorm", avatar: "I", score: 7800, wins: 89 },
  { id: 11, rank: 11, name: "BlazeFury", avatar: "B", score: 7200, wins: 82 },
  {
    id: 12,
    rank: 12,
    name: "John Doe",
    avatar: "J",
    score: 6500,
    wins: 75,
    isCurrentUser: true,
  },
];

export default function Leaderboard() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<LeaderboardType>("global");

  const currentLeaderboard = globalLeaderboard;

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          borderColor: "#FFD700",
        };
      case 2:
        return {
          backgroundColor: "rgba(192, 192, 192, 0.2)",
          borderColor: "#C0C0C0",
        };
      case 3:
        return {
          backgroundColor: "rgba(205, 127, 50, 0.2)",
          borderColor: "#CD7F32",
        };
      default:
        return {
          backgroundColor: "rgba(42, 42, 42, 0.5)",
          borderColor: "transparent",
        };
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Ionicons name="trophy" size={fontScale(14)} color="#FFD700" />;
      case 2:
        return <Ionicons name="trophy" size={fontScale(14)} color="#C0C0C0" />;
      case 3:
        return <Ionicons name="trophy" size={fontScale(14)} color="#CD7F32" />;
      default:
        return null;
    }
  };

  const renderLeaderboardItem = (entry: LeaderboardEntry) => {
    const rankStyle = getRankStyle(entry.rank);

    return (
      <View
        key={entry.id}
        style={[
          styles.leaderboardCard,
          entry.isCurrentUser && styles.currentUserCard,
        ]}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.rankBadge, rankStyle]}>
            {getRankIcon(entry.rank) ? (
              getRankIcon(entry.rank)
            ) : (
              <Text style={styles.rankText}>{entry.rank}</Text>
            )}
          </View>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarCircle,
                entry.isCurrentUser && styles.currentUserAvatar,
              ]}
            >
              <Text style={styles.avatarText}>{entry.avatar}</Text>
            </View>
          </View>
          <View style={styles.playerInfo}>
            <Text
              style={[
                styles.playerName,
                entry.isCurrentUser && styles.currentUserName,
              ]}
            >
              {entry.name}
              {entry.isCurrentUser && " (You)"}
            </Text>
            <Text style={styles.winsText}>{entry.wins} wins</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text
            style={[
              styles.scoreText,
              entry.isCurrentUser && styles.currentUserScore,
            ]}
          >
            {entry.score.toLocaleString()}
          </Text>
          <Text style={styles.scoreLabel}>points</Text>
        </View>
      </View>
    );
  };

  // Top 3 podium
  const topThree = currentLeaderboard.slice(0, 3);

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
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <View style={{ width: wp(10) }} />
          </View>

          {/* Category Toggle */}
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedType === "global" && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedType("global")}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedType === "global" && styles.categoryTextActive,
                ]}
              >
                Global players leaderboard
              </Text>
            </TouchableOpacity>
          </View>

          {/* Top 3 Podium */}
          {selectedType === "global" && (
            <View style={styles.podiumContainer}>
              {/* <ImageBackground
                source={require("@/assets/images/podium.jpg")}
                style={styles.podiumBackground}
                resizeMode="contain"
              > */}
              {/* Winner's Circle Title */}
              <View style={styles.winnersCircleHeader}>
                <Image
                  source={require("@/assets/ranks/top.png")}
                  style={{
                    width: wp(30),
                    height: hp(18.8),
                    marginLeft: wp(0.2),
                    marginTop: -hp(20),
                    position:'absolute',
                    zIndex:100
                  }}
                />
                {/* <Ionicons name="trophy" size={fontScale(24)} color="#FFD700" />
                  {/* <Text style={styles.winnersCircleTitle}>WINNER'S CIRCLE</Text> */}
                {/* <Ionicons name="trophy" size={fontScale(24)} color="#FFD700" /> */}{" "}
                */
              </View>

              <View style={styles.podiumPlayersContainer}>
                {/* 2nd Place - Left */}
                <View
                  style={[
                    styles.podiumPlayerWrapper,
                    styles.secondPlaceWrapper,
                  ]}
                >
                  <Image
                    source={require("@/assets/ranks/second.png")}
                    style={{
                      width: wp(24),
                      height: hp(13),
                      marginLeft: wp(0),
                      marginTop: -20,
                      position: "absolute",
                      zIndex:100
                    }}
                  />
                  <View
                    style={[styles.podiumAvatar, styles.podiumAvatarSecond]}
                  >
                    <Text style={styles.podiumAvatarText}>
                      {topThree[1]?.avatar || "2"}
                    </Text>
                    <View style={styles.medalBadge}>
                      <Ionicons
                        name="medal"
                        size={fontScale(16)}
                        color="#C0C0C0"
                      />
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {topThree[1]?.name || ""}
                  </Text>
                  {/* <View style={styles.podiumScoreCard}>
                      <Text style={styles.podiumScore}>
                        {topThree[1]?.score.toLocaleString()}
                      </Text>
                      <Text style={styles.scoreSubtext}>points</Text>
                    </View> */}
                </View>

                {/* 1st Place - Center */}
                <View
                  style={[styles.podiumPlayerWrapper, styles.firstPlaceWrapper]}
                >
                  {/* <Ionicons
                      name="star"
                      size={fontScale(28)}
                      color="#FFD700"
                      style={styles.crownIcon}
                    /> */}
                  <View style={[styles.podiumAvatar, styles.podiumAvatarFirst]}>
                    <Text
                      style={[styles.podiumAvatarText, styles.firstPlaceText]}
                    >
                      {topThree[0]?.avatar || "1"}
                    </Text>
                    <View style={[styles.medalBadge, styles.goldMedalBadge]}>
                      <Ionicons
                        name="medal"
                        size={fontScale(20)}
                        color="#fdcc86"
                      />
                    </View>
                  </View>
                  {/* <Text style={[styles.podiumName, styles.firstPlaceName]} numberOfLines={1}>
                      {topThree[0]?.name || ""}
                    </Text> */}
                  {/* <View style={[styles.podiumScoreCard, styles.firstPlaceScoreCard]}>
                      <Text style={[styles.podiumScore, styles.firstPlaceScore]}>
                        {topThree[0]?.score.toLocaleString()}
                      </Text>
                      <Text style={styles.scoreSubtext}>points</Text>
                    </View> */}
                </View>

                {/* 3rd Place - Right */}
                <View
                  style={[styles.podiumPlayerWrapper, styles.thirdPlaceWrapper]}
                >
                  <View style={[styles.podiumAvatar, styles.podiumAvatarThird]}>
                    <Image
                      source={require("@/assets/ranks/last.png")}
                      style={{
                        width: wp(20),
                        height: hp(15),
                        position: "absolute",
                        zIndex:100,
                        top: -hp(4),
                        left: -wp(3),
                      }}
                    />
                    <Text style={styles.podiumAvatarText}>
                      {topThree[2]?.avatar || "3"}
                    </Text>
                    <View style={styles.medalBadge}>
                      <Ionicons
                        name="medal"
                        size={fontScale(16)}
                        color="#CD7F32"
                      />
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {topThree[2]?.name || ""}
                  </Text>
                  {/* <View style={styles.podiumScoreCard}>
                    <Text style={styles.podiumScore}>
                      {topThree[2]?.score.toLocaleString()}
                    </Text>
                    <Text style={styles.scoreSubtext}>points</Text>
                  </View> */}
                </View>
              </View>
            </View>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={{ height: hp(6) }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: fontScale(18),
                  fontWeight: "700",
                  marginLeft: 3,
                }}
              >
                Gamers Leaderboard
              </Text>
            </View>
            {/* Leaderboard List */}
            <View style={styles.leaderboardList}>
              {currentLeaderboard.map(renderLeaderboardItem)}
            </View>

            <View style={{ height: hp(4) }} />
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
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: wp(4.5),
    gap: wp(2),
    marginBottom: hp(3),
  },
  categoryButton: {
    flex: 1,
    backgroundColor: "rgba(78, 78, 78, 0.4)",
    paddingVertical: hp(1.2),
    borderRadius: hp(2.5),
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "rgba(59, 132, 226, 0.8)",
  },
  categoryText: {
    fontSize: fontScale(12),
    color: "#a0a0a0",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  scrollContent: {
    paddingHorizontal: wp(4.5),
  },
  podiumContainer: {
    paddingHorizontal: wp(2),
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  podiumBackground: {
    width: "100%",
    height: hp(35),
    justifyContent: "flex-start",
    paddingTop: hp(2),
  },
  winnersCircleHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(1.5),
    marginBottom: hp(1),
    marginTop:hp(20)
  },
  winnersCircleTitle: {
    color: "#FFD700",
    fontSize: fontScale(16),    
    fontWeight: "800",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  podiumPlayersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: wp(4),
    flex: 1,
    paddingBottom: hp(2),
  },
  podiumPlayerWrapper: {
    alignItems: "center",
    flex: 1,
  },
  firstPlaceWrapper: {
    marginBottom: hp(4),
  },
  secondPlaceWrapper: {
    marginBottom: hp(1),
  },
  thirdPlaceWrapper: {
    marginBottom: hp(1),
  },
  podiumAvatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(0.8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  podiumAvatarFirst: {
    backgroundColor: "#188c9b",
    borderWidth: 3,
    borderColor: "#FFF",
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
  },
  podiumAvatarSecond: {
    backgroundColor: "#C0C0C0",
    borderWidth: 0,
    borderColor: "#FFF",
  },
  podiumAvatarThird: {
    backgroundColor: "#CD7F32",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  crownIcon: {
    position: "absolute",
    top: -hp(2.5),
    zIndex: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  medalBadge: {
    position: "absolute",
    zIndex:-100,
    bottom: -hp(0.5),
    right: -wp(1),
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: wp(4),
    padding: wp(1),
    borderWidth: 2,
    borderColor: "#FFF",
  },
  goldMedalBadge: {
    bottom: -hp(0.8),
    right: -wp(1.5),
    padding: wp(1.5),
  },
  podiumAvatarText: {
    color: "#1a1a1a",
    fontSize: fontScale(18),
    fontWeight: "900",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  firstPlaceText: {
    fontSize: fontScale(22),
  },
  podiumName: {
    color: "#fff",
    fontSize: fontScale(11),
    fontWeight: "700",
    marginBottom: hp(0.5),
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    maxWidth: wp(25),
  },
  firstPlaceName: {
    fontSize: fontScale(13),
    color: "#FFD700",
  },
  podiumScoreCard: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: wp(3),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  firstPlaceScoreCard: {
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderColor: "#FFD700",
    borderWidth: 2,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
  },
  podiumScore: {
    color: "#fff",
    fontSize: fontScale(12),
    fontWeight: "800",
  },
  firstPlaceScore: {
    color: "#FFD700",
    fontSize: fontScale(14),
  },
  scoreSubtext: {
    color: "#a0a0a0",
    fontSize: fontScale(8),
    marginTop: hp(0.2),
  },
  leaderboardList: {
    gap: hp(1),
  },
  leaderboardCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(3),
  },
  currentUserCard: {
    backgroundColor: "rgba(59, 132, 226, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(59, 132, 226, 0.6)",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  rankBadge: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  rankText: {
    color: "#fff",
    fontSize: fontScale(12),
    fontWeight: "700",
  },
  avatarContainer: {
    marginLeft: wp(1),
  },
  avatarCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "rgba(60, 60, 60, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  currentUserAvatar: {
    backgroundColor: "rgba(59, 132, 226, 0.5)",
  },
  avatarText: {
    color: "#fff",
    fontSize: fontScale(14),
    fontWeight: "700",
  },
  playerInfo: {
    gap: hp(0.25),
  },
  playerName: {
    color: "#fff",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  currentUserName: {
    color: "#4fc3f7",
  },
  winsText: {
    color: "#a0a0a0",
    fontSize: fontScale(11),
  },
  cardRight: {
    alignItems: "flex-end",
  },
  scoreText: {
    color: "#fff",
    fontSize: fontScale(16),
    fontWeight: "700",
  },
  currentUserScore: {
    color: "#4fc3f7",
  },
  scoreLabel: {
    color: "#707070",
    fontSize: fontScale(10),
  },
});
