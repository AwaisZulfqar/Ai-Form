import { ShareIcon } from "../common/icons";
import { useToast } from "../../context/ToastContext";
import { copyToClipboard } from "../../utils/clipboard";

interface ShareButtonProps {
  postId: string;
  title?: string;
  size?: number;
  withLabel?: boolean;
}

const ShareButton = ({ postId, title, size = 16, withLabel = false }: ShareButtonProps) => {
  const { showToast } = useToast();

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${postId}`;

    // Native share sheet on mobile; clipboard fallback elsewhere (PRD §4.5).
    if (navigator.share) {
      try {
        await navigator.share({ title: title ?? "AI Forum", url });
      } catch {
        // user dismissed the sheet — nothing to do
      }
      return;
    }

    const ok = await copyToClipboard(url);
    showToast(ok ? "Link copied to clipboard." : "Could not copy link.", ok ? "success" : "error");
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
    </button>
  );
};

export default ShareButton;
