import { supabase } from "./supabase";

export interface FeedbackData {
  id?: string;
  user_id: string | null;
  message: string;
  category?: string | null;
  created_at?: string;
  rating?: number | null;
}

/**
 * Submit user feedback to the database
 * Matches your table structure: id (uuid), user_id (uuid), message (text), category (text), created_at (timestamp), rating (smallint)
 */
export async function submitFeedback(
  userId: string | null,
  message: string,
  rating?: number | null,
  category?: string,
): Promise<{ success: boolean; error?: string; data?: FeedbackData }> {
  try {
    if (!message.trim()) {
      throw new Error("Feedback message cannot be empty");
    }

    if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    const feedbackData: any = {
      user_id: userId,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    // Only add rating if provided
    if (rating !== undefined && rating !== null) {
      feedbackData.rating = rating;
    }

    // Only add category if provided
    if (category && category.trim()) {
      feedbackData.category = category.trim();
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert([feedbackData])
      .select()
      .single();

    if (error) {
      console.error("Error submitting feedback:", error);
      return { success: false, error: error.message };
    }

    console.log("Feedback submitted successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get all feedback (for admin purposes)
 */
export async function getAllFeedback(): Promise<{
  success: boolean;
  data?: FeedbackData[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedback:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getAllFeedback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get user's feedback history
 */
export async function getUserFeedback(userId: string): Promise<{
  success: boolean;
  data?: FeedbackData[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user feedback:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getUserFeedback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check if user has already submitted feedback today
 */
export async function hasSubmittedFeedbackToday(userId: string): Promise<boolean> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from("feedback")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())
      .limit(1);

    if (error) {
      console.error("Error checking today's feedback:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Error in hasSubmittedFeedbackToday:", error);
    return false;
  }
}

/**
 * Get feedback by category
 */
export async function getFeedbackByCategory(category: string): Promise<{
  success: boolean;
  data?: FeedbackData[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedback by category:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getFeedbackByCategory:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get average rating
 */
export async function getAverageRating(): Promise<{
  success: boolean;
  average?: number;
  total?: number;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("rating")
      .not("rating", "is", null);

    if (error) {
      console.error("Error fetching ratings:", error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, average: 0, total: 0 };
    }

    const total = data.length;
    const sum = data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const average = sum / total;

    return { success: true, average, total };
  } catch (error) {
    console.error("Error in getAverageRating:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Delete feedback (admin only)
 */
export async function deleteFeedback(feedbackId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("id", feedbackId);

    if (error) {
      console.error("Error deleting feedback:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteFeedback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}