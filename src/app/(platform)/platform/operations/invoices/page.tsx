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
import { roomAssignmentService } from '@/services/roomAssignmentService';
import { buildingService } from '@/services/buildingService';
import type { InvoiceResponseDto, UserResponseDto, RoomAssignmentResponseDto, BuildingNodeResponseDto } from '@/types/models';
import { toast } from 'sonner';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [assignments, setAssignments] = useState<RoomAssignmentResponseDto[]>([]);
  const [nodes, setNodes] = useState<BuildingNodeResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState({
    roomAssignmentId: '',
    feeCategory: 'ROOM_RENT',
    amount: 1500000,
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
    notes: 'Hóa đơn thanh toán định kỳ',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [invRes, usersRes, asgRes, nodesRes] = await Promise.allSettled([
        invoiceService.listAllInvoices(),
        userService.list(),
        roomAssignmentService.list(),
        buildingService.listNodes(),
      ]);

      setInvoices(invRes.status === 'fulfilled' ? invRes.value : []);
      setUsers(usersRes.status === 'fulfilled' ? usersRes.value : []);
      const activeAsg = asgRes.status === 'fulfilled' && asgRes.value 
        ? asgRes.value.filter(a => !a.endDate || new Date(a.endDate).getTime() > Date.now()) 
        : [];
      setAssignments(activeAsg);
      setNodes(nodesRes.status === 'fulfilled' ? nodesRes.value : []);

      if (activeAsg.length > 0 && !invoiceForm.roomAssignmentId) {
        setInvoiceForm(prev => ({ ...prev, roomAssignmentId: activeAsg[0].id }));
      }
    } catch (e) {
      console.error('Failed to load invoices data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.roomAssignmentId) {
      toast.error('Vui lòng chọn sinh viên / phòng ở để phát hành hóa đơn!');
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await invoiceService.createInvoice({
        roomAssignmentId: invoiceForm.roomAssignmentId,
        feeCategory: invoiceForm.feeCategory as any,
        amount: Number(invoiceForm.amount),
        month: invoiceForm.month,
        notes: invoiceForm.notes,
      });
      toast.success('Đã tạo và phát hành hóa đơn thành công!');
      setInvoices((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
    } catch (e: any) {
      console.error('Failed to create invoice:', e);
      toast.error(e?.response?.data?.message || 'Tạo hóa đơn thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await invoiceService.payInvoice(id);
      toast.success('Đã xác nhận thanh toán hóa đơn!');
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: 'PAID' } : inv))
      );
    } catch (e: any) {
      console.error('Failed to pay invoice:', e);
      toast.error('Xác nhận thanh toán thất bại!');
    }
  };

  const userMap = new Map(users.map((u) => [u.id, u]));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const assignmentMap = new Map(assignments.map((a) => [a.id, a]));

  const filtered = invoices.filter((inv: any) => {
    if (filterStatus !== 'ALL' && inv.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const u = userMap.get(inv.userId);
      return (
        inv.notes?.toLowerCase().includes(q) ||
        inv.month?.toLowerCase().includes(q) ||
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#9b7a4a]/16 blur-3xl" />

      <div className="relative p-4 sm:p-6 2xl:p-7">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <Receipt className="h-3.5 w-3.5" />
              Invoices & Financials
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Invoices & Billing
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage room fees, utility bills, and payment records for residents.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white/70 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-white transition shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#b08f5a] transition"
            >
              <Plus className="h-4 w-4" />
              Create Invoice
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Total Billed</p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{totalAmount.toLocaleString('vi-VN')} VND</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">Total Paid</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">{paidAmount.toLocaleString('vi-VN')} VND</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-amber-700">Pending Invoices</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">{pendingCount} Unpaid</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by student name, month, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-4 py-2 text-xs backdrop-blur-sm focus:border-[#c3a26c] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'UNPAID', 'PAID'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition',
                  filterStatus === st
                    ? 'bg-[#c3a26c] text-white shadow-sm'
                    : 'bg-white/40 text-stone-600 hover:bg-white/60'
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-stone-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading invoices...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/60 bg-white/20 p-12 text-center text-sm text-stone-500">
            No invoices found.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv: any) => {
              const u = userMap.get(inv.userId);
              const asg = assignmentMap.get(inv.roomAssignmentId);
              const roomNode = asg ? nodeMap.get(asg.roomNodeId) : null;
              const isPaid = inv.status === 'PAID';

              return (
                <div
                  key={inv.id}
                  className="rounded-2xl border border-white/60 bg-white/35 backdrop-blur-sm p-4 transition hover:bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl font-bold shadow-sm',
                      isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">
                        Phòng {roomNode?.name || 'Ký túc xá'} &bull; Cư dân: {u?.fullName || 'Sinh viên'} &bull; {inv.month || 'Tháng thanh toán'}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Loại phí: {inv.feeCategory || 'ROOM_RENT'} &bull; {inv.notes || 'Hóa đơn ký túc xá'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-stone-900">{Number(inv.amount || 0).toLocaleString('vi-VN')} VND</p>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {inv.status || 'UNPAID'}
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

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-stone-800">Tạo Hóa Đơn Mới</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Chọn Phòng Cư Trú (Room) / Sinh viên <span className="text-rose-500">*</span>
                </label>
                {assignments.length > 0 ? (
                  <select
                    value={invoiceForm.roomAssignmentId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, roomAssignmentId: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                  >
                    {assignments.map((asg) => {
                      const u = userMap.get(asg.userId);
                      const rNode = nodeMap.get(asg.roomNodeId);
                      const fNode = rNode?.parentId ? nodeMap.get(rNode.parentId) : null;
                      const bNode = fNode?.parentId ? nodeMap.get(fNode.parentId) : null;
                      const locationStr = bNode ? ` (${bNode.name})` : '';

                      return (
                        <option key={asg.id} value={asg.id}>
                          Phòng {rNode?.name || 'Ký túc xá'}{locationStr} &bull; Cư dân: {u?.fullName || 'Sinh viên'} ({u?.email || ''})
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <p className="text-xs text-amber-600 font-medium p-2 bg-amber-50 rounded-xl border border-amber-200">
                    Chưa có sinh viên nào có hợp đồng cư trú active để tạo hóa đơn.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Loại Thu Phí (Fee Category)</label>
                  <select
                    value={invoiceForm.feeCategory}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, feeCategory: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                  >
                    <option value="ROOM_RENT">Tiền Phòng (ROOM_RENT)</option>
                    <option value="ELECTRICITY">Tiền Điện (ELECTRICITY)</option>
                    <option value="WATER">Tiền Nước (WATER)</option>
                    <option value="SERVICE">Phí Dịch Vụ (SERVICE)</option>
                    <option value="OTHER">Chi Phí Khác (OTHER)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Tháng Thanh Toán</label>
                  <input
                    type="month"
                    required
                    value={invoiceForm.month}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, month: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Số Tiền Hóa Đơn (VND)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={10000}
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Ghi Chú Hóa Đơn</label>
                <textarea
                  rows={2}
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                  placeholder="Nhập chi tiết ghi chú thu phí..."
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !invoiceForm.roomAssignmentId}
                  className="flex items-center gap-1.5 rounded-xl bg-[#c3a26c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] disabled:opacity-50 transition"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Phát Hành Hóa Đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
