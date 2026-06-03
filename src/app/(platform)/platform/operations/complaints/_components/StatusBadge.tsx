// app/(platform)/operations/complaints/_components/StatusBadge.tsx
'use client';

import { ComplaintPriority, ComplaintStatus } from './types';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, AlertTriangle, CheckCircle, 
  Clock, Eye, FileSearch, Archive, XCircle
} from 'lucide-react';

// Priority badges
const priorityConfig = {
  critical: {
    label: 'Critical',
    icon: AlertCircle,
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    iconColor: 'text-red-500',
    borderColor: 'border-red-200',
  },
  high: {
    label: 'High',
    icon: AlertTriangle,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    iconColor: 'text-orange-500',
    borderColor: 'border-orange-200',
  },
  medium: {
    label: 'Medium',
    icon: AlertTriangle,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-200',
  },
  low: {
    label: 'Low',
    icon: CheckCircle,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-200',
  },
};

// Status badges
const statusConfig = {
  pending: {
    label: 'New',
    icon: Clock,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-200',
  },
  reviewing: {
    label: 'Reviewing',
    icon: Eye,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200',
  },
  investigating: {
    label: 'Investigating',
    icon: FileSearch,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-500',
    borderColor: 'border-purple-200',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-200',
  },
  closed: {
    label: 'Closed',
    icon: Archive,
    bgColor: 'bg-stone-100',
    textColor: 'text-stone-600',
    iconColor: 'text-stone-400',
    borderColor: 'border-stone-200',
  },
};

interface StatusBadgeProps {
  type: 'priority' | 'status';
  value: ComplaintPriority | ComplaintStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ type, value, size = 'md', showIcon = true, className }: StatusBadgeProps) {
  const config = type === 'priority' 
    ? priorityConfig[value as ComplaintPriority] 
    : statusConfig[value as ComplaintStatus];
  
  if (!config) return null;
  
  const Icon = config.icon;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn("h-3 w-3", config.iconColor)} />}
      {config.label}
    </span>
  );
}

// Compact version without icon
export function CompactStatusBadge({ type, value }: { type: 'priority' | 'status'; value: ComplaintPriority | ComplaintStatus }) {
  const config = type === 'priority' 
    ? priorityConfig[value as ComplaintPriority] 
    : statusConfig[value as ComplaintStatus];
  
  if (!config) return null;
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
        config.bgColor,
        config.textColor,
        config.borderColor
      )}
    >
      {config.label}
    </span>
  );
}