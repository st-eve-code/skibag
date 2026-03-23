import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { supabase } from "../services/supabase";
import { getCurrentUser } from "../services/supabaseAuthService";

// Storage key for user data
const USER_DATA_STORAGE_KEY = "@skibag_user_data";

// Notification types
export type NotificationType =
  | "signup"
  | "login"
  | "game_played"
  | "game_win"
  | "game_loss"
  | "topup"
  | "withdraw"
  | "update"
  | "referral";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface UserData {
  id: string;
  username: string;
  email?: string;
  avatarUri: string | null;
  rank: string;
  score: number;
  day_streak: number;
  last_streak_date?: string;
}

interface UserContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  updateAvatar: (uri: string | null) => void;
  updateRank: (rank: string) => void;
  updateScore: (score: number) => void;
  updateDayStreak: (streak: number, lastDate?: string) => void;
  // Notification system
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;
  isLoading: boolean;
}

const defaultUserData: UserData = {
  id: "",
  username: "",
  avatarUri: null,
  rank: "beginner",
  score: 0,
  day_streak: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper to generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user data from Supabase or custom auth service
  const fetchUserDataFromSupabase = async () => {
    try {
      // First try to get user from custom auth service (for username/password login)
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.username) {
        return {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.username + "@skibag.app",
          avatarUri: currentUser.avatar_url || null,
          rank: currentUser.rank || "beginner",
          score: currentUser.coins || 0,
          day_streak: currentUser.day_streak || 0,
          last_streak_date: currentUser.last_streak_date || undefined,
          referral_code: currentUser.referral_code,
        };
      }

      // Fallback: try Supabase auth session (for OAuth login)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user metadata from users table
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (userData) {
          return {
            id: userData.id,
            username: userData.username,
            email: userData.email || session.user.email,
            avatarUri: userData.avatar_url || null,
            rank: userData.rank || "beginner",
            score: userData.coins || 0,
            day_streak: userData.day_streak || 0,
            last_streak_date: userData.last_streak_date || undefined,
          };
        }
      }

      // Last fallback: Try to get any user from the users table (for persistence check)
      // This helps if the user was previously logged in but session was lost
      const { data: allUsers } = await supabase
        .from("users")
        .select("*")
        .limit(1);

      if (allUsers && allUsers.length > 0) {
        // Don't return random user - this is just to avoid returning null
        console.log("No active session found, waiting for login");
      }
    } catch (error) {
      console.log("Error fetching user data from Supabase:", error);
    }
    return null;
  };

  // Helper function to safely interact with AsyncStorage
  const safeAsyncStorage = {
    getItem: async (key: string): Promise<string | null> => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.log("AsyncStorage getItem error:", error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.log("AsyncStorage setItem error:", error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.log("AsyncStorage removeItem error:", error);
      }
    },
  };

  // Load persisted user data on mount and sync with Supabase
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // First, try to load from AsyncStorage for immediate display
        const storedUserData = await safeAsyncStorage.getItem(
          USER_DATA_STORAGE_KEY,
        );
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
        }

        // Then, try to fetch fresh data from Supabase if user is logged in
        const supabaseUserData = await fetchUserDataFromSupabase();
        if (supabaseUserData) {
          setUserData(supabaseUserData);
          // Update AsyncStorage with fresh data
          await safeAsyncStorage.setItem(
            USER_DATA_STORAGE_KEY,
            JSON.stringify(supabaseUserData),
          );
        }
      } catch (error) {
        console.log("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Listen for auth changes and sync user data
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const supabaseUserData = await fetchUserDataFromSupabase();
        if (supabaseUserData) {
          setUserData(supabaseUserData);
          await safeAsyncStorage.setItem(
            USER_DATA_STORAGE_KEY,
            JSON.stringify(supabaseUserData),
          );
        }
      } else {
        // User logged out, clear data
        setUserData(defaultUserData);
        await safeAsyncStorage.removeItem(USER_DATA_STORAGE_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist user data whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        if (userData.id) {
          // Only save if user is logged in (has an ID)
          await safeAsyncStorage.setItem(
            USER_DATA_STORAGE_KEY,
            JSON.stringify(userData),
          );
        }
      } catch (error) {
        console.log("Error saving user data:", error);
      }
    };

    if (!isLoading) {
      saveUserData();
    }
  }, [userData, isLoading]);

  const updateAvatar = (uri: string | null) => {
    setUserData((prev) => ({ ...prev, avatarUri: uri }));
  };

  const updateRank = (rank: string) => {
    setUserData((prev) => ({ ...prev, rank }));
  };

  const updateScore = (score: number) => {
    setUserData((prev) => ({ ...prev, score }));
  };

  const updateDayStreak = (streak: number, lastDate?: string) => {
    setUserData((prev) => ({
      ...prev,
      day_streak: streak,
      last_streak_date: lastDate || prev.last_streak_date,
    }));
  };

  // Add a new notification
  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
  ) => {
    const newNotification: Notification = {
      id: generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Mark a single notification as read
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Calculate unread count
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        updateAvatar,
        updateRank,
        updateScore,
        updateDayStreak,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadCount,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
