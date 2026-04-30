import apiClient from './client';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const authAPI = {
  login: async (data: LoginPayload) => {
    const response = await apiClient.post<AuthResponse>('/auth/login/', data);
    return response.data;
  },
  register: async (data: RegisterPayload) => {
    const response = await apiClient.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get<User>('/auth/profile/');
    return response.data;
  },
};
