// app/(platform)/communication/notifications/_components/PriorityBadge.tsx
'use client';

import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationPriority } from './types';

interface PriorityBadgeProps {
  priority: NotificationPriority;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = {
    normal: {
      label: 'Normal',
      icon: Info,
      bgColor: 'bg-blue-200',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      iconColor: 'text-blue-600',
    },
    important: {
      label: 'Important',
      icon: AlertCircle,
      bgColor: 'bg-amber-200',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300',
      iconColor: 'text-amber-600',
    },
    emergency: {
      label: 'Emergency',
      icon: AlertTriangle,
      bgColor: 'bg-red-200',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      iconColor: 'text-red-600',
    },
  };
  
  const { label, icon: Icon, bgColor, textColor, borderColor, iconColor } = config[priority];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  
  return (
    <span className={cn("inline-flex items-center rounded-md font-semibold border", bgColor, textColor, borderColor, sizeClasses)}>
      <Icon className={cn("h-3 w-3", iconColor)} />
      {label}
    </span>
  );
}