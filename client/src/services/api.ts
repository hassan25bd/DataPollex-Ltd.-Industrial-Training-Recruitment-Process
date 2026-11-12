import type { Course, Lecture, AuthResponse, ApiResponse } from '../types';

const API_BASE = '/api';

// Helper to get auth header
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('lms_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper with clean error extraction
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the API request');
  }

  return data;
}

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  getMe: async (): Promise<{ success: boolean; user: AuthResponse['user'] }> => {
    return request<{ success: boolean; user: AuthResponse['user'] }>('/auth/me');
  },
};

// Course API
export const courseApi = {
  getAll: async (): Promise<ApiResponse<Course[]>> => {
    return request<ApiResponse<Course[]>>('/courses');
  },
  getById: async (id: string): Promise<ApiResponse<Course>> => {
    return request<ApiResponse<Course>>(`/courses/${id}`);
  },
  create: async (data: {
    title: string;
    description: string;
    price: number;
    thumbnail: string;
  }): Promise<ApiResponse<Course>> => {
    return request<ApiResponse<Course>>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      price: number;
      thumbnail: string;
    }>
  ): Promise<ApiResponse<Course>> => {
    return request<ApiResponse<Course>>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Lecture API
export const lectureApi = {
  getByCourse: async (courseId: string): Promise<ApiResponse<Lecture[]>> => {
    return request<ApiResponse<Lecture[]>>(`/courses/${courseId}/lectures`);
  },
  getById: async (id: string): Promise<ApiResponse<Lecture>> => {
    return request<ApiResponse<Lecture>>(`/lectures/${id}`);
  },
  create: async (data: {
    courseId: string;
    title: string;
    description?: string;
    videoUrl: string;
    order?: number;
  }): Promise<ApiResponse<Lecture>> => {
    return request<ApiResponse<Lecture>>('/lectures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      videoUrl: string;
      order: number;
      courseId: string;
    }>
  ): Promise<ApiResponse<Lecture>> => {
    return request<ApiResponse<Lecture>>(`/lectures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return request<{ success: boolean; message: string }>(`/lectures/${id}`, {
      method: 'DELETE',
    });
  },
};
