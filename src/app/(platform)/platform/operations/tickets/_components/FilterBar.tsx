// app/(platform)/operations/tickets/_components/FilterBar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterOptions, TicketCategory, TicketPriority, TicketStatus } from './types';
import { blocksList } from './mockData';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const categories: { value: TicketCategory; label: string }[] = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'ac', label: 'Air Conditioner' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'internet', label: 'Internet' },
  { value: 'lock', label: 'Door Lock' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'other', label: 'Other' },
];

const priorities: { value: TicketPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const statuses: { value: TicketStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'rejected', label: 'Rejected' },
];

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-200",
          "border-stone-300 bg-stone-100/80 text-stone-700",
          "hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30",
          !value && "text-stone-400"
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 rounded-lg border border-stone-200 bg-white shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition",
                  value === option.value 
                    ? "bg-[#c3a26c]/10 text-[#c3a26c] font-medium"
                    : "text-stone-700 hover:bg-stone-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Date Picker Component
function CustomDatePicker({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const handleConfirm = () => {
    onChange(tempDate);
    setIsOpen(false);
  };
  
  const handleClear = () => {
    setTempDate('');
    onChange('');
    setIsOpen(false);
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-200",
          "border-stone-300 bg-stone-100/80 text-stone-700",
          "hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30",
          !value && "text-stone-400"
        )}
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span className="truncate">{value ? formatDisplayDate(value) : placeholder}</span>
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 rounded-lg border border-stone-200 bg-white shadow-lg p-4 w-72">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-700">Select Date</span>
              <button
                onClick={handleClear}
                className="text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            </div>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              max={today}
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-[#c3a26c] py-1.5 text-sm font-medium text-white hover:bg-[#b08f5a] transition"
              >
                Apply
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg border border-stone-300 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
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

export function FilterBar({ filters, onFilterChange, onSearch, searchQuery }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  const handleSearch = () => {
    onSearch(localSearch);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const clearAllFilters = () => {
    onFilterChange({
      blockId: '',
      floorLevel: '',
      roomNumber: '',
      category: '',
      priority: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    });
    setLocalSearch('');
    onSearch('');
  };
  
  const clearSingleFilter = (key: keyof FilterOptions) => {
    onFilterChange({ ...filters, [key]: '' });
  };
  
  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;
  
  return (
    <div className="space-y-3">
      {/* Search Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by ticket ID, title, student name, or room..."
            className="w-full rounded-lg border border-stone-200 bg-stone-100/80 py-2 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-lg bg-[#c3a26c] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#b08f5a] flex items-center gap-1.5"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm font-medium transition flex items-center gap-1.5",
            showAdvanced 
              ? "border-[#c3a26c] bg-[#c3a26c]/10 text-[#c3a26c]" 
              : "border-stone-300 bg-stone-100/80 text-stone-600 hover:bg-stone-100"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-[#c3a26c] px-1.5 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="rounded-lg border border-stone-300 bg-stone-100/80 px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-100 flex items-center gap-1.5"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>
      
      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="rounded-lg border border-stone-200/60 bg-[#e8e2d8]/80 p-4 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">Block</label>
              <CustomSelect
                value={filters.blockId}
                onChange={(value) => onFilterChange({ ...filters, blockId: value })}
                options={blocksList.map(b => ({ value: b.id, label: b.name }))}
                placeholder="All Blocks"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">Floor</label>
              <CustomSelect
                value={filters.floorLevel}
                onChange={(value) => onFilterChange({ ...filters, floorLevel: value })}
                options={[
                  { value: '1', label: 'Floor 1' },
                  { value: '2', label: 'Floor 2' },
                  { value: '3', label: 'Floor 3' },
                  { value: '4', label: 'Floor 4' },
                  { value: '5', label: 'Floor 5' },
                ]}
                placeholder="All Floors"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">Room Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.roomNumber}
                  onChange={(e) => onFilterChange({ ...filters, roomNumber: e.target.value })}
                  placeholder="e.g., 101"
                  className="w-full rounded-lg border border-stone-300 bg-stone-100/80 px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                />
                {filters.roomNumber && (
                  <button
                    onClick={() => clearSingleFilter('roomNumber')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">Category</label>
              <CustomSelect
                value={filters.category}
                onChange={(value) => onFilterChange({ ...filters, category: value })}
                options={categories}
                placeholder="All Categories"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">Priority</label>
              <CustomSelect
                value={filters.priority}
                onChange={(value) => onFilterChange({ ...filters, priority: value })}
                options={priorities}
                placeholder="All Priorities"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">Status</label>
              <CustomSelect
                value={filters.status}
                onChange={(value) => onFilterChange({ ...filters, status: value })}
                options={statuses}
                placeholder="All Statuses"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">From Date</label>
              <CustomDatePicker
                value={filters.dateFrom}
                onChange={(value) => onFilterChange({ ...filters, dateFrom: value })}
                placeholder="Select start date"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">To Date</label>
              <CustomDatePicker
                value={filters.dateTo}
                onChange={(value) => onFilterChange({ ...filters, dateTo: value })}
                placeholder="Select end date"
              />
            </div>
          </div>
          
          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-stone-200/50 flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500">Active filters:</span>
              <div className="flex flex-wrap gap-1.5">
                {filters.blockId && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    Block: {blocksList.find(b => b.id === filters.blockId)?.name}
                    <button onClick={() => clearSingleFilter('blockId')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.floorLevel && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    Floor {filters.floorLevel}
                    <button onClick={() => clearSingleFilter('floorLevel')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.roomNumber && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    Room: {filters.roomNumber}
                    <button onClick={() => clearSingleFilter('roomNumber')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    Category: {categories.find(c => c.value === filters.category)?.label}
                    <button onClick={() => clearSingleFilter('category')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.priority && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    Priority: {priorities.find(p => p.value === filters.priority)?.label}
                    <button onClick={() => clearSingleFilter('priority')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    Status: {statuses.find(s => s.value === filters.status)?.label}
                    <button onClick={() => clearSingleFilter('status')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    From: {new Date(filters.dateFrom).toLocaleDateString()}
                    <button onClick={() => clearSingleFilter('dateFrom')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.dateTo && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                    To: {new Date(filters.dateTo).toLocaleDateString()}
                    <button onClick={() => clearSingleFilter('dateTo')} className="hover:text-stone-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#c3a26c] hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}