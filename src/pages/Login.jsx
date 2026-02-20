import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loginThunk,
  clearAuthError,
  meThunk,
} from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const res = await dispatch(loginThunk(form));
    if (res.meta.requestStatus === "fulfilled") {
      await dispatch(meThunk());
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 bg-white border shadow-sm rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-slate-500">
          Instazoo hesabına daxil ol
        </p>

        {error && (
          <div className="px-3 py-2 mt-4 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
            {typeof error === "string" ? error : "Login xətası"}
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            className="w-full px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="username (email)"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="w-full px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full py-3 font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-50">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Hesabın yoxdur?{" "}
          <Link
            className="font-semibold text-slate-900 dark:text-slate-100"
            to="/register">
            Register
          </Link>
        </p>

        <p className="mt-3 text-xs text-slate-500">
          Qeyd: token memory-də saxlanır, səhifəni refresh etsən yenidən login
          lazım olacaq (refresh token gələndə düzələcək).
        </p>
      </div>
    </div>
  );
}
