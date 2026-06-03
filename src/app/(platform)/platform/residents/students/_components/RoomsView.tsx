// app/(platform)/residents/students/_components/RoomsView.tsx
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Users, Bed, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room } from './types';
import { roomTypes } from './mockData';

interface RoomsViewProps {
  rooms: Room[];
  onRoomSelect: (room: Room) => void;
  onBack: () => void;
}

const getRoomIcon = (type: string) => {
  switch(type) {
    case 'single': return Bed;
    case 'double': return Users;
    case 'quad': return Users;
    case 'vip': return Crown;
    default: return Bed;
  }
};

export function RoomsView({ rooms, onRoomSelect, onBack }: RoomsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {rooms.map((room, idx) => {
          const roomTypeInfo = roomTypes[room.type];
          const RoomIcon = getRoomIcon(room.type);
          const occupancyText = room.students.length === room.capacity 
            ? 'Full' 
            : room.students.length === 0 
              ? 'Empty' 
              : `${room.students.length}/${room.capacity}`;
          
          return (
            <motion.button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: idx * 0.01, duration: 0.3 }}
              className={cn(
                "group rounded-xl border p-3 text-center transition-all duration-300",
                room.students.length > 0 && room.status === 'active'
                  ? "border-[#c3a26c]/40 bg-[#c3a26c]/12 hover:border-[#c3a26c]/70"
                  : room.status === 'maintenance'
                    ? "border-amber-200/50 bg-amber-50/30 hover:border-amber-300/70"
                    : "border-white/55 bg-white/32 hover:border-white/70",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl"
              )}
            >
              <div className={cn(
                "mx-auto mb-2 rounded-full p-1.5 w-fit",
                roomTypeInfo.bgColor
              )}>
                <RoomIcon className={cn("h-4 w-4", roomTypeInfo.color)} />
              </div>
              <p className="font-semibold text-stone-950 text-base">Room {room.number}</p>
              <p className="text-xs text-stone-500 mt-0.5">{roomTypeInfo.displayName}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  room.students.length === room.capacity 
                    ? "bg-emerald-100 text-emerald-700"
                    : room.students.length === 0
                      ? "bg-stone-100 text-stone-500"
                      : "bg-amber-100 text-amber-700"
                )}>
                  {occupancyText}
                </span>
              </div>
              {room.status === 'maintenance' && (
                <span className="mt-2 inline-block text-[10px] font-medium text-amber-600">Maintenance</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-start pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-white/55 bg-white/32 px-5 py-2.5 text-sm text-stone-600 transition hover:bg-white/45"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Floors
        </button>
      </div>
    </motion.div>
  );
}