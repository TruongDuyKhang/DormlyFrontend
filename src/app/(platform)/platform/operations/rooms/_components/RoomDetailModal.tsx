// app/(platform)/operations/rooms/_components/RoomDetailModal.tsx
'use client';

import { motion } from 'framer-motion';
import { X, Edit, Archive, UserPlus, User, GraduationCap, Calendar, ArrowRightLeft, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Block, Floor, roomTypes, amenitiesList, Student } from './types';

interface RoomDetailModalProps {
  isOpen: boolean;
  room: Room | null;
  block: Block | null;
  floor: Floor | null;
  onClose: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onAssign: () => void;
  onTransfer: (student: Student) => void;
  onMoveOut: (student: Student) => void;
}

export function RoomDetailModal({ 
  isOpen, 
  room, 
  block, 
  floor, 
  onClose, 
  onEdit, 
  onArchive, 
  onAssign, 
  onTransfer, 
  onMoveOut 
}: RoomDetailModalProps) {
  if (!isOpen || !room) return null;
  
  const roomTypeInfo = roomTypes[room.type];
  const RoomIcon = roomTypeInfo.icon;

  return (
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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40 z-10">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-xl p-2", roomTypeInfo.bgColor)}>
                <RoomIcon className={cn("h-5 w-5", roomTypeInfo.color)} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                  {block?.name} • Floor {floor?.level}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    Room {room.number}
                  </h2>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-medium", roomTypeInfo.bgColor, roomTypeInfo.color)}>
                    {roomTypeInfo.displayName}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="rounded-xl border border-white/55 bg-white/40 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-white/60 flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={onArchive}
                className="rounded-xl border border-white/55 bg-white/40 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-white/60 flex items-center gap-1"
              >
                <Archive className="h-4 w-4" />
                {room.status === 'active' ? 'Archive' : 'Restore'}
              </button>
              <button
                onClick={onAssign}
                className="rounded-xl bg-[#c3a26c] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#b08f5a] flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Assign
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/50 p-3">
                  <p className="text-xs text-stone-500">Capacity</p>
                  <p className="text-lg font-semibold text-stone-950">{room.capacity} students</p>
                </div>
                <div className="rounded-xl bg-white/50 p-3">
                  <p className="text-xs text-stone-500">Monthly Fee</p>
                  <p className="text-lg font-semibold text-stone-950">{room.monthlyFee.toLocaleString()} VND</p>
                </div>
                <div className="rounded-xl bg-white/50 p-3">
                  <p className="text-xs text-stone-500">Floor Area</p>
                  <p className="text-lg font-semibold text-stone-950">{room.floorArea} m²</p>
                </div>
                <div className="rounded-xl bg-white/50 p-3">
                  <p className="text-xs text-stone-500">Status</p>
                  <span className={cn(
                    "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                    room.status === 'active' ? "bg-emerald-100 text-emerald-700" : 
                    room.status === 'maintenance' ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-500"
                  )}>
                    {room.status === 'active' ? 'Active' : room.status === 'maintenance' ? 'Maintenance' : 'Archived'}
                  </span>
                </div>
              </div>
              
              {/* Amenities */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenityId: string) => {
                    const amenity = amenitiesList.find(a => a.id === amenityId);
                    const AmenityIcon = amenity?.icon;
                    return (
                      <span key={amenityId} className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-xs text-stone-700">
                        {AmenityIcon && <AmenityIcon className="h-3.5 w-3.5" />}
                        {amenity?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              {/* Description */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-2">Description</p>
                <p className="text-sm text-stone-600 leading-relaxed">{room.description || "No description provided"}</p>
              </div>
            </div>
            
            {/* Right Column - Residents */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Current Residents</p>
              <div className="rounded-xl border border-white/50 bg-white/40 p-4 min-h-[200px]">
                {room.students.length > 0 ? (
                  <div className="space-y-3">
                    {room.students.map((student: Student) => (
                      <div key={student.id} className="rounded-xl border border-white/50 bg-white/50 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/20">
                              <User className="h-5 w-5 text-[#c3a26c]" />
                            </div>
                            <div>
                              <p className="font-semibold text-stone-950">{student.name}</p>
                              <p className="text-xs text-stone-500">{student.studentId}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                                <GraduationCap className="h-3 w-3" />
                                {student.major} • {student.year}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onTransfer(student)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-[#c3a26c] hover:bg-white/50 transition flex items-center gap-1"
                            >
                              <ArrowRightLeft className="h-3 w-3" />
                              Transfer
                            </button>
                            <button
                              onClick={() => onMoveOut(student)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-white/50 transition flex items-center gap-1"
                            >
                              <UserMinus className="h-3 w-3" />
                              Move Out
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <User className="h-10 w-10 text-stone-300 mb-2" />
                    <p className="text-sm text-stone-500">No residents assigned</p>
                    <button
                      onClick={onAssign}
                      className="mt-3 rounded-lg bg-[#c3a26c] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#b08f5a]"
                    >
                      + Assign Student
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}