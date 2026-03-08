import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserData {
  id: string;
  username: string;
  email?: string;
  avatarUri: string | null;
  rank: string;
  score: number;
}

interface UserContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  updateAvatar: (uri: string | null) => void;
  updateRank: (rank: string) => void;
  updateScore: (score: number) => void;
}

const defaultUserData: UserData = {
  id: "",
  username: "Player",
  avatarUri: null,
  rank: "beginner",
  score: 12,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const updateAvatar = (uri: string | null) => {
    setUserData((prev) => ({ ...prev, avatarUri: uri }));
  };

  const updateRank = (rank: string) => {
    setUserData((prev) => ({ ...prev, rank }));
  };

  const updateScore = (score: number) => {
    setUserData((prev) => ({ ...prev, score }));
  };

  return (
    <UserContext.Provider
      value={{ userData, setUserData, updateAvatar, updateRank, updateScore }}
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
