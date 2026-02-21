import { useEffect, useState } from "react";
import { getProfileImage } from "../api/imageApi";

export default function ProfileImage({ size = 96 }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let active = true;

    getProfileImage()
      .then((res) => {
        const bytes = res.data?.imageBytes;
        if (!bytes) return;
        const url = `data:image/jpeg;base64,${bytes}`;
        if (active) setSrc(url);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const px = `${size}px`;

  if (!src) {
    return (
      <div
        className="rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <img
      src={src}
      alt="profile"
      className="object-cover border rounded-full border-slate-200 dark:border-slate-800"
      style={{ width: px, height: px }}
    />
  );
}
