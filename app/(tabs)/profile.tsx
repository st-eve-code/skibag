// import { fontScale, hp, wp } from "@/lib/responsive";
// import { useUser } from "@/lib/userContext";
// import { signOut } from "@/lib/authService";
// import { deleteUserAccount, getUserProfile, submitFeedback, updateUserProfile, getReferralCount, getUserPointsAndCoins, convertPointsToCoins } from "@/lib/firestoreService";
// import { uploadProfilePicture, deleteProfilePicture } from "@/lib/storageService";
// import { Ionicons } from "@expo/vector-icons";
// import * as Clipboard from "expo-clipboard";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import React, { useState, useEffect } from "react";
// import {
//   Alert,
//   Image,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// let ImageCropper: any = null;
// try {
//   ImageCropper = require("expo-image-cropper");
// } catch (e) {
//   console.log("expo-image-cropper not available");
// }

// export default function Profile() {
//   const router = useRouter();
//   const { userData, updateAvatar } = useUser();

//   const [avatarUri, setAvatarUri] = useState<string | null>(userData.avatarUri);
//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState("");
//   const [referralCode, setReferralCode] = useState("Loading...");
//   const [referralCount, setReferralCount] = useState(0);
//   const [referralPoints, setReferralPoints] = useState(0);
//   const [coins, setCoins] = useState(0);
//   const [submittingFeedback, setSubmittingFeedback] = useState(false);
//   const [uploadingAvatar, setUploadingAvatar] = useState(false);
//   const [showConversionModal, setShowConversionModal] = useState(false);
//   const [pointsToConvert, setPointsToConvert] = useState('');

//   // ─── Load user profile from Firestore ────────────────────────────────────
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const profile = await getUserProfile();
//         console.log("Profile loaded:", profile);

//         if (profile?.referralCode) {
//           setReferralCode(profile.referralCode);
//         } else {
//           // If no profile exists yet, generate a temporary code
//           console.log("No profile found - generating temporary code");
//           const tempCode = generateTempReferralCode();
//           setReferralCode(tempCode);
//         }

//         // Load referral count
//         const count = await getReferralCount();
//         setReferralCount(count);

//         // Load points and coins
//         const { referralPoints: points, coins: userCoins } = await getUserPointsAndCoins();
//         setReferralPoints(points);
//         setCoins(userCoins);

//         // Sync Firestore data with local context
//         if (profile?.avatarUri) {
//           setAvatarUri(profile.avatarUri);
//           updateAvatar(profile.avatarUri);
//         }
//       } catch (e) {
//         console.error("Error loading profile:", e);
//         // Generate fallback code on error
//         const fallbackCode = generateTempReferralCode();
//         setReferralCode(fallbackCode);
//       }
//     };
//     loadProfile();
//   }, []);

//   // Generate temporary referral code
//   const generateTempReferralCode = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let code = '';
//     for (let i = 0; i < 8; i++) {
//       code += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return code;
//   };

//   const copyToClipboard = async () => {
//     await Clipboard.setStringAsync(referralCode);
//     Alert.alert("Copied!", "Referral code copied to clipboard");
//   };

//   const handleStarPress = (star: number) => {
//     if (rating === star) {
//       setRating(0);
//     } else {
//       setRating(star);
//     }
//   };

//   // ─── Submit Feedback ──────────────────────────────────────────────────────
//   const handleFeedbackSubmit = async () => {
//     if (!feedback.trim()) return;
//     if (rating === 0) {
//       Alert.alert("Rating Required", "Please select a star rating before submitting.");
//       return;
//     }
//     try {
//       setSubmittingFeedback(true);
//       await submitFeedback(feedback, rating);
//       Alert.alert("Thank you!", "Your feedback has been submitted.");
//       setFeedback("");
//       setRating(0);
//     } catch (e: any) {
//       Alert.alert("Error", e.message);
//     } finally {
//       setSubmittingFeedback(false);
//     }
//   };

//   // ─── Logout ────────────────────────────────────────────────────────────────
//   const handleLogout = () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await signOut();
//               router.replace("/(auth)");
//             } catch (e: any) {
//               Alert.alert("Error", e.message);
//             }
//           },
//         },
//       ]
//     );
//   };

//   // ─── Delete Account ────────────────────────────────────────────────────────
//   const handleDeleteAccount = () => {
//     Alert.alert(
//       "Delete Account",
//       "This will permanently delete your account and all your data. This action cannot be undone.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await deleteUserAccount();
//               router.replace("/(auth)");
//             } catch (e: any) {
//               Alert.alert(
//                 "Error",
//                 "Please sign out and sign back in before deleting your account."
//               );
//             }
//           },
//         },
//       ]
//     );
//   };

//   const pickImage = async (useCamera: boolean) => {
//     try {
//       if (useCamera) {
//         const { status } = await ImagePicker.requestCameraPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert("Permission Required", "Camera permission is required to take photos.");
//           return;
//         }
//       } else {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert("Permission Required", "Photo library permission is required to select photos.");
//           return;
//         }
//       }

//       const result = useCamera
//         ? await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 0.8,
//             aspect: [1, 1],
//           })
//         : await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 0.8,
//             aspect: [1, 1],
//           });

//       if (!result.canceled && result.assets[0]) {
//         const localUri = result.assets[0].uri;

//         try {
//           // Update local state immediately
//           setAvatarUri(localUri);
//           updateAvatar(localUri);

//           // Try to save to Firestore (optional - will fail gracefully if not configured)
//           try {
//             await updateUserProfile({ avatarUri: localUri });
//           } catch (firestoreError) {
//             console.log('Firestore not configured - avatar saved locally only');
//           }

//           Alert.alert("Success", "Profile picture updated!");
//         } catch (error) {
//           console.error('Error updating avatar:', error);
//           Alert.alert("Error", "Failed to update profile picture. Please try again.");
//         }
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick image. Please try again.");
//     }
//   };

//   const handleConvertPoints = async () => {
//     const points = parseInt(pointsToConvert);

//     if (isNaN(points) || points <= 0) {
//       Alert.alert("Invalid Amount", "Please enter a valid number of points");
//       return;
//     }

//     if (points % 10 !== 0) {
//       Alert.alert("Invalid Amount", "Points must be in multiples of 10");
//       return;
//     }

//     if (points > referralPoints) {
//       Alert.alert("Insufficient Points", `You only have ${referralPoints} points`);
//       return;
//     }

