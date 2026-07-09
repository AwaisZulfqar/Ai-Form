import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { getUsers } from "../services/userService";

export interface ForumUser {
  id: string | null;
  name: string;
  avatar: string | null;
}

interface UserContextValue {
  currentUser: ForumUser;
  users: ForumUser[];
  setCurrentUserId: (id: string) => void;
}

const FALLBACK_USER: ForumUser = { id: null, name: "Default User", avatar: null };
const STORAGE_KEY = "ai-forum:actingAs";

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<ForumUser[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let cancelled = false;
    getUsers()
      .then((list) => {
        if (cancelled) return;
        const mapped = list.map((u) => ({ id: u._id, name: u.name, avatar: u.avatar }));
        setUsers(mapped);
        setCurrentId((prev) =>
          prev && mapped.some((m) => m.id === prev) ? prev : (mapped[0]?.id ?? null)
        );
      })
      .catch(() => {
        /* keep the fallback user if the list can't be fetched */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrentUserId = useCallback((id: string) => {
    setCurrentId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentId) ?? users[0] ?? FALLBACK_USER,
    [users, currentId]
  );

  const value = useMemo(
    () => ({ currentUser, users, setCurrentUserId }),
    [currentUser, users, setCurrentUserId]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const useUser = (): ForumUser => useUserContext().currentUser;

export const useUserSwitcher = () => {
  const { users, currentUser, setCurrentUserId } = useUserContext();
  return { users, currentUser, setCurrentUserId };
};
