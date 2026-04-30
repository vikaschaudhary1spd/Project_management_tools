// Auth types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

// Project types
export type ProjectStatus = 'active' | 'completed';

export interface Project {
  id: number;
  user: number;
  user_details?: User;
  title: string;
  description: string;
  status: ProjectStatus;
  created_at: string;
}

export interface ProjectPayload {
  title: string;
  description?: string;
  status?: ProjectStatus;
}

// Task types
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
}

export interface TaskPayload {
  project: number;
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string | null;
}

// API Pagination
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
