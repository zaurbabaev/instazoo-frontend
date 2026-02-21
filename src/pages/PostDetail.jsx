import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComments, createComment, deleteComment } from "../api/commentApi";
import PostImage from "../components/PostImage";
import { useSelector } from "react-redux";

export default function PostDetail() {
  const { id } = useParams();
  const me = useSelector((s) => s.auth.user);

  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getComments(id);
      setComments(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const send = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    await createComment(id, { message: msg.trim() });
    setMsg("");
    await load();
  };

  const remove = async (commentId) => {
    if (!confirm("Comment silinsin?")) return;
    await deleteComment(commentId);
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Post #{id}</h1>

      <div className="p-4 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <PostImage postId={id} />
      </div>

      <div className="p-4 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="font-semibold">Comments</div>

        <form onSubmit={send} className="flex gap-2 mt-3">
          <input
            className="flex-1 px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Write comment..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className="px-4 py-3 font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90">
            Send
          </button>
        </form>

        {loading ?
          <div className="mt-4 text-sm text-slate-500">Loading...</div>
        : <div className="mt-4 space-y-2">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between gap-3 p-3 border rounded-xl bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-sm font-semibold">{c.username}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-200">
                    {c.message}
                  </div>
                </div>

                {me?.username && me.username === c.username && (
                  <button
                    onClick={() => remove(c.id)}
                    className="px-3 py-2 text-sm text-white rounded-xl bg-rose-600 hover:bg-rose-500">
                    Delete
                  </button>
                )}
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-sm text-slate-500">Hələ comment yoxdur.</div>
            )}
          </div>
        }
      </div>
    </div>
  );
}
