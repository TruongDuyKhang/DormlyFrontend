import { api, apiWithFile, baseUrl } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  TicketSummary,
  TicketDetail,
  TicketStatus,
  TicketComment,
  CreateTicketPayload,
  CreateCommentPayload,
} from "../types/ticket";

function buildMultipart(
  data: CreateTicketPayload | CreateCommentPayload,
  files?: File[]
) {
  const formData = new FormData();
  // Backend đọc part "data" bằng @RequestPart -> phải gửi đúng content-type application/json
  formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
  files?.forEach((file) => formData.append("files", file));
  return formData;
}

export const ticketService = {
  async createTicket(payload: CreateTicketPayload, files?: File[]) {
    const formData = buildMultipart(payload, files);
    const { data } = await apiWithFile.post<ApiResponse<TicketDetail>>(
      "/api/users/me/tickets",
      formData,
      // ghi đè header mặc định để browser tự set boundary cho multipart
      { headers: { "Content-Type": undefined } }
    );
    return data.result;
  },

  async getMyTickets(status?: TicketStatus) {
    const { data } = await api.get<ApiResponse<TicketSummary[]>>("/api/users/me/tickets", {
      params: status ? { status } : undefined,
    });
    return data.result;
  },

  async getMyTicketDetail(ticketId: string) {
    const { data } = await api.get<ApiResponse<TicketDetail>>(
      `/api/users/me/tickets/${ticketId}`
    );
    return data.result;
  },

  async addComment(ticketId: string, payload: CreateCommentPayload, files?: File[]) {
    const formData = buildMultipart(payload, files);
    const { data } = await apiWithFile.post<ApiResponse<TicketComment>>(
      `/api/users/me/tickets/${ticketId}/comments`,
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return data.result;
  },

  attachmentUrl(url: string) {
    return `${baseUrl}${url}`;
  },
};