import { useEffect, useState } from "react";
import Modal from "./Modal";

import { updateUser } from "../api/userApi";

import Button from "./ui/Button";
import Input from "./ui/Input";
import { Card, CardContent } from "./ui/Card";

export default function EditProfileModal({ open, onClose, user, onSaved }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    bio: "",
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setForm({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      username: user?.username || "",
      bio: user?.bio || "",
    });
  }, [open, user]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!form.firstname.trim()) return setErr("Firstname boş ola bilməz.");
    if (!form.lastname.trim()) return setErr("Lastname boş ola bilməz.");

    setSaving(true);
    try {
      // ⚠️ Backend username update icazə vermirsə, username-i göndərmə:
      const payload = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        bio: form.bio.trim(),
        username: form.username.trim(),
      };

      const res = await updateUser(payload);

      onSaved?.(res.data); // parent refresh üçün
      onClose?.();
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : null) ||
        e2.message ||
        "Yadda saxlanmadı";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <Card>
        <CardContent>
          {err && (
            <div className="px-3 py-2 mb-3 text-sm border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-500">
                  Firstname
                </div>
                <Input
                  value={form.firstname}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, firstname: e.target.value }))
                  }
                  placeholder="Firstname"
                />
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold text-slate-500">
                  Lastname
                </div>
                <Input
                  value={form.lastname}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, lastname: e.target.value }))
                  }
                  placeholder="Lastname"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold text-slate-500">
                Username (read-only)
              </div>
              <Input value={form.username} disabled />
              <div className="mt-1 text-xs text-slate-500">
                Username dəyişmək istəsən, ayrıca endpoint lazımdır.
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold text-slate-500">
                Bio
              </div>
              <textarea
                rows={4}
                className="w-full px-4 py-3 text-sm bg-transparent border rounded-xl border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
                value={form.bio}
                onChange={(e) =>
                  setForm((s) => ({ ...s, bio: e.target.value }))
                }
                placeholder="Write something about you..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
}
