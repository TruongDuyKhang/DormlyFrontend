// app/(platform)/analytics/insights/_components/KpiCard.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KpiData } from './types';

interface KpiCardProps {
  data: KpiData;
  index: number;
}

export function KpiCard({ data, index }: KpiCardProps) {
  const getTrendIcon = () => {
    if (data.trend === 'up') return <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />;
    if (data.trend === 'down') return <ArrowDown className="h-3.5 w-3.5 text-red-600" />;
    return <Minus className="h-3.5 w-3.5 text-stone-400" />;
  };
  
  const getTrendColor = () => {
    if (data.trend === 'up') return 'text-emerald-600 bg-emerald-50';
    if (data.trend === 'down') return 'text-red-600 bg-red-50';
    return 'text-stone-500 bg-stone-100';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-medium text-stone-500">{data.label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-3xl font-semibold text-stone-900">{data.value}</span>
        {data.change !== undefined && (
          <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(data.change)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}