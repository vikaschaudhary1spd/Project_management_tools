import apiClient from './client';
import { Task, TaskPayload, PaginatedResponse } from '../types';

export const tasksAPI = {
  getTasks: async (params?: { project?: number; status?: string; search?: string; page?: number; ordering?: string }) => {
    const response = await apiClient.get<PaginatedResponse<Task>>('/tasks/', { params });
    return response.data;
  },
  getTask: async (id: number) => {
    const response = await apiClient.get<Task>(`/tasks/${id}/`);
    return response.data;
  },
  createTask: async (data: TaskPayload) => {
    const response = await apiClient.post<Task>('/tasks/', data);
    return response.data;
  },
  updateTask: async (id: number, data: Partial<TaskPayload>) => {
    const response = await apiClient.put<Task>(`/tasks/${id}/`, data);
    return response.data;
  },
  deleteTask: async (id: number) => {
    const response = await apiClient.delete(`/tasks/${id}/`);
    return response.data;
  },
};
