import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";

import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

export default function Settings() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">UI və hesab parametrləri</p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-lg font-bold">Appearance</div>
          <div className="mt-1 text-sm text-slate-500">
            Dark mode-u istədiyin kimi seç.
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm">
            Hazırki rejim:{" "}
            <span className="font-semibold">
              {mode === "dark" ? "Dark" : "Light"}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => dispatch(toggleTheme())}>
              {mode === "dark" ? "🌙 Dark → Light" : "☀️ Light → Dark"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-bold">About</div>
          <div className="mt-1 text-sm text-slate-500">
            Instazoo — şəkil paylaşma platforması (demo).
          </div>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          Buraya sonra: profil təhlükəsizliyi, hesab silmə, logout-all-devices
          kimi bölmələr əlavə edəcəyik.
        </CardContent>
      </Card>
    </div>
  );
}
