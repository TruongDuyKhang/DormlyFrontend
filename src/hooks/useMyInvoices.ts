'use client';

import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '@/services/invoiceService';
import type { InvoiceResponseDto } from '@/types/models';

export function useMyInvoices() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getMyInvoices();
      setInvoices(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const payInvoice = async (id: string) => {
    try {
      const result = await invoiceService.payInvoice(id);
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? result : inv)));
      return result;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Payment failed';
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    isLoading,
    error,
    payInvoice,
    refetch: fetchInvoices,
  };
}
