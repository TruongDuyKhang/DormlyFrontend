import axios from "axios";
import { tokenService } from "@/services/tokenService";
import { refreshTokenService } from "@/services/refreshTokenService";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://26.153.167.228:55555";
export const baseUrl = rawBaseUrl.replace(/\/+$/, "").replace(/\/api$/, "");

// Public endpoints that don't need Bearer token
const PUBLIC_API_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/verify-otp",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/refresh",
  "/api/v1/auth/firebase",
  "/api/v1/auth/oauth2",
];

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiWithFile = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_API_PATHS.some((p) => config.url?.includes(p));
  const token = tokenService.getAccessToken();

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiWithFile.interceptors.request.use((config) => {
  const isPublic = PUBLIC_API_PATHS.some((p) => config.url?.includes(p));
  const token = tokenService.getAccessToken();

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handling token refresh on 401
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
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.replace("/login?expired=1");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);