import api from './axios';
import type { ApiResponse, User, LoginInput, RegisterInput } from '@/types';

export async function registerUser(data: RegisterInput): Promise<User> {
  const res = await api.post<ApiResponse<User>>('/auth/register', data);
  return res.data.data!;
}

export async function loginUser(data: LoginInput): Promise<User> {
  const res = await api.post<ApiResponse<User>>('/auth/login', data);
  return res.data.data!;
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<User> {
  const res = await api.get<ApiResponse<User>>('/auth/me');
  return res.data.data!;
}
