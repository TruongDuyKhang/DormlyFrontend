// app/(auth)/logout/services/logoutService.ts
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export async function logoutUser() {
  return api.post<ApiResponse<null>>("/api/v1/auth/logout").then((res) => res.data);
}