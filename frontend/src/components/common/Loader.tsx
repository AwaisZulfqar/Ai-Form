export const Spinner = ({ className = "h-5 w-5" }: { className?: string }) => (
  <span
    role="status"
    aria-label="Loading"
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary ${className}`}
  />
);

export const Loader = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8">
    <Spinner />
    {label && <span className="text-body-sm text-secondary">{label}</span>}
  </div>
);

export const SkeletonPost = () => (
  <div className="animate-pulse rounded-lg border border-border bg-surface p-4">
    <div className="mb-3 h-5 w-2/3 rounded bg-border" />
    <div className="mb-2 h-3 w-full rounded bg-background" />
    <div className="mb-2 h-3 w-full rounded bg-background" />
    <div className="mb-4 h-3 w-4/5 rounded bg-background" />
    <div className="flex items-center gap-3">
      <div className="h-6 w-6 rounded-full bg-border" />
      <div className="h-3 w-24 rounded bg-background" />
    </div>
  </div>
);

export default Loader;
