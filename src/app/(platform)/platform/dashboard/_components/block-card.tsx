'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Block } from '../_types/types';
import { AlertTriangle, ShieldAlert, Building2, ChevronDown } from 'lucide-react';

interface BlockCardProps {
  block: Block;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const SIGNAL: Record<string, string> = {
  occupied:    'bg-[#c3a26c]',
  empty:       'bg-stone-400',
  maintenance: 'bg-amber-500',
  complaint:   'bg-red-500',
};

export function BlockCard({ block, index, isSelected, onSelect }: BlockCardProps) {
  const allRooms    = block.floors.flatMap((f) => f.rooms);
  const total       = allRooms.length;
  const occupied    = allRooms.filter((r) => r === 'occupied').length;
  const maintenance = allRooms.filter((r) => r === 'maintenance').length;
  const complaint   = allRooms.filter((r) => r === 'complaint').length;
  const pct         = Math.round((occupied / total) * 100);

  const hasAlert = maintenance > 0 || complaint > 0;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.978 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex flex-col rounded-2xl border p-5 text-left w-full transition-all duration-250 group",
        isSelected
          ? "border-[#c3a26c]/55 bg-[#c3a26c]/8 shadow-[0_0_0_1.5px_rgba(195,162,108,0.4)]"
          : "border-white/40 bg-white/40 hover:border-white/60 hover:bg-white/60 shadow-sm"
      )}
    >
      {/* Alert pulse dot */}
      {hasAlert && !isSelected && (
        <span className="absolute right-4 top-4 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5 pr-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200",
            isSelected
              ? "border-[#c3a26c]/40 bg-[#c3a26c]/15"
              : "border-stone-200 bg-white/60 group-hover:border-stone-300"
          )}>
            <Building2 className={cn(
              "h-5 w-5 transition",
              isSelected ? "text-[#c3a26c]" : "text-stone-500 group-hover:text-stone-700"
            )} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Residence</p>
            <h3 className="text-lg font-bold tracking-tight text-stone-800 leading-tight">{block.name}</h3>
          </div>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 mt-1 transition-transform duration-300",
          isSelected ? "rotate-180 text-[#c3a26c]" : "text-stone-400 group-hover:text-stone-600"
        )} />
      </div>

      {/* Floor signal map */}
      <div className="space-y-1.5 mb-5">
        {block.floors.map((floor) => (
          <div key={floor.level} className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-stone-500 w-4 shrink-0 text-right">
              {floor.level}
            </span>
            <div className="flex gap-1 flex-1 items-center">
              {floor.rooms.map((signal, i) => (
                <motion.span
                  key={i}
                  className={cn("h-2 flex-1 rounded-sm min-w-[4px]", SIGNAL[signal])}
                  animate={
                    signal === 'complaint'
                      ? { opacity: [0.45, 1, 0.45] }
                      : signal === 'maintenance'
                      ? { opacity: [0.6, 1, 0.6] }
                      : {}
                  }
                  transition={{ duration: signal === 'complaint' ? 1.8 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Occupancy bar */}
      <div className="mb-5">
        <div className="h-1.5 w-full rounded-full bg-stone-200/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#c3a26c]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between mt-auto">
        <div>
          <span className="font-mono text-2xl font-bold tracking-tight text-stone-800 leading-none">
            {pct}%
          </span>
          <p className="text-xs font-medium text-stone-500 mt-1 leading-none">
            {occupied} / {total} rooms
          </p>
        </div>

       
      </div>
    </motion.button>
  );
}