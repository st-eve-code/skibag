import { Avatar } from "@/constant/Avatar";
import { hp, wp } from "@/lib/responsive";
import {
  convertReferralPointsToCoins,
  getUserBadges,
  getUserReferralStats,
  signOut,
  updateUserAvatar,
  deleteUserAccount,
} from "@/lib/supabaseAuthService";
import { submitFeedback, hasSubmittedFeedbackToday } from "@/lib/supabaseFeedbackService";
import { useUser } from "@/lib/userContext";
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Rank image mapping
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

// Default avatar (Builder - ID 3)
const DEFAULT_AVATAR_ID = 3;

export default function Profile() {
  const router = useRouter();
  const { userData, setUserData } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState(null);
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

  // Load saved avatar from userData when it changes
  useEffect(() => {
    const loadSavedAvatar = async () => {
      // Check both avatar_url and avatarUri for compatibility
      const avatarId = userData?.avatar_url || userData?.avatarUri;
      
      if (avatarId) {
        console.log("Found avatar ID in userData:", avatarId);

        // Try to parse as number (avatar ID)
        const savedAvatarId = parseInt(avatarId);

        if (!isNaN(savedAvatarId)) {
          const savedAvatar = Avatar.find((a) => a.id === savedAvatarId);
          if (savedAvatar) {
            console.log(
              "Loading saved avatar:",
              savedAvatar.name,
              "with ID:",
              savedAvatar.id,
            );
            setSelectedAvatar(savedAvatar);
          } else {
            console.log(
              "No avatar found with ID:",
              savedAvatarId,
              "using default",
            );
            setSelectedAvatar(Avatar.find((a) => a.id === DEFAULT_AVATAR_ID));
          }
        } else {
          console.log("avatar_id is not a number, using default");
          setSelectedAvatar(Avatar.find((a) => a.id === DEFAULT_AVATAR_ID));
        }
      } else {
        console.log("No avatar ID found in userData, using default");
        setSelectedAvatar(Avatar.find((a) => a.id === DEFAULT_AVATAR_ID));
      }
    };

    loadSavedAvatar();
  }, [userData?.avatar_url, userData?.avatarUri]);

  // Fetch user stats (referrals, points, badges)
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!userData?.id) return;

      try {
        // Get referral stats
        const { referrals_count, referral_points } = await getUserReferralStats(
          userData.id,
        );

        // Get badges
        const badges = await getUserBadges(userData.id);

        setUserStats({
          referrals: referrals_count,
          referralPoints: referral_points,
          badges: badges,
        });
      } catch (error) {
        console.log("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [userData]);

  // Get referral code from userData
  const referralCode = userData?.referral_code || "";

  // Debug logs
  useEffect(() => {
    console.log("User data:", userData);
    console.log("User referral code:", userData?.referral_code);
    console.log("User avatar_url:", userData?.avatar_url);
    console.log("User avatarUri:", userData?.avatarUri);
    console.log("Selected avatar:", selectedAvatar?.name);
  }, [userData, selectedAvatar]);

  const handleEditAvatar = () => {
    setTempSelectedAvatar(selectedAvatar);
    setModalVisible(true);
  };

  const handleAvatarSelect = (avatar) => {
    setTempSelectedAvatar(avatar);
  };

  const handleConfirmSelection = async () => {
    if (tempSelectedAvatar) {
      setIsSavingAvatar(true);
      try {
        console.log("Saving avatar with ID:", tempSelectedAvatar.id);

        // Save avatar ID to Supabase
        await updateUserAvatar(tempSelectedAvatar.id.toString());

        // Update local state
        setSelectedAvatar(tempSelectedAvatar);
        setImageError(false);

        // Update userData in context with both fields for compatibility
        if (userData) {
          const updatedUserData = {
            ...userData,
            avatar_url: tempSelectedAvatar.id.toString(),
            avatarUri: tempSelectedAvatar.id.toString(),
          };
          setUserData(updatedUserData);
          console.log("Updated userData with new avatar:", updatedUserData);
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
    if (!userData?.id) return;

    setIsConverting(true);
    try {
      const result = await convertReferralPointsToCoins(userData.id);

      if (result.success) {
        // Update userData with new coins
        if (userData) {
          const updatedUserData = {
            ...userData,
            coins: result.newCoins,
          };
          setUserData(updatedUserData);
        }

        // Refresh stats
        const { referrals_count, referral_points } = await getUserReferralStats(
          userData.id,
        );
        setUserStats((prev) => ({
          ...prev,
          referralPoints: referral_points,
        }));

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

  const handlePrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  const handleTermsOfUse = () => {
    router.push("/terms-of-use");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone. All your data including feedback, referrals, and game progress will be permanently lost.",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Second confirmation for extra safety
            Alert.alert(
              "Final Confirmation",
              "This is your last chance. Are you absolutely sure you want to permanently delete your account?",
              [
                { 
                  text: "No, keep my account", 
                  style: "cancel" 
                },
                {
                  text: "Yes, delete everything",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      setIsDeleting(true);
                      
                      const result = await deleteUserAccount();
                      
                      if (result.success) {
                        // Clear user data from context
                        setUserData(null);
                        
                        Alert.alert(
                          "Account Deleted",
                          "Your account has been successfully deleted. We're sorry to see you go!",
                          [
                            {
                              text: "OK",
                              onPress: () => router.replace("/(auth)")
                            }
                          ]
                        );
                      } else {
                        Alert.alert(
                          "Error", 
                          result.error || "Failed to delete account. Please try again or contact support."
                        );
                      }
                    } catch (error) {
                      console.log("Delete account error:", error);
                      Alert.alert("Error", "An unexpected error occurred. Please try again.");
                    } finally {
                      setIsDeleting(false);
                    }
                  }
                }
              ]
            );
          }
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
            setUserData(null);
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

    if (!userData?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    // Optional: Check if user already submitted feedback today
    const hasSubmitted = await hasSubmittedFeedbackToday(userData.id);
    if (hasSubmitted) {
      Alert.alert(
        "Already Submitted",
        "You have already submitted feedback today. Thank you for your support!"
      );
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      // You can set a category if you want, e.g., "general", "bug", "feature", etc.
      const category = "general"; // or make this dynamic based on user selection
      
      const result = await submitFeedback(
        userData.id,
        feedback,
        rating > 0 ? rating : null, // Only send rating if user selected one
        category
      );

      if (result.success) {
        console.log("Feedback submitted:", { rating, feedback });
        Alert.alert(
          "Thank You!",
          "Your feedback has been submitted successfully. We appreciate your input!"
        );
        // Reset form
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

  const getAvatarImageStyle = (avatar) => {
    const baseStyle = styles.avatarImage;
    if (avatar.id === 5 || avatar.id === 6 || avatar.id === 7) {
      return [baseStyle, styles.largeAvatarImage];
    }
    return baseStyle;
  };

  const renderAvatarItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.avatarItem,
        tempSelectedAvatar?.id === item.id && styles.selectedAvatarItem,
      ]}
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
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} disabled={isSubmittingFeedback}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#FFD700" : "#666"}
          />
        </TouchableOpacity>,
      );
    }
    return stars;
  };

  // Show loading state while fetching user data or avatar
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
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollViewContent}
          bounces={true}
          alwaysBounceVertical={true}
        >
          <View style={styles.content}>
            <Text style={styles.headerText}>Profile</Text>

            {/* Profile Card */}
            <LinearGradient
              colors={
                selectedAvatar.gradientColors || [
                  selectedAvatar.bgColor,
                  selectedAvatar.bgColor,
                ]
              }
              style={styles.profileCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatarContainer}>
                {!imageError ? (
                  <Image
                    source={selectedAvatar.image}
                    style={getAvatarImageStyle(selectedAvatar)}
                    resizeMode="contain"
                    onError={handleImageError}
                  />
                ) : (
                  <View style={[styles.avatarImage, styles.errorContainer]}>
                    <Ionicons name="image-outline" size={40} color="#666" />
                    <Text style={styles.errorText}>Failed to load</Text>
                  </View>
                )}
              </View>

              <View style={styles.infoWhiteContainer}>
                <Text style={styles.scoreText}>#{userData.coins || 0}</Text>
                <Text style={styles.nameText}>
                  {userData.username || "Player"}
                </Text>

                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Image
                      source={getRankImage(userData.rank || "beginner")}
                      style={styles.rankIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.rankText}>
                      {userData.rank
                        ? userData.rank.charAt(0).toUpperCase() +
                          userData.rank.slice(1)
                        : "Beginner"}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="flame" size={25} color="#FF6B00" />
                    <Text style={styles.statText}>
                      {userData.day_streak || 0}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditAvatar}
                  activeOpacity={0.7}
                  disabled={isSavingAvatar}
                >
                  {isSavingAvatar ? (
                    <ActivityIndicator size="small" color="#262626" />
                  ) : (
                    <>
                      <Ionicons name="refresh" size={20} color="#262626" />
                      <Text style={styles.editButtonText}>Edit avatar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Referrals Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Referrals & Achievements</Text>
              <View style={styles.referralsContainer}>
                <View style={styles.referralCard}>
                  <View style={styles.referralIconContainer}>
                    <Ionicons name="people" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.referralLabel}>Referrals</Text>
                  <Text style={styles.referralValue}>
                    {userStats.referrals}
                  </Text>
                </View>

                <View style={styles.referralCard}>
                  <View style={styles.referralIconContainer}>
                    <Ionicons name="gift" size={20} color="#FF9800" />
                  </View>
                  <Text style={styles.referralLabel}>Points</Text>
                  <Text style={styles.referralValue}>
                    {userStats.referralPoints}
                  </Text>
                </View>

                <View style={styles.referralCard}>
                  <View style={styles.referralIconContainer}>
                    <Ionicons name="trophy" size={20} color="#9C27B0" />
                  </View>
                  <Text style={styles.referralLabel}>Badges</Text>
                  <Text style={styles.referralValue}>{userStats.badges}</Text>
                </View>
              </View>

              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={16} color="#FFA500" />
                <Text style={styles.warningText}>
                  {userStats.referralPoints >= 100
                    ? "You have enough points to convert to coins!"
                    : `Need ${100 - userStats.referralPoints} more points to convert to coins`}
                </Text>
              </View>

              {userStats.referralPoints >= 100 && (
                <TouchableOpacity
                  style={styles.convertButton}
                  onPress={handleConvertPoints}
                  disabled={isConverting}
                >
                  <LinearGradient
                    colors={["#4CAF50", "#45a049"]}
                    style={styles.convertButtonGradient}
                  >
                    {isConverting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Ionicons
                          name="swap-horizontal"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.convertButtonText}>
                          Convert {userStats.referralPoints} Points to Coins
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Referral Code Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Your Referral Code</Text>
              <View style={styles.referralCodeContainer}>
                <Text style={styles.referralCodeText}>
                  {referralCode || "No code yet"}
                </Text>
                {referralCode ? (
                  <TouchableOpacity
                    onPress={handleCopyCode}
                    style={styles.copyButton}
                  >
                    <Ionicons name="copy-outline" size={18} color="#4CAF50" />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.copyButton}>
                    <Text style={styles.copyButtonText}>Generating...</Text>
                  </View>
                )}
              </View>
              <Text style={styles.referralInfoText}>
                Share this code with friends. When they sign up, you get 10
                points!
              </Text>
            </View>

            {/* Legal Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Legal</Text>
              <View style={styles.legalButtonsContainer}>
                <TouchableOpacity
                  style={styles.legalButton}
                  onPress={handlePrivacyPolicy}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#4CAF50"
                  />
                  <Text style={styles.legalButtonText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.legalButton}
                  onPress={handleTermsOfUse}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#4CAF50"
                  />
                  <Text style={styles.legalButtonText}>Terms of Use</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating & Feedback Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Rate Us</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>{renderStars()}</View>
                <Text style={styles.ratingText}>
                  {rating > 0
                    ? `${rating} star${rating > 1 ? "s" : ""}`
                    : "Tap to rate (optional)"}
                </Text>
              </View>

              <Text style={styles.sectionSubtitle}>Feedback</Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Share your thoughts... (required)"
                placeholderTextColor="#999"
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                editable={!isSubmittingFeedback}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitFeedback}
                disabled={isSubmittingFeedback || !feedback.trim()}
              >
                <LinearGradient
                  colors={["#4CAF50", "#45a049"]}
                  style={styles.submitButtonGradient}
                >
                  {isSubmittingFeedback ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Account Actions Section */}
            <View style={styles.accountSectionContainer}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.accountButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.accountButton, 
                    styles.deleteButton,
                    isDeleting && styles.disabledButton
                  ]}
                  onPress={handleDeleteAccount}
                  activeOpacity={0.7}
                  disabled={isDeleting || isLoading}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#FF4444" />
                  ) : (
                    <>
                      <Ionicons name="trash-outline" size={20} color="#FF4444" />
                      <Text style={[styles.accountButtonText, styles.deleteButtonText]}>
                        Delete Account
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.accountButton, 
                    styles.logoutButton,
                    isLoading && styles.disabledButton
                  ]}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                  disabled={isLoading || isDeleting}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FF9800" />
                  ) : (
                    <>
                      <Ionicons name="log-out-outline" size={20} color="#FF9800" />
                      <Text style={[styles.accountButtonText, styles.logoutButtonText]}>
                        Logout
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Large bottom padding */}
            <View style={styles.largeBottomPadding} />
          </View>
        </ScrollView>

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
                      <Ionicons name="close" size={24} color="#666" />
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
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={handleCancelSelection}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.confirmButton,
                        (!tempSelectedAvatar || isSavingAvatar) &&
                          styles.disabledButton,
                      ]}
                      onPress={handleConfirmSelection}
                      disabled={!tempSelectedAvatar || isSavingAvatar}
                    >
                      {isSavingAvatar ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={styles.confirmButtonText}>OK</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(12, 12, 12, 0.8)",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: hp(3),
    marginBottom: hp(1),
  },
  profileCard: {
    position: "relative",
    width: "100%",
    borderRadius: 14,
    padding: wp(4),
    marginTop: hp(2),
    minHeight: hp(22),
  },
  avatarContainer: {
    position: "absolute",
    top: -hp(9),
    left: -wp(10.5),
    width: wp(50),
    height: hp(30),
    zIndex: 1,
  },
  avatarImage: {
    width: "110%",
    height: "120%",
    top: hp(6),
  },
  largeAvatarImage: {
    width: "130%",
    height: "130%",
    top: hp(5),
  },
  errorContainer: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  infoWhiteContainer: {
    marginLeft: wp(38),
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 12,
    padding: wp(3),
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "italic",
    color: "#ffffff",
  },
  nameText: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: hp(0.5),
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 16,
    padding: wp(1),
    width: "100%",
    marginTop: hp(1),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    flex: 1,
  },
  rankIcon: {
    width: wp(10),
    height: hp(5),
  },
  rankText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: wp(2),
    width: "100%",
    marginTop: hp(1),
  },
  editButtonText: {
    fontSize: 20,
    color: "#262626",
  },
  sectionContainer: {
    marginTop: hp(2),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: wp(4),
  },
  accountSectionContainer: {
    marginTop: hp(2),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: hp(1.5),
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginTop: hp(1.5),
    marginBottom: hp(1),
  },
  referralsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp(2),
  },
  referralCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: hp(1.2),
    alignItems: "center",
  },
  referralIconContainer: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(0.3),
  },
  referralLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  referralValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 165, 0, 0.15)",
    borderRadius: 8,
    padding: wp(2),
    marginTop: hp(1),
    gap: wp(1.5),
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: "#FFA500",
    fontWeight: "500",
  },
  convertButton: {
    marginTop: hp(1.5),
    borderRadius: 8,
    overflow: "hidden",
  },
  convertButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.2),
    gap: wp(2),
  },
  convertButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  referralCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: wp(3),
    gap: wp(2),
  },
  referralCodeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    letterSpacing: 0.5,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    borderRadius: 6,
    gap: wp(1),
  },
  copyButtonText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  referralInfoText: {
    fontSize: 11,
    color: "#aaa",
    marginTop: hp(0.5),
    fontStyle: "italic",
  },
  legalButtonsContainer: {
    flexDirection: "row",
    gap: wp(3),
  },
  legalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    gap: wp(1.5),
  },
  legalButtonText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  ratingContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: wp(3),
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: wp(1.5),
    marginBottom: hp(0.5),
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  feedbackInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: wp(3),
    minHeight: hp(8),
    fontSize: 13,
    color: "#333",
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: hp(1),
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButtonGradient: {
    paddingVertical: hp(1.2),
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  accountButtonsContainer: {
    flexDirection: "row",
    gap: wp(3),
  },
  accountButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    gap: wp(2),
  },
  accountButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "#FF4444",
  },
  logoutButtonText: {
    color: "#FF9800",
  },
  largeBottomPadding: {
    height: hp(10),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: "white",
    borderRadius: 20,
    padding: wp(4),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  avatarGrid: {
    paddingBottom: hp(2),
  },
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
  avatarItemImage: {
    width: "80%",
    height: "80%",
  },
  selectedAvatarItem: {
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  checkmarkContainer: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: wp(2),
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    opacity: 0.5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});