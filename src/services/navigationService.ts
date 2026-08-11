import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { NavigationResponseDto, NavigationRequest } from "@/types/models";

export const navigationService = {
  /**
   * Get dynamic navigation tree for current authenticated user
   */
  async getMyNavigations(): Promise<NavigationResponseDto[]> {
    const { data } = await api.get<ApiResponse<NavigationResponseDto[]>>(
      "/api/navigations/me"
    );
    return data.result || [];
  },

  /**
   * List all navigations (Admin)
   */
  async list(): Promise<NavigationResponseDto[]> {
    const { data } = await api.get<ApiResponse<NavigationResponseDto[]>>(
      "/api/navigations"
    );
    return data.result || [];
  },

  /**
   * Create navigation item
   */
  async create(payload: NavigationRequest): Promise<NavigationResponseDto> {
    const { data } = await api.post<ApiResponse<NavigationResponseDto>>(
      "/api/navigations",
      payload
    );
    return data.result;
  },

  /**
   * Update navigation item
   */
  async update(id: string, payload: NavigationRequest): Promise<NavigationResponseDto> {
    const { data } = await api.put<ApiResponse<NavigationResponseDto>>(
      `/api/navigations/${id}`,
      payload
    );
    return data.result;
  },

  /**
   * Delete navigation item
   */
  async delete(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/navigations/${id}`);
  },
};
