import { api, apiWithFile } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  FirebaseLoginRequest,
  AuthTokensResponse,
} from "@/types/models";
import { tokenService } from "./tokenService";

export const authService = {
  /**
   * User login with email/password
   */
  async login(payload: LoginRequest): Promise<AuthTokensResponse> {
    const { data } = await api.post<ApiResponse<AuthTokensResponse>>(
      "/api/v1/auth/login",
      payload
    );
    if (data.result?.accessToken) {
      tokenService.setAccessToken(data.result.accessToken);
      localStorage.setItem("session.user", JSON.stringify(data.result));
    }
    return data.result;
  },

  /**
   * Register a new student account with identity files (Multipart)
   */
  async register(
    payload: RegisterRequest,
    citizenIdFile: File,
    studentCardFile: File
  ): Promise<void> {
    const formData = new FormData();
    formData.append("request", JSON.stringify(payload));
    formData.append("citizenIdFile", citizenIdFile);
    formData.append("studentCardFile", studentCardFile);

    await apiWithFile.post<ApiResponse<void>>(
      "/api/v1/auth/register",
      formData,
      { headers: { "Content-Type": undefined } }
    );
  },

  /**
   * Refresh JWT token using httpOnly cookie
   */
  async refresh(): Promise<AuthTokensResponse> {
    const { data } = await api.post<ApiResponse<AuthTokensResponse>>(
      "/api/v1/auth/refresh",
      {}
    );
    if (data.result?.accessToken) {
      tokenService.setAccessToken(data.result.accessToken);
    }
    return data.result;
  },

  /**
   * Logout user & blacklist token
   */
  async logout(): Promise<void> {
    try {
      await api.post<ApiResponse<void>>("/api/v1/auth/logout", {});
    } finally {
      tokenService.clearAccessToken();
      localStorage.removeItem("session.user");
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  },

  /**
   * Reset/Forgot password
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await api.post<ApiResponse<void>>("/api/v1/auth/forgot-password", payload);
  },

  /**
   * Exchange Google OAuth2 code
   */
  async exchangeOAuth2Code(): Promise<AuthTokensResponse> {
    const { data } = await api.post<ApiResponse<AuthTokensResponse>>(
      "/api/v1/auth/oauth2/token"
    );
    if (data.result?.accessToken) {
      tokenService.setAccessToken(data.result.accessToken);
      localStorage.setItem("session.user", JSON.stringify(data.result));
    }
    return data.result;
  },

  /**
   * Firebase ID Token authentication
   */
  async loginWithFirebase(payload: FirebaseLoginRequest): Promise<AuthTokensResponse> {
    const { data } = await api.post<ApiResponse<AuthTokensResponse>>(
      "/api/v1/auth/firebase",
      payload
    );
    if (data.result?.accessToken) {
      tokenService.setAccessToken(data.result.accessToken);
      localStorage.setItem("session.user", JSON.stringify(data.result));
    }
    return data.result;
  },
};
