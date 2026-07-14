import { describe, vi, it, expect } from 'vitest';
import { register } from './authService';
import { httpService } from './httpService';

vi.mock('./httpService', () => ({
  httpService: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  it('registers a user and returns response data', async () => {
    const registerData = {
      email: 'john.doe@email.com',
      password: 'password123',
    };
    const responseData = { message: 'Response email sent' };

    vi.mocked(httpService.post).mockResolvedValue({ data: responseData });
    const result = await register(registerData);

    expect(httpService.post).toHaveBeenCalledWith(
      '/auth/register',
      registerData
    );
    expect(result).toEqual(responseData);
  });

  it('throws an error when registraiton request fails', async () => {
    const registerData = {
      email: 'john.doe@email.com',
      password: 'password123',
    };

    const error = new Error('Registration failed');

    vi.mocked(httpService.post).mockRejectedValue(error);

    await expect(register(registerData)).rejects.toThrow('Registration failed');
    expect(httpService.post).toHaveBeenCalledWith(
      '/auth/register',
      registerData
    );
  });
});
