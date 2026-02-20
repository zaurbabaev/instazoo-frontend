import api from "./axios";

export const uploadProfileImage = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post("/api/images/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProfileImage = () => api.get("/api/images/profileImage");

export const uploadPostImage = (postId, file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api.post(`/api/images/${postId}/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getPostImage = (postId) => api.get(`/api/images/${postId}/image`);
