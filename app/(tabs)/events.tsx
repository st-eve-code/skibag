import MatchCard from "@/app/components/MatchCard";
import { useTranslation } from "@/lib/context/I18nContext";
import { useUser } from "@/lib/context/userContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const liveTournaments = [
  {
    id: 1,
    name: "Champions League",
    game: "PUBG Mobile",
    prize: "$5,000",
    players: "64/128",
    status: "Live",
    entry: "$25",
    image: require("@/assets/gameicons/pbg.jpeg"),
  },
  {
    id: 2,
    name: "Weekend Warriors",
    game: "Call of Duty",
    prize: "$2,500",
    players: "32/64",
    status: "Starting Soon",
    entry: "$15",
    image: require("@/assets/gameicons/cod.jpg"),
  },
  {
    id: 3,
    name: "Street Fighter V",
    game: "Fighting Games",
    prize: "$1,000",
    players: "16/32",
    status: "Live",
    entry: "$10",
    image: require("@/assets/gameicons/street.jpeg"),
  },
  {
    id: 4,
    name: "Racing Championship",
    game: "Mario Kart",
    prize: "$3,000",
    players: "24/32",
    status: "Live",
    entry: "$20",
    image: require("@/assets/gameicons/race.jpeg"),
  },
  {
    id: 5,
    name: "Poker Masters",
    game: "Texas Hold em",
    prize: "$10,000",
    players: "100/200",
    status: "Live",
    entry: "$50",
    image: require("@/assets/gameicons/pocker.jpeg"),
  },
];

const matchHistory = [
  {
    id: 1,
    opponent: "PlayerOne",
    game: "PUBG Mobile",
    result: "Win",
    score: "12/5",
    date: "2h ago",
    avatar: "P",
  },
  {
    id: 2,
    opponent: "ProGamer99",
    game: "Call of Duty",
    result: "Loss",
    score: "8/12",
    date: "5h ago",
    avatar: "P",
  },
  {
    id: 3,
    opponent: "ChampionX",
    game: "Ludo",
    result: "Win",
    score: "W",
    date: "1d ago",
    avatar: "C",
  },
  {
    id: 4,
    opponent: "GameMaster",
    game: "Domino",
    result: "Draw",
    score: "D",
    date: "2d ago",
    avatar: "G",
  },
  {
    id: 5,
    opponent: "ShadowRider",
    game: "Street Fighter",
    result: "Win",
    score: "3/1",
    date: "3d ago",
    avatar: "S",
  },
];

