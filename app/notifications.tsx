import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const notifications = [
  {
    id: 1,
    type: "bonus",
    title: "Bonus Available!",
    message: "You have a 100% bonus waiting for you. Claim now!",
    time: "2h ago",
    read: false,
  },
  {
    id: 2,
    type: "game",
    title: "New Game Added",
    message: "Check out our newest game - Blood Island",
    time: "5h ago",
    read: false,
  },
  {
    id: 3,
    type: "system",
    title: "Maintenance Complete",
    message: "The servers are back online. Enjoy your games!",
    time: "1d ago",
    read: true,
  },
  {
    id: 4,
    type: "promo",
    title: "Weekend Special",
    message: "Get double rewards this weekend only",
    time: "2d ago",
    read: true,
  },
  {
    id: 5,
    type: "system",
    title: "Account Update",
    message: "Your account has been verified successfully",
    time: "3d ago",
    read: true,
  },
];

export default function Notifications() {
  const router = useRouter();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bonus":
        return { name: "gift", color: "#FFD700" };
      case "game":
        return { name: "game-controller", color: "#3a7be4" };
      case "promo":
        return { name: "pricetag", color: "#ff6b6b" };
      default:
        return { name: "notifications", color: "#a0a0a0" };
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
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={fontScale(24)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {notifications.map((notification) => {
              const icon = getNotificationIcon(notification.type);
              return (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.notificationUnread,
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: icon.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={icon.name as any}
                      size={fontScale(22)}
                      color={icon.color}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                </View>
              );
            })}

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
  clearButton: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
  },
  clearText: {
    color: "#3a7be4",
    fontSize: fontScale(14),
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    borderRadius: wp(3),
    padding: wp(3),
    marginBottom: wp(3),
  },
  notificationUnread: {
    backgroundColor: "rgba(59, 132, 226, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(59, 132, 226, 0.3)",
  },
  iconContainer: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(0.5),
  },
  notificationTitle: {
    fontSize: fontScale(15),
    color: "#fff",
    fontWeight: "600",
  },
  unreadDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: "#3a7be4",
  },
  notificationMessage: {
    fontSize: fontScale(13),
    color: "#a0a0a0",
    lineHeight: hp(2),
    marginBottom: hp(0.5),
  },
  notificationTime: {
    fontSize: fontScale(11),
    color: "#7c7c7c",
  },
});
