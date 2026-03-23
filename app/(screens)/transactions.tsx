import BackButton from "@/app/components/BackButton";
import ScreenBackground from "@/app/components/ScreenBackground";
import TransactionCard from "@/app/components/TransactionCard";
import { useTranslation } from "@/lib/context/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transactions() {
  const { t } = useTranslation();
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

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text style={styles.headerTitle}>{t("all_transactions")}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
          <View style={{ height: hp(12) }} />
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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  headerTitle: { fontSize: fontScale(20), fontWeight: "700", color: "#fff" },
  placeholder: { width: wp(12) },
  scrollContent: { paddingHorizontal: wp(5), paddingBottom: hp(2.5) },
});
