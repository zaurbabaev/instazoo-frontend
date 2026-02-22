import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bootstrapAuthThunk } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);
  const bootRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    dispatch(bootstrapAuthThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AppRoutes />
    </div>
  );
}
