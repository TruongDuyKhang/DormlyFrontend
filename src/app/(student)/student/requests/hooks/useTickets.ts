"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ticketService } from "../services/ticketService";
import type { TicketSummary, TicketStatus, CreateTicketPayload } from "../types/ticket";

function extractErrorMessage(err: unknown, fallback: string) {
  return axios.isAxiosError(err)
    ? err.response?.data?.message ?? err.message ?? fallback
    : (err as any)?.message ?? fallback;
}

export function useTickets(status?: TicketStatus) {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ticketService.getMyTickets(status);
      setTickets(result);
    } catch (err) {
      const message = extractErrorMessage(err, "Không tải được danh sách yêu cầu");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = useCallback(
    async (payload: CreateTicketPayload, files: File[]) => {
      try {
        const result = await ticketService.createTicket(payload, files);
        toast.success(`The ${result.code} request has been created`);
        await fetchTickets();
        return result;
      } catch (err) {
        const message = extractErrorMessage(err, "Create a failure request");
        toast.error(message);
        throw new Error(message);
      }
    },
    [fetchTickets]
  );

  return { tickets, loading, error, refetch: fetchTickets, createTicket };
}