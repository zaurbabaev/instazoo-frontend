import api from "./axios";

export const getCommentsByPost = (postId) =>
  api.get(`/api/comments/${postId}/all`);

export const createComment = (postId, payload) =>
  api.post(`/api/comments/${postId}/create`, payload);

export const deleteComment = (commentId) =>
  api.delete(`/api/comments/${commentId}`);
