// app/(platform)/operations/tickets/_components/StatusBadge.tsx
'use client';

import { TicketPriority, TicketStatus } from './types';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, UserCheck, Wrench, XCircle } from 'lucide-react';

// Priority badges - màu đậm hơn nữa
const priorityConfig = {
  high: {
    label: 'High',
    icon: AlertCircle,
    bgColor: 'bg-red-300',
    textColor: 'text-red-900',
    iconColor: 'text-red-700',
    borderColor: 'border-red-400',
  },
  medium: {
    label: 'Medium',
    icon: AlertTriangle,
    bgColor: 'bg-amber-300',
    textColor: 'text-amber-900',
    iconColor: 'text-amber-700',
    borderColor: 'border-amber-400',
  },
  low: {
    label: 'Low',
    icon: CheckCircle,
    bgColor: 'bg-emerald-300',
    textColor: 'text-emerald-900',
    iconColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
  },
};

// Status badges - màu đậm hơn nữa
const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    bgColor: 'bg-amber-300',
    textColor: 'text-amber-900',
    iconColor: 'text-amber-700',
    borderColor: 'border-amber-400',
  },
  assigned: {
    label: 'Assigned',
    icon: UserCheck,
    bgColor: 'bg-blue-300',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-700',
    borderColor: 'border-blue-400',
  },
  in_progress: {
    label: 'In Progress',
    icon: Wrench,
    bgColor: 'bg-purple-300',
    textColor: 'text-purple-900',
    iconColor: 'text-purple-700',
    borderColor: 'border-purple-400',
  },
  done: {
    label: 'Done',
    icon: CheckCircle,
    bgColor: 'bg-emerald-300',
    textColor: 'text-emerald-900',
    iconColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    bgColor: 'bg-red-300',
    textColor: 'text-red-900',
    iconColor: 'text-red-700',
    borderColor: 'border-red-400',
  },
};

interface StatusBadgeProps {
  type: 'priority' | 'status';
  value: TicketPriority | TicketStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ type, value, size = 'md', showIcon = true, className }: StatusBadgeProps) {
  const config = type === 'priority' 
    ? priorityConfig[value as TicketPriority] 
    : statusConfig[value as TicketStatus];
  
  if (!config) return null;
  
  const Icon = config.icon;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold border",
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
export function CompactStatusBadge({ type, value }: { type: 'priority' | 'status'; value: TicketPriority | TicketStatus }) {
  const config = type === 'priority' 
    ? priorityConfig[value as TicketPriority] 
    : statusConfig[value as TicketStatus];
  
  if (!config) return null;
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold border",
        config.bgColor,
        config.textColor,
        config.borderColor
      )}
    >
      {config.label}
    </span>
  );
}