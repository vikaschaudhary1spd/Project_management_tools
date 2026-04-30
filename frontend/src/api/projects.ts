import apiClient from './client';
import { Project, ProjectPayload, PaginatedResponse } from '../types';

export const projectsAPI = {
  getProjects: async (params?: { page?: number; search?: string; ordering?: string }) => {
    const response = await apiClient.get<PaginatedResponse<Project>>('/projects/', { params });
    return response.data;
  },
  getProject: async (id: number) => {
    const response = await apiClient.get<Project>(`/projects/${id}/`);
    return response.data;
  },
  createProject: async (data: ProjectPayload) => {
    const response = await apiClient.post<Project>('/projects/', data);
    return response.data;
  },
  updateProject: async (id: number, data: Partial<ProjectPayload>) => {
    const response = await apiClient.put<Project>(`/projects/${id}/`, data);
    return response.data;
  },
  deleteProject: async (id: number) => {
    const response = await apiClient.delete(`/projects/${id}/`);
    return response.data;
  },
};
