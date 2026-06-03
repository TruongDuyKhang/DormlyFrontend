// app/(platform)/operations/rooms/_components/BlocksView.tsx
'use client';

import { motion } from 'framer-motion';
import { Building2, DoorOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block } from './types';

interface BlocksViewProps {
  blocks: Block[];
  hoveredBlockId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (block: Block) => void;
}

export function BlocksView({ blocks, hoveredBlockId, onHover, onSelect }: BlocksViewProps) {
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
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {blocks.map((block, idx) => {
        const isHovered = hoveredBlockId === block.id;
        const isDimmed = hoveredBlockId && hoveredBlockId !== block.id;

        return (
          <motion.button
            key={block.id}
            onClick={() => onSelect(block)}
            onMouseEnter={() => onHover(block.id)}
            onMouseLeave={() => onHover(null)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: isDimmed ? 0.55 : 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-white/55 bg-white/32 p-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl transition-all duration-500 hover:border-white/70 hover:shadow-[0_20px_40px_-20px_rgba(47,43,37,0.25)]"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-[#c3a26c]/15 px-3 py-1 text-sm font-semibold text-[#8b6b3e]">
                  {block.name}
                </span>
                <span className={cn("text-3xl font-semibold font-mono", getOccupancyColor(block.occupancyRate))}>
                  {block.occupancyRate}%
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-stone-500">
                <span className="flex items-center gap-1.5">
                  <DoorOpen className="h-4 w-4" />
                  {block.totalRooms} rooms
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {block.totalStudents} students
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-[0.06] transition-transform duration-500 group-hover:scale-110">
              <Building2 className="h-32 w-32 text-stone-900" />
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}