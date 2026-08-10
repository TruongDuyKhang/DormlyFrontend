export interface ForgotPasswordRequestBody {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SendForgotPasswordCodeBody {
  email: string;
}

export type ForgotPasswordResult = null;