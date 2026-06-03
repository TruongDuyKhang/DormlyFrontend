'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Block } from '../_types/types';
import { X, Building2 } from 'lucide-react';

interface BlockDetailPanelProps {
  block: Block;
  onClose: () => void;
}

const SIGNAL: Record<string, string> = {
  occupied:    'bg-[#c3a26c]',
  empty:       'bg-stone-400',
  maintenance: 'bg-amber-500',
  complaint:   'bg-red-500',
};

const LEGEND = [
  { key: 'occupied',    label: 'Occupied',    dot: 'bg-[#c3a26c]' },
  { key: 'empty',       label: 'Available',   dot: 'bg-stone-400'  },
  { key: 'maintenance', label: 'Maintenance', dot: 'bg-amber-500' },
  { key: 'complaint',   label: 'Complaint',   dot: 'bg-red-500'   },
];

export function BlockDetailPanel({ block, onClose }: BlockDetailPanelProps) {
  const allRooms    = block.floors.flatMap((f) => f.rooms);
  const total       = allRooms.length;
  const occupied    = allRooms.filter((r) => r === 'occupied').length;
  const maintenance = allRooms.filter((r) => r === 'maintenance').length;
  const complaint   = allRooms.filter((r) => r === 'complaint').length;
  const pct         = Math.round((occupied / total) * 100);

  return (
    <motion.div
      key={block.id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[#c3a26c]/30 bg-white/95 shadow-xl overflow-hidden mt-6"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-gradient-to-r from-[#c3a26c]/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c3a26c]/20 border-2 border-[#c3a26c]/40">
            <Building2 className="h-6 w-6 text-[#c3a26c]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Floor Details</p>
            <h3 className="text-2xl font-bold tracking-tight text-stone-800">{block.name}</h3>
            <p className="text-sm text-stone-500 mt-0.5">Residence block floor-by-floor breakdown</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Bảng thông tin - full width, không có stat cards bên phải */}
      <div className="p-6">
        {/* Table header */}
        <div className="grid grid-cols-[5rem_1fr_4rem_5rem_5rem] gap-x-4 pb-3 mb-3 border-b-2 border-stone-200">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-stone-600">Floor</span>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-stone-600">Room Map</span>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-stone-600 text-right">Occupied</span>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-stone-600 text-right">Maint.</span>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-stone-600 text-right">Compl.</span>
        </div>

        {/* Floor rows */}
        <div className="space-y-1">
          {block.floors.map((floor, fi) => {
            const cnt = (s: string) => floor.rooms.filter((r) => r === s).length;
            const occ = cnt('occupied');
            const mnt = cnt('maintenance');
            const cmp = cnt('complaint');
            const totalRoomsOnFloor = floor.rooms.length;
            
            return (
              <div
                key={floor.level}
                className={cn(
                  "grid grid-cols-[5rem_1fr_4rem_5rem_5rem] gap-x-4 items-center py-3 rounded-lg transition hover:bg-stone-50",
                  fi < block.floors.length - 1 && "border-b border-stone-100"
                )}
              >
                {/* Floor column */}
                <div>
                  <span className="font-mono text-base font-bold text-stone-700">Floor {floor.level}</span>
                </div>

                {/* Room map column */}
                <div className="flex gap-1 flex-wrap items-center py-1">
                  {floor.rooms.map((signal, i) => (
                    <motion.div
                      key={i}
                      className="group relative flex flex-col items-center"
                      whileHover={{ scale: 1.2 }}
                    >
                      <span className={cn("h-3 w-3 rounded-full cursor-pointer", SIGNAL[signal])} />
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-stone-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none z-10">
                        Room {i + 1}: {signal === 'occupied' ? 'Occupied' : signal === 'empty' ? 'Available' : signal === 'maintenance' ? 'Maintenance' : 'Complaint'}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Occupied column */}
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-stone-700">{occ}</span>
                  <span className="text-xs text-stone-400 ml-1">/ {totalRoomsOnFloor}</span>
                </div>
                
                {/* Maintenance column */}
                <div className="text-right">
                  {mnt > 0 ? (
                    <span className="inline-flex items-center justify-center font-mono text-base font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md min-w-[3rem]">
                      {mnt}
                    </span>
                  ) : (
                    <span className="text-sm text-stone-400">—</span>
                  )}
                </div>
                
                {/* Complaint column */}
                <div className="text-right">
                  {cmp > 0 ? (
                    <span className="inline-flex items-center justify-center font-mono text-base font-bold text-red-700 bg-red-100 px-2 py-1 rounded-md min-w-[3rem]">
                      {cmp}
                    </span>
                  ) : (
                    <span className="text-sm text-stone-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend và tổng quan - full width */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 border-t-2 border-stone-100 bg-stone-50/50">
        {LEGEND.map((l) => (
          <div key={l.key} className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", l.dot)} />
            <span className="text-sm font-semibold text-stone-600">{l.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <div className="h-4 w-px bg-stone-300" />
          <span className="text-sm font-bold text-stone-700">{total} total rooms</span>
          <span className="text-sm font-bold text-[#c3a26c]">{pct}% occupied</span>
        </div>
      </div>
    </motion.div>
  );
}