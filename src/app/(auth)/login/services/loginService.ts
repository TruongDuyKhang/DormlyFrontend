import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { LoginRequestBody, LoginResult } from "../types/login";

export const loginUser = (data: LoginRequestBody) =>
  api.post<ApiResponse<LoginResult>>("/api/v1/auth/login", data).then((res) => res.data);
