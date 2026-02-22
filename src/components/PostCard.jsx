import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likePostThunk, deletePostThunk } from "../features/posts/postsSlice";
import PostImage from "./PostImage";
import { pushToast } from "../features/toast/toastSlice";
import Button from "./ui/Button";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);

  const canDelete = me?.username && me.username === post.username;

  const handleLike = async () => {
    console.log("Me", me);
    if (!me?.username) return;
    await dispatch(likePostThunk({ postId: post.id, username: me.username }));
  };

  const handleDelete = async () => {
    if (!confirm("Post silinsin?")) return;
    try {
      await dispatch(deletePostThunk({ postId: post.id })).unwrap();
      dispatch(pushToast({ type: "success", message: "Post silindi ✅" }));
    } catch (e) {
      dispatch(pushToast({ type: "error", message: "Post silinmədi ❌" }));
    }
  };

  const liked = me?.username && (post.usersLiked || []).includes(me.username);

  return (
    <div className="p-4 bg-white border shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{post.title || "Untitled"}</div>
          <div className="text-sm text-slate-500">
            by{" "}
            <Link
              className="underline decoration-dotted"
              to={`/profile/${post.userId}`}>
              {post.username}
            </Link>
            {post.location ? ` • ${post.location}` : ""}
          </div>
        </div>

        {canDelete && (
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-sm text-white rounded-xl bg-rose-600 hover:bg-rose-500">
            Delete
          </button>
        )}
      </div>

      <div className="mt-3">
        <PostImage postId={post.id} />
      </div>

      {post.caption && (
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {post.caption}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <Button variant={liked ? "default" : "outline"} onClick={handleLike}>
          ❤️ Like ({post.likes ?? 0})
        </Button>

        <Link
          to={`/post/${post.id}`}
          className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90">
          Comments
        </Link>
      </div>
    </div>
  );
}
