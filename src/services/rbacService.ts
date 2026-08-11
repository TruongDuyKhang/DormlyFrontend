import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  RoleResponseDto,
  RoleRequest,
  PermissionResponseDto,
  PermissionRequest,
  NavigationResponseDto,
  NavigationRequest,
} from "@/types/models";

export const rbacService = {
  // ================= ROLES =================
  async listRoles(): Promise<RoleResponseDto[]> {
    const { data } = await api.get<ApiResponse<RoleResponseDto[]>>("/api/roles");
    return data.result;
  },

  async getRoleById(id: string): Promise<RoleResponseDto> {
    const { data } = await api.get<ApiResponse<RoleResponseDto>>(`/api/roles/${id}`);
    return data.result;
  },

  async createRole(payload: RoleRequest): Promise<RoleResponseDto> {
    const { data } = await api.post<ApiResponse<RoleResponseDto>>("/api/roles", payload);
    return data.result;
  },

  async updateRole(id: string, payload: RoleRequest): Promise<RoleResponseDto> {
    const { data } = await api.put<ApiResponse<RoleResponseDto>>(`/api/roles/${id}`, payload);
    return data.result;
  },

  async deleteRole(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/roles/${id}`);
  },

  // ================= PERMISSIONS =================
  async listPermissions(): Promise<PermissionResponseDto[]> {
    const { data } = await api.get<ApiResponse<PermissionResponseDto[]>>("/api/permissions");
    return data.result;
  },

  async getPermissionById(id: string): Promise<PermissionResponseDto> {
    const { data } = await api.get<ApiResponse<PermissionResponseDto>>(`/api/permissions/${id}`);
    return data.result;
  },

  async createPermission(payload: PermissionRequest): Promise<PermissionResponseDto> {
    const { data } = await api.post<ApiResponse<PermissionResponseDto>>("/api/permissions", payload);
    return data.result;
  },

  async updatePermission(id: string, payload: PermissionRequest): Promise<PermissionResponseDto> {
    const { data } = await api.put<ApiResponse<PermissionResponseDto>>(`/api/permissions/${id}`, payload);
    return data.result;
  },

  async deletePermission(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/permissions/${id}`);
  },

  // ================= NAVIGATIONS =================
  async listNavigations(): Promise<NavigationResponseDto[]> {
    const { data } = await api.get<ApiResponse<NavigationResponseDto[]>>("/api/navigations");
    return data.result;
  },

  async getNavigationById(id: string): Promise<NavigationResponseDto> {
    const { data } = await api.get<ApiResponse<NavigationResponseDto>>(`/api/navigations/${id}`);
    return data.result;
  },

  async createNavigation(payload: NavigationRequest): Promise<NavigationResponseDto> {
    const { data } = await api.post<ApiResponse<NavigationResponseDto>>("/api/navigations", payload);
    return data.result;
  },

  async updateNavigation(id: string, payload: NavigationRequest): Promise<NavigationResponseDto> {
    const { data } = await api.put<ApiResponse<NavigationResponseDto>>(`/api/navigations/${id}`, payload);
    return data.result;
  },

  async deleteNavigation(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/navigations/${id}`);
  },

  /**
   * Get dynamic navigation tree for current user according to assigned permissions/roles
   */
  async getMyNavigationsTree(): Promise<NavigationResponseDto[]> {
    const { data } = await api.get<ApiResponse<NavigationResponseDto[]>>("/api/navigations/me");
    return data.result;
  },
};
