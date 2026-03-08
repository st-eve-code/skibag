import { supabase } from "./supabase";

const BUCKET = "avatars";

/**
 * Upload profile picture to Supabase Storage.
 * @param uri - Local file URI (from expo-image-picker)
 * @param userId - User ID (required for custom auth)
 * @returns Public URL of the uploaded image
 */
export const uploadProfilePicture = async (
  uri: string,
  userId: string,
): Promise<string> => {
  if (!userId) throw new Error("User ID is required");

  const uid = userId;
  const filename = `profile_${uid}_${Date.now()}.jpg`;
  const path = `${uid}/${filename}`;

  // Create form data for React Native compatibility
  const formData = new FormData();

  // Append the file with proper type
  const fileExtension = uri.split(".").pop() || "jpg";
  const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";

  // @ts-ignore - React Native FormData append
  formData.append("file", {
    uri: uri,
    name: filename,
    type: mimeType,
  });

  const { error } = await supabase.storage.from(BUCKET).upload(path, formData, {
    contentType: mimeType,
    upsert: true,
  });

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
 * @param userId - User ID (required for custom auth)
 * @returns Public URL of the uploaded image
 */
export const uploadGameMedia = async (
  uri: string,
  gameId: string,
  userId: string,
): Promise<string> => {
  if (!userId) throw new Error("User ID is required");

  const uid = userId;
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
