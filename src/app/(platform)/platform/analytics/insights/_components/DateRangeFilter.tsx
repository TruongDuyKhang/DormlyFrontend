// app/(platform)/analytics/insights/_components/DateRangeFilter.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from './types';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

const presets = [
  { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: 'Last 90 days', getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
  { label: 'This year', getValue: () => ({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }) },
];

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DateRangeFilter({ dateRange, onChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tempRange, setTempRange] = useState<DateRange>(dateRange);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };
  
  const handlePreset = (preset: typeof presets[0]) => {
    const newRange = preset.getValue();
    setTempRange(newRange);
    onChange(newRange);
    setIsOpen(false);
  };
  
  const displayText = `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
  
  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
      >
        <Calendar className="h-4 w-4 text-stone-400" />
        <span className="hidden sm:inline">{displayText}</span>
        <span className="sm:hidden">Date</span>
        <ChevronDown className={cn("h-4 w-4 transition", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-20 w-80 rounded-xl border border-stone-200 bg-white shadow-lg">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500">From</label>
                <input
                  type="date"
                  value={tempRange.from.toISOString().split('T')[0]}
                  onChange={(e) => setTempRange({ ...tempRange, from: new Date(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500">To</label>
                <input
                  type="date"
                  value={tempRange.to.toISOString().split('T')[0]}
                  onChange={(e) => setTempRange({ ...tempRange, to: new Date(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 hover:bg-stone-200 transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleApply}
                className="flex-1 rounded-lg bg-[#c3a26c] py-2 text-sm font-medium text-white hover:bg-[#b08f5a] transition"
              >
                Apply
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg border border-stone-200 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}