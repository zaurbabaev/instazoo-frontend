import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";
import postsReducer from "../features/posts/postsSlice";
import toastReducer from "../features/toast/toastSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    posts: postsReducer,
    toast: toastReducer,
  },
});
