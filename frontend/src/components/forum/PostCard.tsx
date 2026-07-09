import { Link } from "react-router-dom";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import { UpvoteIcon, CommentIcon, ShareIcon } from "../common/icons";
import { formatRelativeDate } from "../../utils/formatDate";
import type { Post } from "../../types";

const ICON_SIZE = 16;

// M3 renders the action row as read-only meta; like/comment/share become
// interactive in M4.
const PostCard = ({ post }: { post: Post }) => (
  <Card hoverable as="article">
    <Link to={`/posts/${post._id}`} className="block">
      <h3 className="text-h3 text-on-surface transition-colors hover:text-primary/80">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-body-sm text-on-surface-variant">{post.content}</p>
    </Link>

    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-secondary">
        <Avatar name={post.author.name} src={post.author.avatar} size={24} />
        <span className="text-body-sm text-on-surface">{post.author.name}</span>
        <span aria-hidden="true">•</span>
        <time className="text-caption" dateTime={post.createdAt}>
          {formatRelativeDate(post.createdAt)}
        </time>
        {post.topic && (
          <span className="rounded-full border border-border px-2 py-0.5 text-caption text-secondary">
            {post.topic}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-secondary">
        <span className="flex items-center gap-1 text-body-sm">
          <UpvoteIcon size={ICON_SIZE} />
          {post.likeCount}
        </span>
        <span className="flex items-center gap-1 text-body-sm">
          <CommentIcon size={ICON_SIZE} />
          {post.commentCount}
        </span>
        <ShareIcon size={ICON_SIZE} />
      </div>
    </div>
  </Card>
);

export default PostCard;
