import { supabase } from "./supabase";

const BUCKET = "avatars";

/**
 * Upload profile picture to Supabase Storage.
 * @param uri - Local file URI (from expo-image-picker)
 * @returns Public URL of the uploaded image
 */
export const uploadProfilePicture = async (uri: string): Promise<string> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("User not authenticated");

  const uid = userData.user.id;
  const filename = `profile_${uid}_${Date.now()}.jpg`;
  const path = `${uid}/${filename}`;

  // Fetch the file as a blob
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
};

/**
 * Delete old profile picture from Supabase Storage.
 * @param publicUrl - The public URL previously returned by uploadProfilePicture
 */
export const deleteProfilePicture = async (
  publicUrl: string,
): Promise<void> => {
  try {
    if (!publicUrl || !publicUrl.includes(BUCKET)) return;

    // Extract the storage path from the public URL
    const urlParts = publicUrl.split(`/${BUCKET}/`);
    if (urlParts.length < 2) return;

    const path = urlParts[1];
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    // Non-fatal
  }
};

/**
 * Upload game screenshot or media to Supabase Storage.
 * @param uri - Local file URI
 * @param gameId - Game identifier
 * @returns Public URL of the uploaded image
 */
export const uploadGameMedia = async (
  uri: string,
  gameId: string,
): Promise<string> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("User not authenticated");

  const uid = userData.user.id;
  const filename = `game_${gameId}_${uid}_${Date.now()}.jpg`;
  const path = `game_media/${filename}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
};
