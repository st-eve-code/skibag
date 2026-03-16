import { useTranslation } from "@/lib/I18nContext";
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

const connectedUsers = [
  { rank: 1, name: "ProGamer99", score: 15420, status: "Playing" },
  { rank: 2, name: "NightOwl", score: 14850, status: "Waiting" },
  { rank: 3, name: "ChampionX", score: 13200, status: "Playing" },
  { rank: 4, name: "GameMaster", score: 12100, status: "Waiting" },
  { rank: 5, name: "Speedy", score: 11500, status: "Playing" },
  { rank: 6, name: "CyberNinja", score: 10200, status: "Waiting" },
  { rank: 7, name: "ShadowHunter", score: 9800, status: "Playing" },
  { rank: 8, name: "DragonSlayer", score: 8900, status: "Waiting" },
];

const tournamentData: { [key: string]: any } = {
  "1": {
    id: 1,
    name: "Champions League",
    game: "PUBG Mobile",
    prize: "$5,000",
    players: "64/128",
    status: "Live",
    entry: "$25",
    timeleft: "12 : 30 : 00",
    image: require("@/assets/gameicons/pbg.jpeg"),
    description:
      "The ultimate PUBG Mobile tournament! Compete against the best players worldwide for a massive prize pool.",
  },
  "2": {
    id: 2,
    name: "Weekend Warriors",
    game: "Call of Duty",
    prize: "$2,500",
    players: "32/64",
    status: "Starting Soon",
    entry: "$15",
    timeleft: "24 : 35 : 50",
    image: require("@/assets/gameicons/cod.jpg"),
    description:
      "Join the weekend warriors! Fast-paced COD matches with exciting prizes.",
  },
  "3": {
    id: 3,
    name: "Street Fighter V",
    game: "Fighting Games",
    prize: "$1,000",
    players: "16/32",
    status: "Live",
    entry: "$10",
    timeleft: "34 : 30 : 30",
    image: require("@/assets/gameicons/street.jpeg"),
    description:
      "Prove you're the best fighter! Street Fighter V tournament with top players.",
  },
  "4": {
    id: 4,
    name: "Racing Championship",
    game: "Mario Kart",
    prize: "$3,000",
    players: "24/32",
    status: "Live",
    entry: "$20",
    timeleft: "14 : 50 : 60",
    image: require("@/assets/gameicons/race.jpeg"),
    description:
      "Speed through the competition! Mario Kart championship awaits.",
  },
  "5": {
    id: 5,
    name: "Poker Masters",
    game: "Texas Hold em",
    prize: "$10,000",
    players: "100/200",
    status: "Live",
    entry: "$50",
    image: require("@/assets/gameicons/pocker.jpeg"),
    description:
      "The ultimate poker showdown! Test your skills in Texas Hold'em.",
  },
};

