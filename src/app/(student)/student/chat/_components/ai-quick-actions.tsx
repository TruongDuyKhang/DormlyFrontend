// app/(student)/chat/_components/ai-quick-actions.tsx
'use client';

import { FileText, AlertCircle, Calendar, Home, MessageSquare, Wrench } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  { label: 'Report Issue', href: '/student/requests', icon: Wrench, color: 'bg-sky-600 text-white' },
  { label: 'Create Complaint', href: '/student/requests', icon: AlertCircle, color: 'bg-amber-600 text-white' },
  { label: 'Open Documents', href: '/student/residence/documents', icon: FileText, color: 'bg-emerald-600 text-white' },
  { label: 'View Events', href: '/student/community/events', icon: Calendar, color: 'bg-purple-600 text-white' },
  { label: 'My Residence', href: '/student/residence/room', icon: Home, color: 'bg-stone-600 text-white' },
  { label: 'Community Feed', href: '/student/community/feed', icon: MessageSquare, color: 'bg-rose-600 text-white' },
];

export function AiQuickActions() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-stone-700">Quick Actions</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-2 rounded-lg ${action.color} px-3 py-2 text-sm font-medium transition hover:opacity-90 active:scale-[0.98] shadow-sm`}
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}