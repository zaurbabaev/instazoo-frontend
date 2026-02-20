import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <div className="text-3xl font-extrabold">404</div>
        <p className="mt-2 text-slate-500">Səhifə tapılmadı</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 mt-4 text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900">
          Home
        </Link>
      </div>
    </div>
  );
}
