import { useCallback, useEffect, useState } from "react";
import { getPost } from "../services/postService";
import { ApiRequestError } from "../services/apiClient";
import type { PostDetail } from "../types";

export const usePost = (id: string) => {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      setPost(await getPost(id));
    } catch (err) {
      if (err instanceof ApiRequestError && (err.status === 404 || err.status === 400)) {
        setNotFound(true);
      } else {
        setError(err instanceof Error ? err.message : "Failed to load the post.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { post, loading, error, notFound, refetch };
};

export default usePost;
