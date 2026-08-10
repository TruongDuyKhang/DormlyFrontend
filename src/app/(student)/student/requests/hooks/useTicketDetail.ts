"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ticketService } from "../services/ticketService";
import type { TicketDetail, CreateCommentPayload } from "../types/ticket";

function extractErrorMessage(err: unknown, fallback: string) {
  return axios.isAxiosError(err)
    ? err.response?.data?.message ?? err.message ?? fallback
    : (err as any)?.message ?? fallback;
}

export function useTicketDetail(ticketId: string | null) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!ticketId) {
      setTicket(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await ticketService.getMyTicketDetail(ticketId);
      setTicket(result);
    } catch (err) {
      const message = extractErrorMessage(err, "Không tải được yêu cầu này");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const addComment = useCallback(
    async (payload: CreateCommentPayload, files: File[]) => {
      if (!ticketId) return;
      try {
        const result = await ticketService.addComment(ticketId, payload, files);
        toast.success("Comment sent");
        await fetchDetail();
        return result;
      } catch (err) {
        const message = extractErrorMessage(err, "Comment submission failed");
        toast.error(message);
        throw new Error(message);
      }
    },
    [ticketId, fetchDetail]
  );

  return { ticket, loading, error, refetch: fetchDetail, addComment };
}