import { Games } from "@/constant/games";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedGames, setDisplayedGames] = useState(Games);

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
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={fontScale(24)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Games</Text>
            <View style={{ width: wp(10) }} />
          </View>

          <ScrollView
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
          </ScrollView>

          <View style={styles.gamesCount}>
            <Text style={styles.gamesCountText}>
              {displayedGames.length} games available
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.gamesGrid}>
              {displayedGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gridGameCard}
                  onPress={() => navigateToGame(game.id)}
                >
                  <ImageBackground
                    source={game.image}
                    style={styles.gridGameImage}
                    imageStyle={{ borderRadius: wp(3) }}
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
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: hp(5) }} />
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
    backgroundColor: "rgba(12, 12, 12, 0.85)",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: wp(2.5),
    borderRadius: wp(3),
  },
  headerTitle: {
    fontSize: fontScale(20),
    color: "#fff",
    fontWeight: "700",
  },
  categoriesScroll: {
    maxHeight: hp(7),
  },
  categoriesContent: {
    paddingHorizontal: wp(4),
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
  gamesCount: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  gamesCountText: {
    color: "rgb(133, 133, 133)",
    fontSize: fontScale(13),
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
  },
  gamesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(3),
    justifyContent: "space-between",
  },
  gridGameCard: {
    width: "48%",
    height: hp(20),
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(3),
    overflow: "hidden",
  },
  gridGameImage: {
    flex: 1,
    width: "100%",
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
    marginBottom: hp(0.3),
  },
  gridGameCategory: {
    fontSize: fontScale(11),
    color: "#a0a0a0",
  },
});
