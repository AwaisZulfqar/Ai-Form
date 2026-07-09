import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import VoteControl from "./VoteControl";
import ShareButton from "./ShareButton";
import InlineComments from "./InlineComments";
import { CommentIcon } from "../common/icons";
import { formatRelativeDate } from "../../utils/formatDate";
import type { Post } from "../../types";

const PostCard = ({ post }: { post: Post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  return (
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

        <div className="flex items-center gap-4">
          <VoteControl
            postId={post._id}
            likeCount={post.likeCount}
            dislikeCount={post.dislikeCount ?? 0}
          />
          <button
            type="button"
            onClick={() => setShowComments((open) => !open)}
            aria-expanded={showComments}
            aria-label={`${commentCount} comments`}
            className={`flex items-center gap-1 text-body-sm transition-colors hover:text-primary ${
              showComments ? "text-primary" : "text-secondary"
            }`}
          >
            <CommentIcon size={16} />
            {commentCount}
          </button>
          <ShareButton postId={post._id} title={post.title} shareCount={post.shareCount ?? 0} />
        </div>
      </div>

      {showComments && (
        <InlineComments
          postId={post._id}
          postAuthorId={post.author._id}
          onAdded={() => setCommentCount((count) => count + 1)}
        />
      )}
    </Card>
  );
};

export default PostCard;
