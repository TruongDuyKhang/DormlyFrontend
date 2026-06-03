'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { QuickAction } from '../_types/types';

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/40">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-700">
          Quick access
        </p>
      </div>

      {/* Action items */}
      <div className="p-2">
        {actions.map((action, i) => (
          <a
            key={action.href}
            href={action.href}
            className={cn(
              "group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/50",
              i < actions.length - 1 && "mb-1"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-stone-800 group-hover:text-stone-900 transition leading-none">
                  {action.label}
                </p>
                {action.badgeUrgent && (
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              <p className="text-sm font-medium text-stone-500 truncate mt-1 leading-none">{action.desc}</p>
            </div>

            {/* Badge số - chữ đậm và rực rỡ */}
            {action.badge != null && action.badge > 0 && (
              <span className={cn(
                "text-sm font-extrabold px-3 py-1 rounded-full tabular-nums shrink-0 ml-3 border-2 shadow-sm",
                action.badgeColor === "bg-blue-100 text-blue-700 border-blue-300" && "bg-blue-200 text-blue-800 border-blue-400",
                action.badgeColor === "bg-red-100 text-red-700 border-red-300" && "bg-red-200 text-red-800 border-red-400",
                action.badgeColor === "bg-amber-100 text-amber-700 border-amber-300" && "bg-amber-200 text-amber-800 border-amber-400",
                action.badgeColor === "bg-emerald-100 text-emerald-700 border-emerald-300" && "bg-emerald-200 text-emerald-800 border-emerald-400",
                action.badgeColor === "bg-[#c3a26c]/15 text-[#c3a26c] border-[#c3a26c]/30" && "bg-[#c3a26c]/25 text-[#c3a26c] border-[#c3a26c]/50 font-extrabold",
                (!action.badgeColor || action.badgeColor === "bg-stone-100 text-stone-700 border-stone-300") && "bg-stone-200 text-stone-800 border-stone-400"
              )}>
                {action.badge}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-stone-600 transition shrink-0 ml-2" />
          </a>
        ))}
      </div>
    </div>
  );
}