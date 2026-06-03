'use client';

import { ActivityItem } from '../_types/types';

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-600 mb-4">
        Recent Activity
      </p>
      <div className="divide-y divide-stone-200">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 leading-snug">{item.title}</p>
              <p className="text-xs text-stone-500 mt-1 leading-snug">{item.meta}</p>
            </div>
            <span className="text-xs font-medium text-stone-400 shrink-0 ml-4 whitespace-nowrap">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}