// services/authService.ts
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  fullName: string;
  roles: string[];
}

export const authService = {
  login(data: LoginRequestBody) {
    return api
      .post<ApiResponse<LoginResult>>("/api/v1/auth/login", data)
      .then((res) => res.data);
  },

  logout() {
    return api
      .post<ApiResponse<null>>("/api/v1/auth/logout")
      .then((res) => res.data);
  },
};