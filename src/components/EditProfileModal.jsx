import { useState } from "react";
import { updateUser } from "../api/userApi";
import { useDispatch } from "react-redux";
import { pushToast } from "../features/toast/toastSlice";

export default function EditProfileModal({ user, onClose, onUpdated }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    username: user?.username || "", // ✅ vacib
    bio: user?.bio || "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (
      !form.firstname.trim() ||
      !form.lastname.trim() ||
      !form.username.trim()
    ) {
      setErr("Firstname, lastname, username boş ola bilməz.");
      return;
    }

    setLoading(true);
    try {
      // ✅ backend UserDTO tələb edir
      const payload = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        username: form.username.trim(), // ✅ göndər
        bio: form.bio?.trim() || "",
      };

      const res = await updateUser(payload);
      onUpdated(res.data);
      dispatch(pushToast({ type: "success", message: "Profil yeniləndi ✅" }));
      onClose();
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        JSON.stringify(e2?.response?.data || {}) ||
        e2.message ||
        "Update alınmadı";
      setErr(msg);
      dispatch(pushToast({ type: "error", message: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md overflow-hidden bg-white border shadow-xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="text-lg font-extrabold">Edit Profile</div>
          <div className="mt-1 text-sm text-slate-500">
            Ad, soyad, username və bio
          </div>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3">
          {err && (
            <div className="px-3 py-2 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
              {err}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
              placeholder="Firstname *"
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            />
            <input
              className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
              placeholder="Lastname *"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            />
          </div>

          <input
            className="w-full px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Username *"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-sm font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-5 py-3 text-sm font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
