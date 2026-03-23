import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Transaction {
  id: number;
  type: string;
  game: string;
  amount: number;
  date: string;
  status: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "win": return "trophy";
    case "loss": return "close-circle";
    case "deposit": return "arrow-down-circle";
    case "withdraw": return "arrow-up-circle";
    case "bonus": return "gift";
    default: return "cash";
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case "win": return "#22c55e";
    case "loss": return "#ef4444";
    case "deposit": return "#3a6fe9";
    case "withdraw": return "#f59e0b";
    case "bonus": return "#8b5cf6";
    default: return "#6b7280";
  }
};

export default function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const color = getTransactionColor(transaction.type);
  const icon = getTransactionIcon(transaction.type);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress?.(transaction)}
    >
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon as any} size={fontScale(20)} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.game}>{transaction.game}</Text>
          <Text style={styles.date}>{transaction.date}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: transaction.amount > 0 ? "#22c55e" : "#ef4444" }]}>
          {transaction.amount > 0 ? "+" : ""}
          {transaction.amount} XAF
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                transaction.status === "completed" ? "#22c55e20" : "#f59e0b20",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  transaction.status === "completed" ? "#22c55e" : "#f59e0b",
              },
            ]}
          >
            {transaction.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  info: { flex: 1 },
  game: { fontSize: fontScale(15), fontWeight: "600", color: "#fff", marginBottom: hp(0.5) },
  date: { fontSize: fontScale(12), color: "rgba(255, 255, 255, 0.5)" },
  right: { alignItems: "flex-end" },
  amount: { fontSize: fontScale(16), fontWeight: "700", marginBottom: hp(0.5) },
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
