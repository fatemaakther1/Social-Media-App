import axios from 'axios';

// Configure axios instance using the same setup as authService
const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Types for post data
export interface User {
  id: number;
  username?: string;
  email?: string;
}

export interface PostLike {
  id: number;
  postId: number;
  profileId: number;
  createdTime: string;
  profile?: User;
}

export interface PostComment {
  id: number;
  postId: number;
  profileId: number;
  commentText: string;
  createdDatetime: string;
  profile?: User;
}

export interface Post {
  id: number;
  profileId: number;
  writtenText?: string;
  mediaLocation?: string;
  createdDatetime: string;
  createdAt: string;
  updatedAt: string;
  profile?: User;
  likes?: PostLike[];
  comments?: PostComment[];
}

export interface CreatePostData {
  writtenText?: string;
  mediaLocation?: string;
}

export interface PostResponse {
  success: boolean;
  message?: string;
  post?: Post;
  posts?: Post[];
}

export interface LikeResponse {
  message: string;
  liked: boolean;
  like?: PostLike;
}

class PostService {
  // Get all posts
  async getAllPosts(): Promise<Post[]> {
    try {
      console.log('🚀 Frontend Get Posts Request:', {
        url: '/api/posts',
        baseURL: api.defaults.baseURL
      });
      
      const response = await api.get('/api/posts');
      
      console.log('✅ Frontend Get Posts Success:', {
        status: response.status,
        postsCount: response.data.length
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Get Posts Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      throw new Error(
        error.response?.data?.message || 'Failed to fetch posts'
      );
    }
  }

  // Get a specific post
  async getPost(postId: number): Promise<Post> {
    try {
      const response = await api.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Get Post Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch post'
      );
    }
  }

  // Create a new post
  async createPost(data: CreatePostData): Promise<Post> {
    try {
      console.log('🚀 Frontend Create Post Request:', {
        url: '/api/posts',
        data: data,
        baseURL: api.defaults.baseURL
      });
      
      const response = await api.post('/api/posts', data);
      
      console.log('✅ Frontend Create Post Success:', {
        status: response.status,
        postId: response.data.id
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Create Post Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      throw new Error(
        error.response?.data?.message || 'Failed to create post'
      );
    }
  }

  // Update a post
  async updatePost(postId: number, data: CreatePostData): Promise<Post> {
    try {
      const response = await api.put(`/api/posts/${postId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Update Post Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to update post'
      );
    }
  }

  // Delete a post
  async deletePost(postId: number): Promise<void> {
    try {
      await api.delete(`/api/posts/${postId}`);
    } catch (error: any) {
      console.error('❌ Frontend Delete Post Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to delete post'
      );
    }
  }

  // Toggle like on a post
  async toggleLike(postId: number): Promise<LikeResponse> {
    try {
      console.log('🚀 Frontend Toggle Like Request:', {
        url: `/api/posts/${postId}/like`,
        postId: postId,
        baseURL: api.defaults.baseURL
      });
      
      const response = await api.post(`/api/posts/${postId}/like`);
      
      console.log('✅ Frontend Toggle Like Success:', {
        status: response.status,
        liked: response.data.liked
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Toggle Like Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      throw new Error(
        error.response?.data?.message || 'Failed to toggle like'
      );
    }
  }

  // Get likes for a post
  async getPostLikes(postId: number): Promise<{ count: number; likes: PostLike[] }> {
    try {
      const response = await api.get(`/api/posts/${postId}/likes`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Get Post Likes Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch post likes'
      );
    }
  }

  // Check if user liked a post
  async checkLikeStatus(postId: number): Promise<{ liked: boolean }> {
    try {
      const response = await api.get(`/api/posts/${postId}/like-status`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Check Like Status Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to check like status'
      );
    }
  }

  // Get user's posts
  async getUserPosts(userId: number): Promise<Post[]> {
    try {
      const response = await api.get(`/api/users/${userId}/posts`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Get User Posts Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch user posts'
      );
    }
  }

  // Get comments for a post
  async getPostComments(postId: number): Promise<{ count: number; comments: PostComment[] }> {
    try {
      const response = await api.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Get Post Comments Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch comments'
      );
    }
  }

  // Create a comment on a post
  async createComment(postId: number, commentText: string): Promise<PostComment> {
    try {
      console.log('🚀 Frontend Create Comment Request:', {
        url: `/api/posts/${postId}/comments`,
        postId: postId,
        commentText: commentText,
        baseURL: api.defaults.baseURL
      });
      
      const response = await api.post(`/api/posts/${postId}/comments`, { commentText });
      
      console.log('✅ Frontend Create Comment Success:', {
        status: response.status,
        commentId: response.data.id
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Create Comment Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      throw new Error(
        error.response?.data?.message || 'Failed to create comment'
      );
    }
  }

  // Update a comment
  async updateComment(commentId: number, commentText: string): Promise<PostComment> {
    try {
      const response = await api.put(`/api/comments/${commentId}`, { commentText });
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Update Comment Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to update comment'
      );
    }
  }

  // Delete a comment
  async deleteComment(commentId: number): Promise<void> {
    try {
      await api.delete(`/api/comments/${commentId}`);
    } catch (error: any) {
      console.error('❌ Frontend Delete Comment Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to delete comment'
      );
    }
  }
}

export default new PostService();
