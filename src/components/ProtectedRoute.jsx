import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { token, booting } = useSelector((s) => s.auth);

  if (booting) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-slate-500">
        Loading session...
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
