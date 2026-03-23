import NotificationBell from "@/app/components/NotificationBell";
import TransactionCard from "@/app/components/TransactionCard";
import { useTranslation } from "@/lib/context/I18nContext";
import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Clipboard,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  const { t } = useTranslation();
  const [balance] = useState(5000);
  const [bonusBalance] = useState(1200);
  const [userName] = useState("John");
  const [showModal, setShowModal] = useState(false);
  const [choice, setChoice] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [cardId] = useState("4532 8910 2234 5678");

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
  ];

  const handleModal = (type: string) => {
    setShowModal(true);
    setChoice(type);
    setAmount("");
    setRecipient("");
  };

  const closeModal = () => {
    setShowModal(false);
    setChoice("");
    setAmount("");
    setRecipient("");
  };

  const handleSubmit = () => {
    console.log(`${choice} - Amount: ${amount}, Recipient: ${recipient}`);
    closeModal();
  };

  const copyToClipboard = async () => {
    await Clipboard.setString(cardId);
    alert("Account ID copied to clipboard!");
  };

  const quickActions = [
    { id: 1, title: t("deposit"), icon: "add-circle", color: "#3a6fe9" },
    { id: 2, title: t("withdraw"), icon: "cash", color: "#22c55e" },
    { id: 3, title: t("history"), icon: "time", color: "#f59e0b" },
    { id: 4, title: t("transfer"), icon: "swap-horizontal", color: "#8b5cf6" },
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
            <View>
              <Text style={styles.greetingText}>
                {t("hello_user").replace("{name}", userName)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push("/notifications")}
            >
              <NotificationBell unreadCount={3} onPress={() => router.push("/notifications")} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.balanceCardContainer}>
              <LinearGradient
                colors={["#3a6fe9", "#5b8ef7", "#3a6fe9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}
              >
                <View style={styles.circleDecor1} />
                <View style={styles.circleDecor2} />

                <View style={styles.balanceContent}>
                  <View style={styles.balanceHeader}>
                    <View style={styles.walletTitleContainer}>
                      <Ionicons
                        name="wallet"
                        size={fontScale(28)}
                        color="#fff"
                      />
                      <Text style={styles.walletTitle}>{t("my_wallet")}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowBalance(!showBalance)}
                    >
                      <Ionicons
                        name={showBalance ? "eye" : "eye-off"}
                        size={fontScale(20)}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.balanceLabel}>
                    {t("available_balance")}
                  </Text>

                  <View style={styles.balanceAmount}>
                    <Text style={styles.balanceNumber}>
                      {showBalance ? balance.toLocaleString() : "••••••"}
                    </Text>
                    <Text style={styles.currencySymbol}>
                      {showBalance ? "XAF" : "••••"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.cardIdRow}
                    onPress={copyToClipboard}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="card"
                      size={fontScale(14)}
                      color="rgba(255, 255, 255, 0.7)"
                    />
                    <Text style={styles.cardIdText}>
                      {showBalance ? cardId : "•••• •••• •••• ••••"}
                    </Text>
                    <Ionicons
                      name="copy"
                      size={fontScale(14)}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </TouchableOpacity>

                  <View style={styles.footerRow}>
                    <View style={styles.bonusChip}>
                      <Ionicons
                        name="gift"
                        size={fontScale(14)}
                        color="#fbbf24"
                      />
                      <Text style={styles.bonusText}>
                        {t("bonus")}: {bonusBalance} XAF
                      </Text>
                    </View>
                    <Text style={styles.validThru}>
                      {t("valid_thru")}: 12/28
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>{t("quick_actions")}</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.actionCard}
                    activeOpacity={0.7}
                    onPress={() => handleModal(action.title)}
                  >
                    <View
                      style={[
                        styles.actionIcon,
                        { backgroundColor: action.color + "20" },
                      ]}
                    >
                      <Ionicons
                        name={action.icon as any}
                        size={fontScale(24)}
                        color={action.color}
                      />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {showModal && (
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalTitleRow}>
                      <Ionicons
                        name={
                          choice === t("deposit")
                            ? "add-circle"
                            : choice === t("withdraw")
                              ? "cash"
                              : choice === t("history")
                                ? "time"
                                : "swap-horizontal"
                        }
                        size={fontScale(28)}
                        color={
                          choice === t("deposit")
                            ? "#3a6fe9"
                            : choice === t("withdraw")
                              ? "#22c55e"
                              : choice === t("history")
                                ? "#f59e0b"
                                : "#8b5cf6"
                        }
                      />
                      <Text style={styles.modalTitle}>{choice}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={styles.closeButton}
                    >
                      <Ionicons
                        name="close"
                        size={fontScale(24)}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>

                  <Image
                    source={require("@/assets/badges/child.png")}
                    style={styles.modalImage}
                  />

                  {choice === t("deposit") && (
                    <View style={styles.inputContainer}>
                      {/* Payment Method Selection */}
                      <Text style={styles.inputLabel}>
                        {t("payment_method")}
                      </Text>
                      <View style={styles.paymentOptions}>
                        <TouchableOpacity
                          style={[
                            styles.paymentOption,
                            selectedPayment === "mtn" &&
                              styles.paymentOptionSelected,
                          ]}
                          onPress={() => setSelectedPayment("mtn")}
                        >
                          <Text
                            style={[
                              styles.paymentOptionText,
                              selectedPayment === "mtn" &&
                                styles.paymentOptionTextSelected,
                            ]}
                          >
                            MTN
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.paymentOption,
                            selectedPayment === "orange" &&
                              styles.paymentOptionSelected,
                          ]}
                          onPress={() => setSelectedPayment("orange")}
                        >
                          <Text
                            style={[
                              styles.paymentOptionText,
                              selectedPayment === "orange" &&
                                styles.paymentOptionTextSelected,
                            ]}
                          >
                            Orange
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Phone Number */}
                      <Text style={styles.inputLabel}>{t("phone_number")}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={t("phone_number")}
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />

                      {/* Amount */}
                      <Text style={styles.inputLabel}>{t("enter_amount")}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                      />
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.submitButtonText}>
                          {t("deposit_now")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {choice === t("withdraw") && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{t("withdraw_now")}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                      />
                      <TouchableOpacity
                        style={[
                          styles.submitButton,
                          { backgroundColor: "#22c55e" },
                        ]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.submitButtonText}>
                          {t("withdraw_now")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {choice === t("history") && (
                    <TouchableOpacity
                      style={styles.fullScreenButton}
                      onPress={() => {
                        closeModal();
                        router.push("/transactions");
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="time"
                        size={fontScale(40)}
                        color="#f59e0b"
                      />
                      <Text style={styles.fullScreenButtonText}>
                        {t("view_all_transactions")}
                      </Text>
                      <Text style={styles.fullScreenButtonSubtext}>
                        {t("tap_see_history")}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {choice === t("transfer") && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{t("account_id")}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={t("enter_account_id")}
                        placeholderTextColor="#666"
                        value={recipient}
                        onChangeText={setRecipient}
                      />
                      <Text style={styles.inputLabel}>{t("enter_amount")}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                      />
                      <TouchableOpacity
                        style={[
                          styles.submitButton,
                          { backgroundColor: "#8b5cf6" },
                        ]}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.submitButtonText}>
                          {t("transfer_now")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.transactionsContainer}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.sectionTitle}>
                  {t("recent_transactions")}
                </Text>
                <TouchableOpacity onPress={() => router.push("/transactions")}>
                  <Text style={styles.viewAllText}>{t("view_all")}</Text>
                </TouchableOpacity>
              </View>

              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </View>

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
  greetingText: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: "#fff",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -hp(0.5),
    right: -wp(1),
    backgroundColor: "#ef4444",
    borderRadius: hp(1.2),
    width: hp(2.2),
    height: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontSize: fontScale(10),
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2.5),
  },
  balanceCardContainer: {
    marginBottom: hp(3),
  },
  balanceCard: {
    borderRadius: wp(5),
    padding: wp(6),
    position: "relative",
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#3a6fe9",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: hp(1),
  },
  circleDecor1: {
    position: "absolute",
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -hp(5),
    right: -wp(5),
  },
  circleDecor2: {
    position: "absolute",
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: -hp(2.5),
    left: -wp(2.5),
  },
  balanceContent: {
    zIndex: 1,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2.5),
  },
  walletTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
  },
  walletTitle: {
    fontSize: fontScale(18),
    fontWeight: "700",
    color: "#fff",
  },
  eyeButton: {
    padding: wp(2),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: hp(2.5),
  },
  balanceLabel: {
    fontSize: fontScale(13),
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: hp(1),
  },
  balanceAmount: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: hp(2),
  },
  balanceNumber: {
    fontSize: fontScale(42),
    fontWeight: "800",
    color: "#fff",
    marginRight: wp(2),
  },
  currencySymbol: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  cardIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    marginTop: hp(1),
  },
  cardIdText: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2),
  },
  validThru: {
    fontSize: fontScale(12),
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  bonusRow: {
    flexDirection: "row",
  },
  bonusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(2.5),
  },
  bonusText: {
    color: "#fff",
    fontSize: fontScale(13),
    fontWeight: "600",
  },
  quickActionsContainer: {
    marginBottom: hp(3.5),
  },
  sectionTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: "#fff",
    marginBottom: hp(2),
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: wp(3),
  },
  actionCard: {
    width: "48%",
    backgroundColor: "rgba(42, 42, 42, 0.6)",
    borderRadius: wp(4),
    padding: wp(5),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  actionIcon: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  actionTitle: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: "#fff",
  },
  transactionsContainer: {
    marginBottom: hp(2.5),
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  viewAllText: {
    fontSize: fontScale(14),
    color: "#3a6fe9",
    fontWeight: "600",
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
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(12, 12, 12, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(5),
    zIndex: 100,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "rgba(42, 42, 42, 0.95)",
    borderRadius: wp(5),
    padding: wp(6),
    borderWidth: 1,
    top: -350,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  modalTitle: {
    fontSize: fontScale(24),
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    padding: wp(2),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: hp(2),
  },
  modalImage: {
    width: wp(40),
    height: wp(40),
    position: "absolute",
    top: -hp(15),
    right: -wp(-21),
    opacity: 1,
  },
  inputContainer: {
    marginTop: hp(2),
  },
  inputLabel: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: "#fff",
    marginBottom: hp(1),
    marginTop: hp(2),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: wp(3),
    padding: wp(4),
    color: "#fff",
    fontSize: fontScale(16),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  submitButton: {
    backgroundColor: "#3a6fe9",
    borderRadius: wp(3),
    padding: wp(4),
    alignItems: "center",
    marginTop: hp(3),
  },
  submitButtonText: {
    color: "#fff",
    fontSize: fontScale(16),
    fontWeight: "700",
  },
  historyContainer: {
    marginTop: hp(2),
    maxHeight: hp(50),
  },
  historyScroll: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  historyGame: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: "#fff",
  },
  historyDate: {
    fontSize: fontScale(11),
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: hp(0.3),
  },
  historyAmount: {
    fontSize: fontScale(15),
    fontWeight: "700",
  },
  fullScreenButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: wp(4),
    padding: wp(6),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(3),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderStyle: "dashed",
  },
  fullScreenButtonText: {
    fontSize: fontScale(18),
    fontWeight: "700",
    color: "#fff",
    marginTop: hp(2),
  },
  fullScreenButtonSubtext: {
    fontSize: fontScale(13),
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: hp(1),
  },
  // Payment Options Styles
  paymentOptions: {
    flexDirection: "row",
    gap: wp(3),
    marginBottom: hp(2),
  },
  paymentOption: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: wp(3),
    padding: wp(4),
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  paymentOptionSelected: {
    borderColor: "#3a6fe9",
    backgroundColor: "rgba(58, 111, 233, 0.2)",
  },
  paymentOptionText: {
    color: "#a0a0a0",
    fontSize: fontScale(16),
    fontWeight: "600",
  },
  paymentOptionTextSelected: {
    color: "#3a6fe9",
  },
});
