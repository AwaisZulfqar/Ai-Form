import React from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ title, message, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
    <p className="text-body-lg font-semibold text-on-surface">{title}</p>
    {message && <p className="max-w-md text-body-sm text-secondary">{message}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
