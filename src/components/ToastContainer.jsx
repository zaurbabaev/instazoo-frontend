import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../features/toast/toastSlice";

export default function ToastContainer() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.toast.items);

  useEffect(() => {
    const timers = items.map((t) =>
      setTimeout(() => dispatch(removeToast(t.id)), t.duration),
    );

    return () => timers.forEach(clearTimeout);
  }, [items, dispatch]);

  if (!items.length) return null;

  const styleByType = (type) => {
    if (type === "success")
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    if (type === "error") return "border-rose-200 bg-rose-50 text-rose-900";
    return "border-slate-200 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800";
  };

  return (
    <div className="fixed z-50 top-4 right-4 space-y-2 w-[320px] max-w-[92vw]">
      {items.map((t) => (
        <div
          key={t.id}
          className={`rounded-2xl border px-4 py-3 shadow-sm ${styleByType(t.type)}`}>
          <div className="text-sm font-semibold">{t.message}</div>
          <button
            onClick={() => dispatch(removeToast(t.id))}
            className="mt-2 text-xs font-semibold opacity-70 hover:opacity-100">
            Close
          </button>
        </div>
      ))}
    </div>
  );
}