//     try {
//       const coinsEarned = await convertPointsToCoins(points);

//       // Update local state
//       setReferralPoints(prev => prev - points);
//       setCoins(prev => prev + coinsEarned);
//       setPointsToConvert('');
//       setShowConversionModal(false);

//       Alert.alert(
//         "Conversion Successful! 🎉",
//         `You converted ${points} points to ${coinsEarned} coins!`
//       );
//     } catch (error: any) {
//       Alert.alert("Error", error.message || "Failed to convert points");
//     }
//   };

//   const showImagePickerOptions = () => {
//     Alert.alert(
//       "Change Profile Photo",
//       "Choose an option",
//       [
//         { text: "Take Photo", onPress: () => pickImage(true) },
//         { text: "Choose from Gallery", onPress: () => pickImage(false) },
//         { text: "Cancel", style: "cancel" },
//       ],
//       { cancelable: true }
//     );
//   };

//   return (
//     <ImageBackground
//       source={require("@/assets/images/bg3.jpg")}
//       style={styles.backgroundImage}
//       resizeMode="cover"
//     >
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
//       <View style={styles.overlay}>
//         <SafeAreaView style={styles.container} edges={["top"]}>
//           <KeyboardAvoidingView
//             style={{ flex: 1 }}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             keyboardVerticalOffset={100}
//           >
//             {/* Profile Header */}
//             <View style={styles.profileHeader}>
//               <View style={styles.avatarContainer}>
//                 <TouchableOpacity onPress={showImagePickerOptions}>
//                   {avatarUri ? (
//                     <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
//                   ) : (
//                     <View style={styles.avatar}>
//                       <Ionicons name="person" size={fontScale(36)} color="#ffffff" />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.editAvatarButton} onPress={showImagePickerOptions}>
//                   <Ionicons name="camera" size={fontScale(12)} color="#ffffff" />
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.username}>
//                 {auth().currentUser?.displayName ?? "Player"}
//               </Text>
//               <Text style={styles.userId}>
//                 {auth().currentUser?.email ?? ""}
//               </Text>
//             </View>

//             <View style={{ alignItems: "flex-start", marginVertical: hp(1), alignSelf: "center" }}>
//               <Text style={styles.text}>Profile</Text>
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollContent}
//               keyboardShouldPersistTaps="handled"
//             >
//               {/* POINTS & COINS SECTION */}
//               <Text style={styles.sectionLabel}>Rewards</Text>
//               <View style={styles.rewardsCard}>
//                 <View style={styles.rewardRow}>
//                   <View style={styles.rewardItem}>
//                     <View style={styles.rewardIconContainer}>
//                       <Ionicons name="star" size={fontScale(28)} color="#f59e0b" />
//                     </View>
//                     <View>
//                       <Text style={styles.rewardLabel}>Referral Points</Text>
//                       <Text style={styles.rewardValue}>{referralPoints}</Text>
//                     </View>
//                   </View>
//                   <View style={styles.rewardItem}>
//                     <View style={styles.rewardIconContainer}>
//                       <Image
//                         source={require('@/assets/badges/coin.png')}
//                         style={{ width: wp(8), height: wp(8) }}
//                       />
//                     </View>
//                     <View>
//                       <Text style={styles.rewardLabel}>Coins</Text>
//                       <Text style={styles.rewardValue}>{coins}</Text>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Convert Points Button */}
//                 {referralPoints >= 10 && (
//                   <TouchableOpacity
//                     style={styles.convertButton}
//                     onPress={() => setShowConversionModal(true)}
//                   >
//                     <Ionicons name="swap-horizontal" size={fontScale(20)} color="#ffffff" />
//                     <Text style={styles.convertButtonText}>Convert Points to Coins</Text>
//                   </TouchableOpacity>
//                 )}

//                 <Text style={styles.rewardHint}>
//                   🎁 Earn 100 points for each referral • 10 points = 1 coin
//                 </Text>

//                 {/* Roulette Button */}
//                 {coins >= 10 && (
//                   <TouchableOpacity
//                     style={styles.rouletteButton}
//                     onPress={() => router.push('/roulette')}
//                   >
//                     <Ionicons name="play-circle" size={fontScale(24)} color="#ffffff" />
//                     <Text style={styles.rouletteButtonText}>Play Roulette Game</Text>
//                     <Ionicons name="chevron-forward" size={fontScale(20)} color="#ffffff" />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {/* GENERAL SECTION */}
//               <Text style={styles.sectionLabel}>General</Text>
//               <View style={styles.card}>

//                 {/* Email Address */}
//                 <View style={styles.emailContainer}>
//                   <Text style={styles.emailLabel}>Email address:</Text>
//                   <Text style={styles.emailValue}>
//                     {auth().currentUser?.email ?? "No email"}
//                   </Text>
//                 </View>

//                 {/* Language */}
//                 <View style={styles.buttonSpacing}>
//                   <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/language")}>
//                     <View style={styles.buttonContent}>
//                       <Ionicons name="globe" size={fontScale(24)} color={"#ffffff"} />
//                       <Text style={styles.buttonText}>Select Language</Text>
//                     </View>
//                     <Ionicons name="chevron-forward" size={fontScale(26)} color={"rgb(216, 216, 216)"} />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Privacy Policy */}
//                 <View style={styles.buttonSpacing}>
//                   <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/privacy-policy")}>
//                     <View style={styles.buttonContent}>
//                       <Ionicons name="key" size={fontScale(24)} color={"#ffffff"} />
//                       <Text style={styles.buttonText}>Privacy Policy</Text>
//                     </View>
//                     <Ionicons name="chevron-forward" size={fontScale(26)} color={"rgb(216, 216, 216)"} />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Terms of Use */}
//                 <View style={styles.buttonSpacing}>
//                   <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/terms-of-use")}>
//                     <View style={styles.buttonContent}>
//                       <Ionicons name="flag" size={fontScale(20)} color={"#ffffff"} />
//                       <Text style={styles.buttonText}>Terms of use</Text>
//                     </View>
//                     <Ionicons name="chevron-forward" size={fontScale(26)} color={"rgb(216, 216, 216)"} />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Referral Code */}
//                 <View style={styles.referralSection}>
//                   <Text style={styles.referralTitle}>Your Referral Code</Text>
//                   <View style={styles.referralCodeContainer}>
//                     <View style={styles.codeBox}>
//                       <Ionicons name="gift" size={fontScale(20)} color={"#f59e0b"} style={{ marginRight: wp(2) }} />
//                       <Text style={styles.codeText}>{referralCode}</Text>
//                     </View>
//                     <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
//                       <Ionicons name="copy-outline" size={fontScale(20)} color={"#ffffff"} />
//                       <Text style={styles.copyButtonText}>Copy</Text>
//                     </TouchableOpacity>
//                   </View>
//                   <Text style={styles.referralSubtext}>
//                     Share with friends to earn rewards • {referralCount} {referralCount === 1 ? 'referral' : 'referrals'}
//                   </Text>
//                 </View>

