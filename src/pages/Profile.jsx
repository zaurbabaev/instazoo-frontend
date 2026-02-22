import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getCurrentUser, getUserProfile } from "../api/userApi";
import { getMyPosts, getPostsByUserId } from "../api/postApi";

import PostCard from "../components/PostCard";
import ProfileImage from "../components/ProfileImage";
import EditProfileModal from "../components/EditProfileModal";
import AvatarUploader from "../components/AvatarUploader";

export default function Profile() {
  const dispatch = useDispatch();
  const { userId } = useParams(); // ola da bilər, olmaya da

  const isMyProfile = !userId; // /profile → my
  const [editOpen, setEditOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let active = true;
    setErr(null);

    // USER
    setLoadingUser(true);
    const userReq = isMyProfile ? getCurrentUser() : getUserProfile(userId);

    userReq
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

    // POSTS
    setLoadingPosts(true);
    const postsReq = isMyProfile ? getMyPosts() : getPostsByUserId(userId);

    postsReq
      .then((res) => {
        if (!active) return;
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (!active) return;
        setPosts([]);
      })
      .finally(() => {
        if (!active) return;
        setLoadingPosts(false);
      });

    return () => {
      active = false;
    };
  }, [userId, isMyProfile, dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isMyProfile ? "My Profile" : "User Profile"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isMyProfile ? "Current user məlumatları" : `User ID: ${userId}`}
          </p>
        </div>

        {isMyProfile && (
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-2 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
            Edit Profile
          </button>
        )}
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex items-start gap-4">
              <ProfileImage size={96} />
              {isMyProfile && (
                <AvatarUploader onUploaded={() => window.location.reload()} />
              )}
            </div>

            <div className="flex-1">
              <div className="text-xl font-bold">
                {user.firstname} {user.lastname}
              </div>
              <div className="text-sm text-slate-500">@{user.username}</div>

              {user.bio ?
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  {user.bio}
                </p>
              : <p className="mt-2 text-sm text-slate-500">Bio yoxdur.</p>}
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
        <h2 className="text-lg font-bold">
          {isMyProfile ? "My Posts" : "User Posts"}
        </h2>
      </div>

      {loadingPosts ?
        <div className="text-sm text-slate-500">Loading posts...</div>
      : posts.length === 0 ?
        <div className="p-6 text-center bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="text-lg font-bold">Post yoxdur</div>
          <div className="mt-1 text-sm text-slate-500">
            {isMyProfile ?
              "İlk postu Create-dən paylaş."
            : "Bu user-in postu yoxdur."}
          </div>
        </div>
      : <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      }

      {editOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onUpdated={(u) => setUser(u)}
        />
      )}
    </div>
  );
}
