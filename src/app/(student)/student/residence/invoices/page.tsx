// app/(student)/student/residence/invoices/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Receipt, CheckCircle2, Clock, DollarSign, RefreshCw, Loader2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { invoiceService } from '@/services/invoiceService';
import type { InvoiceResponseDto } from '@/types/models';

export default function StudentInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await invoiceService.getMyInvoices().catch(() => []);
      setInvoices(data);
    } catch (e) {
      console.error('Failed to load student invoices:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const totalDue = invoices
    .filter((inv: any) => inv.status !== 'PAID')
    .reduce((acc, inv: any) => acc + (inv.amount || 0), 0);

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Residence Billing
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28241f] sm:text-5xl">
            My Invoices
          </h1>
          <p className="mt-2 text-base text-stone-600">
            View your dormitory accommodation fees, utility charges, and payment receipts.
          </p>
        </div>

        <button
          onClick={loadInvoices}
          className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white/70 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-white transition shadow-sm self-start"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          Sync Invoices
        </button>
      </div>

      {/* Outstanding Summary */}
      <div className="rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c3a26c] text-white shadow-md">
              <DollarSign className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Outstanding Balance
              </p>
              <h2 className="text-3xl font-bold text-stone-900 mt-0.5">
                {totalDue.toLocaleString('vi-VN')} VND
              </h2>
            </div>
          </div>

          {totalDue > 0 && (
            <button className="flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800 transition shadow-md">
              <CreditCard className="h-4 w-4" />
              Pay Balance Online
            </button>
          )}
        </div>
      </div>

      {/* Invoice List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-800">Billing History ({invoices.length})</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Loading your billing statements...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/40">
            <Receipt className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium">You currently have no outstanding invoices.</p>
          </div>
        ) : (
          invoices.map((inv: any) => {
            const isPaid = inv.status === 'PAID';
            return (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/60 p-5 backdrop-blur-md shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl',
                      isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-800 text-base">{inv.title}</h4>
                      <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                        {inv.invoiceType || 'ROOM_FEE'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Due Date: <span className="font-medium text-stone-700">{inv.dueDate || 'End of month'}</span> • {inv.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-stone-900">
                      {Number(inv.amount || 0).toLocaleString('vi-VN')} VND
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {inv.status || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
