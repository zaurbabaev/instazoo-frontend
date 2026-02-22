import api from "./axios";

export const signup = (payload) => api.post("/api/auth/signup", payload);
export const signin = (payload) => api.post("/api/auth/signin", payload);

export const refreshTokenApi = () => api.post("/api/auth/refresh");
export const logoutApi = () => api.post("/api/auth/logout");
