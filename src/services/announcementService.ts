import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  AnnouncementResponseDto,
  AnnouncementRequestDto,
} from "@/types/models";

export const announcementService = {
  /**
   * Get all announcements
   */
  async getAll(): Promise<AnnouncementResponseDto[]> {
    const { data } = await api.get<ApiResponse<AnnouncementResponseDto[]>>(
      "/api/announcements"
    );
    return data.result;
  },

  /**
   * Get announcement details by ID
   */
  async getById(id: string): Promise<AnnouncementResponseDto> {
    const { data } = await api.get<ApiResponse<AnnouncementResponseDto>>(
      `/api/announcements/${id}`
    );
    return data.result;
  },

  /**
   * Admin: Create a new announcement
   */
  async create(payload: AnnouncementRequestDto): Promise<AnnouncementResponseDto> {
    const { data } = await api.post<ApiResponse<AnnouncementResponseDto>>(
      "/api/announcements",
      payload
    );
    return data.result;
  },

  /**
   * Admin: Delete announcement
   */
  async delete(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/announcements/${id}`);
  },
};
