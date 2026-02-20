import api from "./axios";

export const getCurrentUser = () => api.get("/api/users");
export const getUserProfile = (userId) => api.get(`/api/users/${userId}`);
export const updateUser = (payload) => api.put("/api/users/update", payload);
