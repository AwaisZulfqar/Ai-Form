import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import EmptyState from "../common/EmptyState";
import { Loader } from "../common/Loader";
import type { Comment } from "../../types";

interface CommentSectionProps {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  postAuthorId: string;
  onAddComment: (text: string) => Promise<unknown>;
}

const CommentSection = ({
  comments,
  loading,
  error,
  postAuthorId,
  onAddComment,
}: CommentSectionProps) => (
  <section className="flex flex-col gap-4">
    <h2 className="text-h3 text-on-surface">Comments ({comments.length})</h2>

    <CommentForm onSubmit={onAddComment} />

    {loading && <Loader label="Loading comments…" />}

    {!loading && error && <EmptyState title="Could not load comments" message={error} />}

    {!loading && !error && comments.length === 0 && (
      <EmptyState title="No comments yet" message="Be the first to reply." />
    )}

    {!loading && !error && comments.length > 0 && (
      <ul className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            isAuthor={comment.author._id === postAuthorId}
          />
        ))}
      </ul>
    )}
  </section>
);

export default CommentSection;
