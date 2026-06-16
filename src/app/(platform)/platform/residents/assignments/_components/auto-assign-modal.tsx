// app/(platform)/residents/assignments/_components/auto-assign-modal.tsx
'use client';

import { motion } from 'framer-motion';
import { X, Sparkles, Loader2, AlertCircle, User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentAssignment, AvailableRoom } from './types';

interface AutoAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentAssignment[];
  rooms: AvailableRoom[];
  onConfirm: (students: StudentAssignment[]) => void;
  isProcessing?: boolean;
}

export function AutoAssignModal({
  isOpen,
  onClose,
  students,
  rooms,
  onConfirm,
  isProcessing = false,
}: AutoAssignModalProps) {
  if (!isOpen) return null;

  const totalStudents = students.length;
  const totalRooms = rooms.reduce((acc, r) => acc + r.availableSlots, 0);
  const canAssign = totalRooms >= totalStudents;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-5 border-b border-white/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-[#c3a26c]" />
              <h2 className="text-xl font-semibold text-stone-950">Auto Assign</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-white/50 transition">
              <X className="h-5 w-5 text-stone-500" />
            </button>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Bạn có chắc muốn tự động gán phòng cho {totalStudents} sinh viên?
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/40 p-3 text-center">
              <p className="text-2xl font-bold text-stone-900">{totalStudents}</p>
              <p className="text-xs text-stone-500">Sinh viên</p>
            </div>
            <div className="rounded-xl bg-white/40 p-3 text-center">
              <p className="text-2xl font-bold text-stone-900">{totalRooms}</p>
              <p className="text-xs text-stone-500">Chỗ trống</p>
            </div>
          </div>

          {/* Student List */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">Danh sách sinh viên:</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {students.map((student) => (
                <div key={student.id} className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2">
                  <div className="h-6 w-6 rounded-full bg-amber-500/20 text-xs font-semibold text-amber-700 flex items-center justify-center">
                    {student.name.charAt(0)}
                  </div>
                  <span className="text-sm text-stone-800">{student.name}</span>
                  <span className="text-xs text-stone-400 ml-auto">{student.studentId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          {!canAssign && (
            <div className="rounded-xl bg-red-50/60 border border-red-200/60 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                Không đủ chỗ trống ({totalRooms} chỗ cho {totalStudents} sinh viên)
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/40 p-4 bg-white/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-300 bg-white/50 px-6 py-2.5 text-sm font-medium text-stone-700 hover:bg-white transition"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(students)}
            disabled={!canAssign || isProcessing}
            className={cn(
              "rounded-xl px-6 py-2.5 text-sm font-medium text-white transition flex items-center gap-2",
              canAssign && !isProcessing
                ? "bg-[#c3a26c] hover:bg-[#b08f5a]"
                : "bg-stone-400 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang gán...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Xác nhận
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}