import { Link, useParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";
import Avatar from "../components/common/Avatar";
import LikeButton from "../components/forum/LikeButton";
import ShareButton from "../components/forum/ShareButton";
import CommentSection from "../components/forum/CommentSection";
import EmptyState from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { usePost } from "../hooks/usePost";
import { useComments } from "../hooks/useComments";
import { formatRelativeDate } from "../utils/formatDate";

const BackLink = () => (
  <Link to="/" className="text-label-md text-secondary transition-colors hover:text-primary">
    ← Back to feed
  </Link>
);

const PostDetailPage = () => {
  const { id = "" } = useParams();
  const { post, loading, notFound, error } = usePost(id);
  const { comments, loading: commentsLoading, error: commentsError, addComment } = useComments(id);

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Loading post…" />
      </PageContainer>
    );
  }

  if (notFound || !post) {
    return (
      <PageContainer>
        <EmptyState
          title="Post not found"
          message="This discussion does not exist or may have been removed."
          action={<BackLink />}
        />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState title="Something went wrong" message={error} action={<BackLink />} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <BackLink />

        <Card as="article" className="flex flex-col gap-4">
          <h1 className="text-h1 text-on-surface">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-2 text-secondary">
            <Avatar name={post.author.name} src={post.author.avatar} size={28} />
            <span className="text-body-sm text-on-surface">{post.author.name}</span>
            <span aria-hidden="true">•</span>
            <time className="text-caption" dateTime={post.createdAt}>
              {formatRelativeDate(post.createdAt)}
            </time>
            {post.topic && (
              <span className="rounded-full border border-border px-2 py-0.5 text-caption">
                {post.topic}
              </span>
            )}
          </div>

          <p className="whitespace-pre-wrap text-body-md text-on-surface-variant">{post.content}</p>

          <div className="flex items-center gap-6 border-t border-border pt-4">
            <LikeButton postId={post._id} likeCount={post.likeCount} size={18} />
            <ShareButton postId={post._id} title={post.title} size={18} withLabel />
          </div>
        </Card>

        <Card>
          <CommentSection
            comments={comments}
            loading={commentsLoading}
            error={commentsError}
            postAuthorId={post.author._id}
            onAddComment={addComment}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default PostDetailPage;
