import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

/**
 * Upload profile picture to Firebase Storage
 * @param uri - Local file URI
 * @returns Download URL of uploaded image
 */
export const uploadProfilePicture = async (uri: string): Promise<string> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    const filename = `profile_${user.uid}_${Date.now()}.jpg`;
    const reference = storage().ref(`avatars/${filename}`);

    // Upload file
    await reference.putFile(uri);

    // Get download URL
    const downloadURL = await reference.getDownloadURL();
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture');
  }
};

/**
 * Delete old profile picture from Firebase Storage
 * @param photoURL - Firebase Storage URL to delete
 */
export const deleteProfilePicture = async (photoURL: string): Promise<void> => {
  try {
    if (!photoURL || !photoURL.includes('firebase')) return;
    
    const reference = storage().refFromURL(photoURL);
    await reference.delete();
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    // Don't throw - it's okay if deletion fails
  }
};

/**
 * Upload game screenshot or media
 * @param uri - Local file URI
 * @param gameId - Game identifier
 * @returns Download URL of uploaded image
 */
export const uploadGameMedia = async (uri: string, gameId: string): Promise<string> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    const filename = `game_${gameId}_${user.uid}_${Date.now()}.jpg`;
    const reference = storage().ref(`game_media/${filename}`);

    await reference.putFile(uri);
    const downloadURL = await reference.getDownloadURL();
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading game media:', error);
    throw new Error('Failed to upload media');
  }
};
