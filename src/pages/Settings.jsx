export default function Settings() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="p-5 bg-white border rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        Növbəti addım: <b>PUT /api/users/update</b> və profile şəkli üçün{" "}
        <b>POST /api/images/upload</b>.
      </div>
    </div>
  );
}
