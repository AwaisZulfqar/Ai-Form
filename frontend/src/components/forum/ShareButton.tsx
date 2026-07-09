import { useState } from "react";
import { ShareIcon } from "../common/icons";
import { useToast } from "../../context/ToastContext";
import { copyToClipboard } from "../../utils/clipboard";
import { sharePost } from "../../services/postService";

interface ShareButtonProps {
  postId: string;
  title?: string;
  shareCount?: number;
  size?: number;
  withLabel?: boolean;
}

const ShareButton = ({
  postId,
  title,
  shareCount = 0,
  size = 16,
  withLabel = false,
}: ShareButtonProps) => {
  const { showToast } = useToast();
  const [count, setCount] = useState(shareCount);

  const bumpCount = async () => {
    setCount((prev) => prev + 1);
    try {
      const result = await sharePost(postId);
      setCount(result.shareCount);
    } catch {
      setCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${postId}`;

    // Native share sheet on mobile; clipboard fallback elsewhere (PRD §4.5).
    if (navigator.share) {
      try {
        await navigator.share({ title: title ?? "AI Forum", url });
        await bumpCount();
      } catch {
        // user dismissed the sheet — do not count it
      }
      return;
    }

    const ok = await copyToClipboard(url);
    if (ok) {
      await bumpCount();
      showToast("Link copied to clipboard.");
    } else {
      showToast("Could not copy link.", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this post"
      className="flex items-center gap-1 text-body-sm text-secondary transition-colors hover:text-primary"
    >
      <ShareIcon size={size} />
      {withLabel && <span>Share</span>}
      {count}
    </button>
  );
};

export default ShareButton;
