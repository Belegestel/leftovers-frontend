import axios from 'axios';
import { env } from '@/config/env';
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearTokens,
} from './tokenService';

export const httpService = axios.create({
  baseURL: env.apiUrl,
});

type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

httpService.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (
      error.response?.status !== 401 ||
      request._retry ||
      request.url === '/auth/refresh'
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token) => {
            request.headers = request.headers ?? {};
            request.headers.Authorization = `Bearer ${token}`;
            resolve(httpService(request));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(`${env.apiUrl}/auth/refresh`, {
        token: refreshToken,
      });

      const rememberMe = localStorage.getItem('refresh_token') !== null;

      setToken(data.accessToken, rememberMe);
      setRefreshToken(data.refreshToken, rememberMe);

      pendingRequests.forEach(({ resolve }) => resolve(data.accessToken));
      pendingRequests = [];

      request.headers.Authorization = `Bearer ${data.accessToken}`;

      return httpService(request);
    } catch (refreshError) {
      clearTokens();

      pendingRequests.forEach(({ reject }) => reject(refreshError));
      pendingRequests = [];

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
