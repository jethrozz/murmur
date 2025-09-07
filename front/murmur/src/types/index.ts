// 用户类型
export interface User {
  id: string;
  address: string;
  nickname?: string;
  avatar?: string;
}

// 圈子类型
export interface Circle {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  isJoined: boolean;
}

// 吐槽类型
export interface Murmur {
  id: string;
  circleId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  userReaction?: 'like' | 'dislike' | null;
  comments: Comment[];
}

// 评论类型
export interface Comment {
  id: string;
  murmurId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  userReaction?: 'like' | 'dislike' | null;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 搜索圈子请求
export interface SearchCircleRequest {
  query: string;
}

// 加入圈子请求
export interface JoinCircleRequest {
  circleId: string;
}

// 发布吐槽请求
export interface CreateMurmurRequest {
  circleId: string;
  content: string;
}

// 发布评论请求
export interface CreateCommentRequest {
  murmurId: string;
  content: string;
}

// 点赞/点踩请求
export interface ReactionRequest {
  targetId: string;
  targetType: 'murmur' | 'comment';
  reaction: 'like' | 'dislike' | null;
}
