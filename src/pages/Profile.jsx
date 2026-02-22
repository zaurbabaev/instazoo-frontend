import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCurrentUser } from "../api/userApi";
import { fetchMyPostsThunk } from "../features/posts/postsSlice";
import PostCard from "../components/PostCard";
import ProfileImage from "../components/ProfileImage";

export default function Profile() {
  const dispatch = useDispatch();

  const posts = useSelector((s) => s.posts.items);
  const loadingPosts = useSelector((s) => s.posts.loading);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let active = true;
    setErr(null);

    setLoadingUser(true);
    getCurrentUser()
      .then((res) => {
        if (!active) return;
        setUser(res.data);
      })
      .catch((e) => {
        if (!active) return;
        setErr(
          e?.response?.data?.message ||
            (typeof e?.response?.data === "string" ? e.response.data : null) ||
            e.message ||
            "Profile yüklənmədi",
        );
      })
      .finally(() => {
        if (!active) return;
        setLoadingUser(false);
      });

    // ✅ postları Redux-a yüklə (like/delete də burada işləyəcək)
    dispatch(fetchMyPostsThunk());

    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Current user məlumatları</p>
      </div>

      {err && (
        <div className="px-3 py-2 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
          {err}
        </div>
      )}

      <div className="p-5 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        {loadingUser ?
          <div className="text-sm text-slate-500">Loading profile...</div>
        : user ?
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <ProfileImage size={96} />

            <div className="flex-1">
              <div className="text-xl font-bold">
                {user.firstname} {user.lastname}
              </div>
              <div className="text-sm text-slate-500">@{user.username}</div>

              {user.bio && (
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  {user.bio}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <div className="px-4 py-3 border rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500">Posts</div>
                <div className="text-lg font-extrabold">{posts.length}</div>
              </div>
            </div>
          </div>
        : <div className="text-sm text-slate-500">User tapılmadı.</div>}
      </div>

      <div>
        <h2 className="text-lg font-bold">My Posts</h2>
      </div>

      {loadingPosts ?
        <div className="text-sm text-slate-500">Loading posts...</div>
      : posts.length === 0 ?
        <div className="text-sm text-slate-500">Sənin postun yoxdur.</div>
      : <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      }
    </div>
  );
}
