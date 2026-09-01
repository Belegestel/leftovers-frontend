import { httpService } from './httpService';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RefreshRequest {
  token: string;
}

export async function register(data: RegisterRequest) {
  const response = await httpService.post('/auth/register', data);

  return response.data;
}

export async function login(data: LoginRequest) {
  const response = await httpService.post('/auth/login', data);

  return response.data;
}

export async function forgotPassword(data: ForgotPasswordRequest) {
  const response = await httpService.post('/auth/reset-password', data);

  return response.data;
}

export async function resetPassword(data: ResetPasswordRequest) {
  const response = await httpService.post('/auth/reset-password/confirm', data);

  return response.data;
}

export async function refresh(data: RefreshRequest) {
  const response = await httpService.post('/auth/refresh', data);

  return response.data;
}
