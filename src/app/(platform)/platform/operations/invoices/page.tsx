// app/(platform)/platform/operations/invoices/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  Plus, 
  Search, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Save, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { invoiceService } from '@/services/invoiceService';
import { userService } from '@/services/userService';
import type { InvoiceResponseDto, UserResponseDto } from '@/types/models';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState({
    userId: '',
    title: '',
    amount: 1500000,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: '',
    invoiceType: 'ROOM_FEE',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [invRes, usersRes] = await Promise.allSettled([
        invoiceService.listAllInvoices(),
        userService.list(),
      ]);

      setInvoices(invRes.status === 'fulfilled' ? invRes.value : []);
      setUsers(usersRes.status === 'fulfilled' ? usersRes.value : []);
    } catch (e) {
      console.error('Failed to load invoices:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await invoiceService.createInvoice({
        userId: invoiceForm.userId || users[0]?.id || '',
        title: invoiceForm.title,
        amount: Number(invoiceForm.amount),
        dueDate: invoiceForm.dueDate,
        description: invoiceForm.description,
        invoiceType: invoiceForm.invoiceType,
      } as any);
      setInvoices((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await invoiceService.payInvoice(id);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: 'PAID' } : inv))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const userMap = new Map(users.map((u) => [u.id, u]));

  const filtered = invoices.filter((inv: any) => {
    if (filterStatus !== 'ALL' && inv.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const u = userMap.get(inv.userId);
      return (
        inv.title?.toLowerCase().includes(q) ||
        u?.fullName?.toLowerCase().includes(q) ||
        u?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAmount = invoices.reduce((acc, inv: any) => acc + (inv.amount || 0), 0);
  const paidAmount = invoices
    .filter((inv: any) => inv.status === 'PAID')
    .reduce((acc, inv: any) => acc + (inv.amount || 0), 0);
  const pendingCount = invoices.filter((inv: any) => inv.status !== 'PAID').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />

      <div className="relative p-4 sm:p-6 2xl:p-7">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <Receipt className="h-3.5 w-3.5" />
              Finance & Billing
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Invoices & Payments
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage student rent invoices, utility charges, and payment settlements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition shadow-sm"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Sync API
            </button>
            <button
              onClick={() => {
                setInvoiceForm({
                  userId: users[0]?.id || '',
                  title: 'Phí Ký túc xá Tháng ' + (new Date().getMonth() + 1),
                  amount: 1500000,
                  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  description: 'Tiền phòng và dịch vụ sinh hoạt tiêu chuẩn',
                  invoiceType: 'ROOM_FEE',
                });
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#c3a26c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Financial KPI Summary */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-sm shadow-sm">
            <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Total Billed</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">
              {totalAmount.toLocaleString('vi-VN')} VND
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-sm shadow-sm">
            <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Collected Revenue</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {paidAmount.toLocaleString('vi-VN')} VND
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-sm shadow-sm">
            <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">Pending Payments</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount} Invoices</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2">
            {(['ALL', 'PENDING', 'PAID', 'OVERDUE'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition',
                  filterStatus === status
                    ? 'bg-[#c3a26c] text-white shadow-sm'
                    : 'bg-white/40 text-stone-600 hover:bg-white/70'
                )}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice title, student..."
              className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-4 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
          </div>
        </div>

        {/* Invoices List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Loading invoices from API...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/20">
            <Receipt className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium">No invoices found matching criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv: any) => {
              const u = userMap.get(inv.userId);
              const isPaid = inv.status === 'PAID';

              return (
                <div
                  key={inv.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-sm shadow-sm hover:border-[#c3a26c]/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl',
                        isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-[#c3a26c]/10 text-[#c3a26c]'
                      )}
                    >
                      <Receipt className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800 text-base">{inv.title}</span>
                        <span className="text-xs font-mono text-stone-500 bg-white/60 px-2 py-0.5 rounded-md">
                          {inv.invoiceType || 'ROOM_FEE'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Resident: <span className="font-medium text-stone-700">{u?.fullName || 'Resident'}</span> • Due: {inv.dueDate || 'End of month'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-base font-bold text-stone-800">
                        {Number(inv.amount || 0).toLocaleString('vi-VN')} VND
                      </p>
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider',
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {inv.status || 'PENDING'}
                      </span>
                    </div>

                    {!isPaid && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-stone-800">Create New Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Target Resident</label>
                <select
                  value={invoiceForm.userId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, userId: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Invoice Title</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.title}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
                  placeholder="e.g. Tiền phòng Tháng 09/2026"
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Amount (VND)</label>
                  <input
                    type="number"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#c3a26c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a]"
                >
                  <Save className="h-4 w-4" />
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
