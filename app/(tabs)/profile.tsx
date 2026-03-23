import { Avatar } from "@/constant/Avatar";
import { useUser } from "@/lib/context/userContext";
import { hp, wp } from "@/lib/responsive";
import {
    convertReferralPointsToCoins,
    deleteUserAccount,
    getUserBadges,
    getUserReferralStats,
    signOut,
    updateUserAvatar,
} from "@/lib/services/supabaseAuthService";
import { hasSubmittedFeedbackToday, submitFeedback } from "@/lib/services/supabaseFeedbackService";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const getRankImage = (rank: string) => {
  const rankImages: { [key: string]: any } = {
    beginner: require("@/assets/ranks/beginner.png"),
    advanced: require("@/assets/ranks/advanced.png"),
    inter: require("@/assets/ranks/inter.png"),
    pro: require("@/assets/ranks/pro.png"),
    legend: require("@/assets/ranks/legend.png"),
    crown1: require("@/assets/ranks/crown1.png"),
    crown2: require("@/assets/ranks/crown2.png"),
    top: require("@/assets/ranks/top.png"),
    second: require("@/assets/ranks/second.png"),
    last: require("@/assets/ranks/last.png"),
  };
  return rankImages[rank] || rankImages["beginner"];
};

const DEFAULT_AVATAR_ID = 3;

