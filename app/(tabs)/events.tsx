import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Sample tournament data
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

// Sample match history data
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

export default function events() {
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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Player stats</Text>
              <Button style={styles.leaderboardBtn}>
                <Text style={styles.leaderboardText}>Leaderboard</Text>
              </Button>
            </View>

            {/* Player Stats Section - Your Original Design */}
            <View style={styles.playerStatsSection}>
              <View style={styles.playerImageContainer}>
                <Image
                  source={require("@/assets/badges/cover.png")}
                  style={styles.coverImage}
                />
                <Image
                  source={require("@/assets/badges/child.png")}
                  style={styles.characterImage}
                />
              </View>

              <View style={styles.playerInfo}>
                <Text style={styles.playerRank}>#0023</Text>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>John Doe</Text>
                  <Image
                    source={require("@/assets/ranks/beginner.png")}
                    style={styles.rankBadge}
                  />
                  <Text style={styles.playerScore}>13</Text>
                </View>
                <Text style={styles.playerBio}>
                  Extremely confident and skillfull in every game played so far
                </Text>
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
            </View>

            {/* Live Tournaments Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Live Tournaments</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tournamentScroll}
              >
                {liveTournaments.map((tournament) => (
                  <TouchableOpacity
                    key={tournament.id}
                    style={styles.tournamentCard}
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
                            <Ionicons name="trophy" size={14} color="#FFD700" />
                            <Text style={styles.detailText}>
                              {tournament.prize}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons name="people" size={14} color="#4fc3f7" />
                            <Text style={styles.detailText}>
                              {tournament.players}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.tournamentEntry}>
                          <Text style={styles.entryLabel}>Entry:</Text>
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

            {/* Players Match History Section */}
            <View style={styles.section}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>Match History</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              {matchHistory.map((match) => (
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
                        vs {match.opponent}
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
                        {match.result}
                      </Text>
                    </View>
                    <Text style={styles.matchScore}>{match.score}</Text>
                    <Text style={styles.matchDate}>{match.date}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Bottom padding */}
            <View style={{ height: 30 }} />
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
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600",
  },
  leaderboardBtn: {
    backgroundColor: "rgb(76, 63, 191)",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  leaderboardText: {
    color: "#fff",
    fontSize: 15,
  },
  // Player Stats Section
  playerStatsSection: {
    width: width,
    height: 380,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 45,
  },
  playerImageContainer: {
    position: "relative",
  },
  coverImage: {
    width: 300,
    height: 340,
    position: "relative",
    marginLeft: -80,
    shadowColor: "rgb(153, 0, 255)",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  characterImage: {
    width: 260,
    height: 260,
    position: "absolute",
    top: 150,
    right: 10,
  },
  playerInfo: {
    marginTop: -210,
    marginLeft: -60,
  },
  playerRank: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  playerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 23,
  },
  playerName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
  },
  rankBadge: {
    width: 35,
    height: 35,
  },
  playerScore: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    marginLeft: -10,
  },
  playerBio: {
    color: "#b2b2b2",
    fontSize: 14,
    fontWeight: "400",
    flexWrap: "wrap",
    maxWidth: 230,
    marginTop: 5,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 8,
  },
  badgeIcon: {
    width: 35,
    height: 35,
  },
  winStats: {
    marginTop: 5,
    color: "#43be81e0",
    fontSize: 10,
  },
  statsLoss: {
    color: "#c74b4bdd",
  },
  statsDraw: {
    color: "#4b4b4b",
  },
  // Section Styles
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    color: "rgb(255, 255, 255)",
    fontWeight: "600",
    marginBottom: 18,
  },
  // Tournament Styles
  tournamentScroll: {
    gap: 15,
    paddingRight: 20,
    paddingBottom: 15,
  },
  tournamentCard: {
    width: 180,
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 15,
  },
  tournamentImage: {
    flex: 1,
  },
  tournamentImageStyle: {
    borderRadius: 16,
  },
  tournamentGradient: {
    flex: 1,
    justifyContent: "space-between",
    padding: 12,
  },
  tournamentStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveDot: {
    backgroundColor: "#4ade80",
  },
  soonDot: {
    backgroundColor: "#fbbf24",
  },
  tournamentStatus: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  tournamentName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: "auto",
  },
  tournamentGame: {
    color: "#a0a0a0",
    fontSize: 12,
    marginTop: 2,
  },
  tournamentDetails: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    color: "#e0e0e0",
    fontSize: 12,
    fontWeight: "500",
  },
  tournamentEntry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  entryLabel: {
    color: "#a0a0a0",
    fontSize: 11,
  },
  entryFee: {
    color: "#4fc3f7",
    fontSize: 13,
    fontWeight: "700",
  },
  // Match History Styles
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  viewAllButton: {
    backgroundColor: "rgba(78, 78, 78, 0.4)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 13,
    color: "#eaeaea",
    fontWeight: "500",
  },
  matchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  matchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 18,
    fontWeight: "700",
  },
  matchInfo: {
    gap: 4,
  },
  opponentName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  matchGame: {
    color: "#a0a0a0",
    fontSize: 12,
  },
  matchRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  resultBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
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
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: "600",
  },
  matchDate: {
    color: "#707070",
    fontSize: 11,
  },
});
