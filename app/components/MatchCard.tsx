import { fontScale, hp, wp } from "@/lib/responsive";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MatchCardProps {
  match: {
    id: number;
    opponent: string;
    game: string;
    result: "Win" | "Loss" | "Draw";
    score: string;
    date: string;
    avatar: string;
    tournamentName?: string;
    type?: "daily" | "tournament";
  };
  vsLabel?: string;
  winLabel?: string;
  lossLabel?: string;
  drawLabel?: string;
}

export default function MatchCard({
  match,
  vsLabel = "vs",
  winLabel = "Win",
  lossLabel = "Loss",
  drawLabel = "Draw",
}: MatchCardProps) {
  const isTournament = match.type === "tournament" && match.tournamentName;

  const avatarStyle =
    match.result === "Win"
      ? styles.winAvatar
      : match.result === "Loss"
        ? styles.lossAvatar
        : styles.drawAvatar;

  const badgeStyle =
    match.result === "Win"
      ? styles.winBadge
      : match.result === "Loss"
        ? styles.lossBadge
        : styles.drawBadge;

  const textStyle =
    match.result === "Win"
      ? styles.winText
      : match.result === "Loss"
        ? styles.lossText
        : styles.drawText;

  const resultLabel =
    match.result === "Win"
      ? winLabel
      : match.result === "Loss"
        ? lossLabel
        : drawLabel;

  return (
    <View style={styles.matchCard}>
      <View style={styles.matchLeft}>
        <View style={[styles.avatarCircle, avatarStyle]}>
          <Text style={styles.avatarText}>{match.avatar}</Text>
        </View>
        <View style={styles.matchInfo}>
          <Text style={styles.opponentName}>
            {isTournament ? match.tournamentName : `${vsLabel} ${match.opponent}`}
          </Text>
          <Text style={styles.matchGame}>{match.game}</Text>
        </View>
      </View>
      <View style={styles.matchRight}>
        <View style={[styles.resultBadge, badgeStyle]}>
          <Text style={[styles.resultText, textStyle]}>{resultLabel}</Text>
        </View>
        <Text style={styles.matchScore}>{match.score}</Text>
        <Text style={styles.matchDate}>{match.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  matchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(3.5),
    marginBottom: hp(1.5),
  },
  matchLeft: { flexDirection: "row", alignItems: "center", gap: wp(3) },
  avatarCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: "center",
    alignItems: "center",
  },
  winAvatar: { backgroundColor: "rgba(74, 222, 128, 0.2)" },
  lossAvatar: { backgroundColor: "rgba(248, 113, 113, 0.2)" },
  drawAvatar: { backgroundColor: "rgba(251, 191, 36, 0.2)" },
  avatarText: { color: "#fff", fontSize: fontScale(18), fontWeight: "700" },
  matchInfo: { gap: hp(0.5) },
  opponentName: { color: "#fff", fontSize: fontScale(15), fontWeight: "600" },
  matchGame: { color: "#a0a0a0", fontSize: fontScale(12) },
  matchRight: { alignItems: "flex-end", gap: hp(0.5) },
  resultBadge: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
  },
  winBadge: { backgroundColor: "rgba(74, 222, 128, 0.2)" },
  lossBadge: { backgroundColor: "rgba(248, 113, 113, 0.2)" },
  drawBadge: { backgroundColor: "rgba(251, 191, 36, 0.2)" },
  resultText: { fontSize: fontScale(12), fontWeight: "700" },
  winText: { color: "#4ade80" },
  lossText: { color: "#f87171" },
  drawText: { color: "#fbbf24" },
  matchScore: { color: "#e0e0e0", fontSize: fontScale(14), fontWeight: "600" },
  matchDate: { color: "#707070", fontSize: fontScale(11) },
});
