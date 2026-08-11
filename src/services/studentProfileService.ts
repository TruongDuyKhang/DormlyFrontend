import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  StudentProfileResponseDto,
  StudentProfileRequest,
} from "@/types/models";

export const studentProfileService = {
  /**
   * Get current student profile
   */
  async getMyProfile(): Promise<StudentProfileResponseDto> {
    const { data } = await api.get<ApiResponse<StudentProfileResponseDto>>(
      "/api/users/profile/student-profile"
    );
    return data.result;
  },

  /**
   * Upsert current student profile
   */
  async upsertMyProfile(
    payload: StudentProfileRequest
  ): Promise<StudentProfileResponseDto> {
    const { data } = await api.put<ApiResponse<StudentProfileResponseDto>>(
      "/api/users/profile/student-profile",
      payload
    );
    return data.result;
  },

  /**
   * List all student profiles (Admin / Staff)
   */
  async listAllProfiles(): Promise<StudentProfileResponseDto[]> {
    const { data } = await api.get<ApiResponse<StudentProfileResponseDto[]>>(
      "/api/users/profile/student-profiles"
    );
    return data.result;
  },
};
