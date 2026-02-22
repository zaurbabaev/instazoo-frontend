import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pushToast } from "../features/toast/toastSlice";
import { fetchPostsThunk, likePostThunk } from "../features/posts/postsSlice";
import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from "../api/commentApi";
import { meThunk } from "../features/auth/authSlice";
import { getPostImage } from "../api/imageApi";

export default function PostDetail() {
  const { id } = useParams();
  const postId = Number(id);

  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);
  const posts = useSelector((s) => s.posts.items);

  const post = useMemo(
    () => posts.find((p) => p.id === postId),
    [posts, postId],
  );

  const [imgSrc, setImgSrc] = useState(null);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState(null);

  const loadComments = async () => {
    setLoadingComments(true);
    setErr(null);
    try {
      const res = await getCommentsByPost(postId);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          (typeof e?.response?.data === "string" ? e.response.data : null) ||
          e.message ||
          "Comments yüklənmədi",
      );
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (!me) dispatch(meThunk());
    if (!post) dispatch(fetchPostsThunk());
  }, [dispatch, me, post]);

  useEffect(() => {
    let active = true;

    // Post image
    getPostImage(postId)
      .then((res) => {
        const bytes = res.data?.imageBytes;
        if (!bytes) return;
        const url = `data:image/jpeg;base64,${bytes}`;
        if (active) setImgSrc(url);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [postId]);

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const onLike = async () => {
    if (!me?.username) return;
    await dispatch(
      likePostThunk({ postId: String(postId), username: me.username }),
    );
  };

  const onSend = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!commentText.trim()) return;

    setSending(true);
    try {
      await createComment(postId, { message: commentText.trim() });
      setCommentText("");
      await loadComments();
      dispatch(
        pushToast({ type: "success", message: "Comment əlavə olundu ✅" }),
      );
    } catch (e2) {
      const errMsg =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        e2.message ||
        "Comment göndərilmədi";

      setErr(errMsg);
      dispatch(pushToast({ type: "error", message: errMsg }));
    } finally {
      setSending(false);
    }
  };

  const onDelete = async (commentId) => {
    setErr(null);
    try {
      await deleteComment(commentId);
      await loadComments();
      dispatch(pushToast({ type: "success", message: "Comment silindi ✅" }));
    } catch (e2) {
      const errMsg =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        e2.message ||
        "Comment silinmədi";

      setErr(errMsg);
      dispatch(pushToast({ type: "error", message: errMsg }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Post</h1>
          <p className="mt-1 text-sm text-slate-500">Post ID: {postId}</p>
        </div>

        <Link
          to="/"
          className="px-4 py-2 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40">
          Back
        </Link>
      </div>

      {err && (
        <div className="px-3 py-2 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Post card */}
        <div className="overflow-hidden bg-white border lg:col-span-2 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
          {imgSrc ?
            <img
              src={imgSrc}
              alt="post"
              className="w-full aspect-[4/3] object-cover"
            />
          : <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
          }

          <div className="p-4 space-y-2">
            <div className="text-lg font-bold">
              {post?.title || "Loading..."}
            </div>

            <div className="text-sm text-slate-500">
              by <span className="font-semibold">{post?.username || "-"}</span>
              {post?.location ? ` • ${post.location}` : ""}
            </div>

            {post?.caption && (
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {post.caption}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onLike}
                className="px-4 py-2 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40">
                ❤️ Like ({post?.likes ?? 0})
              </button>

              <button
                onClick={loadComments}
                className="px-4 py-2 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40">
                Refresh comments
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="p-4 space-y-3 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="font-bold">Comments</div>

          <form onSubmit={onSend} className="space-y-2">
            <textarea
              rows={3}
              className="w-full px-3 py-2 text-sm bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              disabled={sending}
              className="w-full px-4 py-2 font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-50">
              {sending ? "Sending..." : "Send"}
            </button>
          </form>

          <div className="h-px bg-slate-200 dark:bg-slate-800" />

          {loadingComments ?
            <div className="text-sm text-slate-500">Loading comments...</div>
          : comments.length === 0 ?
            <div className="text-sm text-slate-500">Hələ comment yoxdur.</div>
          : <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold">@{c.username}</span>
                  </div>
                  <div className="mt-1 text-sm">{c.message}</div>

                  {/* only show delete for your own comments (best effort) */}
                  {me?.username && c.username === me.username && (
                    <button
                      onClick={() => onDelete(c.id)}
                      className="mt-2 text-xs font-semibold text-rose-600 hover:underline">
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
