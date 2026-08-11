import axios from "axios";
import { tokenService } from "@/services/tokenService";
import { refreshTokenService } from "@/services/refreshTokenService";

export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Các path public không cần token
const PUBLIC_API_PATHS = [
  "/api/v1/auth/login",        // 👈 Sửa đúng path
  "/api/v1/auth/register",
  "/api/v1/auth/verify-otp",
  "/api/v1/auth/forget-password",
  "/api/v1/auth/refresh",
  "/api/v1/auth/logout",
];

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_API_PATHS.some((p) => config.url?.includes(p));
  const token = tokenService.getAccessToken();

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor xử lý refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthPath = PUBLIC_API_PATHS.some((p) => originalRequest?.url?.includes(p));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshTokenService.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenService.clearAccessToken();
        localStorage.removeItem("session.user");
        if (typeof window !== "undefined") {
          window.location.replace("/login?expired=1");
        }
        return Promise.reject(refreshError);
      }
    }

    console.error("API Error:", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

// Api cho upload file
export const apiWithFile = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

apiWithFile.interceptors.request.use((config) => {
  const isPublic = PUBLIC_API_PATHS.some((p) => config.url?.includes(p));
  const token = tokenService.getAccessToken();

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiWithFile.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthPath = PUBLIC_API_PATHS.some((p) => originalRequest?.url?.includes(p));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshTokenService.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiWithFile(originalRequest);
      } catch (refreshError) {
        tokenService.clearAccessToken();
        localStorage.removeItem("session.user");
        if (typeof window !== "undefined") {
          window.location.replace("/login?expired=1");
        }
        return Promise.reject(refreshError);
      }
    }
    console.error("API Error:", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);