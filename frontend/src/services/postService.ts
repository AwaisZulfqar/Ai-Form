import { apiGet, apiPost, apiPatch } from "./apiClient";
import type { Post, PostDetail } from "../types";

export const getPosts = () => apiGet<Post[]>("/posts");

export const getPost = (id: string) => apiGet<PostDetail>(`/posts/${id}`);

export const generatePost = (topic: string) => apiPost<Post>("/posts/generate", { topic });

export const likePost = (id: string) =>
  apiPatch<{ _id: string; likeCount: number }>(`/posts/${id}/like`);
