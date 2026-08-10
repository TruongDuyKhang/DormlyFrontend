// app/(auth)/register/services/registerService.ts
import { api, apiWithFile } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { RegisterRequestBody, RegisterResult } from "../types/register";

export const sendRegisterCode = (email: string) =>
  api.post<ApiResponse<null>>("/api/request-code/register-code", { email })
    .then(res => res.data);

export const registerUser = (
  body: RegisterRequestBody,
  citizenIdFile: File,
  studentCardFile: File
) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify(body));
  formData.append("citizenIdFile", citizenIdFile);
  formData.append("studentCardFile", studentCardFile);

  return apiWithFile
    .post<ApiResponse<RegisterResult>>("/api/v1/auth/register", formData)
    .then(res => res.data);
};