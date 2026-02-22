import axios from "axios";
import { store } from "../app/store";
import { logout, setToken } from "../features/auth/authSlice"; // <- öz slice path-ini düz yaz
import { refreshTokenApi } from "./authApi"; // <- refresh endpoint

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true, // refresh cookie getsin
});

// ----- refresh queue (eyni anda çox request 401 alsa, 1 refresh) -----
let isRefreshing = false; 
let waitQueue = [];

const resolveQueue = (err, token = null) => {
  waitQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  waitQueue = [];
};

// Request: access token header-a yaz
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token; // "Bearer ..."
  if (token) config.headers.Authorization = token;
  return config;
});

// Response: 401/403 -> refresh -> retry
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config;

    // başqa xətalar
    if (status !== 401 && status !== 403) {
      return Promise.reject(error);
    }

    // refresh endpoint özü fail olarsa loop olmasın
    if (original?.url?.includes("/api/auth/refresh")) {
      store.dispatch(logout());
      if (window.location.pathname !== "/login")
        window.location.href = "/login";
      return Promise.reject(error);
    }

    // bir dəfə retry et
    if (original?._retry) {
      store.dispatch(logout());
      if (window.location.pathname !== "/login")
        window.location.href = "/login";
      return Promise.reject(error);
    }
    original._retry = true;

    // Əgər refresh artıq gedirsə, növbəyə dayan
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = newToken;
        return api(original);
      });
    }

    isRefreshing = true;

    try {
      // refresh cookie ilə gedir
      const res = await refreshTokenApi();
      const newToken = res.data?.token; // backend: JWTTokenSuccessResponse(true, token)

      if (!newToken) throw new Error("Refresh cavabında token yoxdur");

      // redux-da token yenilə
      store.dispatch(setToken(newToken));

      // queue-də gözləyənləri aç
      resolveQueue(null, newToken);

      // original request-i retry et
      original.headers.Authorization = newToken;
      return api(original);
    } catch (e2) {
      resolveQueue(e2, null);

      store.dispatch(logout());
      if (window.location.pathname !== "/login")
        window.location.href = "/login";

      return Promise.reject(e2);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
