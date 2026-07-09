import Card from "../common/Card";

// Static per PRD §8.2 — not backed by the API. Hidden on mobile.
const TRENDING = [
  "Artificial Intelligence",
  "Remote Work",
  "Open Source",
  "Web Performance",
  "Developer Health",
];

const RULES = [
  "Be respectful and constructive.",
  "Stay on topic.",
  "No spam or self-promotion.",
  "Share sources when you can.",
];

const Sidebar = () => (
  <aside className="hidden w-full flex-col gap-6 lg:flex">
    <Card>
      <h2 className="text-label-md uppercase tracking-wide text-secondary">Trending Topics</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {TRENDING.map((topic) => (
          <li key={topic}>
            <span className="inline-block rounded-full border border-border bg-background px-3 py-1 text-body-sm text-on-surface-variant">
              #{topic}
            </span>
          </li>
        ))}
      </ul>
    </Card>

    <Card>
      <h2 className="text-label-md uppercase tracking-wide text-secondary">Forum Rules</h2>
      <ol className="mt-3 flex list-decimal flex-col gap-2 pl-4 text-body-sm text-on-surface-variant">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
    </Card>
  </aside>
);

export default Sidebar;
