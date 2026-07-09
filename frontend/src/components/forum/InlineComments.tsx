import CommentSection from "./CommentSection";
import { useComments } from "../../hooks/useComments";

interface InlineCommentsProps {
  postId: string;
  postAuthorId: string;
  onAdded?: () => void;
}

// Rendered only when a card's comments are expanded, so useComments fetches
// lazily on first open rather than for every card in the feed.
const InlineComments = ({ postId, postAuthorId, onAdded }: InlineCommentsProps) => {
  const { comments, loading, error, addComment } = useComments(postId);

  const handleAdd = async (text: string) => {
    const comment = await addComment(text);
    onAdded?.();
    return comment;
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      <CommentSection
        comments={comments}
        loading={loading}
        error={error}
        postAuthorId={postAuthorId}
        onAddComment={handleAdd}
      />
    </div>
  );
};

export default InlineComments;
