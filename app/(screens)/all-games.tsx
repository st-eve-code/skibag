import BackButton from "@/app/components/BackButton";
import CategoryFilterBar from "@/app/components/CategoryFilterBar";
import GameCard from "@/app/components/GameCard";
import ScreenBackground from "@/app/components/ScreenBackground";
import { Games } from "@/constant/games";
import { useTranslation } from "@/lib/context/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function AllGames() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedGames, setDisplayedGames] = useState(Games);

  // Category translation keys
  const categoryKeys: Record<string, string> = {
    all: "category_all",
    casino: "category_casino",
    action: "category_action",
    football: "category_football",
    board: "category_board",
    puzzles: "category_puzzles",
    arcade: "category_arcade",
    fighting: "category_fighting",
    adventure: "category_adventure",
  };

  useEffect(() => {
    if (selectedCategory === "all") {
      setDisplayedGames(Games);
    } else {
      setDisplayedGames(
        Games.filter((game) =>
          game.category.toLowerCase().includes(selectedCategory.toLowerCase()),
        ),
      );
    }
  }, [selectedCategory]);

  const navigateToGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  return (
    <ScreenBackground overlayOpacity={0.85}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} style={styles.backButtonStyle} />
          <Text style={styles.headerTitle}>{t("all_games_title")}</Text>
          <View style={{ width: wp(10) }} />
        </View>

        <CategoryFilterBar
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          getLabel={(item) => t(categoryKeys[item] || item)}
        />

        <View style={styles.gamesCount}>
          <Text style={styles.gamesCountText}>
            {t("games_available").replace("{count}", displayedGames.length.toString())}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.gamesGrid}>
            {displayedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPress={navigateToGame}
                variant="grid"
              />
            ))}
          </View>
          <View style={{ height: hp(5) }} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  backButtonStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
  headerTitle: { fontSize: fontScale(20), color: "#fff", fontWeight: "700" },
  gamesCount: { paddingHorizontal: wp(4), paddingVertical: hp(1.5) },
  gamesCountText: { color: "rgb(133, 133, 133)", fontSize: fontScale(13) },
  scrollContent: { paddingHorizontal: wp(4), paddingBottom: hp(3) },
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(3),
    justifyContent: "space-between",
  },
});
