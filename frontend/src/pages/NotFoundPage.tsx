import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import EmptyState from "../components/common/EmptyState";

const NotFoundPage = () => (
  <PageContainer>
    <EmptyState
      title="Page not found"
      message="The page you are looking for does not exist."
      action={
        <Link to="/" className="text-label-md text-primary underline">
          ← Back to feed
        </Link>
      }
    />
  </PageContainer>
);

export default NotFoundPage;
