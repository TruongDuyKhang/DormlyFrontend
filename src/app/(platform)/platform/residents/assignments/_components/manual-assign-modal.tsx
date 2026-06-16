// app/(platform)/residents/assignments/_components/manual-assign-modal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Building2, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentAssignment, AvailableRoom } from './types';

interface ManualAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentAssignment | null;
  rooms: AvailableRoom[];
  onConfirm: (studentId: string, roomId: string) => void;
}

export function ManualAssignModal({
  isOpen,
  onClose,
  student,
  rooms,
  onConfirm,
}: ManualAssignModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-2xl rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-5 border-b border-white/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-[#c3a26c]" />
              <h2 className="text-xl font-semibold text-stone-950">Manual Assign</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-white/50 transition">
              <X className="h-5 w-5 text-stone-500" />
            </button>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Assign <strong>{student.name}</strong> to a room
          </p>
        </div>

        <div className="px-6 pt-4">
          <div className="rounded-xl bg-white/40 p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/80 text-white flex items-center justify-center font-semibold">
              {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-stone-900">{student.name}</p>
              <p className="text-xs text-stone-500">{student.studentId} • {student.major}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="w-full rounded-full border border-white/55 bg-white/40 pl-9 pr-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition",
                    selectedRoomId === room.id
                      ? "bg-[#c3a26c]/15 border border-[#c3a26c]/40"
                      : "bg-white/30 hover:bg-white/50 border border-transparent"
                  )}
                >
                  <div>
                    <p className="font-semibold text-stone-900">{room.roomNumber}</p>
                    <p className="text-xs text-stone-500">Block {room.block} • Floor {room.floor}</p>
                    <p className="text-xs text-stone-500">{room.availableSlots} slot{room.availableSlots > 1 ? 's' : ''} available</p>
                  </div>
                  {selectedRoomId === room.id && (
                    <Check className="h-5 w-5 text-[#c3a26c]" />
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-stone-500 text-sm">No rooms found</div>
            )}
          </div>
        </div>

        <div className="border-t border-white/40 p-4 bg-white/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-300 bg-white/50 px-6 py-2.5 text-sm font-medium text-stone-700 hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedRoomId && student) {
                onConfirm(student.id, selectedRoomId);
              }
            }}
            disabled={!selectedRoomId}
            className={cn(
              "rounded-xl px-6 py-2.5 text-sm font-medium text-white transition",
              selectedRoomId ? "bg-[#c3a26c] hover:bg-[#b08f5a]" : "bg-stone-400 cursor-not-allowed"
            )}
          >
            Assign to Room
          </button>
        </div>
      </motion.div>
    </div>
  );
}