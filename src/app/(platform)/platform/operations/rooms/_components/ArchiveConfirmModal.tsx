// app/(platform)/operations/rooms/_components/ArchiveConfirmModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Archive, AlertCircle, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room } from './types';

interface ArchiveConfirmModalProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ArchiveConfirmModal({ isOpen, room, onClose, onConfirm }: ArchiveConfirmModalProps) {
  if (!isOpen || !room) return null;
  
  const isActive = room.status === 'active';
  const hasResidents = room.students.length > 0;
  
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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className={cn(
              "px-6 py-5 border-b border-white/40",
              isActive ? "bg-gradient-to-r from-amber-100/60 to-amber-50/30" : "bg-gradient-to-r from-emerald-100/60 to-emerald-50/30"
            )}>
              <button 
                onClick={onClose} 
                className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "rounded-xl p-2",
                  isActive ? "bg-amber-200/50" : "bg-emerald-200/50"
                )}>
                  {isActive ? (
                    <Archive className="h-6 w-6 text-amber-600" />
                  ) : (
                    <RotateCcw className="h-6 w-6 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    {isActive ? 'Archive Room' : 'Restore Room'}
                  </h2>
                  <p className="text-sm text-stone-500 mt-0.5">
                    Room {room.number} • {room.type}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Warning/Info Message */}
              <div className={cn(
                "flex items-start gap-3 rounded-xl p-4",
                isActive ? "bg-amber-50/80 border border-amber-200/60" : "bg-emerald-50/80 border border-emerald-200/60"
              )}>
                <AlertCircle className={cn(
                  "h-5 w-5 shrink-0 mt-0.5",
                  isActive ? "text-amber-600" : "text-emerald-600"
                )} />
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {isActive 
                      ? `Are you sure you want to archive Room ${room.number}?`
                      : `Are you sure you want to restore Room ${room.number}?`
                    }
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {isActive
                      ? 'Archived rooms will be hidden from active selection but all data will be preserved for historical records.'
                      : 'Restored rooms will become available for student assignments and appear in active room listings.'
                    }
                  </p>
                </div>
              </div>
              
              {/* Resident Warning (only for archive with residents) */}
              {hasResidents && isActive && (
                <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-600">!</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-700">Cannot archive occupied room</p>
                      <p className="text-xs text-red-600 mt-1">
                        This room currently has {room.students.length} resident(s). 
                        Please transfer or move out all residents before archiving.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {room.students.map(s => (
                          <span key={s.id} className="inline-block text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Room Info Summary */}
              <div className="rounded-xl bg-white/50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-2">Room Information</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-stone-500">Capacity</p>
                    <p className="font-semibold text-stone-950">{room.capacity} students</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Current Residents</p>
                    <p className="font-semibold text-stone-950">{room.students.length}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Monthly Fee</p>
                    <p className="font-semibold text-stone-950">{room.monthlyFee.toLocaleString()} VND</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Status</p>
                    <span className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                      room.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                      room.status === 'maintenance' ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                    )}>
                      {room.status === 'active' ? 'Active' : room.status === 'maintenance' ? 'Maintenance' : 'Archived'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isActive && hasResidents}
                  className={cn(
                    "flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition flex items-center justify-center gap-2",
                    isActive && hasResidents
                      ? "bg-stone-300 cursor-not-allowed"
                      : isActive 
                        ? "bg-amber-500 hover:bg-amber-600 shadow-sm" 
                        : "bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                  )}
                >
                  {isActive ? (
                    <>
                      <Archive className="h-4 w-4" />
                      Confirm Archive
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Confirm Restore
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-white transition"
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