'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { OverviewMetric } from '../_types/types';

interface OverviewMetricsProps {
  metrics: OverviewMetric[];
}

const trendConfig = {
  up:      { icon: TrendingUp,   color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  down:    { icon: TrendingDown, color: 'text-red-700',     bg: 'bg-red-100',     border: 'border-red-300' },
  neutral: { icon: Minus,        color: 'text-amber-700',   bg: 'bg-amber-100',   border: 'border-amber-300' },
};

export function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m, i) => {
        const trend = m.trend ? trendConfig[m.trend] : null;
        const TrendIcon = trend?.icon;
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/30 p-5 shadow-sm backdrop-blur-sm"
          >
            {/* Top row: icon + trend badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 border border-stone-200">
                <m.icon className="h-5 w-5 text-[#c3a26c]" />
              </div>
              {trend && TrendIcon && m.trendLabel && (
                <div className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 border-2 font-bold",
                  trend.bg,
                  trend.border
                )}>
                  <TrendIcon className={cn("h-3.5 w-3.5", trend.color)} />
                  <span className={cn("text-xs font-bold", trend.color)}>
                    {m.trendLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Value */}
            <div className="font-mono text-3xl font-bold tracking-tight text-stone-800 leading-none">
              {m.value}
            </div>

            {/* Label + sub */}
            <p className="mt-2 text-sm font-semibold text-stone-600 leading-snug">{m.label}</p>
            <p className="mt-1 text-xs font-medium text-stone-400 leading-snug">{m.sub}</p>
          </motion.div>
        );
      })}
    </div>
  );
}