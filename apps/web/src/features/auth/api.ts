import { apiClient } from '@/lib/api';
import type {
  ApiResponse,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  User,
} from '@waylo/shared';

export async function login(credentials: LoginCredentials): Promise<AuthTokens> {
  const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login', credentials);
  return response.data.data;
}

export async function register(data: RegisterData): Promise<AuthTokens> {
  const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/register', data);
  return response.data.data;
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore error on logout
  }
}
