import { apiGet, apiPatch } from "./apiClient";
import type { UserVote, VoteValue } from "../types";

interface VoteResult {
  _id: string;
  likeCount: number;
  dislikeCount: number;
  userVote: 0 | VoteValue;
}

export const votePost = (postId: string, value: VoteValue, userId?: string | null) =>
  apiPatch<VoteResult>(`/posts/${postId}/vote`, { value, userId });

export const getUserVotes = (userId: string) =>
  apiGet<UserVote[]>(`/votes?userId=${encodeURIComponent(userId)}`);
