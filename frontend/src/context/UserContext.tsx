import { createContext, useContext, useState, ReactNode } from "react";

export interface ForumUser {
  id: string | null;
  name: string;
  avatar: string | null;
}

const defaultUser: ForumUser = { id: null, name: "Default User", avatar: null };

const UserContext = createContext<ForumUser | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Static for now; state allows future hydration from the API without a shape change.
  const [user] = useState<ForumUser>(defaultUser);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = (): ForumUser => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