//                 {/* Rating */}
//                 <View style={styles.ratingSection}>
//                   <Text style={styles.ratingTitle}>Rate Us</Text>
//                   <View style={styles.starsRow}>
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
//                         <Ionicons
//                           name="star"
//                           size={fontScale(24)}
//                           color={star <= rating ? "#f3893d" : "#e1e1e1ee"}
//                         />
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                   <View style={styles.feedbackContainer}>
//                     <Text style={styles.feedbackTitle}>Feedback</Text>
//                     <TextInput
//                       placeholder="Enter your feedback"
//                       placeholderTextColor="rgb(169, 169, 167)"
//                       style={styles.feedbackInput}
//                       multiline
//                       numberOfLines={3}
//                       value={feedback}
//                       onChangeText={setFeedback}
//                     />
//                     <TouchableOpacity
//                       style={[styles.feedbackButton, submittingFeedback && { opacity: 0.6 }]}
//                       onPress={handleFeedbackSubmit}
//                       disabled={submittingFeedback}
//                     >
//                       <Text style={styles.feedbackButtonText}>
//                         {submittingFeedback ? "Submitting..." : "Send Feedback"}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>

//               {/* ACCOUNT SECTION */}
//               <Text style={[styles.sectionLabel, { marginTop: hp(3) }]}>Account</Text>
//               <View style={styles.accountCard}>
//                 {/* Delete Account */}
//                 <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
//                   <View style={styles.buttonContent}>
//                     <Ionicons name="trash" size={fontScale(32)} color={"#ffffff"} />
//                     <Text style={styles.deleteButtonText}>Delete Account</Text>
//                   </View>
//                   <Ionicons name="chevron-forward" size={fontScale(26)} color={"rgb(216, 216, 216)"} />
//                 </TouchableOpacity>

//                 {/* Logout */}
//                 <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//                   <View style={styles.buttonContent}>
//                     <Ionicons name="log-out" size={fontScale(32)} color={"#5a5a5a"} />
//                     <Text style={styles.logoutButtonText}>Logout</Text>
//                   </View>
//                   <Ionicons name="chevron-forward" size={fontScale(26)} color={"rgb(26, 26, 26)"} />
//                 </TouchableOpacity>
//               </View>

//               <View style={{ height: hp(10) }} />
//             </ScrollView>
//           </KeyboardAvoidingView>

//           {/* Conversion Modal */}
//           {showConversionModal && (
//             <View style={styles.modalOverlay}>
//               <View style={styles.modalContainer}>
//                 <Text style={styles.modalTitle}>Convert Points to Coins</Text>
//                 <Text style={styles.modalSubtitle}>
//                   You have {referralPoints} points
//                 </Text>

//                 <View style={styles.conversionInfo}>
//                   <Ionicons name="information-circle" size={fontScale(20)} color="#3b48b9" />
//                   <Text style={styles.conversionInfoText}>10 points = 1 coin</Text>
//                 </View>

//                 <TextInput
//                   style={styles.modalInput}
//                   placeholder="Enter points (multiples of 10)"
//                   placeholderTextColor="#999"
//                   keyboardType="numeric"
//                   value={pointsToConvert}
//                   onChangeText={setPointsToConvert}
//                 />

//                 {pointsToConvert && parseInt(pointsToConvert) >= 10 && (
//                   <View style={styles.conversionPreview}>
//                     <Text style={styles.conversionPreviewText}>
//                       You will receive: {Math.floor(parseInt(pointsToConvert) / 10)} coins
//                     </Text>
//                   </View>
//                 )}

