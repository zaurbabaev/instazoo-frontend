import { useEffect, useState } from "react";
import { getPostImage } from "../api/imageApi";

export default function PostImage({ postId }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let active = true;

    getPostImage(postId)
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
  }, [postId]);

  if (!src) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  return (
    <img
      src={src}
      alt="post"
      className="object-cover w-full border aspect-square rounded-2xl border-slate-200 dark:border-slate-800"
    />
  );
}
