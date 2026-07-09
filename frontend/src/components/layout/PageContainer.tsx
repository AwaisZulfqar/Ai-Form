import React from "react";

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-container px-4 py-6 sm:px-6">{children}</div>
);

export default PageContainer;
