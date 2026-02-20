import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const mode = useSelector((s) => s.theme.mode);

  useEffect(() => {
    const root = document.documentElement; // <html>
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AppRoutes />
    </div>
  );
}
