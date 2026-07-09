import { useCallback, useEffect, useRef, useState } from "react";
import { votePost } from "../services/voteService";
import { ApiRequestError } from "../services/apiClient";
import { useUser } from "../context/UserContext";
import { useVotes } from "../context/VotesContext";
import type { VoteValue } from "../types";

type VoteState = 0 | VoteValue;

// Applies a vote transition locally (same rules as the server) so the UI can
// update before the request resolves.
const applyTransition = (current: VoteState, value: VoteValue, like: number, dislike: number) => {
  let nextVote: VoteState = current;
  let nextLike = like;
  let nextDislike = dislike;

  if (current === value) {
    nextVote = 0;
    if (value === 1) nextLike -= 1;
    else nextDislike -= 1;
  } else if (current === 0) {
    nextVote = value;
    if (value === 1) nextLike += 1;
    else nextDislike += 1;
  } else {
    nextVote = value;
    if (value === 1) {
      nextLike += 1;
      nextDislike -= 1;
    } else {
      nextDislike += 1;
      nextLike -= 1;
    }
  }

  return { nextVote, nextLike: Math.max(0, nextLike), nextDislike: Math.max(0, nextDislike) };
};

// Optimistic per-post vote: the UI updates instantly on click, the request runs
// in the background, and state reconciles with the server (or rolls back on
// failure). Rapid clicks abort the previous in-flight request via an
// AbortController, so only the last request is kept.
export const useVote = (postId: string, initialLike: number, initialDislike: number) => {
  const { id: userId } = useUser();
  const { getVote, setVoteLocal } = useVotes();
  const [likeCount, setLikeCount] = useState(initialLike);
  const [dislikeCount, setDislikeCount] = useState(initialDislike);
  const abortRef = useRef<AbortController | null>(null);

  const userVote = getVote(postId);

  // Cancel any request still in flight when this control unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  const vote = useCallback(
    async (value: VoteValue) => {
      const prevVote = getVote(postId);
      const prevLike = likeCount;
      const prevDislike = dislikeCount;

      const { nextVote, nextLike, nextDislike } = applyTransition(
        prevVote,
        value,
        prevLike,
        prevDislike
      );

      // Apply immediately for an instant feel.
      setLikeCount(nextLike);
      setDislikeCount(nextDislike);
      setVoteLocal(postId, nextVote);

      // Cancel the previous in-flight vote so only the latest click reaches the
      // server; start a fresh controller for this request.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const result = await votePost(postId, value, userId, controller.signal);
        setLikeCount(result.likeCount);
        setDislikeCount(result.dislikeCount);
        setVoteLocal(postId, result.userVote);
      } catch (err) {
        // A superseded (aborted) request is expected — leave the newer optimistic
        // state alone. Only a real failure rolls back.
        if (err instanceof ApiRequestError && err.canceled) return;
        setLikeCount(prevLike);
        setDislikeCount(prevDislike);
        setVoteLocal(postId, prevVote);
      }
    },
    [postId, userId, likeCount, dislikeCount, getVote, setVoteLocal]
  );

  return { likeCount, dislikeCount, userVote, vote };
};

export default useVote;
