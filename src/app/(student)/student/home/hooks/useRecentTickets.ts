"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ticketService } from "../services/ticketService";
import type { TicketSummary } from "../types/ticket";

function extractErrorMessage(err: unknown, fallback: string) {
  return axios.isAxiosError(err)
    ? err.response?.data?.message ?? err.message ?? fallback
    : (err as any)?.message ?? fallback;
}

export function useRecentTickets(limit = 3) {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ticketService.getRecentTickets(limit);
      setTickets(result);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Không tải được yêu cầu gần đây"));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  return { tickets, loading, refetch: fetchRecent };
}