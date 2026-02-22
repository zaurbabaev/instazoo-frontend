import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { toggleTheme } from "../../features/theme/themeSlice";

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
  const me = useSelector((s) => s.auth.user); // ✅ əlavə et

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

          {/* ✅ My Profile */}
          {me?.id && (
            <NavLink to={`/profile/${me.id}`} className={navClass}>
              Profile
            </NavLink>
          )}

          <NavLink to="/create" className={navClass}>
            Create
          </NavLink>

          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>

          <button
            onClick={() => dispatch(toggleTheme())}
            className="px-3 py-2 text-sm border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            title="Toggle theme">
            {mode === "dark" ? "🌙" : "☀️"}
          </button>

          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="px-3 py-2 text-sm text-white rounded-xl bg-rose-600 hover:bg-rose-500">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
