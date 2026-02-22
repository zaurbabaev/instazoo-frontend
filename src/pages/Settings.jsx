import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateUser } from "../api/userApi";
import { uploadProfileImage } from "../api/imageApi";
import { meThunk } from "../features/auth/authSlice";

export default function Settings() {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);

  const [form, setForm] = useState({
    id: null,
    firstname: "",
    lastname: "",
    username: "",
    bio: "",
  });

  const [file, setFile] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  useEffect(() => {
    // User info yoxdursa yüklə
    if (!me) dispatch(meThunk());
  }, [dispatch, me]);

  useEffect(() => {
    if (!me) return;
    setForm({
      id: me.id ?? null,
      firstname: me.firstname ?? "",
      lastname: me.lastname ?? "",
      username: me.username ?? "",
      bio: me.bio ?? "",
    });
  }, [me]);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErr("Zəhmət olmasa yalnız şəkil seçin (image/*).");
      e.target.value = "";
      return;
    }

    const maxMb = 5;
    if (f.size > maxMb * 1024 * 1024) {
      setErr(`Şəkil maksimum ${maxMb}MB olmalıdır.`);
      e.target.value = "";
      return;
    }

    setErr(null);
    setOk(null);
    setFile(f);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (
      !form.firstname.trim() ||
      !form.lastname.trim() ||
      !form.username.trim()
    ) {
      setErr("Firstname, Lastname və Username boş ola bilməz.");
      return;
    }

    setLoadingSave(true);
    try {
      const payload = {
        id: form.id, // backend id istəyirsə lazımdır
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        username: form.username.trim(),
        bio: form.bio?.trim() || "",
      };

      await updateUser(payload);
      await dispatch(meThunk());

      setOk("Profil məlumatları uğurla yeniləndi ✅");
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        e2.message ||
        "Update xətası";
      setErr(msg);
    } finally {
      setLoadingSave(false);
    }
  };

  const uploadAvatar = async () => {
    setErr(null);
    setOk(null);

    if (!file) {
      setErr("Upload üçün şəkil seç.");
      return;
    }

    setLoadingUpload(true);
    try {
      await uploadProfileImage(file);
      // user info yenilə (bəzən lazım olur)
      await dispatch(meThunk());

      setOk("Profil şəkli uğurla yükləndi ✅");
      setFile(null);
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        e2.message ||
        "Image upload xətası";
      setErr(msg);
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Profil məlumatlarını yenilə və avatar yüklə.
        </p>
      </div>

      {err && (
        <div className="px-3 py-2 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
          {err}
        </div>
      )}
      {ok && (
        <div className="px-3 py-2 text-sm border rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
          {ok}
        </div>
      )}

      {/* PROFILE UPDATE */}
      <form
        onSubmit={saveProfile}
        className="p-5 space-y-4 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="font-semibold">Profile info</div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Firstname"
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
          />
          <input
            className="px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
            placeholder="Lastname"
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          />
        </div>

        <input
          className="w-full px-4 py-3 bg-transparent border rounded-xl border-slate-200 dark:border-slate-800"
          placeholder="Username"
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

        <div className="flex justify-end">
          <button
            disabled={loadingSave}
            className="px-5 py-3 font-semibold text-white rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 disabled:opacity-50">
            {loadingSave ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {/* AVATAR UPLOAD */}
      <div className="p-5 space-y-4 bg-white border dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="font-semibold">Profile image</div>

        <div className="grid items-start grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <input type="file" accept="image/*" onChange={pickFile} />
            <p className="text-xs text-slate-500">Max 5MB</p>

            <button
              onClick={uploadAvatar}
              disabled={loadingUpload}
              className="w-full px-5 py-3 font-semibold border rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 disabled:opacity-50">
              {loadingUpload ? "Uploading..." : "Upload image"}
            </button>
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
      </div>
    </div>
  );
}
