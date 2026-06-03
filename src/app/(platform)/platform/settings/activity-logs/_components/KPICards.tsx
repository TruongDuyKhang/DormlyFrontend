// app/(platform)/platform/settings/activity-logs/_components/KPICards.tsx
'use client';

import { Activity, Calendar, AlertCircle, Server } from 'lucide-react';
import { KPIData } from './types';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  data: KPIData;
}

export function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      label: 'Total Activities',
      value: data.totalActivities.toLocaleString(),
      icon: Activity,
      color: 'text-[#c3a26c]',
      bg: 'bg-[#c3a26c]/10',
    },
    {
      label: "Today's Activities",
      value: data.todayActivities.toLocaleString(),
      icon: Calendar,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      label: 'Failed Events',
      value: data.failedEvents.toLocaleString(),
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      label: 'System Events',
      value: data.systemEvents.toLocaleString(),
      icon: Server,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-white/40 bg-white/30 backdrop-blur-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-stone-800">{card.value}</p>
              <p className="text-xs text-stone-500 mt-1">{card.label}</p>
            </div>
            <div className={cn("rounded-full p-2", card.bg)}>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}