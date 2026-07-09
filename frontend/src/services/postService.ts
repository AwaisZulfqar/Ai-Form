import { apiGet, apiPost, apiPatch } from "./apiClient";
import type { Post, PostDetail } from "../types";

export const getPosts = () => apiGet<Post[]>("/posts");

export const getPost = (id: string) => apiGet<PostDetail>(`/posts/${id}`);

export const generatePost = (topic: string, authorId?: string | null) =>
  apiPost<Post>("/posts/generate", { topic, authorId });

export const likePost = (id: string) =>
  apiPatch<{ _id: string; likeCount: number }>(`/posts/${id}/like`);

export const sharePost = (id: string) =>
  apiPatch<{ _id: string; shareCount: number }>(`/posts/${id}/share`);