export default function Profile() {
  const router = useRouter();
  const { userData, setUserData } = useUser();
  // Cast to any to access extended Supabase fields not in context type
  const ud = userData as any;
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState<any>(null);
  const [imageError, setImageError] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userStats, setUserStats] = useState({
    referrals: 0,
    referralPoints: 0,
    badges: 0,
  });

  useEffect(() => {
    const loadSavedAvatar = async () => {
      const avatarId = ud?.avatar_url || ud?.avatarUri;
      if (avatarId) {
        const savedAvatarId = parseInt(avatarId);
        if (!isNaN(savedAvatarId)) {
          const savedAvatar = Avatar.find((a) => a.id === savedAvatarId);
          setSelectedAvatar(savedAvatar || Avatar.find((a) => a.id === DEFAULT_AVATAR_ID));
        } else {
          setSelectedAvatar(Avatar.find((a) => a.id === DEFAULT_AVATAR_ID));
        }
      } else {
        setSelectedAvatar(Avatar.find((a) => a.id === DEFAULT_AVATAR_ID));
      }
    };
    loadSavedAvatar();
  }, [ud?.avatar_url, ud?.avatarUri]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!ud?.id) return;
      try {
        const { referrals_count, referral_points } = await getUserReferralStats(ud.id);
        const badges = await getUserBadges(ud.id);
        setUserStats({ referrals: referrals_count, referralPoints: referral_points, badges });
      } catch (error) {
        console.log("Error fetching user stats:", error);
      }
    };
    fetchUserStats();
  }, [userData]);

  useEffect(() => {
    console.log("User data:", userData);
    console.log("User referral code:", ud?.referral_code);
    console.log("User avatar_url:", ud?.avatar_url);
    console.log("User avatarUri:", ud?.avatarUri);
    console.log("Selected avatar:", selectedAvatar?.name);
  }, [userData, selectedAvatar]);

  const referralCode = ud?.referral_code || "";

  const handleEditAvatar = () => {
    setTempSelectedAvatar(selectedAvatar);
    setModalVisible(true);
  };

  const handleAvatarSelect = (avatar: any) => {
    setTempSelectedAvatar(avatar);
  };

  const handleConfirmSelection = async () => {
    if (tempSelectedAvatar) {
      setIsSavingAvatar(true);
      try {
        await updateUserAvatar(tempSelectedAvatar.id.toString());
        setSelectedAvatar(tempSelectedAvatar);
        setImageError(false);
        if (userData) {
          setUserData({
            ...userData,
            avatar_url: tempSelectedAvatar.id.toString(),
            avatarUri: tempSelectedAvatar.id.toString(),
          } as any);
        }
        Alert.alert("Success", "Avatar updated successfully!");
      } catch (error) {
        console.log("Error saving avatar:", error);
        Alert.alert("Error", "Failed to save avatar. Please try again.");
      } finally {
        setIsSavingAvatar(false);
        setModalVisible(false);
      }
    }
  };

  const handleConvertPoints = async () => {
    if (!ud?.id) return;
    setIsConverting(true);
    try {
      const result = await convertReferralPointsToCoins(ud.id);
      if (result.success) {
        if (userData) setUserData({ ...userData, coins: result.newCoins } as any);
        const { referrals_count, referral_points } = await getUserReferralStats(ud.id);
        setUserStats((prev) => ({ ...prev, referralPoints: referral_points }));
        Alert.alert("Success", result.message);
      } else {
        Alert.alert("Info", result.message);
      }
    } catch (error) {
      console.log("Error converting points:", error);
      Alert.alert("Error", "Failed to convert points");
    } finally {
      setIsConverting(false);
    }
  };

  const handleCancelSelection = () => {
    setTempSelectedAvatar(null);
    setModalVisible(false);
  };

  const handleImageError = () => {
    console.log("Image failed to load");
    setImageError(true);
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("Success", "Referral code copied to clipboard!");
  };

  const handlePrivacyPolicy = () => router.push("/privacy-policy");
  const handleTermsOfUse = () => router.push("/terms-of-use");

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone. All your data including feedback, referrals, and game progress will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "This is your last chance. Are you absolutely sure you want to permanently delete your account?",
              [
                { text: "No, keep my account", style: "cancel" },
                {
                  text: "Yes, delete everything",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      setIsDeleting(true);
                      const result = await deleteUserAccount();
                      if (result.success) {
                        setUserData({ id: "", username: "", avatarUri: null, rank: "beginner", score: 0, day_streak: 0 });
                        Alert.alert(
                          "Account Deleted",
                          "Your account has been successfully deleted. We're sorry to see you go!",
                          [{ text: "OK", onPress: () => router.replace("/(auth)") }]
                        );
                      } else {
                        Alert.alert("Error", result.error || "Failed to delete account. Please try again or contact support.");
                      }
                    } catch (error) {
                      console.log("Delete account error:", error);
                      Alert.alert("Error", "An unexpected error occurred. Please try again.");
                    } finally {
                      setIsDeleting(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            await signOut();
            setUserData({ id: "", username: "", avatarUri: null, rank: "beginner", score: 0, day_streak: 0 });
            router.replace("/(auth)");
          } catch (error) {
            console.log("Logout error:", error);
            Alert.alert("Error", "Failed to logout");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback message");
      return;
    }
    if (!ud?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    const hasSubmitted = await hasSubmittedFeedbackToday(ud.id);
    if (hasSubmitted) {
      Alert.alert("Already Submitted", "You have already submitted feedback today. Thank you for your support!");
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const result = await submitFeedback(ud.id, feedback, rating > 0 ? rating : null, "general");
      if (result.success) {
        Alert.alert("Thank You!", "Your feedback has been submitted successfully. We appreciate your input!");
        setRating(0);
        setFeedback("");
      } else {
        Alert.alert("Error", result.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.log("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getAvatarImageStyle = (avatar: any) => {
    if (avatar.id === 5 || avatar.id === 6 || avatar.id === 7) {
      return [styles.avatarImage, styles.largeAvatarImage];
    }
    return styles.avatarImage;
  };

  const renderAvatarItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.avatarItem, tempSelectedAvatar?.id === item.id && styles.selectedAvatarItem]}
      onPress={() => handleAvatarSelect(item)}
    >
      <LinearGradient
        colors={item.gradientColors || [item.bgColor, item.bgColor]}
        style={styles.avatarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image
          source={item.image}
          style={styles.avatarItemImage}
          resizeMode="contain"
          onError={(error) => console.log(`Error loading ${item.name}:`, error)}
        />
        {tempSelectedAvatar?.id === item.id && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
      <TouchableOpacity key={i} onPress={() => setRating(i)} disabled={isSubmittingFeedback}>
        <Ionicons
          name={i <= rating ? "star" : "star-outline"}
          size={32}
          color={i <= rating ? "#FFD700" : "#666"}
        />
      </TouchableOpacity>
    ));
  };

  if (!userData || !selectedAvatar) {
    return (
      <ImageBackground
        source={require("@/assets/images/bg3.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.overlay, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#5929d4" />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/bg3.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            bounces={true}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Profile</Text>
              <View style={styles.coinsChip}>
                <Ionicons name="logo-bitcoin" size={16} color="#FFD700" />
                <Text style={styles.coinsChipText}>{ud.coins || ud.score || 0}</Text>
              </View>
            </View>

            {/* Profile Card */}
            <LinearGradient
              colors={selectedAvatar.gradientColors || [selectedAvatar.bgColor, selectedAvatar.bgColor]}
              style={styles.profileCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Avatar */}
              <View style={styles.avatarWrapper}>
                {!imageError ? (
                  <Image
                    source={selectedAvatar.image}
                    style={getAvatarImageStyle(selectedAvatar)}
                    resizeMode="contain"
                    onError={handleImageError}
                  />
                ) : (
                  <View style={styles.errorContainer}>
                    <Ionicons name="image-outline" size={40} color="#666" />
                    <Text style={styles.errorText}>Failed to load</Text>
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.nameText}>{ud.username || "Player"}</Text>

                <View style={styles.badgeRow}>
                  <View style={styles.rankBadge}>
                    <Image
                      source={getRankImage(ud.rank || "beginner")}
                      style={styles.rankIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.rankText}>
                      {ud.rank
                        ? ud.rank.charAt(0).toUpperCase() + ud.rank.slice(1)
                        : "Beginner"}
                    </Text>
                  </View>

                  <View style={styles.streakBadge}>
                    <Ionicons name="flame" size={16} color="#FF6B00" />
                    <Text style={styles.streakText}>{ud.day_streak || 0} day streak</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditAvatar}
                  activeOpacity={0.7}
                  disabled={isSavingAvatar}
                >
                  {isSavingAvatar ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="camera-outline" size={16} color="#fff" />
                      <Text style={styles.editButtonText}>Change Avatar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Referrals & Achievements */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Referrals & Achievements</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <View style={[styles.statIcon, { backgroundColor: "rgba(76,175,80,0.15)" }]}>
                    <Ionicons name="people" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.statValue}>{userStats.referrals}</Text>
                  <Text style={styles.statLabel}>Referrals</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <View style={[styles.statIcon, { backgroundColor: "rgba(255,152,0,0.15)" }]}>
                    <Ionicons name="gift" size={20} color="#FF9800" />
                  </View>
                  <Text style={styles.statValue}>{userStats.referralPoints}</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <View style={[styles.statIcon, { backgroundColor: "rgba(156,39,176,0.15)" }]}>
                    <Ionicons name="trophy" size={20} color="#9C27B0" />
                  </View>
                  <Text style={styles.statValue}>{userStats.badges}</Text>
                  <Text style={styles.statLabel}>Badges</Text>
                </View>
              </View>

              <View style={styles.warningContainer}>
                <Ionicons name="information-circle-outline" size={16} color="#FFA500" />
                <Text style={styles.warningText}>
                  {userStats.referralPoints >= 100
                    ? "You have enough points to convert to coins!"
                    : `Need ${100 - userStats.referralPoints} more points to convert`}
                </Text>
              </View>

              {userStats.referralPoints >= 100 && (
                <TouchableOpacity
                  style={styles.convertButton}
                  onPress={handleConvertPoints}
                  disabled={isConverting}
                >
                  <LinearGradient colors={["#4CAF50", "#45a049"]} style={styles.convertGradient}>
                    {isConverting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Ionicons name="swap-horizontal" size={18} color="white" />
                        <Text style={styles.convertButtonText}>
                          Convert {userStats.referralPoints} Points to Coins
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Referral Code */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your Referral Code</Text>
              <View style={styles.referralCodeRow}>
                <Text style={styles.referralCodeText}>{referralCode || "No code yet"}</Text>
                {referralCode ? (
                  <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                    <Ionicons name="copy-outline" size={16} color="#4CAF50" />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.generatingText}>Generating...</Text>
                )}
              </View>
              <Text style={styles.referralInfoText}>
                Share this code with friends. When they sign up, you get 10 points!
              </Text>
            </View>

            {/* Legal */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Legal</Text>
              <View style={styles.legalRow}>
                <TouchableOpacity style={styles.legalButton} onPress={handlePrivacyPolicy}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#4CAF50" />
                  <Text style={styles.legalButtonText}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.legalButton} onPress={handleTermsOfUse}>
                  <Ionicons name="document-text-outline" size={18} color="#4CAF50" />
                  <Text style={styles.legalButtonText}>Terms of Use</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rate & Feedback */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Rate Us</Text>
              <View style={styles.starsRow}>{renderStars()}</View>
              <Text style={styles.ratingHint}>
                {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Tap to rate (optional)"}
              </Text>

              <Text style={styles.cardSubtitle}>Feedback</Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Share your thoughts... (required)"
                placeholderTextColor="#666"
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                editable={!isSubmittingFeedback}
              />

              <TouchableOpacity
                style={[styles.submitButton, (!feedback.trim() || isSubmittingFeedback) && styles.disabledButton]}
                onPress={handleSubmitFeedback}
                disabled={isSubmittingFeedback || !feedback.trim()}
              >
                <LinearGradient colors={["#5929d4", "#7b4fe0"]} style={styles.submitGradient}>
                  {isSubmittingFeedback ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Account Actions */}
            <View style={[styles.card, styles.accountCard]}>
              <Text style={styles.cardTitle}>Account</Text>
              <TouchableOpacity
                style={[styles.accountButton, isDeleting && styles.disabledButton]}
                onPress={handleDeleteAccount}
                disabled={isDeleting || isLoading}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FF4444" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={18} color="#FF4444" />
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.accountButton, styles.logoutAccountButton, isLoading && styles.disabledButton]}
                onPress={handleLogout}
                disabled={isLoading || isDeleting}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FF9800" />
                ) : (
                  <>
                    <Ionicons name="log-out-outline" size={18} color="#FF9800" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: hp(10) }} />
          </ScrollView>
        </SafeAreaView>
      </View>

      {/* Avatar Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancelSelection}
      >
        <TouchableWithoutFeedback onPress={handleCancelSelection}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Your Avatar</Text>
                  <TouchableOpacity onPress={handleCancelSelection}>
                    <Ionicons name="close" size={24} color="#aaa" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={Avatar}
                  renderItem={renderAvatarItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  contentContainerStyle={styles.avatarGrid}
                  showsVerticalScrollIndicator={false}
                />

                <View style={styles.modalFooter}>
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelSelection}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.confirmButton,
                      (!tempSelectedAvatar || isSavingAvatar) && styles.disabledButton,
                    ]}
                    onPress={handleConfirmSelection}
                    disabled={!tempSelectedAvatar || isSavingAvatar}
                  >
                    {isSavingAvatar ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(12, 12, 12, 0.82)" },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, paddingHorizontal: wp(4) },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  headerText: { fontSize: 26, fontWeight: "bold", color: "white" },
  coinsChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.15)",
    borderRadius: 20,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    gap: wp(1.5),
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  coinsChipText: { color: "#FFD700", fontWeight: "700", fontSize: 14 },

  // Profile Card
  profileCard: {
    flexDirection: "row",
    borderRadius: 20,
    padding: wp(4),
    marginBottom: hp(2),
    alignItems: "center",
    minHeight: hp(18),
    overflow: "hidden",
  },
  avatarWrapper: {
    width: wp(28),
    height: hp(16),
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: wp(3),
  },
  avatarImage: { width: "100%", height: "100%" },
  largeAvatarImage: { width: "115%", height: "115%" },
  errorContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  errorText: { fontSize: 10, color: "#ccc", marginTop: 4 },
  profileInfo: { flex: 1 },
  nameText: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: hp(0.8) },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: wp(2), marginBottom: hp(1.2) },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 20,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    gap: wp(1),
  },
  rankIcon: { width: wp(5), height: hp(2.5) },
  rankText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,107,0,0.2)",
    borderRadius: 20,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    gap: wp(1),
  },
  streakText: { fontSize: 12, fontWeight: "600", color: "#FF6B00" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 10,
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    gap: wp(1.5),
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  editButtonText: { fontSize: 13, color: "#fff", fontWeight: "500" },

  // Cards
  card: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  accountCard: { marginBottom: hp(0) },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: hp(1.5) },
  cardSubtitle: { fontSize: 14, fontWeight: "600", color: "#ccc", marginTop: hp(1.5), marginBottom: hp(1) },

  // Stats row
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: hp(1.5),
    marginBottom: hp(1),
  },
  statBox: { flex: 1, alignItems: "center", gap: hp(0.4) },
  statDivider: { width: 1, height: hp(5), backgroundColor: "rgba(255,255,255,0.1)" },
  statIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  statLabel: { fontSize: 11, color: "#aaa", fontWeight: "500" },

  // Warning
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,165,0,0.1)",
    borderRadius: 8,
    padding: wp(2.5),
    gap: wp(2),
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.2)",
  },
  warningText: { flex: 1, fontSize: 12, color: "#FFA500", fontWeight: "500" },

  // Convert button
  convertButton: { marginTop: hp(1.2), borderRadius: 10, overflow: "hidden" },
  convertGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.3),
    gap: wp(2),
  },
  convertButtonText: { fontSize: 14, color: "white", fontWeight: "600" },

  // Referral code
  referralCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: wp(3),
    gap: wp(2),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: hp(0.8),
  },
  referralCodeText: { flex: 1, fontSize: 15, fontWeight: "700", color: "#fff", letterSpacing: 1 },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76,175,80,0.15)",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2.5),
    borderRadius: 8,
    gap: wp(1),
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.3)",
  },
  copyButtonText: { fontSize: 12, color: "#4CAF50", fontWeight: "600" },
  generatingText: { fontSize: 12, color: "#aaa", fontStyle: "italic" },
  referralInfoText: { fontSize: 11, color: "#888", fontStyle: "italic" },

  // Legal
  legalRow: { flexDirection: "row", gap: wp(3) },
  legalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 10,
    paddingVertical: hp(1.2),
    gap: wp(1.5),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  legalButtonText: { fontSize: 12, color: "#ddd", fontWeight: "500" },

  // Rating
  starsRow: { flexDirection: "row", gap: wp(2), marginBottom: hp(0.5) },
  ratingHint: { fontSize: 12, color: "#888", marginBottom: hp(1) },

  // Feedback
  feedbackInput: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: wp(3),
    minHeight: hp(10),
    fontSize: 13,
    color: "#fff",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  submitButton: { marginTop: hp(1.2), borderRadius: 10, overflow: "hidden" },
  submitGradient: { paddingVertical: hp(1.3), alignItems: "center" },
  submitButtonText: { fontSize: 14, color: "white", fontWeight: "600" },

  // Account
  accountButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,68,68,0.08)",
    borderRadius: 10,
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(4),
    gap: wp(2),
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: "rgba(255,68,68,0.2)",
  },
  logoutAccountButton: {
    backgroundColor: "rgba(255,152,0,0.08)",
    borderColor: "rgba(255,152,0,0.2)",
    marginBottom: 0,
  },
  deleteButtonText: { fontSize: 14, fontWeight: "600", color: "#FF4444" },
  logoutButtonText: { fontSize: 14, fontWeight: "600", color: "#FF9800" },
  disabledButton: { opacity: 0.4 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.72,
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: wp(4),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  avatarGrid: { paddingBottom: hp(2) },
  avatarItem: {
    flex: 1,
    margin: wp(2),
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  avatarGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarItemImage: { width: "80%", height: "80%" },
  selectedAvatarItem: { borderWidth: 3, borderColor: "#4CAF50" },
  checkmarkContainer: { position: "absolute", top: 5, right: 5 },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    gap: wp(3),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "rgba(255,255,255,0.1)" },
  confirmButton: { backgroundColor: "#5929d4" },
  cancelButtonText: { fontSize: 15, color: "#ccc", fontWeight: "600" },
  confirmButtonText: { fontSize: 15, color: "white", fontWeight: "600" },
});
