import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

export default function Transactions() {
  const transactions = [
    {
      id: 1,
      type: "win",
      game: "Chess Battle",
      amount: 2500,
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "deposit",
      game: "MTN Mobile Money",
      amount: 5000,
      date: "5 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "loss",
      game: "Ludo Match",
      amount: -1000,
      date: "1 day ago",
      status: "completed",
    },
    {
      id: 4,
      type: "win",
      game: "Puzzle Challenge",
      amount: 500,
      date: "1 day ago",
      status: "completed",
    },
    {
      id: 5,
      type: "withdraw",
      game: "Orange Money",
      amount: -3000,
      date: "2 days ago",
      status: "pending",
    },
    {
      id: 6,
      type: "bonus",
      game: "Referral Bonus",
      amount: 1200,
      date: "3 days ago",
      status: "completed",
    },
    {
      id: 7,
      type: "deposit",
      game: "Bank Transfer",
      amount: 10000,
      date: "4 days ago",
      status: "completed",
    },
    {
      id: 8,
      type: "withdraw",
      game: "MTN Mobile Money",
      amount: -5000,
      date: "5 days ago",
      status: "completed",
    },
    {
      id: 9,
      type: "win",
      game: "Pool Tournament",
      amount: 3000,
      date: "6 days ago",
      status: "completed",
    },
    {
      id: 10,
      type: "loss",
      game: "Card Game",
      amount: -1500,
      date: "1 week ago",
      status: "completed",
    },
    {
      id: 11,
      type: "bonus",
      game: "Daily Login",
      amount: 200,
      date: "1 week ago",
      status: "completed",
    },
    {
      id: 12,
      type: "deposit",
      game: "Orange Money",
      amount: 2500,
      date: "1 week ago",
      status: "completed",
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "win":
        return "trophy";
      case "loss":
        return "close-circle";
      case "deposit":
        return "arrow-down-circle";
      case "withdraw":
        return "arrow-up-circle";
      case "bonus":
        return "gift";
      default:
        return "cash";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "win":
        return "#22c55e";
      case "loss":
        return "#ef4444";
      case "deposit":
        return "#3a6fe9";
      case "withdraw":
        return "#f59e0b";
      case "bonus":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={fontScale(24)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Transactions</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                activeOpacity={0.7}
              >
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          getTransactionColor(transaction.type) + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={getTransactionIcon(transaction.type) as any}
                      size={fontScale(20)}
                      color={getTransactionColor(transaction.type)}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionGame}>
                      {transaction.game}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {transaction.date}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: transaction.amount > 0 ? "#22c55e" : "#ef4444",
                      },
                    ]}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount} XAF
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          transaction.status === "completed"
                            ? "#22c55e20"
                            : "#f59e0b20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            transaction.status === "completed"
                              ? "#22c55e"
                              : "#f59e0b",
                        },
                      ]}
                    >
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View style={{ height: hp(12) }} />
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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  backButton: {
    padding: wp(2),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: hp(2),
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: "#fff",
  },
  placeholder: {
    width: wp(12),
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2.5),
  },
  transactionCard: {
    backgroundColor: "rgba(42, 42, 42, 0.6)",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(1.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  transactionInfo: {
    flex: 1,
  },
  transactionGame: {
    fontSize: fontScale(15),
    fontWeight: "600",
    color: "#fff",
    marginBottom: hp(0.5),
  },
  transactionDate: {
    fontSize: fontScale(12),
    color: "rgba(255, 255, 255, 0.5)",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: fontScale(16),
    fontWeight: "700",
    marginBottom: hp(0.5),
  },
  statusBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: hp(1.5),
  },
  statusText: {
    fontSize: fontScale(11),
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
