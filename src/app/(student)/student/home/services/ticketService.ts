import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { TicketSummary } from "../types/ticket";

export const ticketService = {
  async getRecentTickets(limit = 3) {
    const { data } = await api.get<ApiResponse<TicketSummary[]>>("/api/users/me/tickets");
    // Backend đã trả newest-first, sort lại phòng trường hợp không đảm bảo thứ tự
    const sorted = [...data.result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, limit);
  },
};