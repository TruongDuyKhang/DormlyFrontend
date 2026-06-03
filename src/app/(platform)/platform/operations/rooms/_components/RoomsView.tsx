// app/(platform)/operations/rooms/_components/RoomsView.tsx
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Floor, roomTypes } from './types';

interface RoomsViewProps {
  floor: Floor;
  blockName: string;
  onRoomSelect: (room: Room) => void;
  onBack: () => void;
  onAddRoom: () => void;
}

export function RoomsView({ floor, blockName, onRoomSelect, onBack, onAddRoom }: RoomsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{blockName}</p>
          <h2 className="text-xl font-semibold text-stone-950">Floor {floor.level}</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddRoom}
          className="rounded-full bg-[#c3a26c] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#b08f5a] transition flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {floor.rooms.map((room, idx) => {
          const roomTypeInfo = roomTypes[room.type];
          
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
                "border-white/55 bg-white/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl hover:border-white/70",
                room.status === 'maintenance' && "bg-amber-50/40",
                room.status === 'inactive' && "opacity-60"
              )}
            >
              <p className="font-mono font-semibold text-stone-950 text-base">Room {room.number}</p>
              <p className="mt-1 text-xs text-stone-500">{roomTypeInfo.displayName}</p>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                  room.students.length === room.capacity ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                )}>
                  {room.students.length}/{room.capacity} occupied
                </span>
              </div>
              {room.status === 'maintenance' && (
                <span className="mt-2 inline-block text-[10px] font-medium text-amber-600">Maintenance</span>
              )}
              {room.status === 'inactive' && (
                <span className="mt-2 inline-block text-[10px] font-medium text-stone-400">Archived</span>
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