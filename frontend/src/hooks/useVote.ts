import { useCallback, useState } from "react";
import { votePost } from "../services/voteService";
import { useUser } from "../context/UserContext";
import { useVotes } from "../context/VotesContext";
import type { VoteValue } from "../types";

// Per-post vote state. Counts start from the post and are replaced by the
// server's authoritative values after each vote; the user's own up/down state
// comes from VotesContext so it stays correct across user switches.
export const useVote = (postId: string, initialLike: number, initialDislike: number) => {
  const { id: userId } = useUser();
  const { getVote, setVoteLocal } = useVotes();
  const [likeCount, setLikeCount] = useState(initialLike);
  const [dislikeCount, setDislikeCount] = useState(initialDislike);
  const [pending, setPending] = useState(false);

  const userVote = getVote(postId);

  const vote = useCallback(
    async (value: VoteValue) => {
      if (pending) return;
      setPending(true);
      try {
        const result = await votePost(postId, value, userId);
        setLikeCount(result.likeCount);
        setDislikeCount(result.dislikeCount);
        setVoteLocal(postId, result.userVote);
      } catch {
        // leave counts unchanged on failure
      } finally {
        setPending(false);
      }
    },
    [pending, postId, userId, setVoteLocal]
  );

  return { likeCount, dislikeCount, userVote, pending, vote };
};

export default useVote;
