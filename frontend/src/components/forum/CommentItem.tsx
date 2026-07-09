import Avatar from "../common/Avatar";
import { formatRelativeDate } from "../../utils/formatDate";
import type { Comment } from "../../types";

interface CommentItemProps {
  comment: Comment;
  isAuthor?: boolean;
}

const CommentItem = ({ comment, isAuthor = false }: CommentItemProps) => (
  <li className="border-l-2 border-border pl-4">
    <div className="flex flex-wrap items-center gap-2">
      <Avatar name={comment.author.name} src={comment.author.avatar} size={24} />
      <span className="text-body-sm font-semibold text-on-surface">{comment.author.name}</span>
      {isAuthor && (
        <span className="rounded-full bg-primary px-2 py-0.5 text-caption font-semibold text-on-primary">
          AUTHOR
        </span>
      )}
      <span aria-hidden="true" className="text-secondary">
        •
      </span>
      <time className="text-caption text-secondary" dateTime={comment.createdAt}>
        {formatRelativeDate(comment.createdAt)}
      </time>
    </div>
    <p className="mt-1 whitespace-pre-wrap text-body-sm text-on-surface-variant">{comment.text}</p>
  </li>
);

export default CommentItem;
