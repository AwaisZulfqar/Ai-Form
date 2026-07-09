import { useCallback, useEffect, useState } from "react";
import { getComments, createComment } from "../services/commentService";
import type { Comment } from "../types";

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setComments(await getComments(postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Throws on failure so the form can surface an inline error.
  const addComment = useCallback(
    async (text: string): Promise<Comment> => {
      const comment = await createComment(postId, text);
      setComments((prev) => [...prev, comment]);
      return comment;
    },
    [postId]
  );

  return { comments, loading, error, refetch, addComment };
};

export default useComments;
