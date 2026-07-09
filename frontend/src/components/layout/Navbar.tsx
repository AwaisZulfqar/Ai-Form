import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { useUserSwitcher } from "../../context/UserContext";

const Navbar = () => {
  const { users, currentUser, setCurrentUserId } = useUserSwitcher();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-surface">
      <div className="mx-auto flex h-full max-w-container items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-700 text-on-primary">
            ✦
          </span>
          <span className="text-h3 text-on-surface">AI Forum</span>
        </Link>

        <div className="flex items-center gap-2">
          <Avatar name={currentUser.name} src={currentUser.avatar} />
          {users.length > 0 && (
            <>
              <label htmlFor="acting-as" className="sr-only">
                Acting as
              </label>
              <select
                id="acting-as"
                value={currentUser.id ?? ""}
                onChange={(event) => setCurrentUserId(event.target.value)}
                className="h-9 max-w-[10rem] rounded-lg border border-border bg-surface px-2 text-body-sm text-on-surface"
                title="Acting as"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id ?? ""}>
                    {user.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
