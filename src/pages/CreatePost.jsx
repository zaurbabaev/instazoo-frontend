export default function CreatePost() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Post</h1>
      <div className="p-5 bg-white border rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        Növbəti addım: əvvəl <b>POST /api/posts/create</b>, sonra{" "}
        <b>POST /api/images/{`{postId}`}/upload</b>.
      </div>
    </div>
  );
}
