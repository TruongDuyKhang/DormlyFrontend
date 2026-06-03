// app/(platform)/operations/complaints/_components/StatusCards.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Complaint } from './types';
import { Inbox, Eye, FileSearch, CheckCircle, Archive } from 'lucide-react';

interface StatusCardsProps {
  complaints: Complaint[];
  selectedStatus: string;
  onStatusClick: (status: string) => void;
}

// Màu sắc đậm, rực rỡ - giống Tickets
const statusConfig = [
  { 
    status: 'pending', 
    label: 'New', 
    icon: Inbox,
    color: 'text-amber-800',
    bgColor: 'bg-amber-100',
    selectedBg: 'bg-amber-500',
    selectedText: 'text-white',
    borderColor: 'border-amber-200',
    selectedBorderColor: 'border-amber-600',
    hoverBg: 'hover:bg-amber-200',
    countBg: 'bg-amber-200',
    countColor: 'text-amber-800',
    selectedCountBg: 'bg-amber-600',
    selectedCountColor: 'text-white'
  },
  { 
    status: 'reviewing', 
    label: 'Reviewing', 
    icon: Eye,
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    selectedBg: 'bg-blue-500',
    selectedText: 'text-white',
    borderColor: 'border-blue-200',
    selectedBorderColor: 'border-blue-600',
    hoverBg: 'hover:bg-blue-200',
    countBg: 'bg-blue-200',
    countColor: 'text-blue-800',
    selectedCountBg: 'bg-blue-600',
    selectedCountColor: 'text-white'
  },
  { 
    status: 'investigating', 
    label: 'Investigating', 
    icon: FileSearch,
    color: 'text-purple-800',
    bgColor: 'bg-purple-100',
    selectedBg: 'bg-purple-500',
    selectedText: 'text-white',
    borderColor: 'border-purple-200',
    selectedBorderColor: 'border-purple-600',
    hoverBg: 'hover:bg-purple-200',
    countBg: 'bg-purple-200',
    countColor: 'text-purple-800',
    selectedCountBg: 'bg-purple-600',
    selectedCountColor: 'text-white'
  },
  { 
    status: 'resolved', 
    label: 'Resolved', 
    icon: CheckCircle,
    color: 'text-emerald-800',
    bgColor: 'bg-emerald-100',
    selectedBg: 'bg-emerald-500',
    selectedText: 'text-white',
    borderColor: 'border-emerald-200',
    selectedBorderColor: 'border-emerald-600',
    hoverBg: 'hover:bg-emerald-200',
    countBg: 'bg-emerald-200',
    countColor: 'text-emerald-800',
    selectedCountBg: 'bg-emerald-600',
    selectedCountColor: 'text-white'
  },
  { 
    status: 'closed', 
    label: 'Closed', 
    icon: Archive,
    color: 'text-stone-800',
    bgColor: 'bg-stone-100',
    selectedBg: 'bg-stone-500',
    selectedText: 'text-white',
    borderColor: 'border-stone-200',
    selectedBorderColor: 'border-stone-600',
    hoverBg: 'hover:bg-stone-200',
    countBg: 'bg-stone-200',
    countColor: 'text-stone-800',
    selectedCountBg: 'bg-stone-600',
    selectedCountColor: 'text-white'
  },
];

export function StatusCards({ complaints, selectedStatus, onStatusClick }: StatusCardsProps) {
  const getCount = (status: string) => {
    return complaints.filter(c => c.status === status).length;
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {statusConfig.map((config) => {
        const count = getCount(config.status);
        const isSelected = selectedStatus === config.status;
        const Icon = config.icon;
        
        return (
          <motion.button
            key={config.status}
            onClick={() => onStatusClick(isSelected ? '' : config.status)}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative rounded-xl border p-3 text-left transition-all duration-200 shadow-sm",
              isSelected ? config.selectedBg : config.bgColor,
              isSelected ? config.selectedBorderColor : config.borderColor,
              !isSelected && config.hoverBg,
              isSelected && "shadow-md"
            )}
          >
            <div className="flex items-center justify-between">
              <Icon className={cn("h-5 w-5", isSelected ? "text-white" : config.color)} />
              <span className={cn(
                "text-base font-bold rounded-full px-2 py-0.5",
                isSelected ? config.selectedCountBg : config.countBg,
                isSelected ? config.selectedCountColor : config.countColor
              )}>
                {count}
              </span>
            </div>
            <p className={cn("mt-1 text-sm font-semibold", isSelected ? "text-white" : config.color)}>
              {config.label}
            </p>
            {isSelected && (
              <div className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white shadow-sm" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}