//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.cancelButton]}
//                     onPress={() => {
//                       setShowConversionModal(false);
//                       setPointsToConvert('');
//                     }}
//                   >
//                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.confirmButton]}
//                     onPress={handleConvertPoints}
//                   >
//                     <Text style={styles.confirmButtonText}>Convert</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* Upload Avatar Loading Overlay */}
//           {uploadingAvatar && (
//             <View style={styles.loadingOverlay}>
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#3b48b9" />
//                 <Text style={styles.loadingText}>Uploading profile picture...</Text>
//               </View>
//             </View>
//           )}
//         </SafeAreaView>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   backgroundImage: { flex: 1, width: "100%", height: "100%" },
//   overlay: { flex: 1, backgroundColor: "rgba(12, 12, 12, 0.75)" },
//   container: { flex: 1, marginHorizontal: wp(5), marginVertical: hp(1) },
//   profileHeader: { alignItems: "center", paddingVertical: hp(2) },
//   avatarContainer: { position: "relative", marginBottom: hp(1) },
//   avatar: {
//     width: wp(20), height: wp(20), borderRadius: wp(10),
//     backgroundColor: "#3b48b9", justifyContent: "center", alignItems: "center",
//     borderWidth: 3, borderColor: "rgba(255, 255, 255, 0.2)",
//   },
//   avatarImage: {
//     width: wp(20), height: wp(20), borderRadius: wp(10),
//     borderWidth: 3, borderColor: "rgba(255, 255, 255, 0.2)",
//   },
//   editAvatarButton: {
//     position: "absolute", bottom: 0, right: 0, backgroundColor: "#4d5aee",
//     width: wp(7), height: wp(7), borderRadius: wp(3.5),
//     justifyContent: "center", alignItems: "center",
//     borderWidth: 2, borderColor: "rgba(26, 26, 31, 0.95)",
//   },
//   username: { color: "white", fontSize: fontScale(20), fontWeight: "700", marginBottom: hp(0.2) },
//   userId: { color: "rgba(180, 180, 180, 0.7)", fontSize: fontScale(11), fontWeight: "500" },
//   text: { color: "white", fontSize: fontScale(24), fontWeight: "bold", marginBottom: hp(2) },
//   scrollContent: { gap: hp(1.5), paddingRight: wp(4), alignItems: "flex-start", paddingBottom: hp(5) },
//   sectionLabel: { color: "#b0b0b0e4", fontSize: fontScale(16), marginBottom: hp(0.5) },
//   card: {
//     backgroundColor: "rgba(18, 18, 18, 0.05)", width: "100%", marginTop: hp(0.1),
//     borderRadius: wp(2.5), paddingHorizontal: wp(2.5), paddingVertical: hp(2),
//     gap: hp(1.5), borderRightColor: "rgba(23, 23, 23, 0.24)",
//   },
//   emailContainer: { justifyContent: "space-between", flexDirection: "row", alignItems: "center", gap: wp(5), marginBottom: hp(0.5) },
//   emailLabel: { fontSize: fontScale(16), color: "#757575", fontWeight: "500" },
//   emailValue: { fontSize: fontScale(14), color: "rgba(180, 180, 180, 0.87)", fontWeight: "400" },
//   buttonSpacing: { marginTop: hp(1.5) },
//   actionButton: {
//     width: "100%", backgroundColor: "#3b48b9", paddingVertical: hp(1),
//     paddingHorizontal: wp(2.5), borderRadius: wp(2.5), flexDirection: "row",
//     alignItems: "center", justifyContent: "space-between",
//     shadowColor: "rgba(0, 0, 0, 0.05)", shadowOpacity: 0.5, elevation: 10,
//     shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
//   },
//   buttonContent: { flexDirection: "row", alignItems: "center", gap: wp(7) },
//   buttonText: { fontSize: fontScale(15), fontWeight: "500", color: "#ffffff" },
//   referralSection: { marginTop: hp(2.5), paddingTop: hp(2.5), borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.1)" },
//   referralTitle: { fontSize: fontScale(16), fontWeight: "500", color: "#757575", marginBottom: hp(1.5) },
//   referralCodeContainer: { flexDirection: "row", gap: wp(2.5) },
//   codeBox: {
//     flex: 1, backgroundColor: "rgba(59, 72, 185, 0.2)", borderWidth: 1,
//     borderColor: "#3b48b9", borderRadius: wp(2.5), paddingVertical: hp(1.5),
//     paddingHorizontal: wp(4), flexDirection: "row", alignItems: "center",
//   },
//   codeText: { fontSize: fontScale(16), fontWeight: "700", color: "#ffffff", letterSpacing: 1 },
//   copyButton: {
//     backgroundColor: "#3b48b9", paddingHorizontal: wp(4), borderRadius: wp(2.5),
//     flexDirection: "row", alignItems: "center", gap: wp(1.5),
//     shadowColor: "rgba(0, 0, 0, 0.05)", shadowOpacity: 0.5, elevation: 10,
//     shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
//   },
//   copyButtonText: { color: "#ffffff", fontSize: fontScale(14), fontWeight: "600" },
//   referralSubtext: { fontSize: fontScale(12), color: "rgba(180, 180, 180, 0.7)", marginTop: hp(1) },
//   ratingSection: { marginTop: hp(1.5) },
//   ratingTitle: { fontSize: fontScale(16), fontWeight: "500", color: "#707070" },
//   starsRow: { marginTop: hp(1), flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: wp(2) },
//   feedbackContainer: { marginTop: hp(2) },
//   feedbackTitle: { fontSize: fontScale(16), fontWeight: "500", color: "#707070", marginBottom: hp(1) },
//   feedbackInput: {
//     borderRadius: wp(2.5), marginBottom: hp(1.5), backgroundColor: "rgba(42, 42, 42, 0.5)",
//     paddingHorizontal: wp(3), paddingVertical: hp(1.5), color: "#ffffff",
//     fontSize: fontScale(14), borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)",
//     minHeight: hp(10), textAlignVertical: "top",
//   },
//   feedbackButton: { backgroundColor: "#3b48b9", paddingVertical: hp(1.2), borderRadius: wp(2.5), alignItems: "center" },
//   feedbackButtonText: { color: "#ffffff", fontSize: fontScale(14), fontWeight: "600" },
//   accountCard: {
//     backgroundColor: "rgba(59, 59, 58, 0.17)", width: "100%", marginTop: hp(2),
//     borderRadius: wp(5), paddingHorizontal: wp(2.5), paddingVertical: hp(2.5), gap: hp(2.5),
//   },
//   deleteButton: {
//     width: "100%", backgroundColor: "#aa2323", paddingVertical: hp(1.2),
//     paddingHorizontal: wp(2.5), borderRadius: wp(2.5), flexDirection: "row",
//     alignItems: "center", justifyContent: "space-between",
//     shadowColor: "rgb(255, 62, 62)", shadowOpacity: 0.5, elevation: 10,
//     shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
//   },
//   deleteButtonText: { fontSize: fontScale(18), fontWeight: "600", color: "#ffffff" },
//   logoutButton: {
//     width: "100%", backgroundColor: "#ffffff", paddingVertical: hp(1.2),
//     paddingHorizontal: wp(2.5), borderRadius: wp(2.5), flexDirection: "row",
//     alignItems: "center", justifyContent: "space-between",
//     shadowColor: "rgba(255, 255, 255, 0.04)", shadowOpacity: 0.5, elevation: 10,
//     shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
//   },
//   logoutButtonText: { fontSize: fontScale(18), fontWeight: "600", color: "#1b1b1b" },

