import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export const requestCodeService = {
  /**
   * Send verification code for registration
   */
  async sendRegisterCode(email: string): Promise<void> {
    await api.post<ApiResponse<void>>("/api/request-code/register-code", { email });
  },

  /**
   * Send verification code for password reset
   */
  async sendForgotPasswordCode(email: string): Promise<void> {
    await api.post<ApiResponse<void>>("/api/request-code/forgot-password-code", { email });
  },
};
