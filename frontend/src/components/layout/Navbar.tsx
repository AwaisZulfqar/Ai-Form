import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const user = useUser();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-surface">
      <div className="mx-auto flex h-full max-w-container items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-700 text-on-primary">
            ✦
          </span>
          <span className="text-h3 text-on-surface">AI Forum</span>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <input
            type="search"
            disabled
            placeholder="Search discussions…"
            aria-label="Search discussions (coming soon)"
            className="h-10 w-full max-w-[400px] cursor-not-allowed rounded-lg border border-border bg-background px-3 text-body-sm text-secondary"
          />
        </div>

        <Avatar name={user.name} src={user.avatar} />
      </div>
    </header>
  );
};

export default Navbar;
