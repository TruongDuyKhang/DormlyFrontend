import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  RoomAssignmentResponseDto,
  RoomAssignmentRequest,
  CurrentRoomResponseDto,
  RoomHistoryResponseDto,
} from "@/types/models";

export const roomAssignmentService = {
  // ================= ADMIN ROOM ASSIGNMENTS =================
  /**
   * List all room assignments
   */
  async list(): Promise<RoomAssignmentResponseDto[]> {
    const { data } = await api.get<ApiResponse<RoomAssignmentResponseDto[]>>(
      "/api/room-assignments"
    );
    return data.result;
  },

  /**
   * Get assignment by ID
   */
  async getById(id: string): Promise<RoomAssignmentResponseDto> {
    const { data } = await api.get<ApiResponse<RoomAssignmentResponseDto>>(
      `/api/room-assignments/${id}`
    );
    return data.result;
  },

  /**
   * Create room assignment
   */
  async create(payload: RoomAssignmentRequest): Promise<RoomAssignmentResponseDto> {
    const { data } = await api.post<ApiResponse<RoomAssignmentResponseDto>>(
      "/api/room-assignments",
      payload
    );
    return data.result;
  },

  /**
   * Update room assignment
   */
  async update(
    id: string,
    payload: RoomAssignmentRequest
  ): Promise<RoomAssignmentResponseDto> {
    const { data } = await api.put<ApiResponse<RoomAssignmentResponseDto>>(
      `/api/room-assignments/${id}`,
      payload
    );
    return data.result;
  },

  /**
   * Delete room assignment
   */
  async delete(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/room-assignments/${id}`);
  },

  /**
   * Assign room manually with full parameters
   */
  async assignManual(
    payload: RoomAssignmentRequest
  ): Promise<RoomAssignmentResponseDto> {
    const { data } = await api.post<ApiResponse<RoomAssignmentResponseDto>>(
      "/api/room-assignments/assign-manual",
      payload
    );
    return data.result;
  },

  /**
   * Assign room automatically based on algorithm & preferences
   */
  async assignAuto(params: {
    userId: string;
    startDate?: string;
    endDate?: string;
    assignedBy?: string;
    contractUrl?: string;
    notes?: string;
  }): Promise<RoomAssignmentResponseDto> {
    const { data } = await api.post<ApiResponse<RoomAssignmentResponseDto>>(
      "/api/room-assignments/assign-auto",
      null,
      { params }
    );
    return data.result;
  },

  // ================= STUDENT ME ROOM =================
  /**
   * Student: Get current assigned room details
   */
  async getCurrentRoom(at?: string): Promise<CurrentRoomResponseDto> {
    const { data } = await api.get<ApiResponse<CurrentRoomResponseDto>>(
      "/api/users/me/current-room",
      { params: at ? { at } : undefined }
    );
    return data.result;
  },

  /**
   * Student: Get room history
   */
  async getRoomHistory(): Promise<RoomHistoryResponseDto[]> {
    const { data } = await api.get<ApiResponse<RoomHistoryResponseDto[]>>(
      "/api/users/me/room-history"
    );
    return data.result;
  },
};
