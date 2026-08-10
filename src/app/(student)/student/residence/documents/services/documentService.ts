import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { UserDocument } from "../types/document";

export async function getMyDocuments(): Promise<ApiResponse<UserDocument[]>> {
  const resp = await api.get<ApiResponse<UserDocument[]>>("/api/users/me/documents");
  return resp.data;
}

// File được serve ở root domain, không nằm dưới /api -> override baseURL riêng cho request này
const fileOrigin = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/api\/?$/, "");

// File cần Authorization header nên phải fetch bằng axios (blob),
// không thể dùng <img src> hay <a href> trực tiếp.
export async function fetchDocumentBlobUrl(fileUrl: string): Promise<string> {
  const response = await api.get(fileUrl, {
    baseURL: fileOrigin,
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
}