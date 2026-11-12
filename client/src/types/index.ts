export interface Lecture {
  _id: string;
  course: string | { _id: string; title: string };
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  lectureCount?: number;
  lectures?: Lecture[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}
