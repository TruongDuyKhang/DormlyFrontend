import { api, apiWithFile, baseUrl } from "@/lib/axios";
import type { ApiResponse, PageResponse } from "@/types/api";
import type {
  TicketSummaryResponseDto,
  TicketDetailResponseDto,
  TicketCommentResponseDto,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  CreateTicketRequest,
  CreateTicketCommentRequest,
  TicketStatusUpdateRequest,
  TicketPriorityUpdateRequest,
  TicketDueDateUpdateRequest,
  TicketAssigneesUpdateRequest,
  TicketFilterParams,
} from "@/types/models";

function buildMultipart(
  data: CreateTicketRequest | CreateTicketCommentRequest,
  files?: File[]
) {
  const formData = new FormData();
  // Backend reads part "data" using @RequestPart -> send as application/json Blob
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (files && files.length > 0) {
    files.forEach((file) => formData.append("files", file));
  }
  return formData;
}

export const ticketService = {
  // ================= STUDENT ME ENDPOINTS =================
  /**
   * Student: Create a new support ticket (with optional file attachments)
   */
  async createTicket(
    payload: CreateTicketRequest,
    files?: File[]
  ): Promise<TicketDetailResponseDto> {
    const formData = buildMultipart(payload, files);
    const { data } = await apiWithFile.post<ApiResponse<TicketDetailResponseDto>>(
      "/api/users/me/tickets",
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return data.result;
  },

  /**
   * Student: Get my ticket list (optional filter by status)
   */
  async getMyTickets(status?: TicketStatus): Promise<TicketSummaryResponseDto[]> {
    const { data } = await api.get<ApiResponse<TicketSummaryResponseDto[]>>(
      "/api/users/me/tickets",
      { params: status ? { status } : undefined }
    );
    return data.result;
  },

  /**
   * Student: Get ticket details by ID
   */
  async getMyTicketDetail(ticketId: string): Promise<TicketDetailResponseDto> {
    const { data } = await api.get<ApiResponse<TicketDetailResponseDto>>(
      `/api/users/me/tickets/${ticketId}`
    );
    return data.result;
  },

  /**
   * Student: Add comment to own ticket (with optional attachments)
   */
  async addComment(
    ticketId: string,
    payload: CreateTicketCommentRequest,
    files?: File[]
  ): Promise<TicketCommentResponseDto> {
    const formData = buildMultipart(payload, files);
    const { data } = await apiWithFile.post<ApiResponse<TicketCommentResponseDto>>(
      `/api/users/me/tickets/${ticketId}/comments`,
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return data.result;
  },

  // ================= ADMIN & STAFF ENDPOINTS =================
  /**
   * Admin/Staff: List tickets with pagination and filtering
   */
  async listTickets(
    params?: TicketFilterParams
  ): Promise<PageResponse<TicketSummaryResponseDto>> {
    const { data } = await api.get<ApiResponse<PageResponse<TicketSummaryResponseDto>>>(
      "/api/tickets",
      { params }
    );
    return data.result;
  },

  /**
   * Admin/Staff: Get Kanban Board of tickets grouped by status
   */
  async getBoard(): Promise<Record<TicketStatus, TicketSummaryResponseDto[]>> {
    const { data } = await api.get<ApiResponse<Record<TicketStatus, TicketSummaryResponseDto[]>>>(
      "/api/tickets/board"
    );
    return data.result;
  },

  /**
   * Admin/Staff: Get ticket detail
   */
  async getTicketDetail(ticketId: string): Promise<TicketDetailResponseDto> {
    const { data } = await api.get<ApiResponse<TicketDetailResponseDto>>(
      `/api/tickets/${ticketId}`
    );
    return data.result;
  },

  /**
   * Admin/Staff: Update ticket status
   */
  async updateStatus(
    ticketId: string,
    payload: TicketStatusUpdateRequest
  ): Promise<TicketDetailResponseDto> {
    const { data } = await api.patch<ApiResponse<TicketDetailResponseDto>>(
      `/api/tickets/${ticketId}/status`,
      payload
    );
    return data.result;
  },

  /**
   * Admin/Staff: Update ticket priority
   */
  async updatePriority(
    ticketId: string,
    payload: TicketPriorityUpdateRequest
  ): Promise<TicketDetailResponseDto> {
    const { data } = await api.patch<ApiResponse<TicketDetailResponseDto>>(
      `/api/tickets/${ticketId}/priority`,
      payload
    );
    return data.result;
  },

  /**
   * Admin/Staff: Update ticket due date
   */
  async updateDueDate(
    ticketId: string,
    payload: TicketDueDateUpdateRequest
  ): Promise<TicketDetailResponseDto> {
    const { data } = await api.patch<ApiResponse<TicketDetailResponseDto>>(
      `/api/tickets/${ticketId}/due-date`,
      payload
    );
    return data.result;
  },

  /**
   * Admin/Staff: Update assigned staff
   */
  async updateAssignees(
    ticketId: string,
    payload: TicketAssigneesUpdateRequest
  ): Promise<TicketDetailResponseDto> {
    const { data } = await api.put<ApiResponse<TicketDetailResponseDto>>(
      `/api/tickets/${ticketId}/assignees`,
      payload
    );
    return data.result;
  },

  /**
   * Admin/Staff: Add staff comment to ticket
   */
  async addAdminComment(
    ticketId: string,
    payload: CreateTicketCommentRequest,
    files?: File[]
  ): Promise<TicketCommentResponseDto> {
    const formData = buildMultipart(payload, files);
    const { data } = await apiWithFile.post<ApiResponse<TicketCommentResponseDto>>(
      `/api/tickets/${ticketId}/comments`,
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return data.result;
  },

  // ================= ATTACHMENTS =================
  /**
   * Get full URL for downloading/viewing ticket attachment
   */
  getAttachmentUrl(storedFileName: string): string {
    return `${baseUrl}/api/ticket-attachments/${storedFileName}`;
  },

  /**
   * Delete ticket attachment
   */
  async deleteAttachment(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/api/ticket-attachments/${id}`);
  },
};
