import { useTranslation } from "@/lib/I18nContext";
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

type MatchType = "tournament" | "daily";

interface MatchHistoryItem {
  id: number;
  opponent: string;
  game: string;
  result: "Win" | "Loss" | "Draw";
  score: string;
  date: string;
  avatar: string;
  type: MatchType;
  tournamentName?: string;
  placement?: number;
}

const allMatchHistory: MatchHistoryItem[] = [
  // Tournament Matches
  {
    id: 1,
    opponent: "Tournament",
    game: "PUBG Mobile",
    result: "Win",
    score: "#2",
    date: "1d ago",
    avatar: "P",
    type: "tournament",
    tournamentName: "Champions League",
    placement: 2,
  },
  {
    id: 2,
    opponent: "Tournament",
    game: "Call of Duty",
    result: "Loss",
    score: "#15",
    date: "2d ago",
    avatar: "C",
    type: "tournament",
    tournamentName: "Weekend Warriors",
    placement: 15,
  },
  {
    id: 3,
    opponent: "Tournament",
    game: "Texas Hold em",
    result: "Win",
    score: "#1",
    date: "4d ago",
    avatar: "T",
    type: "tournament",
    tournamentName: "Poker Masters",
    placement: 1,
  },
  {
    id: 4,
    opponent: "Tournament",
    game: "Street Fighter",
    result: "Win",
    score: "#3",
    date: "5d ago",
    avatar: "S",
    type: "tournament",
    tournamentName: "Street Fighter V",
    placement: 3,
  },
  {
    id: 5,
    opponent: "Tournament",
    game: "Mario Kart",
    result: "Win",
    score: "#1",
    date: "1w ago",
    avatar: "M",
    type: "tournament",
    tournamentName: "Racing Championship",
    placement: 1,
  },
  // Daily Matches
  {
    id: 6,
    opponent: "PlayerOne",
    game: "PUBG Mobile",
    result: "Win",
    score: "12/5",
    date: "2h ago",
    avatar: "P",
    type: "daily",
  },
  {
    id: 7,
    opponent: "ProGamer99",
    game: "Call of Duty",
    result: "Loss",
    score: "8/12",
    date: "5h ago",
    avatar: "P",
    type: "daily",
  },
  {
    id: 8,
    opponent: "ChampionX",
    game: "Ludo",
    result: "Win",
    score: "W",
    date: "1d ago",
    avatar: "C",
    type: "daily",
  },
  {
    id: 9,
    opponent: "GameMaster",
    game: "Domino",
    result: "Draw",
    score: "D",
    date: "2d ago",
    avatar: "G",
    type: "daily",
  },
  {
    id: 10,
    opponent: "ShadowRider",
    game: "Street Fighter",
    result: "Win",
    score: "3/1",
    date: "3d ago",
    avatar: "S",
    type: "daily",
  },
  {
    id: 11,
    opponent: "DragonKing",
    game: "PUBG Mobile",
    result: "Win",
    score: "15/8",
    date: "4d ago",
    avatar: "D",
    type: "daily",
  },
  {
    id: 12,
    opponent: "NinjaSlayer",
    game: "Call of Duty",
    result: "Loss",
    score: "5/10",
    date: "5d ago",
    avatar: "N",
    type: "daily",
  },
];

export default function MatchHistory() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<MatchType>("daily");

  const currentMatches = allMatchHistory.filter(
    (m) => m.type === selectedCategory,
  );

  const renderMatchCard = (match: MatchHistoryItem) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.matchLeft}>
        <View
          style={[
            styles.avatarCircle,
            match.result === "Win"
              ? styles.winAvatar
              : match.result === "Loss"
                ? styles.lossAvatar
                : styles.drawAvatar,
          ]}
        >
          <Text style={styles.avatarText}>{match.avatar}</Text>
        </View>
        <View style={styles.matchInfo}>
          <Text style={styles.opponentName}>
            {match.type === "tournament" && match.tournamentName
              ? match.tournamentName
              : `${t("vs")} ${match.opponent}`}
          </Text>
          <Text style={styles.matchGame}>{match.game}</Text>
        </View>
      </View>
      <View style={styles.matchRight}>
        <View
          style={[
            styles.resultBadge,
            match.result === "Win"
              ? styles.winBadge
              : match.result === "Loss"
                ? styles.lossBadge
                : styles.drawBadge,
          ]}
        >
          <Text
            style={[
              styles.resultText,
              match.result === "Win"
                ? styles.winText
                : match.result === "Loss"
                  ? styles.lossText
                  : styles.drawText,
            ]}
          >
            {match.result === "Win"
              ? t("win")
              : match.result === "Loss"
                ? t("loss")
                : t("draw")}
          </Text>
        </View>
        <Text style={styles.matchScore}>
          {match.type === "tournament" ? match.score : match.score}
        </Text>
        <Text style={styles.matchDate}>{match.date}</Text>
      </View>
    </View>
  );

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
            <Text style={styles.headerTitle}>{t("match_history_title")}</Text>
            <View style={{ width: wp(10) }} />
          </View>

          {/* Category Toggle */}
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "daily" && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory("daily")}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === "daily" && styles.categoryTextActive,
                ]}
              >
                {t("daily_matches")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "tournament" &&
                  styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory("tournament")}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === "tournament" &&
                    styles.categoryTextActive,
                ]}
              >
                {t("tournament_match")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Match History List */}
            <View style={styles.historySection}>
              {currentMatches.map(renderMatchCard)}
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
    gap: wp(3),
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
    fontSize: fontScale(13),
    color: "#a0a0a0",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  scrollContent: {
    paddingHorizontal: wp(4.5),
  },
  historySection: {
    marginBottom: hp(2),
  },
  matchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(3.5),
    marginBottom: hp(1.5),
  },
  matchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  avatarCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: "center",
    alignItems: "center",
  },
  winAvatar: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
  },
  lossAvatar: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
  },
  drawAvatar: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
  },
  avatarText: {
    color: "#fff",
    fontSize: fontScale(18),
    fontWeight: "700",
  },
  matchInfo: {
    gap: hp(0.5),
  },
  opponentName: {
    color: "#fff",
    fontSize: fontScale(15),
    fontWeight: "600",
  },
  matchGame: {
    color: "#a0a0a0",
    fontSize: fontScale(12),
  },
  matchRight: {
    alignItems: "flex-end",
    gap: hp(0.5),
  },
  resultBadge: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
  },
  winBadge: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
  },
  lossBadge: {
    backgroundColor: "rgba(248, 113, 113, 0.2)",
  },
  drawBadge: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
  },
  resultText: {
    fontSize: fontScale(12),
    fontWeight: "700",
  },
  winText: {
    color: "#4ade80",
  },
  lossText: {
    color: "#f87171",
  },
  drawText: {
    color: "#fbbf24",
  },
  matchScore: {
    color: "#e0e0e0",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  matchDate: {
    color: "#707070",
    fontSize: fontScale(11),
  },
});
