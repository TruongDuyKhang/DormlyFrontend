// app/(platform)/platform/profile/_components/ProfileTabs.tsx
'use client';

import { cn } from '@/lib/utils';
import { User, Shield, Activity } from 'lucide-react';

export type TabType = 'info' | 'security' | 'activity';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'info' as const, label: 'Personal Info', icon: User },
  { id: 'security' as const, label: 'Security', icon: Shield },
  { id: 'activity' as const, label: 'Activity Log', icon: Activity },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex gap-1 border-b border-white/40 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "group flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all",
              isActive
                ? "border-b-2 border-[#c3a26c] text-[#c3a26c]"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            <Icon className={cn(
              "h-4 w-4 transition",
              isActive ? "text-[#c3a26c]" : "text-stone-400 group-hover:text-stone-500"
            )} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}