export default function TournamentDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const tournament = tournamentData[id as string];

  if (!tournament) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("tournament_not_found")}</Text>
        <TouchableOpacity
          style={styles.backButtonError}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{t("go_back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleJoinTournament = () => {
    console.log(`Joining tournament: ${tournament.name}`);
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
            {/* Header Section with Game Image */}
            <View style={styles.heroSection}>
              <ImageBackground
                source={tournament.image}
                resizeMode="cover"
                style={{ flex: 1, height: hp(40) }}
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
                  colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.9)"]}
                  style={styles.heroGradient}
                >
                  <View style={styles.tournamentInfo}>
                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>{tournament.status}</Text>
                    </View>
                    <Text style={styles.tournamentName}>{tournament.name}</Text>
                    <Text style={styles.tournamentGame}>{tournament.game}</Text>

                    <View style={styles.prizeRow}>
                      <View style={styles.prizeItem}>
                        <Ionicons
                          name="trophy"
                          size={fontScale(18)}
                          color="#FFD700"
                        />
                        <Text style={styles.prizeText}>{tournament.prize}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Text style={{ color: "white", paddingLeft: 12 }}>
                            {t("time_left")}
                          </Text>
                          <Text style={{ color: "white" }}>
                            {tournament.timeleft}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.prizeItem}>
                        <Ionicons
                          name="people"
                          size={fontScale(18)}
                          color="#4fc3f7"
                        />
                        <Text style={styles.prizeText}>
                          {tournament.players}
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>

            {/* Join Button Section */}
            <View style={styles.joinSection}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={handleJoinTournament}
              >
                <LinearGradient
                  colors={["#dc2626", "#991b1b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.joinButtonGradient}
                >
                  <Ionicons
                    name="play-circle"
                    size={fontScale(24)}
                    color="#fff"
                  />
                  <Text style={styles.joinButtonText}>
                    {t("join_live_tournament")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.entryContainer}>
                <Text style={styles.entryLabel}>{t("entry_fee")}</Text>
                <Text style={styles.entryFee}>{tournament.entry}</Text>
              </View>
            </View>

            {/* Connected Users Section */}
            <View style={styles.playersSection}>
              <View style={styles.playersHeader}>
                <View style={styles.playersTitleRow}>
                  <Ionicons
                    name="people"
                    size={fontScale(20)}
                    color="#4fc3f7"
                  />
                  <Text style={styles.playersTitle}>
                    {t("connected_players")}
                  </Text>
                </View>
                <Text style={styles.playersCount}>
                  {connectedUsers.length} {t("joined")}
                </Text>
              </View>

              <View style={styles.playersList}>
                {connectedUsers.map((player) => (
                  <View key={player.rank} style={styles.playerCard}>
                    <View style={styles.playerLeft}>
                      <View
                        style={[
                          styles.rankBadge,
                          player.rank <= 3 && styles.topRankBadge,
                        ]}
                      >
                        {player.rank <= 3 ? (
                          <Ionicons
                            name="medal"
                            size={fontScale(14)}
                            color={
                              player.rank === 1
                                ? "#FFD700"
                                : player.rank === 2
                                  ? "#C0C0C0"
                                  : "#CD7F32"
                            }
                          />
                        ) : (
                          <Text style={styles.rankNumber}>{player.rank}</Text>
                        )}
                      </View>
                      <View style={styles.playerInfo}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <View
                          style={[
                            styles.statusIndicator,
                            player.status === "Playing"
                              ? styles.playingStatus
                              : styles.waitingStatus,
                          ]}
                        >
                          <Text style={styles.statusIndicatorText}>
                            {player.status === "Playing"
                              ? t("playing")
                              : t("waiting")}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.playerRight}>
                      <Text style={styles.playerScore}>
                        {player.score.toLocaleString()}
                      </Text>
                      <Text style={styles.scoreLabel}>{t("points_short")}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Tournament Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>{t("about_tournament")}</Text>
              <Text style={styles.descriptionText}>
                {tournament.description}
              </Text>
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
    height: hp(40),
    marginHorizontal: -wp(4),
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: wp(4),
    height: "100%",
  },
  tournamentInfo: {
    gap: hp(1),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: hp(1.5),
    alignSelf: "flex-start",
    gap: wp(1.5),
  },
  statusDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: "#4ade80",
  },
  statusText: {
    color: "#4ade80",
    fontSize: fontScale(12),
    fontWeight: "600",
  },
  tournamentName: {
    fontSize: fontScale(28),
    color: "#fff",
    fontWeight: "700",
  },
  tournamentGame: {
    fontSize: fontScale(14),
    color: "rgba(255, 255, 255, 0.7)",
  },
  prizeRow: {
    flexDirection: "row",
    gap: wp(6),
    marginTop: hp(1),
  },
  prizeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
  },
  prizeText: {
    fontSize: fontScale(14),
    color: "#e0e0e0",
    fontWeight: "500",
  },
  joinSection: {
    marginTop: hp(3),
    alignItems: "center",
    gap: hp(1.5),
  },
  joinButton: {
    width: "100%",
    borderRadius: wp(4),
    overflow: "hidden",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  joinButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(6),
  },
  joinButtonText: {
    color: "#fff",
    fontSize: fontScale(16),
    fontWeight: "700",
  },
  entryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  entryLabel: {
    fontSize: fontScale(14),
    color: "#a0a0a0",
  },
  entryFee: {
    fontSize: fontScale(16),
    color: "#4fc3f7",
    fontWeight: "700",
  },
  playersSection: {
    marginTop: hp(3.5),
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(4),
    padding: wp(4),
  },
  playersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  playersTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  playersTitle: {
    fontSize: fontScale(16),
    color: "#fff",
    fontWeight: "600",
  },
  playersCount: {
    fontSize: fontScale(13),
    color: "#a0a0a0",
  },
  playersList: {
    gap: hp(1),
  },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: wp(3),
    padding: wp(3),
  },
  playerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  rankBadge: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  topRankBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
  },
  rankNumber: {
    fontSize: fontScale(14),
    color: "#a0a0a0",
    fontWeight: "700",
  },
  playerInfo: {
    gap: hp(0.3),
  },
  playerName: {
    fontSize: fontScale(14),
    color: "#fff",
    fontWeight: "500",
  },
  statusIndicator: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: hp(1),
    alignSelf: "flex-start",
  },
  playingStatus: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
  },
  waitingStatus: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
  },
  statusIndicatorText: {
    fontSize: fontScale(10),
    color: "#a0a0a0",
    fontWeight: "500",
  },
  playerRight: {
    alignItems: "flex-end",
  },
  playerScore: {
    fontSize: fontScale(16),
    color: "#4fc3f7",
    fontWeight: "700",
  },
  scoreLabel: {
    fontSize: fontScale(10),
    color: "#a0a0a0",
  },
  descriptionSection: {
    marginTop: hp(3.5),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    color: "#fff",
    fontWeight: "600",
    marginBottom: hp(1),
  },
  descriptionText: {
    fontSize: fontScale(13),
    color: "#a0a0a0",
    lineHeight: hp(2.5),
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
    backgroundColor: "#dc2626",
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: hp(2),
  },
  backButtonText: {
    color: "#fff",
    fontSize: fontScale(16),
  },
});
