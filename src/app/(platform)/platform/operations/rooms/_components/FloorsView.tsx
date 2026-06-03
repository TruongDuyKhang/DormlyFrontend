// app/(platform)/operations/rooms/_components/FloorsView.tsx
'use client';

import { motion } from 'framer-motion';
import { Layers, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Floor, Block } from './types';

interface FloorsViewProps {
  block: Block;
  onFloorSelect: (floor: Floor) => void;
  onBack: () => void;
}

export function FloorsView({ block, onFloorSelect, onBack }: FloorsViewProps) {
  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-600';
    if (rate >= 50) return 'text-amber-600';
    return 'text-stone-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {block.floors.map((floor, idx) => (
          <motion.button
            key={floor.level}
            onClick={() => onFloorSelect(floor)}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: idx * 0.04, duration: 0.4 }}
            className="group rounded-2xl border border-white/55 bg-white/32 p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl transition-all duration-300 hover:border-white/70"
          >
            <div className="flex flex-col items-center">
              <Layers className="h-7 w-7 text-[#c3a26c] mb-3" />
              <span className="text-2xl font-semibold text-stone-950">Floor {floor.level}</span>
              <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                <span>{floor.totalRooms} rooms</span>
                <span className="h-1 w-1 rounded-full bg-stone-400" />
                <span className={cn("font-semibold", getOccupancyColor(floor.occupancyRate))}>
                  {floor.occupancyRate}% full
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-stone-200/50 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#c3a26c] transition-all duration-500"
                  style={{ width: `${floor.occupancyRate}%` }}
                />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-start pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-white/55 bg-white/32 px-5 py-2.5 text-sm text-stone-600 transition hover:bg-white/45"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Blocks
        </button>
      </div>
    </motion.div>
  );
}