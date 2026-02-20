import axios from "axios";
import { store } from "../app/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = token;
  return config;
});

export default api;
