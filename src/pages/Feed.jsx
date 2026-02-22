import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsThunk } from "../features/posts/postsSlice";
import { meThunk } from "../features/auth/authSlice";

import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export default function Feed() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.posts);

  useEffect(() => {
    dispatch(meThunk());
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="mt-1 text-sm text-slate-500">Bütün postlar (desc)</p>
        </div>

        <Button variant="outline" onClick={() => dispatch(fetchPostsThunk())}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-rose-200 bg-rose-50 text-rose-700">
          <CardContent className="py-3 text-sm">
            {typeof error === "string" ? error : "Xəta oldu"}
          </CardContent>
        </Card>
      )}

      {loading ?
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      : items.length === 0 ?
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-lg font-bold">Hələ post yoxdur</div>
            <div className="mt-1 text-sm text-slate-500">
              İlk postu yaratmaq üçün “Create” bölməsinə keç.
            </div>
          </CardContent>
        </Card>
      : <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      }
    </div>
  );
}
