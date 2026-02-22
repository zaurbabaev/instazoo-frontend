export default function PostCardSkeleton() {
  return (
    <div className="overflow-hidden bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse">
      <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800/40" />
      <div className="p-4 space-y-3">
        <div className="w-2/3 h-4 rounded bg-slate-100 dark:bg-slate-800/40" />
        <div className="w-1/2 h-3 rounded bg-slate-100 dark:bg-slate-800/40" />
        <div className="w-full h-3 rounded bg-slate-100 dark:bg-slate-800/40" />
        <div className="flex gap-2 pt-2">
          <div className="w-24 h-9 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
