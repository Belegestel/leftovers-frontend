import axios from "axios";
import { env } from "@/config/env";
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  clearTokens,
} from "./tokenService";

export const httpService = axios.create({
  baseURL: env.apiUrl,
});

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

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
      request.url === "/auth/refresh"
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
      return new Promise((resolve) => {
        pendingRequests.push((token) => {
          request.headers.Authorization = `Bearer ${token}`;
          resolve(httpService(request));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(`${env.apiUrl}/auth/refresh`, {
        token: refreshToken,
      });

      setToken(data.accessToken, true);
      setRefreshToken(data.refreshToken, true);

      pendingRequests.forEach((callback) => callback(data.accessToken));
      pendingRequests = [];

      request.headers.Authorization = `Bearer ${data.accessToken}`;

      return httpService(request);
    } catch (refreshError) {
      clearTokens();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
