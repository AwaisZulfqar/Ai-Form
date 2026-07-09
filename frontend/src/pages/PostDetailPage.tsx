import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/common/Card";

// Placeholder — full post, comments, and actions arrive in M5.
const PostDetailPage = () => (
  <PageContainer>
    <Card>
      <h1 className="text-h2 text-on-surface">Post detail coming soon</h1>
      <p className="mt-2 text-body-sm text-secondary">
        The full post, comments, and actions arrive in the next milestone.
      </p>
      <Link to="/" className="mt-4 inline-block text-label-md text-primary underline">
        ← Back to feed
      </Link>
    </Card>
  </PageContainer>
);

export default PostDetailPage;
