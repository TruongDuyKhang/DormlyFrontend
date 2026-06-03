'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Activity, Calendar, Users, Home, Zap } from 'lucide-react';
import { blocks, overviewMetrics, quickActions, recentActivity } from './_services/constants';
import { BlockCard } from './_components/block-card';
import { BlockDetailPanel } from './_components/block-detail-panel';
import { OverviewMetrics } from './_components/overview-metrics';
import { QuickActions } from './_components/quick-actions';
import { RecentActivity } from './_components/recent-activity';

export default function AdminCommandCenter() {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedBlockId) ?? null,
    [selectedBlockId]
  );

  function handleSelectBlock(id: string) {
    setSelectedBlockId((prev) => (prev === id ? null : id));
  }

  const allRooms = blocks.flatMap((b) => b.floors.flatMap((f) => f.rooms));
  const totalRooms = allRooms.length;
  const totalOcc = allRooms.filter((r) => r === 'occupied').length;
  const globalPct = Math.round((totalOcc / totalRooms) * 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
      >
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />

        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* ── Page header ── */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <Activity className="h-3.5 w-3.5" />
              Command Center
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-6xl">
                  Residence Overview
                </h1>
                <p className="mt-2 text-base text-stone-600">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Global occupancy pill */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm px-5 py-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Overall occupancy</p>
                  <p className="font-mono text-2xl font-semibold text-[#c3a26c] leading-none mt-1">{globalPct}%</p>
                </div>
                <div className="h-10 w-px bg-white/40" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Total rooms</p>
                  <p className="font-mono text-2xl font-semibold text-stone-700 leading-none mt-1">{totalRooms}</p>
                </div>
                <div className="h-10 w-px bg-white/40" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Buildings</p>
                  <p className="font-mono text-2xl font-semibold text-stone-700 leading-none mt-1">{blocks.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4 metric cards ── */}
          <OverviewMetrics metrics={overviewMetrics} />

          {/* ── Main layout ── */}
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-stone-500" />
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
                    Building map
                  </span>
                </div>
                <span className="text-xs text-stone-400">
                  Click a block to inspect floors
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {blocks.map((block, i) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    index={i}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => handleSelectBlock(block.id)}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {selectedBlock && (
                  <BlockDetailPanel
                    key={selectedBlock.id}
                    block={selectedBlock}
                    onClose={() => setSelectedBlockId(null)}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <QuickActions actions={quickActions} />
              <RecentActivity items={recentActivity} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}