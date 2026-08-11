import { api } from "@/lib/axios";
import type { ApiResponse, PageResponse } from "@/types/api";
import type {
  AuditLogResponseDto,
  AuditLogCreateRequest,
} from "@/types/models";

export const auditLogService = {
  /**
   * Search and filter system audit logs with pagination
   */
  async search(params?: {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<AuditLogResponseDto>> {
    const { data } = await api.get<ApiResponse<PageResponse<AuditLogResponseDto>>>(
      "/api/audit-logs",
      { params }
    );
    return data.result;
  },

  /**
   * Manually create audit log entry
   */
  async create(payload: AuditLogCreateRequest): Promise<AuditLogResponseDto> {
    const { data } = await api.post<ApiResponse<AuditLogResponseDto>>(
      "/api/audit-logs",
      payload
    );
    return data.result;
  },
};
