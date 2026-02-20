import api from "./axios";

export const signup = (payload) => api.post("/api/auth/signup", payload);
export const signin = (payload) => api.post("/api/auth/signin", payload);
