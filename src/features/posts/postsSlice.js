import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllPosts, likePost, deletePost } from "../../api/postApi";

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

    b.addCase(likePostThunk.fulfilled, (s, a) => {
      const updated = a.payload;
      const idx = s.items.findIndex((p) => p.id === updated.id);
      if (idx !== -1) s.items[idx] = updated;
    });

    b.addCase(deletePostThunk.fulfilled, (s, a) => {
      s.items = s.items.filter((p) => p.id !== a.payload.postId);
    });
  },
});

export default postsSlice.reducer;
