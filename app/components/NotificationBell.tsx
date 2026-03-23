import { fontScale, hp, wp } from "@/lib/responsive";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationBellProps {
  unreadCount: number;
  onPress: () => void;
}

export default function NotificationBell({
  unreadCount,
  onPress,
}: NotificationBellProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name="notifications" size={fontScale(22)} color="#fff" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -hp(0.5),
    right: -wp(1.5),
    backgroundColor: "rgba(252, 66, 66, 0.96)",
    height: hp(1.8),
    width: hp(1.8),
    borderRadius: hp(0.9),
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: fontScale(9),
    fontWeight: "bold",
  },
});
