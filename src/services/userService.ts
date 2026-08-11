import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  UserResponseDto,
  UserRequest,
  ChangePasswordRequest,
} from "@/types/models";

export const userService = {
  /**
   * Get all users (Admin/Staff)
   */
  async list(): Promise<UserResponseDto[]> {
    const { data } = await api.get<ApiResponse<UserResponseDto[]>>("/api/users");
    return data.result;
  },

  /**
   * Get user details by ID
   */
  async getById(id: string): Promise<UserResponseDto> {
    const { data } = await api.get<ApiResponse<UserResponseDto>>(`/api/users/${id}`);
    return data.result;
  },

  /**
   * Create new user
   */
  async create(payload: UserRequest): Promise<UserResponseDto> {
    const { data } = await api.post<ApiResponse<UserResponseDto>>("/api/users", payload);
    return data.result;
  },

  /**
   * Update user details
   */
  async update(id: string, payload: UserRequest): Promise<UserResponseDto> {
    const { data } = await api.put<ApiResponse<UserResponseDto>>(`/api/users/${id}`, payload);
    return data.result;
  },

  /**
   * Delete user (Admin only)
   */
  async delete(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/users/${id}`);
  },

  /**
   * Toggle active/inactive status of a user
   */
  async toggleStatus(id: string): Promise<UserResponseDto> {
    const { data } = await api.patch<ApiResponse<UserResponseDto>>(`/api/users/toggle/${id}`);
    return data.result;
  },

  /**
   * Update user password
   */
  async updatePassword(id: string, payload: ChangePasswordRequest): Promise<void> {
    await api.put<ApiResponse<void>>(`/api/users/${id}/update-password`, payload);
  },
};
