import { useCallback, useState } from "react";
import { generatePost } from "../services/postService";
import { useUser } from "../context/UserContext";
import type { Post } from "../types";

interface GenerateResult {
  post: Post | null;
  error: string | null;
}

export const useGeneratePost = () => {
  const currentUser = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns the result directly so callers avoid a stale-state read on the
  // error message; `error` state is also exposed for inline UI if needed.
  const generate = useCallback(
    async (topic: string): Promise<GenerateResult> => {
      setIsGenerating(true);
      setError(null);
      try {
        const post = await generatePost(topic, currentUser.id);
        return { post, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to generate post right now.";
        setError(message);
        return { post: null, error: message };
      } finally {
        setIsGenerating(false);
      }
    },
    [currentUser.id]
  );

  return { generate, isGenerating, error };
};

export default useGeneratePost;
