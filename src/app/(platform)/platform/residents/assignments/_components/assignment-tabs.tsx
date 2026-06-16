// app/(platform)/residents/assignments/_components/assignment-tabs.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, XCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'pending' | 'rejected' | 'all';

interface AssignmentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts: {
    pending: number;
    rejected: number;
    all: number;
  };
}

const tabConfig: Record<TabType, { label: string; icon: React.ReactNode; color: string }> = {
  pending: {
    label: 'Pending',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-amber-600',
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-600',
  },
  all: {
    label: 'All',
    icon: <Users className="h-4 w-4" />,
    color: 'text-stone-600',
  },
};

export function AssignmentTabs({ activeTab, onTabChange, counts }: AssignmentTabsProps) {
  return (
    <motion.div
      className="mb-6 flex gap-3 rounded-[1.5rem] border border-white/55 bg-white/32 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {(Object.keys(tabConfig) as TabType[]).map((tab) => (
        <motion.button
          key={tab}
          onClick={() => onTabChange(tab)}
          className="relative flex-1 rounded-lg px-4 py-3 font-medium text-sm transition-all duration-300"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === tab && (
              <motion.div
                layoutId="tab-bg-assignment"
                className="absolute inset-0 rounded-lg bg-white/56 shadow-[0_8px_24px_-12px_rgba(47,43,37,0.2)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className={cn('transition-colors', activeTab === tab ? tabConfig[tab].color : 'text-stone-500')}>
              {tabConfig[tab].icon}
            </span>
            <span className={cn('transition-colors', activeTab === tab ? 'text-stone-950' : 'text-stone-600')}>
              {tabConfig[tab].label}
            </span>
            <span className={cn(
              'ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              activeTab === tab ? 'bg-stone-950/10 text-stone-950' : 'bg-stone-950/5 text-stone-600'
            )}>
              {counts[tab]}
            </span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}