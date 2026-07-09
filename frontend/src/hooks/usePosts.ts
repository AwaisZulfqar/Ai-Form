import { useCallback, useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import type { Post } from "../types";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPosts(await getPosts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const prependPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  return { posts, loading, error, refetch, prependPost };
};

export default usePosts;
