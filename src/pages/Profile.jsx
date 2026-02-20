import { useParams } from "react-router-dom";

export default function Profile() {
  const { userId } = useParams();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="p-5 bg-white border rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        UserId: <span className="font-semibold">{userId}</span>
      </div>
    </div>
  );
}
