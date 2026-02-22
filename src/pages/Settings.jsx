import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { logout, meThunk } from "../features/auth/authSlice";
import { pushToast } from "../features/toast/toastSlice";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mode = useSelector((s) => s.theme.mode);
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);

  const testSession = async () => {
    try {
      const res = await dispatch(meThunk()).unwrap();
      dispatch(
        pushToast({
          type: "success",
          message: `Session OK ✅ (${res.username})`,
        }),
      );
    } catch (e) {
      dispatch(
        pushToast({
          type: "error",
          message: "Session FAIL ❌ (login lazımdır)",
        }),
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Theme, session, logout</p>
      </div>

      <div className="p-5 space-y-3 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Theme</div>
            <div className="text-sm text-slate-500">Dark / Light</div>
          </div>
          <button
            onClick={() => dispatch(toggleTheme())}
            className="px-4 py-2 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
            {mode === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Session test</div>
            <div className="text-sm text-slate-500">me endpoint işləyir?</div>
          </div>
          <button
            onClick={testSession}
            className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90">
            Test
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Logout</div>
            <div className="text-sm text-slate-500">Sessiyanı bağla</div>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-rose-600 hover:bg-rose-500">
            Logout
          </button>
        </div>
      </div>

      {/* Debug card */}
      <div className="p-5 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="font-bold">Debug</div>
        <div className="mt-2 space-y-1 text-sm text-slate-500">
          <div>
            <span className="font-semibold">User:</span>{" "}
            {user ?
              `${user.firstname} ${user.lastname} (@${user.username})`
            : "null"}
          </div>
          <div>
            <span className="font-semibold">Token:</span>{" "}
            {token ? `${String(token).slice(0, 18)}...` : "null"}
          </div>
          <div className="text-xs text-slate-400">
            (Refresh token cookie-dədir, burada görünmür — normaldır.)
          </div>
        </div>
      </div>
    </div>
  );
}
