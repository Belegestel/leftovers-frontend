import { httpService } from "./httpService";

export interface RegisterRequest {
  email: string;
  password: string;
}

export async function register(data: RegisterRequest) {
  const response = await httpService.post('/auth/register', data);

  return response.data;
}