export default function Events() {
  const router = useRouter();
  const { userData } = useUser();
  const { t } = useTranslation();

  // Helper function to get rank badge image
  const getRankBadge = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "legend":
        return require("@/assets/ranks/legend.png");
      case "pro":
        return require("@/assets/ranks/pro.png");
      case "advanced":
        return require("@/assets/ranks/advanced.png");
      case "intermediate":
        return require("@/assets/ranks/inter.png");
      case "beginner":
      default:
        return require("@/assets/ranks/beginner.png");
    }
  };

  const handleTournamentPress = (tournamentId: number) => {
    router.push(`/tournament/${tournamentId}`);
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
        <SafeAreaView style={styles.container} edges={["top"]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{t("Events")}</Text>
              <TouchableOpacity
                style={styles.leaderboardBtn}
                onPress={() => router.push("/leaderboard")}
              >
                <ImageBackground
                  source={require("@/assets/images/crimson.png")}
                  style={styles.leaderboardBackground}
                  imageStyle={styles.leaderboardImageStyle}
                >
                  <Text style={styles.leaderboardText}>{t("leaderboard")}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.playerStatsSection}>
              <View style={styles.playerImageContainer}>
                {userData.avatarUri ? (
                  <Image
                    source={{ uri: userData.avatarUri }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <>
                    <Image
                      source={require("@/assets/badges/cover.png")}
                      style={styles.coverImage}
                    />
                    <Image
                      source={require("@/assets/badges/child.png")}
                      style={styles.characterImage}
                    />
                  </>
                )}
              </View>

              <View style={styles.playerInfo}>
                <Text style={styles.playerRank}>
                  #{userData.score.toString().padStart(4, "0")}
                </Text>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>
                    {userData.username || "Player"}
                  </Text>
                  <Image
                    source={getRankBadge(userData.rank)}
                    style={styles.rankBadge}
                  />
                  <Text style={styles.playerScore}>{userData.score}</Text>
                </View>
                <Text style={styles.playerBio}>{t("player_bio")}</Text>
                <View style={styles.badgesRow}>
                  <Image
                    source={require("@/assets/badges/flame.png")}
                    style={styles.badgeIcon}
                  />
                  <Image
                    source={require("@/assets/badges/eye.png")}
                    style={styles.badgeIcon}
                  />
                  <Image
                    source={require("@/assets/badges/coin.png")}
                    style={styles.badgeIcon}
                  />
                </View>
                <Text style={styles.winStats}>
                  8 Wins / <Text style={styles.statsLoss}>2 Loss /</Text>
                  <Text style={styles.statsDraw}> 1 Draws</Text>
                </Text>
              </View>
            </View> */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("live_tournaments")}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tournamentScroll}
              >
                {liveTournaments.map((tournament) => (
                  <TouchableOpacity
                    key={tournament.id}
                    style={styles.tournamentCard}
                    onPress={() => handleTournamentPress(tournament.id)}
                  >
                    <ImageBackground
                      source={tournament.image}
                      style={styles.tournamentImage}
                      imageStyle={styles.tournamentImageStyle}
                    >
                      <LinearGradient
                        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.9)"]}
                        style={styles.tournamentGradient}
                      >
                        <View style={styles.tournamentStatusBadge}>
                          <View
                            style={[
                              styles.statusDot,
                              tournament.status === "Live"
                                ? styles.liveDot
                                : styles.soonDot,
                            ]}
                          />
                          <Text style={styles.tournamentStatus}>
                            {tournament.status}
                          </Text>
                        </View>
                        <Text style={styles.tournamentName}>
                          {tournament.name}
                        </Text>
                        <Text style={styles.tournamentGame}>
                          {tournament.game}
                        </Text>
                        <View style={styles.tournamentDetails}>
                          <View style={styles.detailItem}>
                            <Ionicons
                              name="trophy"
                              size={fontScale(14)}
                              color="#FFD700"
                            />
                            <Text style={styles.detailText}>
                              {tournament.prize}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons
                              name="people"
                              size={fontScale(14)}
                              color="#4fc3f7"
                            />
                            <Text style={styles.detailText}>
                              {tournament.players}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.tournamentEntry}>
                          <Text style={styles.entryLabel}>{t("entry")}</Text>
                          <Text style={styles.entryFee}>
                            {tournament.entry}
                          </Text>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>
                  {t("match_history_title")}
                </Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => router.push("/match-history")}
                >
                  <Text style={styles.viewAllText}>{t("view_all")}</Text>
                </TouchableOpacity>
              </View>

              {matchHistory.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  vsLabel={t("vs")}
                  winLabel={t("win")}
                  lossLabel={t("loss")}
                  drawLabel={t("draw")}
                />
              ))}
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
  scrollContent: {
    paddingHorizontal: wp(4.5),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(3.5),
  },
  headerTitle: {
    fontSize: fontScale(20),
    color: "#ffffff",
    fontWeight: "600",
  },
  leaderboardBtn: {
    overflow: "hidden",
    borderRadius: 8,
    width: wp(40),
    height: hp(5.5),
  },
  leaderboardBackground: {
    flex: 1,
    top: -15,
    left: 0,
    width: "100%",
    height: "180%",
    justifyContent: "center",
    alignItems: "center",
  },
  leaderboardImageStyle: {
    borderRadius: 3,
    resizeMode: "stretch",
  },
  leaderboardText: {
    color: "#fff",
    fontSize: fontScale(14),
    fontWeight: "600",
    top: 16,
  },
  playerStatsSection: {
    width: "100%",
    height: hp(48),
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(5.5),
  },
  playerImageContainer: {
    position: "relative",
  },
  coverImage: {
    width: wp(75),
    height: hp(42),
    position: "relative",
    marginLeft: -wp(25),
    shadowColor: "rgb(153, 0, 255)",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: hp(0.5) },
  },
  characterImage: {
    width: wp(65),
    height: hp(32),
    position: "absolute",
    top: hp(18),
    right: wp(2.5),
  },
  avatarImage: {
    width: wp(65),
    height: hp(32),
    position: "absolute",
    top: hp(18),
    right: wp(2.5),
    borderRadius: wp(32),
  },
  playerInfo: {
    marginTop: -hp(26),
    marginLeft: -wp(8),
  },
  playerRank: {
    color: "#fff",
    fontSize: fontScale(15),
    fontWeight: "500",
  },
  playerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5.5),
  },
  playerName: {
    color: "#fff",
    fontSize: fontScale(28),
    fontWeight: "600",
  },
  rankBadge: {
    width: wp(8.5),
    height: wp(8.5),
  },
  playerScore: {
    color: "#fff",
    fontSize: fontScale(20),
    fontWeight: "500",
    marginLeft: -wp(4),
  },
  playerBio: {
    color: "#b2b2b2",
    fontSize: fontScale(12),
    fontWeight: "400",
    flexWrap: "wrap",
    maxWidth: wp(52),
    marginTop: hp(0.6),
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.5),
    marginTop: hp(1),
  },
  badgeIcon: {
    width: wp(8.5),
    height: wp(8.5),
  },
  winStats: {
    marginTop: hp(0.6),
    color: "#43be81e0",
    fontSize: fontScale(10),
  },
  statsLoss: {
    color: "#c74b4bdd",
  },
  statsDraw: {
    color: "#4b4b4b",
  },
  section: {
    marginBottom: hp(5),
  },
  sectionTitle: {
    fontSize: fontScale(22),
    color: "rgb(255, 255, 255)",
    fontWeight: "600",
    marginBottom: hp(2.2),
  },
  tournamentScroll: {
    gap: wp(3.5),
    paddingRight: wp(5),
    paddingBottom: hp(2),
  },
  tournamentCard: {
    width: wp(60),
    height: hp(30),
    borderRadius: wp(4),
    overflow: "hidden",
    marginRight: wp(2),
  },
  tournamentImage: {
    flex: 1,
  },
  tournamentImageStyle: {
    borderRadius: wp(4),
  },
  tournamentGradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: wp(3),
  },
  tournamentStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
    gap: wp(1.5),
  },
  statusDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
  },
  liveDot: {
    backgroundColor: "#4ade80",
  },
  soonDot: {
    backgroundColor: "#fbbf24",
  },
  tournamentStatus: {
    color: "#fff",
    fontSize: fontScale(11),
    fontWeight: "600",
  },
  tournamentName: {
    color: "#fff",
    fontSize: fontScale(16),
    fontWeight: "700",
    marginTop: "auto",
  },
  tournamentGame: {
    color: "#a0a0a0",
    fontSize: fontScale(12),
    marginTop: hp(0.25),
  },
  tournamentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(3),
    marginTop: hp(1),
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: wp(2),
  },
  detailText: {
    color: "#e0e0e0",
    fontSize: fontScale(12),
    fontWeight: "500",
  },
  tournamentEntry: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    marginTop: hp(0.75),
  },
  entryLabel: {
    color: "#a0a0a0",
    fontSize: fontScale(11),
  },
  entryFee: {
    color: "#4fc3f7",
    fontSize: fontScale(13),
    fontWeight: "700",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2.2),
  },
  viewAllButton: {
    backgroundColor: "rgba(78, 78, 78, 0.4)",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: hp(2.5),
  },
  viewAllText: {
    fontSize: fontScale(13),
    color: "#eaeaea",
    fontWeight: "500",
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
