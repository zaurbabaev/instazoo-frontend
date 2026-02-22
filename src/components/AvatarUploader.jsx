import { useMemo, useState } from "react";
import { uploadProfileImage } from "../api/imageApi";
import { pushToast } from "../features/toast/toastSlice";
import { useDispatch } from "react-redux";

export default function AvatarUploader({ onUploaded }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      dispatch(
        pushToast({ type: "error", message: "Yalnız şəkil seç (image/*)" }),
      );
      e.target.value = "";
      return;
    }

    const maxMb = 5;
    if (f.size > maxMb * 1024 * 1024) {
      dispatch(pushToast({ type: "error", message: `Şəkil max ${maxMb}MB` }));
      e.target.value = "";
      return;
    }

    setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      await uploadProfileImage(file);
      dispatch(pushToast({ type: "success", message: "Avatar yeniləndi ✅" }));
      setFile(null);
      onUploaded?.(); // profile image refresh
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e.message ||
        "Upload alınmadı";
      dispatch(pushToast({ type: "error", message: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">Avatar</div>

      {previewUrl ?
        <img
          src={previewUrl}
          alt="preview"
          className="object-cover w-24 h-24 border rounded-2xl border-slate-200 dark:border-slate-800"
        />
      : <div className="flex items-center justify-center w-24 h-24 text-xs border rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500">
          Preview
        </div>
      }

      <input type="file" accept="image/*" onChange={pick} />

      <button
        type="button"
        disabled={!file || loading}
        onClick={upload}
        className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 disabled:opacity-50">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
