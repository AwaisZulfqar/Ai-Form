import { useToast } from "../context/ToastContext";
import { usePosts } from "../hooks/usePosts";
import { useGeneratePost } from "../hooks/useGeneratePost";
import PageContainer from "../components/layout/PageContainer";
import Sidebar from "../components/layout/Sidebar";
import TopicForm from "../components/forum/TopicForm";
import PostCard from "../components/forum/PostCard";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { SkeletonPost } from "../components/common/Loader";

const HomePage = () => {
  const { posts, loading, loadingMore, error, hasMore, loadMore, prependPost } = usePosts();
  const { generate, isGenerating } = useGeneratePost();
  const { showToast } = useToast();

  const handleGenerate = async (topic: string): Promise<boolean> => {
    const { post, error: generateError } = await generate(topic);
    if (post) {
      prependPost(post);
      showToast("Post added to the feed.");
      return true;
    }
    showToast(generateError ?? "Unable to generate post right now.", "error");
    return false;
  };

  const showEmpty = !loading && !error && posts.length === 0 && !isGenerating;

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <main className="flex flex-col gap-6">
          <TopicForm onSubmit={handleGenerate} isGenerating={isGenerating} />

          <section className="flex flex-col gap-6">
            {isGenerating && <SkeletonPost />}

            {loading && (
              <>
                <SkeletonPost />
                <SkeletonPost />
              </>
            )}

            {!loading && error && <EmptyState title="Could not load the feed" message={error} />}

            {showEmpty && (
              <EmptyState
                title="No discussions yet"
                message="Start one above to get the conversation going."
              />
            )}

            {!loading && !error && posts.map((post) => <PostCard key={post._id} post={post} />)}

            {!loading && !error && hasMore && (
              <div className="flex justify-center pt-2">
                <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
                  Load more
                </Button>
              </div>
            )}
          </section>
        </main>

        <Sidebar />
      </div>
    </PageContainer>
  );
};

export default HomePage;
