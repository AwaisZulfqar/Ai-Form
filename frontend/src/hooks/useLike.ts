import { useCallback, useState } from "react";
import { likePost } from "../services/postService";

const STORAGE_KEY = "ai-forum:liked";

const readLiked = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
};

const persist = (ids: Set<string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore storage errors (private mode, quota)
  }
};

// Optimistic like with a localStorage session guard (PRD §4.3 / FR-3.4):
// bumps the count immediately, reconciles with the server, rolls back on error.
export const useLike = (postId: string, initialCount: number) => {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(() => readLiked().has(postId));
  const [pending, setPending] = useState(false);

  const like = useCallback(async () => {
    if (liked || pending) return;

    setPending(true);
    setLiked(true);
    setCount((prev) => prev + 1);
    const guard = readLiked();
    guard.add(postId);
    persist(guard);

    try {
      const { likeCount } = await likePost(postId);
      setCount(likeCount);
    } catch {
      setLiked(false);
      setCount((prev) => Math.max(0, prev - 1));
      const rollback = readLiked();
      rollback.delete(postId);
      persist(rollback);
    } finally {
      setPending(false);
    }
  }, [liked, pending, postId]);

  return { count, liked, pending, like };
};

export default useLike;
