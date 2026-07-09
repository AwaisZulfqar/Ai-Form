import { useLike } from "../../hooks/useLike";
import { UpvoteIcon } from "../common/icons";

interface LikeButtonProps {
  postId: string;
  likeCount: number;
  size?: number;
}

const LikeButton = ({ postId, likeCount, size = 16 }: LikeButtonProps) => {
  const { count, liked, pending, like } = useLike(postId, likeCount);

  return (
    <button
      type="button"
      onClick={like}
      disabled={liked || pending}
      aria-pressed={liked}
      aria-label={liked ? "You liked this post" : "Like this post"}
      className={`flex items-center gap-1 text-body-sm transition-colors disabled:cursor-default ${
        liked ? "text-primary" : "text-secondary hover:text-primary"
      }`}
    >
      <UpvoteIcon size={size} fill={liked ? "currentColor" : "none"} />
      {count}
    </button>
  );
};

export default LikeButton;
