import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { getUserVotes } from "../services/voteService";
import { useUser } from "./UserContext";
import type { VoteValue } from "../types";

type VoteState = 0 | VoteValue;

interface VotesContextValue {
  getVote: (postId: string) => VoteState;
  setVoteLocal: (postId: string, value: VoteState) => void;
}

const VotesContext = createContext<VotesContextValue | undefined>(undefined);

// Holds the acting-as user's votes so every VoteControl reflects that user's
// real up/down state; refetched whenever the acting-as user changes.
export const VotesProvider = ({ children }: { children: ReactNode }) => {
  const { id: userId } = useUser();
  const [votes, setVotes] = useState<Record<string, VoteValue>>({});

  useEffect(() => {
    if (!userId) {
      setVotes({});
      return;
    }
    let cancelled = false;
    getUserVotes(userId)
      .then((list) => {
        if (cancelled) return;
        const map: Record<string, VoteValue> = {};
        list.forEach((v) => {
          map[v.postId] = v.value;
        });
        setVotes(map);
      })
      .catch(() => {
        if (!cancelled) setVotes({});
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = useMemo<VotesContextValue>(
    () => ({
      getVote: (postId) => votes[postId] ?? 0,
      setVoteLocal: (postId, vote) =>
        setVotes((prev) => {
          const next = { ...prev };
          if (vote === 0) delete next[postId];
          else next[postId] = vote;
          return next;
        }),
    }),
    [votes]
  );

  return <VotesContext.Provider value={value}>{children}</VotesContext.Provider>;
};

export const useVotes = (): VotesContextValue => {
  const context = useContext(VotesContext);
  if (!context) {
    throw new Error("useVotes must be used within a VotesProvider");
  }
  return context;
};
