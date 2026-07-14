import { httpService } from "./httpService";

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function register(data: RegisterRequest) {
  const response = await httpService.post('/auth/register', data);

  return response.data;
}

export async function login(data: LoginRequest) {
  const response = await httpService.post('/auth/login', data);

  return response.data;
}
