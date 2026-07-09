import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { UserProvider } from "./context/UserContext";
import Button from "./components/common/Button";
import Card from "./components/common/Card";
import { Loader } from "./components/common/Loader";
import { apiGet } from "./services/apiClient";

interface HealthResponse {
  status: string;
  db: string;
}

const HomePlaceholder = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiGet<HealthResponse>("/health")
      .then((result) => {
        if (!cancelled) setHealth(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to reach API.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-container mx-auto p-6">
      <Card>
        <h1 className="text-h1 text-on-surface">AI Forum</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          Scaffolding complete — routing, providers, and design tokens are wired up.
        </p>
        <div className="mt-4">
          <Button>Sample Button</Button>
        </div>
        <div className="mt-4">
          {loading && <Loader label="Checking API…" />}
          {!loading && health && (
            <p className="text-body-sm text-on-surface">
              API: {health.status} · DB: {health.db}
            </p>
          )}
          {!loading && error && <p className="text-body-sm text-error">{error}</p>}
        </div>
      </Card>
    </div>
  );
};

const DetailPlaceholder = () => (
  <div className="max-w-container mx-auto p-6">
    <Card>
      <h1 className="text-h2 text-on-surface">Post Detail</h1>
    </Card>
  </div>
);

const NotFoundPlaceholder = () => (
  <div className="max-w-container mx-auto p-6">
    <Card>
      <h1 className="text-h2 text-on-surface">Page Not Found</h1>
    </Card>
  </div>
);

const App = () => (
  <BrowserRouter>
    <UserProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/posts/:id" element={<DetailPlaceholder />} />
          <Route path="*" element={<NotFoundPlaceholder />} />
        </Routes>
      </ToastProvider>
    </UserProvider>
  </BrowserRouter>
);

export default App;
