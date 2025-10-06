import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:3333', // Your AdonisJS backend URL
  withCredentials: true, // Important for session-based auth (sends cookies)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Types for auth data
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface SessionResponse {
  success: boolean;
  message: string;
  authenticated: boolean;
  user?: {
    id: number;
    email: string;
  };
}

class AuthService {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🚀 Frontend Register Request:', {
        url: '/api/v1/auth/register',
        data: { ...data, password: '[HIDDEN]', password_confirmation: '[HIDDEN]' },
        baseURL: api.defaults.baseURL
      });
      
      const response = await api.post('/api/v1/auth/register', data);
      
      console.log('✅ Frontend Register Success:', {
        status: response.status,
        data: response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Register Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      throw new Error(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('🚀 Frontend Login Request:', {
        url: '/api/v1/auth/login',
        data: { ...data, password: '[HIDDEN]' },
        baseURL: api.defaults.baseURL
      });
      
      const response = await api.post('/api/v1/auth/login', data);
      
      console.log('✅ Frontend Login Success:', {
        status: response.status,
        data: { ...response.data, user: response.data.user ? '[USER_DATA]' : null }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Frontend Login Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      throw new Error(
        error.response?.data?.message || 'Login failed'
      );
    }
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/v1/auth/logout');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }

  // Check current session status
  async checkSession(): Promise<SessionResponse> {
    try {
      const response = await api.get('/api/v1/auth/check-session');
      return response.data;
    } catch (error: any) {
      // If session check fails, return not authenticated
      return {
        success: false,
        message: 'No active session',
        authenticated: false,
      };
    }
  }

  // Get user profile
  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await api.get('/api/v1/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get profile'
      );
    }
  }

  // Update user profile
  async updateProfile(data: { username?: string; email?: string }): Promise<AuthResponse> {
    try {
      const response = await api.put('/api/v1/auth/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }

  // Change password
  async changePassword(data: { 
    current_password: string; 
    password: string; 
    password_confirmation: string; 
  }): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/v1/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to change password'
      );
    }
  }
}

export default new AuthService();