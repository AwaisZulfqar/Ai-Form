import { apiGet, apiPost } from "./apiClient";
import type { Comment } from "../types";

export const getComments = (postId: string) => apiGet<Comment[]>(`/posts/${postId}/comments`);

export const createComment = (postId: string, text: string, authorId?: string | null) =>
  apiPost<Comment>(`/posts/${postId}/comments`, { text, authorId });
