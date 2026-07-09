import { useCallback, useEffect, useState } from "react";
import { getPosts } from "../services/postService";
import type { Post } from "../types";

const PAGE_SIZE = 10;

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (pageToLoad: number, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getPosts(pageToLoad, PAGE_SIZE);
      setPosts((prev) => {
        if (!append) return data.posts;
        // Dedupe in case a prepend or new insert shifted the offset window.
        const seen = new Set(prev.map((p) => p._id));
        return [...prev, ...data.posts.filter((p) => !seen.has(p._id))];
      });
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the feed.");
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1, false);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    load(page + 1, true);
  }, [hasMore, loadingMore, page, load]);

  const refetch = useCallback(() => load(1, false), [load]);

  const prependPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  return { posts, loading, loadingMore, error, hasMore, loadMore, refetch, prependPost };
};

export default usePosts;
