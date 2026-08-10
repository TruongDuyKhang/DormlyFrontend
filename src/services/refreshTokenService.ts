import axios from "axios";
import { baseUrl } from "@/lib/axios";
import { tokenService } from "./tokenService";
import { ApiResponse } from "@/types/api";

interface RefreshTokenResult {
  accessToken: string;
  fullName: string | null;
  roles: string[] | null;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

export const refreshTokenService = {
  async refreshAccessToken(): Promise<string> {
    if (isRefreshing) {
      return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));
    }
    isRefreshing = true;
    try {
      const response = await axios.post<ApiResponse<RefreshTokenResult>>(
        `${baseUrl}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      );

      if (response.data.code === 200 && response.data.result?.accessToken) {
        const { accessToken } = response.data.result;
        tokenService.setAccessToken(accessToken);
        processQueue(null, accessToken);
        return accessToken;
      }
      throw new Error("Refresh token failed");
    } catch (error) {
      processQueue(error, null);
      tokenService.clearAccessToken();
      throw error;
    } finally {
      isRefreshing = false;
    }
  },
};