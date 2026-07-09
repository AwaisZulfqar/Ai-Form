import { useVote } from "../../hooks/useVote";
import { UpvoteIcon, DownvoteIcon } from "../common/icons";

interface VoteControlProps {
  postId: string;
  likeCount: number;
  dislikeCount: number;
  size?: number;
}

const VoteControl = ({ postId, likeCount, dislikeCount, size = 16 }: VoteControlProps) => {
  const {
    likeCount: up,
    dislikeCount: down,
    userVote,
    pending,
    vote,
  } = useVote(postId, likeCount, dislikeCount);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => vote(1)}
        disabled={pending}
        aria-pressed={userVote === 1}
        aria-label="Upvote this post"
        className={`flex items-center gap-1 text-body-sm transition-colors hover:text-primary ${
          userVote === 1 ? "text-primary" : "text-secondary"
        }`}
      >
        <UpvoteIcon size={size} fill={userVote === 1 ? "currentColor" : "none"} />
        {up}
      </button>

      <button
        type="button"
        onClick={() => vote(-1)}
        disabled={pending}
        aria-pressed={userVote === -1}
        aria-label="Downvote this post"
        className={`flex items-center gap-1 text-body-sm transition-colors hover:text-error ${
          userVote === -1 ? "text-error" : "text-secondary"
        }`}
      >
        <DownvoteIcon size={size} fill={userVote === -1 ? "currentColor" : "none"} />
        {down}
      </button>
    </div>
  );
};

export default VoteControl;
