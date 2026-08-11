// app/(platform)/settings/structure/_components/RoomOccupantsModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, DoorClosed, User, GraduationCap, Calendar, Mail, Phone, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Room } from './types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RoomOccupantsModalProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
  onEdit?: (room: Room) => void;
}

export function RoomOccupantsModal({
  isOpen,
  room,
  onClose,
  onEdit,
}: RoomOccupantsModalProps) {
  if (!isOpen || !room) return null;

  const occupants = room.occupants || [];
  const emptyBeds = Math.max(0, room.capacity - occupants.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/60 bg-[#ebe4d8] p-6 shadow-2xl text-[#26231f]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-300/60">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c3a26c]/20 text-[#8f6d38]">
                <DoorClosed className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-stone-900">Phòng {room.roomNumber}</h3>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
                      room.status === 'occupied'
                        ? 'bg-blue-100 text-blue-800'
                        : room.status === 'maintenance'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    )}
                  >
                    {room.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {room.blockName} • Tầng {room.floorLevel} • Loại phòng: {room.roomTypeName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="rounded-2xl border border-white/60 bg-white/50 p-3.5 text-center">
              <p className="text-xs text-stone-500">Sức chứa</p>
              <p className="text-xl font-bold text-stone-900">{room.capacity} chỗ</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/50 p-3.5 text-center">
              <p className="text-xs text-stone-500">Đang ở</p>
              <p className="text-xl font-bold text-[#8f6d38]">
                {room.currentOccupants}/{room.capacity}
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/50 p-3.5 text-center">
              <p className="text-xs text-stone-500">Chỗ trống</p>
              <p className="text-xl font-bold text-emerald-700">{emptyBeds} chỗ</p>
            </div>
          </div>

          {/* Occupants List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
                Danh sách Sinh viên đang ở ({occupants.length})
              </h4>
              <Link
                href="/platform/residents/assignments"
                className="text-xs font-semibold text-[#8f6d38] hover:underline flex items-center gap-1"
              >
                Quản lý phân phòng
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {occupants.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 py-10 text-center text-stone-500 bg-white/30">
                <User className="mx-auto h-8 w-8 text-stone-400 mb-2" />
                <p className="text-sm font-medium">Chưa có sinh viên nào được phân vào phòng này.</p>
                <p className="text-xs text-stone-400 mt-1">
                  Số lượng người hiện tại: 0/{room.capacity} chỗ trống.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {occupants.map((occ, idx) => (
                  <div
                    key={occ.assignmentId || occ.userId || idx}
                    className="flex items-center justify-between p-4 rounded-2xl border border-white/60 bg-white/60 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c3a26c]/20 text-[#8f6d38] font-bold text-sm">
                        {occ.name ? occ.name.charAt(0) : idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-stone-900">{occ.name || 'Sinh viên'}</p>
                          {occ.studentCode && (
                            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600">
                              {occ.studentCode}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-0.5">
                          {occ.major && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {occ.major}
                            </span>
                          )}
                          {occ.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {occ.email}
                            </span>
                          )}
                          {occ.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {occ.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 text-[10px]">
                        <CheckCircle2 className="h-3 w-3" />
                        {occ.status || 'ACTIVE'}
                      </span>
                      {occ.startDate && (
                        <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Từ: {new Date(occ.startDate).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-300/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-300 bg-white/60 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-white transition"
            >
              Đóng
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(room);
                }}
                className="rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition"
              >
                Chỉnh sửa phòng
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
