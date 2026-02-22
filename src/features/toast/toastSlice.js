import { createSlice, nanoid } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    items: [],
  },
  reducers: {
    pushToast: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(payload) {
        return {
          payload: {
            id: nanoid(),
            type: payload?.type || "info", // info | success | error
            message: payload?.message || "",
            duration: payload?.duration ?? 2500,
          },
        };
      },
    },
    removeToast(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.items = [];
    },
  },
});

export const { pushToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
