import BackButton from "@/app/components/BackButton";
import MatchCard from "@/app/components/MatchCard";
import ScreenBackground from "@/app/components/ScreenBackground";
import { useTranslation } from "@/lib/context/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
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
    <MatchCard
      key={match.id}
      match={match}
      vsLabel={t("vs")}
      winLabel={t("win")}
      lossLabel={t("loss")}
      drawLabel={t("draw")}
    />
  );

  return (
    <ScreenBackground>
      <Stack screenOptions={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
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
            <View style={styles.historySection}>
              {currentMatches.map(renderMatchCard)}
            </View>
            <View style={{ height: hp(4) }} />
          </ScrollView>
        </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(2.5),
  },
  headerTitle: { fontSize: fontScale(20), color: "#ffffff", fontWeight: "600" },
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
  categoryButtonActive: { backgroundColor: "rgba(59, 132, 226, 0.8)" },
  categoryText: { fontSize: fontScale(13), color: "#a0a0a0", fontWeight: "500" },
  categoryTextActive: { color: "#ffffff" },
  scrollContent: { paddingHorizontal: wp(4.5) },
  historySection: { marginBottom: hp(2) },
});
