import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createPost } from "../api/postApi";
import { uploadPostImage } from "../api/imageApi";
import { fetchPostsThunk } from "../features/posts/postsSlice";

export default function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    caption: "",
    location: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // yalnız image olsun
    if (!f.type.startsWith("image/")) {
      setErr("Zəhmət olmasa yalnız şəkil seçin (image/*).");
      e.target.value = "";
      return;
    }

    // 5MB limit (istəsən dəyiş)
    const maxMb = 5;
    if (f.size > maxMb * 1024 * 1024) {
      setErr(`Şəkil maksimum ${maxMb}MB olmalıdır.`);
      e.target.value = "";
      return;
    }

    setErr(null);
    setFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!form.title.trim()) {
      setErr("Title boş ola bilməz.");
      return;
    }
    if (!file) {
      setErr("Post üçün şəkil seçməlisən.");
      return;
    }

    setLoading(true);

    try {
      // 1) create post
      const payload = {
        title: form.title.trim(),
        caption: form.caption.trim(),
        location: form.location.trim(),
      };

      const createRes = await createPost(payload);

      // Backend bəzən { id: ... } qaytarır, bəzən birbaşa PostDTO, bəzən object.
      const postId =
        createRes.data?.id ??
        createRes.data?.postId ??
        createRes.data?.data?.id;

      if (!postId) {
        // əgər backend create post response formatı fərqlidirsə, bunu konsolda görək
        console.log("createPost response:", createRes.data);
        throw new Error(
          "Post yaradıldı, amma postId tapılmadı (response formatı fərqli ola bilər).",
        );
      }

      // 2) upload image
      await uploadPostImage(postId, file);

      // 3) refresh feed
      await dispatch(fetchPostsThunk());

      // 4) go home
      navigate("/");
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        e2.message ||
        "Xəta baş verdi";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Create Post</h1>
        <p className="mt-1 text-sm text-slate-500">
          Əvvəl post yaradılır, sonra şəkil yüklənir.
        </p>
      </div>

      {err && (
        <div className="px-3 py-2 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
          {err}
        </div>
      )}

      <form
        onSubmit={submit}
        className="p-5 space-y-4 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <textarea
          rows={4}
          className="w-full px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
          placeholder="Caption"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
        />

        <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={onPickFile}
              className="block w-full text-sm cursor-pointer"
            />
            <p className="text-xs text-slate-500">JPG/PNG. Max 5MB.</p>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold">Preview</div>
            {previewUrl ?
              <img
                src={previewUrl}
                alt="preview"
                className="object-cover w-full border aspect-square rounded-2xl border-slate-200 dark:border-slate-800"
              />
            : <div className="flex items-center justify-center w-full text-sm border border-dashed aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-500">
                Şəkil seçilməyib
              </div>
            }
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-3 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
            Cancel
          </button>

          <button
            disabled={loading}
            className="px-5 py-3 font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-50">
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
