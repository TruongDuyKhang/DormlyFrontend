// app/(platform)/operations/rooms/_components/MoveOutModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserMinus, AlertCircle } from 'lucide-react';
import { Room, Student } from './types';

interface MoveOutModalProps {
  isOpen: boolean;
  student: Student | null;
  room: Room | null;
  onMoveOut: (studentId: string, reason: string, moveOutDate: string) => void;
  onClose: () => void;
}

export function MoveOutModal({ isOpen, student, room, onMoveOut, onClose }: MoveOutModalProps) {
  const [reason, setReason] = useState('');
  const [moveOutDate, setMoveOutDate] = useState(new Date().toISOString().split('T')[0]);
  
  if (!isOpen || !student) return null;
  
  const handleMoveOut = () => {
    onMoveOut(student.id, reason, moveOutDate);
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-red-100/50 to-red-50/30 px-6 py-4 border-b border-white/40">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <UserMinus className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Move Out</h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">Record student move-out</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-stone-100/50 p-3">
                <p className="text-sm font-medium text-stone-950">{student.name}</p>
                <p className="text-xs text-stone-500 mt-0.5">{student.studentId}</p>
                <p className="text-xs text-stone-500 mt-1">{room?.number} • {room?.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-stone-950 mb-1 block">Move Out Date</label>
                <input
                  type="date"
                  value={moveOutDate}
                  onChange={(e) => setMoveOutDate(e.target.value)}
                  className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-stone-950 mb-1 block">Reason (Optional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Graduation, Transfer to other university, Personal reasons..."
                  rows={3}
                  className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMoveOut}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition"
                >
                  Confirm Move Out
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}