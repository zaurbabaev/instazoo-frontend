import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { toggleTheme } from "../../features/theme/themeSlice";
import Button from "../ui/Button";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-medium transition ${
    isActive ?
      "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
    : "hover:bg-slate-100 dark:hover:bg-slate-900/40"
  }`;

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((s) => s.theme.mode);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70 backdrop-blur">
      <div className="flex items-center justify-between max-w-5xl px-4 py-3 mx-auto">
        <Link to="/" className="text-lg font-extrabold tracking-tight">
          Instazoo
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            Feed
          </NavLink>
          <NavLink to="/create" className={navClass}>
            Create
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            Profile
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>

          <Button
            variant="outline"
            onClick={() => dispatch(toggleTheme())}
            title="Toggle theme">
            {mode === "dark" ? "🌙" : "☀️"}
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
