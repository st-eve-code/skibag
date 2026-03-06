import { Platform } from "react-native";
import { supabase } from "./supabase";

// Conditional import — Notifee requires a native build
let notifee: any;
let AndroidImportance: any;
let EventType: any;

try {
  const notifeeModule = require("@notifee/react-native");
  notifee = notifeeModule.default;
  AndroidImportance = notifeeModule.AndroidImportance;
  EventType = notifeeModule.EventType;
} catch (error) {
  console.warn(
    "Notifee not available — local notifications require a native build.",
  );
}

// ─── Request notification permissions ────────────────────────────────────────
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (notifee && notifee.requestPermission) {
      await notifee.requestPermission();
    }
    return true;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

// ─── Create Android notification channel ─────────────────────────────────────
export const createNotificationChannel = async (): Promise<void> => {
  if (!notifee || Platform.OS !== "android") return;
  try {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance?.HIGH ?? 4,
    });
  } catch (error) {
    console.error("Error creating notification channel:", error);
  }
};

// ─── Display a local notification ────────────────────────────────────────────
export const displayLocalNotification = async (
  title: string,
  body: string,
): Promise<void> => {
  if (!notifee) {
    console.warn("Notifee not available — cannot display notification");
    return;
  }
  try {
    await createNotificationChannel();
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: "default",
        smallIcon: "ic_launcher",
        pressAction: { id: "default" },
      },
    });
  } catch (error) {
    console.error("Error displaying notification:", error);
  }
};

// ─── Save notification record to Supabase ────────────────────────────────────
export const saveNotificationRecord = async (
  userId: string,
  title: string,
  body: string,
  type?: string,
): Promise<void> => {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      title,
      body,
      type: type ?? "general",
    });
  } catch (error) {
    console.error("Error saving notification record:", error);
  }
};

// ─── Get user notifications from Supabase ────────────────────────────────────
export const getUserNotifications = async (limit: number = 30) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
};

// ─── Mark notification as read ────────────────────────────────────────────────
export const markNotificationRead = async (
  notificationId: string,
): Promise<void> => {
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
};

// ─── Send referral notification (local + DB record) ──────────────────────────
export const sendReferralNotification = async (
  referrerId: string,
  newUserName: string,
): Promise<void> => {
  const title = "🎉 New Referral!";
  const body = `${newUserName} joined using your referral code. You earned 100 points!`;

  await saveNotificationRecord(referrerId, title, body, "referral");
  await displayLocalNotification(title, body);
};

// ─── Initialize notifications on app start ───────────────────────────────────
export const initializeNotifications = async (): Promise<void> => {
  await requestNotificationPermission();
  await createNotificationChannel();

  // Listen for Notifee foreground events
  if (notifee && EventType) {
    notifee.onForegroundEvent(
      ({ type, detail }: { type: any; detail: any }) => {
        if (type === EventType.PRESS) {
          console.log("Notification pressed:", detail.notification);
        }
      },
    );
  }
};
