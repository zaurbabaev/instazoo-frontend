import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signin, signup } from "../../api/authApi";
import { getCurrentUser } from "../../api/userApi";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await signup(payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await signin(payload);

      // backend cavabı: { success: true, token: "Bearer eyJ..." }
      const raw = res.data?.token;
      const token = raw?.startsWith("Bearer ") ? raw : `Bearer ${raw}`;

      return { token, success: !!res.data?.success };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  },
);

export const meThunk = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCurrentUser();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token: null, // <-- localStorage YOX
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.loading = false;
      s.isAuthenticated = true;
      s.token = a.payload.token; // "Bearer ..."
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(meThunk.fulfilled, (s, a) => {
      s.user = a.payload;
    });
    b.addCase(meThunk.rejected, (s) => {
      // me alınmasa, token var olsa belə user null qalacaq
      s.user = null;
    });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
