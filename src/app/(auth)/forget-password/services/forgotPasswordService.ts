import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import {
  ForgotPasswordRequestBody,
  SendForgotPasswordCodeBody,
  ForgotPasswordResult,
} from "../types/forgot-password";

export const forgotPasswordService = {
  sendCode(data: SendForgotPasswordCodeBody) {
    return api
      .post<ApiResponse<ForgotPasswordResult>>(
        "/api/request-code/forgot-password-code",
        { email: data.email }
      )
      .then((res) => res.data);
  },

  resetPassword(data: ForgotPasswordRequestBody) {
    return api
      .post<ApiResponse<ForgotPasswordResult>>(
        "/api/v1/auth/forgot-password",
        {
          email: data.email,
          code: data.code,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }
      )
      .then((res) => res.data);
  },
};