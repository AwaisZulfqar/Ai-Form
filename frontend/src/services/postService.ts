import { apiGet, apiPost } from "./apiClient";
import type { Post, PostDetail } from "../types";

export const getPosts = () => apiGet<Post[]>("/posts");

export const getPost = (id: string) => apiGet<PostDetail>(`/posts/${id}`);

export const generatePost = (topic: string) => apiPost<Post>("/posts/generate", { topic });
