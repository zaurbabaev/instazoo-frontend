export default function Feed() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Feed</h1>
      <div className="p-5 bg-white border rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        Növbəti addımda buranı{" "}
        <span className="font-semibold">GET /api/posts/all</span> ilə
        dolduracağıq.
      </div>
    </div>
  );
}
