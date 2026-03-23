import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GameCardProps {
  game: {
    id: string;
    name: string;
    image: any;
    category: string;
    rating?: number | string;
  };
  onPress: (id: string) => void;
  variant?: "grid" | "small" | "featured";
  isSelected?: boolean;
}

export default function GameCard({
  game,
  onPress,
  variant = "grid",
  isSelected = false,
}: GameCardProps) {
  if (variant === "featured") {
    return (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => onPress(game.id)}
      >
        <ImageBackground
          source={game.image}
          resizeMode="cover"
          style={styles.featuredImage}
          imageStyle={{ borderRadius: wp(3) }}
        >
          <View style={styles.bonusBadge}>
            <Ionicons name="gift" size={fontScale(10)} color="#FFD700" />
            <Text style={styles.bonusBadgeText}>Bonus</Text>
          </View>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.9)"]}
            style={styles.cardGradient}
          >
            <Text style={styles.featuredTitle}>{game.name}</Text>
            {game.rating !== undefined && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={fontScale(12)} color="#FFD700" />
                <Text style={styles.ratingText}>{game.rating}</Text>
              </View>
            )}
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  if (variant === "small") {
    return (
      <TouchableOpacity
        style={styles.smallCard}
        onPress={() => onPress(game.id)}
      >
        <ImageBackground
          source={game.image}
          resizeMode="cover"
          style={styles.smallImage}
          imageStyle={{ borderRadius: wp(3) }}
        >
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
            style={styles.cardGradient}
          >
            <Text style={styles.smallTitle} numberOfLines={1}>
              {game.name}
            </Text>
            {game.rating !== undefined && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={fontScale(10)} color="#FFD700" />
                <Text style={styles.ratingTextSmall}>{game.rating}</Text>
              </View>
            )}
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  // grid variant
  return (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => onPress(game.id)}
    >
      <ImageBackground
        source={game.image}
        style={styles.gridImage}
        imageStyle={{ borderRadius: wp(3) }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
          style={styles.gridGradient}
        >
          <Text style={styles.gridTitle} numberOfLines={1}>
            {game.name}
          </Text>
          <Text style={styles.gridCategory} numberOfLines={1}>
            {game.category}
          </Text>
        </LinearGradient>
      </ImageBackground>

      {isSelected && (
        <View style={styles.selectedOverlay}>
          <View style={styles.selectedBorder} />
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#3a6fe9" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Featured
  featuredCard: { width: wp(42), height: wp(42) },
  featuredImage: { width: "100%", height: "100%" },
  featuredTitle: { color: "white", fontSize: fontScale(14), fontWeight: "bold" },
  bonusBadge: {
    position: "absolute",
    top: wp(2),
    left: wp(2),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: wp(2),
    paddingVertical: 3,
    borderRadius: wp(2),
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bonusBadgeText: { color: "#FFD700", fontSize: fontScale(10), fontWeight: "600" },

  // Small
  smallCard: { width: wp(42), height: wp(42) },
  smallImage: { width: "100%", height: "100%" },
  smallTitle: { color: "white", fontSize: fontScale(11), fontWeight: "600" },

  // Shared gradient
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
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  ratingText: { color: "#FFD700", fontSize: fontScale(10), fontWeight: "600" },
  ratingTextSmall: { color: "#FFD700", fontSize: fontScale(9), fontWeight: "600" },

  // Grid
  gridCard: {
    width: "47%",
    height: hp(18),
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(3),
    overflow: "hidden",
    position: "relative",
  },
  gridImage: { flex: 1 },
  gridGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: wp(2.5),
  },
  gridTitle: { fontSize: fontScale(14), color: "white", fontWeight: "600", marginBottom: 2 },
  gridCategory: { fontSize: fontScale(11), color: "#a0a0a0" },

  // Selected state
  selectedOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: wp(3),
    pointerEvents: "none",
  },
  selectedBorder: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
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
