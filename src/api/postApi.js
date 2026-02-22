import api from "./axios";

export const getAllPosts = () => api.get("api/posts/all");
export const getMyPosts = () => api.get("api/posts/user/posts");
export const createPost = (payload) => api.post("/api/posts/create", payload);
export const likePost = (postId, username) =>
  api.post(`/api/posts/${postId}/${username}/like`);
export const deletePost = (postId) => api.delete(`/api/posts/${postId}`);

export const getPostsByUserId = (userId) =>
  api.get(`/api/posts/user/${userId}/posts`);
