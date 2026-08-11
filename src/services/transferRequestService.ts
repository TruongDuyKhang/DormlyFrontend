import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  TransferRequestResponseDto,
  RoomTransferRequest,
  TransferRequestStatusUpdateRequest,
} from "@/types/models";

export const transferRequestService = {
  /**
   * Student: Submit a room transfer request
   */
  async submitRequest(payload: RoomTransferRequest): Promise<void> {
    await api.post<ApiResponse<void>>("/api/transfer-request", payload);
  },

  /**
   * Admin: List all transfer requests
   */
  async listAll(): Promise<TransferRequestResponseDto[]> {
    const { data } = await api.get<ApiResponse<TransferRequestResponseDto[]>>(
      "/api/transfer-request"
    );
    return data.result;
  },

  /**
   * Admin: Get transfer request details by ID
   */
  async getById(id: string): Promise<TransferRequestResponseDto> {
    const { data } = await api.get<ApiResponse<TransferRequestResponseDto>>(
      `/api/transfer-request/${id}`
    );
    return data.result;
  },

  /**
   * Admin: Delete transfer request
   */
  async deleteRequest(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/transfer-request/${id}`);
  },

  /**
   * Admin: Approve/Reject transfer request status
   */
  async updateStatus(
    id: string,
    payload: TransferRequestStatusUpdateRequest
  ): Promise<TransferRequestResponseDto> {
    const { data } = await api.patch<ApiResponse<TransferRequestResponseDto>>(
      `/api/transfer-request/${id}/status`,
      payload
    );
    return data.result;
  },
};
