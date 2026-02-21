import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsThunk } from "../features/posts/postsSlice";
import PostCard from "../components/PostCard";
import { meThunk } from "../features/auth/authSlice";

export default function Feed() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.posts);

  useEffect(() => {
    // user info + posts
    dispatch(meThunk());
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="mt-1 text-sm text-slate-500">Bütün postlar (desc)</p>
        </div>

        <button
          onClick={() => dispatch(fetchPostsThunk())}
          className="px-4 py-2 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
          Refresh
        </button>
      </div>

      {loading && <div className="text-sm text-slate-500">Loading...</div>}

      {error && (
        <div className="px-3 py-2 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
          {typeof error === "string" ? error : "Xəta oldu"}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="text-sm text-slate-500">Post yoxdur.</div>
      )}
    </div>
  );
}
