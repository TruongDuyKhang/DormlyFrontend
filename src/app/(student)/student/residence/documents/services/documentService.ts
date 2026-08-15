import { baseUrl, api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { UserDocument } from "../types/document";

export async function getMyDocuments(): Promise<ApiResponse<UserDocument[]>> {
  const resp = await api.get<ApiResponse<UserDocument[]>>("/api/users/me/documents");
  return resp.data;
}

export async function uploadDocument(
  documentType: string,
  file: File
): Promise<ApiResponse<UserDocument>> {
  const formData = new FormData();
  formData.append("documentType", documentType);
  formData.append("status", "PENDING");
  formData.append("file", file);

  const resp = await api.post<ApiResponse<UserDocument>>(
    "/api/users/me/documents",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return resp.data;
}

export async function fetchDocumentBlobUrl(fileUrlPath: string): Promise<string> {
  if (!fileUrlPath) throw new Error("File path is empty");
  
  let fullUrl: string;
  if (fileUrlPath.startsWith("http://") || fileUrlPath.startsWith("https://")) {
    fullUrl = fileUrlPath;
  } else {
    const cleanPath = fileUrlPath.startsWith("/") ? fileUrlPath : `/${fileUrlPath}`;
    fullUrl = `${baseUrl}${cleanPath}`;
  }

  const response = await api.get(fullUrl, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
}