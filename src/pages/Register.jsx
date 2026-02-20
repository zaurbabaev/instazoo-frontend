import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerThunk } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerThunk(form));
    if (res.meta.requestStatus === "fulfilled") navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-lg p-6 bg-white border shadow-sm rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Register</h1>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 gap-3 mt-5 md:grid-cols-2">
          {[
            ["email", "Email"],
            ["firstname", "Firstname"],
            ["lastname", "Lastname"],
            ["username", "Username"],
          ].map(([k, label]) => (
            <input
              key={k}
              className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
              placeholder={label}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          ))}

          <input
            className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full py-3 font-semibold text-white md:col-span-2 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-50">
            {loading ? "Loading..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Hesabın var?{" "}
          <Link
            className="font-semibold text-slate-900 dark:text-slate-100"
            to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
