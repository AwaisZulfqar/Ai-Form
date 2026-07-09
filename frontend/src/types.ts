export interface Author {
  _id: string;
  name: string;
  avatar: string | null;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author;
  topic?: string;
  likeCount: number;
  dislikeCount?: number;
  commentCount: number;
  shareCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type VoteValue = 1 | -1;

export interface UserVote {
  postId: string;
  value: VoteValue;
}

export interface Comment {
  _id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface PostDetail extends Post {
  comments: Comment[];
}
