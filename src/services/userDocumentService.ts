import { api, apiWithFile, baseUrl } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  UserDocumentResponseDto,
  AdminDocumentStatusRequest,
  DocumentType,
  DocumentStatus,
} from "@/types/models";

export const userDocumentService = {
  /**
   * List current user's documents
   */
  async getMyDocuments(): Promise<UserDocumentResponseDto[]> {
    const { data } = await api.get<ApiResponse<UserDocumentResponseDto[]>>(
      "/api/users/me/documents"
    );
    return data.result || [];
  },

  /**
   * List all documents grouped by user ID (Admin)
   */
  async listGroupedByUserId(): Promise<Record<string, UserDocumentResponseDto[]>> {
    const { data } = await api.get<ApiResponse<Record<string, UserDocumentResponseDto[]>>>(
      "/api/users/me/documents/grouped-by-user-id"
    );
    return data.result || {};
  },

  /**
   * Upload or replace a document (Multipart)
   */
  async upsertDocument(
    documentType: DocumentType | string,
    status: DocumentStatus | string,
    file: File,
    rejectReason?: string
  ): Promise<UserDocumentResponseDto> {
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("status", status);
    if (rejectReason) {
      formData.append("rejectReason", rejectReason);
    }
    formData.append("file", file);

    const { data } = await apiWithFile.post<ApiResponse<UserDocumentResponseDto>>(
      "/api/users/me/documents",
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return data.result;
  },

  /**
   * Admin approve/reject document status
   */
  async setDocumentStatus(
    documentId: string,
    payload: AdminDocumentStatusRequest
  ): Promise<UserDocumentResponseDto> {
    const { data } = await api.patch<ApiResponse<UserDocumentResponseDto>>(
      `/api/users/me/documents/${documentId}/status`,
      payload
    );
    return data.result;
  },

  /**
   * Get full URL of document file
   */
  getFileUrl(fileUrl: string): string {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http")) return fileUrl;
    return `${baseUrl}${fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`}`;
  },

  /**
   * Alias for getFileUrl
   */
  getDocumentUrl(filename: string): string {
    return this.getFileUrl(`/uploads/user-documents/${filename}`);
  },
};
