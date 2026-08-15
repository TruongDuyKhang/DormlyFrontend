import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  UserResponseDto,
  UserRequest,
  ChangePasswordRequest,
} from "@/types/models";
import { tokenService, decodeJWT } from "./tokenService";

export const userService = {
  /**
   * Get current authenticated user's full profile (phone, gender, dateOfBirth, etc.)
   * Decodes the stored JWT to extract userId, then calls GET /api/users/{id}
   */
  async getMe(): Promise<UserResponseDto> {
    const token = tokenService.getAccessToken();
    const decoded = token ? decodeJWT(token) : null;
    if (!decoded?.id) {
      throw new Error("No authenticated user found");
    }
    const { data } = await api.get<ApiResponse<UserResponseDto>>(`/api/users/${decoded.id}`);
    return data.result;
  },

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
