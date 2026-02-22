import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllPosts,
  likePost,
  deletePost,
  getMyPosts,
} from "../../api/postApi";

export const fetchPostsThunk = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllPosts();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  },
);

export const fetchMyPostsThunk = createAsyncThunk(
  "posts/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyPosts();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  },
);

export const likePostThunk = createAsyncThunk(
  "posts/like",
  async ({ postId, username }, { rejectWithValue }) => {
    try {
      const res = await likePost(postId, username);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  },
);

export const deletePostThunk = createAsyncThunk(
  "posts/delete",
  async ({ postId }, { rejectWithValue }) => {
    try {
      await deletePost(postId);
      return { postId };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  },
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    deletedBackup: {},
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPostsThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchPostsThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.items = Array.isArray(a.payload) ? a.payload : [];
    });
    b.addCase(fetchPostsThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
    b.addCase(fetchMyPostsThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchMyPostsThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.items = Array.isArray(a.payload) ? a.payload : [];
    });
    b.addCase(fetchMyPostsThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
    b.addCase(likePostThunk.pending, (s, a) => {
      const { postId, username } = a.meta.arg;

      const p = s.items.find((x) => String(x.id) === String(postId));
      if (!p) return;

      const set = new Set(p.usersLiked || []);
      if (set.has(username)) return; // artıq like edibsə, yenə artırma

      set.add(username);
      p.usersLiked = Array.from(set);
      p.likes = (p.likes ?? 0) + 1;
    });
    b.addCase(likePostThunk.fulfilled, (s, a) => {
      const updated = a.payload;
      const idx = s.items.findIndex((p) => p.id === updated.id);
      if (idx !== -1) s.items[idx] = updated;
    });
    b.addCase(likePostThunk.rejected, (s, a) => {
      const { postId, username } = a.meta.arg;

      const p = s.items.find((x) => String(x.id) === String(postId));
      if (!p) return;

      const set = new Set(p.usersLiked || []);
      if (!set.has(username)) return;

      set.delete(username);
      p.usersLiked = Array.from(set);
      p.likes = Math.max(0, (p.likes ?? 0) - 1);

      // optional: error göstərmək üçün
      s.error = a.payload;
    });

    b.addCase(deletePostThunk.pending, (s, a) => {
      const { postId } = a.meta.arg;

      const idx = s.items.findIndex((p) => String(p.id) === String(postId));
      if (idx === -1) return;

      // rollback üçün saxla
      s.deletedBackup[postId] = s.items[idx];

      // optimistic: UI-dən sil
      s.items.splice(idx, 1);
    });

    b.addCase(deletePostThunk.fulfilled, (s, a) => {
      const { postId } = a.payload;
      delete s.deletedBackup[postId];
    });

    b.addCase(deletePostThunk.rejected, (s, a) => {
      const { postId } = a.meta.arg;

      // rollback: geri qaytar
      const saved = s.deletedBackup[postId];
      if (saved) {
        s.items.unshift(saved);
        delete s.deletedBackup[postId];
      }

      s.error = a.payload;
    });
  },
});

export default postsSlice.reducer;