//   // Rewards section
//   rewardsCard: {
//     backgroundColor: "rgba(18, 18, 18, 0.5)", width: "100%", marginTop: hp(0.1),
//     borderRadius: wp(2.5), paddingHorizontal: wp(4), paddingVertical: hp(2.5),
//     borderWidth: 1, borderColor: "rgba(59, 72, 185, 0.3)",
//   },
//   rewardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: hp(2) },
//   rewardItem: { flexDirection: "row", alignItems: "center", gap: wp(3), flex: 1 },
//   rewardIconContainer: {
//     width: wp(12), height: wp(12), borderRadius: wp(6),
//     backgroundColor: "rgba(59, 72, 185, 0.2)", justifyContent: "center", alignItems: "center",
//   },
//   rewardLabel: { fontSize: fontScale(12), color: "#b0b0b0", fontWeight: "500" },
//   rewardValue: { fontSize: fontScale(24), color: "#ffffff", fontWeight: "700" },
//   convertButton: {
//     backgroundColor: "#3b48b9", paddingVertical: hp(1.5), borderRadius: wp(2.5),
//     flexDirection: "row", alignItems: "center", justifyContent: "center", gap: wp(2),
//     marginBottom: hp(1.5),
//   },
//   convertButtonText: { color: "#ffffff", fontSize: fontScale(14), fontWeight: "600" },
//   rewardHint: { fontSize: fontScale(11), color: "rgba(180, 180, 180, 0.7)", textAlign: "center" },
//   rouletteButton: {
//     backgroundColor: "rgba(245, 158, 11, 0.3)", paddingVertical: hp(1.5),
//     borderRadius: wp(2.5), flexDirection: "row", alignItems: "center",
//     justifyContent: "center", gap: wp(2), marginTop: hp(1.5),
//     borderWidth: 1, borderColor: "#f59e0b",
//   },
//   rouletteButtonText: { color: "#ffffff", fontSize: fontScale(14), fontWeight: "600" },

//   // Modal styles
//   modalOverlay: {
//     position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.8)", justifyContent: "center", alignItems: "center",
//   },
//   modalContainer: {
//     backgroundColor: "rgba(26, 26, 31, 0.98)", borderRadius: wp(4),
//     paddingHorizontal: wp(6), paddingVertical: hp(3), width: wp(85),
//     borderWidth: 1, borderColor: "rgba(59, 72, 185, 0.5)",
//   },
//   modalTitle: {
//     fontSize: fontScale(20), fontWeight: "700", color: "#ffffff",
//     textAlign: "center", marginBottom: hp(1),
//   },
//   modalSubtitle: {
//     fontSize: fontScale(14), color: "#b0b0b0", textAlign: "center", marginBottom: hp(2),
//   },
//   conversionInfo: {
//     flexDirection: "row", alignItems: "center", justifyContent: "center",
//     gap: wp(2), backgroundColor: "rgba(59, 72, 185, 0.2)",
//     paddingVertical: hp(1), paddingHorizontal: wp(3), borderRadius: wp(2),
//     marginBottom: hp(2),
//   },
//   conversionInfoText: { fontSize: fontScale(14), color: "#ffffff", fontWeight: "500" },
//   modalInput: {
//     backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: wp(2.5),
//     paddingHorizontal: wp(4), paddingVertical: hp(1.5), color: "#ffffff",
//     fontSize: fontScale(16), borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)",
//     marginBottom: hp(2),
//   },
//   conversionPreview: {
//     backgroundColor: "rgba(245, 158, 11, 0.2)", paddingVertical: hp(1),
//     paddingHorizontal: wp(3), borderRadius: wp(2), marginBottom: hp(2),
//     borderWidth: 1, borderColor: "#f59e0b",
//   },
//   conversionPreviewText: {
//     fontSize: fontScale(14), color: "#f59e0b", fontWeight: "600", textAlign: "center",
//   },
//   modalButtons: { flexDirection: "row", gap: wp(3) },
//   modalButton: {
//     flex: 1, paddingVertical: hp(1.5), borderRadius: wp(2.5),
//     alignItems: "center", justifyContent: "center",
//   },
//   cancelButton: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
//   cancelButtonText: { color: "#ffffff", fontSize: fontScale(14), fontWeight: "600" },
//   confirmButton: { backgroundColor: "#3b48b9" },
//   confirmButtonText: { color: "#ffffff", fontSize: fontScale(14), fontWeight: "700" },

//   // Loading overlay
//   loadingOverlay: {
//     position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.7)", justifyContent: "center", alignItems: "center",
//   },
//   loadingContainer: {
//     backgroundColor: "rgba(26, 26, 31, 0.95)", borderRadius: wp(4),
//     paddingHorizontal: wp(8), paddingVertical: hp(3), alignItems: "center",
//   },
//   loadingText: {
//     color: "#ffffff", fontSize: fontScale(14), marginTop: hp(2), fontWeight: "500",
//   },
// });

import { submitFeedback } from "@/lib/firestoreService";
import { fontScale, hp, wp } from "@/lib/responsive";
import { uploadProfilePicture } from "@/lib/storageService";
import {
  signOut as customSignOut,
  deleteUserAccount,
  getCurrentUser,
  getUserAvatar,
  updateUserAvatar,
} from "@/lib/supabaseAuthService";
import { useUser } from "@/lib/userContext";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

let ImageCropper: any = null;
try {
  ImageCropper = require("expo-image-cropper");
} catch (e) {
  console.log("expo-image-cropper not available");
}

export default function Profile() {
  const router = useRouter();
  const { userData, updateAvatar } = useUser();

  const [avatarUri, setAvatarUri] = useState<string | null>(userData.avatarUri);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [referralCode, setReferralCode] = useState("Loading...");
  const [referralCount, setReferralCount] = useState(0);
  const [referralPoints, setReferralPoints] = useState(0);
  const [coins, setCoins] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [pointsToConvert, setPointsToConvert] = useState("");

  // ─── Load user profile from Supabase ───────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get current user with referral code
        const user = await getCurrentUser();
        if (user?.referral_code) {
          setReferralCode(user.referral_code);
        } else {
          // Generate temporary referral code if not available
          const tempCode = generateTempReferralCode();
          setReferralCode(tempCode);
        }

        setReferralCount(0);
        setReferralPoints(0);
        setCoins(0);

        // Load avatar from Supabase
        try {
          const avatarUrl = await getUserAvatar();
          if (avatarUrl) {
            setAvatarUri(avatarUrl);
            updateAvatar(avatarUrl);
          }
        } catch (avatarError) {
          console.log("Could not load avatar from Supabase:", avatarError);
        }
      } catch (e) {
        console.error("Error loading profile:", e);
        const fallbackCode = generateTempReferralCode();
        setReferralCode(fallbackCode);
      }
    };
    loadProfile();
  }, []);

  const generateTempReferralCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyToClipboard = async () => {
    // Use web URL for referral
    const webUrl = `https://skibag.vercel.app/?ref=${referralCode}`;
    await Clipboard.setStringAsync(webUrl);
    Alert.alert("Copied!", "Referral link copied to clipboard");
  };

  // ─── Share Referral Link ──────────────────────────────────────────────────
  const handleShareReferral = async () => {
    try {
      // Use web URL for referral
      const webUrl = `https://skibag.vercel.app/?ref=${referralCode}`;

      await Share.share({
        message: `Join me on Skibag and get bonus coins! Use my referral link: ${webUrl}`,
      });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleStarPress = (star: number) => {
    if (rating === star) {
      setRating(0);
    } else {
      setRating(star);
    }
  };

  // ─── Submit Feedback ──────────────────────────────────────────────────────
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert(
        "Empty Feedback",
        "Please enter your feedback before submitting.",
      );
      return;
    }
    if (rating === 0) {
      Alert.alert(
        "Rating Required",
        "Please select a star rating before submitting.",
      );
      return;
    }
    try {
      setSubmittingFeedback(true);

      // Determine category based on rating
      const category =
        rating >= 4 ? "feature" : rating <= 2 ? "bug" : "general";

      // Submit feedback to Supabase
      await submitFeedback(feedback, rating, category);

      Alert.alert("Thank you!", "Your feedback has been submitted.");
      setFeedback("");
      setRating(0);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Sign out from custom auth
            await customSignOut();

            // Navigate to onboard screen
            router.replace("/(onboardScreen)");
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  // ─── Delete Account ────────────────────────────────────────────────────────
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserAccount();
              Alert.alert("Success", "Your account has been deleted.");
              router.replace("/(auth)");
            } catch (e: any) {
              Alert.alert(
                "Error",
                e.message || "Failed to delete account. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Camera permission is required to take photos.",
          );
          return;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Photo library permission is required to select photos.",
          );
          return;
        }
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            aspect: [1, 1],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            aspect: [1, 1],
          });

      if (!result.canceled && result.assets[0]) {
        const localUri = result.assets[0].uri;

        try {
          // Get current user
          const user = await getCurrentUser();
          if (!user) {
            throw new Error("User not authenticated");
          }

          // Update local state immediately for better UX
          setAvatarUri(localUri);
          setUploadingAvatar(true);
          updateAvatar(localUri);

          // Try to upload to Supabase Storage
          try {
            const uploadedUrl = await uploadProfilePicture(localUri, user.id);

            // Save the URL to Supabase database
            await updateUserAvatar(uploadedUrl);

            // Update local context with the remote URL
            updateAvatar(uploadedUrl);
            setAvatarUri(uploadedUrl);

            Alert.alert("Success", "Profile picture updated!");
          } catch (uploadError) {
            console.log("Upload failed, keeping local avatar:", uploadError);
            Alert.alert("Success", "Profile picture updated locally!");
          }
        } catch (error) {
          console.error("Error updating avatar:", error);
          // Keep the local avatar even if upload fails
          Alert.alert(
            "Success",
            "Profile picture updated locally. Will sync when connected.",
          );
        } finally {
          setUploadingAvatar(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleConvertPoints = async () => {
    const points = parseInt(pointsToConvert);

    if (isNaN(points) || points <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid number of points");
      return;
    }

    if (points % 10 !== 0) {
      Alert.alert("Invalid Amount", "Points must be in multiples of 10");
      return;
    }

    if (points > referralPoints) {
      Alert.alert(
        "Insufficient Points",
        `You only have ${referralPoints} points`,
      );
      return;
    }

    try {
      // TODO: Implement convertPointsToCoins with your backend
      // const coinsEarned = await yourBackend.convertPointsToCoins(points);

      Alert.alert("Info", "Points conversion needs to be implemented");
      setPointsToConvert("");
      setShowConversionModal(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to convert points");
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Change Profile Photo",
      "Choose an option",
      [
        { text: "Take Photo", onPress: () => pickImage(true) },
        { text: "Choose from Gallery", onPress: () => pickImage(false) },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    );
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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
          >
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={showImagePickerOptions}>
                  {avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatar}>
                      <Ionicons
                        name="person"
                        size={fontScale(36)}
                        color="#ffffff"
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editAvatarButton}
                  onPress={showImagePickerOptions}
                >
                  <Ionicons
                    name="camera"
                    size={fontScale(12)}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.username}>
                {userData?.username ?? "Player"}
              </Text>
              <Text style={styles.userId}>{userData?.email ?? ""}</Text>
            </View>

            <View
              style={{
                alignItems: "flex-start",
                marginVertical: hp(1),
                alignSelf: "center",
              }}
            >
              <Text style={styles.text}>Profile</Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* POINTS & COINS SECTION */}
              <Text style={styles.sectionLabel}>Rewards</Text>
              <View style={styles.rewardsCard}>
                <View style={styles.rewardRow}>
                  <View style={styles.rewardItem}>
                    <View style={styles.rewardIconContainer}>
                      <Ionicons
                        name="star"
                        size={fontScale(28)}
                        color="#f59e0b"
                      />
                    </View>
                    <View>
                      <Text style={styles.rewardLabel}>Referral Points</Text>
                      <Text style={styles.rewardValue}>{referralPoints}</Text>
                    </View>
                  </View>
                  <View style={styles.rewardItem}>
                    <View style={styles.rewardIconContainer}>
                      <Image
                        source={require("@/assets/badges/coin.png")}
                        style={{ width: wp(8), height: wp(8) }}
                      />
                    </View>
                    <View>
                      <Text style={styles.rewardLabel}>Coins</Text>
                      <Text style={styles.rewardValue}>{coins}</Text>
                    </View>
                  </View>
                </View>

                {referralPoints >= 10 && (
                  <TouchableOpacity
                    style={styles.convertButton}
                    onPress={() => setShowConversionModal(true)}
                  >
                    <Ionicons
                      name="swap-horizontal"
                      size={fontScale(20)}
                      color="#ffffff"
                    />
                    <Text style={styles.convertButtonText}>
                      Convert Points to Coins
                    </Text>
                  </TouchableOpacity>
                )}

                <Text style={styles.rewardHint}>
                  🎁 Earn 100 points for each referral • 10 points = 1 coin
                </Text>

                {coins >= 10 && (
                  <TouchableOpacity
                    style={styles.rouletteButton}
                    onPress={() => router.push("/roulette")}
                  >
                    <Ionicons
                      name="play-circle"
                      size={fontScale(24)}
                      color="#ffffff"
                    />
                    <Text style={styles.rouletteButtonText}>
                      Play Roulette Game
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={fontScale(20)}
                      color="#ffffff"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* GENERAL SECTION */}
              <Text style={styles.sectionLabel}>General</Text>
              <View style={styles.card}>
                {/* Email Address */}
                <View style={styles.emailContainer}>
                  <Text style={styles.emailLabel}>Email address:</Text>
                  <Text style={styles.emailValue}>
                    {userData?.email ?? "No email"}
                  </Text>
                </View>

                {/* Language */}
                <View style={styles.buttonSpacing}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/language")}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons
                        name="globe"
                        size={fontScale(24)}
                        color={"#ffffff"}
                      />
                      <Text style={styles.buttonText}>Select Language</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={fontScale(26)}
                      color={"rgb(216, 216, 216)"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Privacy Policy */}
                <View style={styles.buttonSpacing}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/privacy-policy")}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons
                        name="key"
                        size={fontScale(24)}
                        color={"#ffffff"}
                      />
                      <Text style={styles.buttonText}>Privacy Policy</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={fontScale(26)}
                      color={"rgb(216, 216, 216)"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Terms of Use */}
                <View style={styles.buttonSpacing}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/terms-of-use")}
                  >
                    <View style={styles.buttonContent}>
                      <Ionicons
                        name="flag"
                        size={fontScale(20)}
                        color={"#ffffff"}
                      />
                      <Text style={styles.buttonText}>Terms of use</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={fontScale(26)}
                      color={"rgb(216, 216, 216)"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Referral Code */}
                <View style={styles.referralSection}>
                  <Text style={styles.referralTitle}>Invite Friends</Text>
                  <View style={styles.referralRow}>
                    {/* Referral Link Field */}
                    <TouchableOpacity
                      style={styles.referralLinkBox}
                      onPress={copyToClipboard}
                    >
                      <Text style={styles.referralLinkText} numberOfLines={1}>
                        https://skibag.vercel.app/?ref={referralCode}
                      </Text>
                      <Ionicons
                        name="copy-outline"
                        size={fontScale(18)}
                        color={"#ffffff"}
                        style={{ marginLeft: wp(2) }}
                      />
                    </TouchableOpacity>
                    {/* Share Button */}
                    <TouchableOpacity
                      onPress={handleShareReferral}
                      style={styles.shareButton}
                    >
                      <Ionicons
                        name="share-social-outline"
                        size={fontScale(20)}
                        color={"#ffffff"}
                      />
                      <Text style={styles.copyButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Rating */}
                <View style={styles.ratingSection}>
                  <Text style={styles.ratingTitle}>Rate Us</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => handleStarPress(star)}
                      >
                        <Ionicons
                          name="star"
                          size={fontScale(24)}
                          color={star <= rating ? "#f3893d" : "#e1e1e1ee"}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackTitle}>Feedback</Text>
                    <TextInput
                      placeholder="Enter your feedback"
                      placeholderTextColor="rgb(169, 169, 167)"
                      style={styles.feedbackInput}
                      multiline
                      numberOfLines={3}
                      value={feedback}
                      onChangeText={setFeedback}
                    />
                    <TouchableOpacity
                      style={[
                        styles.feedbackButton,
                        submittingFeedback && { opacity: 0.6 },
                      ]}
                      onPress={handleFeedbackSubmit}
                      disabled={submittingFeedback}
                    >
                      <Text style={styles.feedbackButtonText}>
                        {submittingFeedback ? "Submitting..." : "Send Feedback"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* ACCOUNT SECTION */}
              <Text style={[styles.sectionLabel, { marginTop: hp(3) }]}>
                Account
              </Text>
              <View style={styles.accountCard}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteAccount}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="trash"
                      size={fontScale(32)}
                      color={"#ffffff"}
                    />
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={fontScale(26)}
                    color={"rgb(216, 216, 216)"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="log-out"
                      size={fontScale(32)}
                      color={"#5a5a5a"}
                    />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={fontScale(26)}
                    color={"rgb(26, 26, 26)"}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ height: hp(10) }} />
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Conversion Modal */}
          {showConversionModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Convert Points to Coins</Text>
                <Text style={styles.modalSubtitle}>
                  You have {referralPoints} points
                </Text>
                <View style={styles.conversionInfo}>
                  <Ionicons
                    name="information-circle"
                    size={fontScale(20)}
                    color="#3b48b9"
                  />
                  <Text style={styles.conversionInfoText}>
                    10 points = 1 coin
                  </Text>
                </View>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter points (multiples of 10)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={pointsToConvert}
                  onChangeText={setPointsToConvert}
                />
                {pointsToConvert && parseInt(pointsToConvert) >= 10 && (
                  <View style={styles.conversionPreview}>
                    <Text style={styles.conversionPreviewText}>
                      You will receive:{" "}
                      {Math.floor(parseInt(pointsToConvert) / 10)} coins
                    </Text>
                  </View>
                )}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowConversionModal(false);
                      setPointsToConvert("");
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleConvertPoints}
                  >
                    <Text style={styles.confirmButtonText}>Convert</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Upload Avatar Loading Overlay */}
          {uploadingAvatar && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b48b9" />
                <Text style={styles.loadingText}>
                  Uploading profile picture...
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(12, 12, 12, 0.75)" },
  container: { flex: 1, marginHorizontal: wp(5), marginVertical: hp(1) },
  profileHeader: { alignItems: "center", paddingVertical: hp(2) },
  avatarContainer: { position: "relative", marginBottom: hp(1) },
  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "#3b48b9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  avatarImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4d5aee",
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(26, 26, 31, 0.95)",
  },
  username: {
    color: "white",
    fontSize: fontScale(20),
    fontWeight: "700",
    marginBottom: hp(0.2),
  },
  userId: {
    color: "rgba(180, 180, 180, 0.7)",
    fontSize: fontScale(11),
    fontWeight: "500",
  },
  text: {
    color: "white",
    fontSize: fontScale(24),
    fontWeight: "bold",
    marginBottom: hp(2),
  },
  scrollContent: {
    gap: hp(1.5),
    paddingRight: wp(4),
    alignItems: "flex-start",
    paddingBottom: hp(5),
  },
  sectionLabel: {
    color: "#b0b0b0e4",
    fontSize: fontScale(16),
    marginBottom: hp(0.5),
  },
  card: {
    backgroundColor: "rgba(18, 18, 18, 0.05)",
    width: "100%",
    marginTop: hp(0.1),
    borderRadius: wp(2.5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(2),
    gap: hp(1.5),
    borderRightColor: "rgba(23, 23, 23, 0.24)",
  },
  emailContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(5),
    marginBottom: hp(0.5),
  },
  emailLabel: { fontSize: fontScale(16), color: "#757575", fontWeight: "500" },
  emailValue: {
    fontSize: fontScale(14),
    color: "rgba(180, 180, 180, 0.87)",
    fontWeight: "400",
  },
  buttonSpacing: { marginTop: hp(1.5) },
  actionButton: {
    width: "100%",
    backgroundColor: "#3b48b9",
    paddingVertical: hp(1),
    paddingHorizontal: wp(2.5),
    borderRadius: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonContent: { flexDirection: "row", alignItems: "center", gap: wp(7) },
  buttonText: { fontSize: fontScale(15), fontWeight: "500", color: "#ffffff" },
  referralSection: {
    marginTop: hp(2.5),
    paddingTop: hp(2.5),
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  referralTitle: {
    fontSize: fontScale(16),
    fontWeight: "500",
    color: "#757575",
    marginBottom: hp(1.5),
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
  },
  referralLinkBox: {
    flex: 1,
    backgroundColor: "rgba(59, 72, 185, 0.2)",
    borderWidth: 1,
    borderColor: "#3b48b9",
    borderRadius: wp(2.5),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  referralLinkText: {
    fontSize: fontScale(11),
    fontWeight: "500",
    color: "#ffffff",
    flex: 1,
  },
  referralCodeContainer: { flexDirection: "row", gap: wp(2.5) },
  codeBox: {
    flex: 1,
    backgroundColor: "rgba(59, 72, 185, 0.2)",
    borderWidth: 1,
    borderColor: "#3b48b9",
    borderRadius: wp(2.5),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
  },
  codeText: {
    fontSize: fontScale(16),
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: "#3b48b9",
    paddingHorizontal: wp(4),
    borderRadius: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  shareButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: wp(4),
    borderRadius: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  copyButtonText: {
    color: "#ffffff",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  referralSubtext: {
    fontSize: fontScale(12),
    color: "rgba(180, 180, 180, 0.7)",
    marginTop: hp(1),
  },
  ratingSection: { marginTop: hp(1.5) },
  ratingTitle: { fontSize: fontScale(16), fontWeight: "500", color: "#707070" },
  starsRow: {
    marginTop: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: wp(2),
  },
  feedbackContainer: { marginTop: hp(2) },
  feedbackTitle: {
    fontSize: fontScale(16),
    fontWeight: "500",
    color: "#707070",
    marginBottom: hp(1),
  },
  feedbackInput: {
    borderRadius: wp(2.5),
    marginBottom: hp(1.5),
    backgroundColor: "rgba(42, 42, 42, 0.5)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    color: "#ffffff",
    fontSize: fontScale(14),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    minHeight: hp(10),
    textAlignVertical: "top",
  },
  feedbackButton: {
    backgroundColor: "#3b48b9",
    paddingVertical: hp(1.2),
    borderRadius: wp(2.5),
    alignItems: "center",
  },
  feedbackButtonText: {
    color: "#ffffff",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  accountCard: {
    backgroundColor: "rgba(59, 59, 58, 0.17)",
    width: "100%",
    marginTop: hp(2),
    borderRadius: wp(5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(2.5),
    gap: hp(2.5),
  },
  deleteButton: {
    width: "100%",
    backgroundColor: "#aa2323",
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2.5),
    borderRadius: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgb(255, 62, 62)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  deleteButtonText: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: "#ffffff",
  },
  logoutButton: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2.5),
    borderRadius: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgba(255, 255, 255, 0.04)",
    shadowOpacity: 0.5,
    elevation: 10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  logoutButtonText: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: "#1b1b1b",
  },
  rewardsCard: {
    backgroundColor: "rgba(18, 18, 18, 0.5)",
    width: "100%",
    marginTop: hp(0.1),
    borderRadius: wp(2.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
    borderWidth: 1,
    borderColor: "rgba(59, 72, 185, 0.3)",
  },
  rewardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    flex: 1,
  },
  rewardIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "rgba(59, 72, 185, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  rewardLabel: { fontSize: fontScale(12), color: "#b0b0b0", fontWeight: "500" },
  rewardValue: { fontSize: fontScale(24), color: "#ffffff", fontWeight: "700" },
  convertButton: {
    backgroundColor: "#3b48b9",
    paddingVertical: hp(1.5),
    borderRadius: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    marginBottom: hp(1.5),
  },
  convertButtonText: {
    color: "#ffffff",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  rewardHint: {
    fontSize: fontScale(11),
    color: "rgba(180, 180, 180, 0.7)",
    textAlign: "center",
  },
  rouletteButton: {
    backgroundColor: "rgba(245, 158, 11, 0.3)",
    paddingVertical: hp(1.5),
    borderRadius: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    marginTop: hp(1.5),
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  rouletteButtonText: {
    color: "#ffffff",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "rgba(26, 26, 31, 0.98)",
    borderRadius: wp(4),
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
    width: wp(85),
    borderWidth: 1,
    borderColor: "rgba(59, 72, 185, 0.5)",
  },
  modalTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: hp(1),
  },
  modalSubtitle: {
    fontSize: fontScale(14),
    color: "#b0b0b0",
    textAlign: "center",
    marginBottom: hp(2),
  },
  conversionInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    backgroundColor: "rgba(59, 72, 185, 0.2)",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  conversionInfoText: {
    fontSize: fontScale(14),
    color: "#ffffff",
    fontWeight: "500",
  },
  modalInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    color: "#ffffff",
    fontSize: fontScale(16),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: hp(2),
  },
  conversionPreview: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  conversionPreviewText: {
    fontSize: fontScale(14),
    color: "#f59e0b",
    fontWeight: "600",
    textAlign: "center",
  },
  modalButtons: { flexDirection: "row", gap: wp(3) },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: wp(2.5),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  confirmButton: { backgroundColor: "#3b48b9" },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: fontScale(14),
    fontWeight: "700",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "rgba(26, 26, 31, 0.95)",
    borderRadius: wp(4),
    paddingHorizontal: wp(8),
    paddingVertical: hp(3),
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: fontScale(14),
    marginTop: hp(2),
    fontWeight: "500",
  },
});
