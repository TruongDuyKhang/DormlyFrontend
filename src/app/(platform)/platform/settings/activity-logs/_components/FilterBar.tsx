// app/(platform)/platform/settings/activity-logs/_components/FilterBar.tsx
'use client';

import { useState } from 'react';
import { Search, Calendar, Users, Tag, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterOptions } from './types';
import { modules, roles, actionTypes } from './mockData';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FilterBar({ filters, onFilterChange, onSearch, searchQuery, setSearchQuery }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleTempFilterChange = (key: keyof FilterOptions, value: any) => {
    setTempFilters({ ...tempFilters, [key]: value });
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    onSearch();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      dateRange: 'today',
      startDate: '',
      endDate: '',
      user: '',
      role: '',
      module: '',
      actionType: '',
      search: '',
    };
    setTempFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setSearchQuery('');
    onSearch();
    setIsExpanded(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search activities... (e.g., assigned, room, ticket)"
            className="w-full rounded-xl border border-white/40 bg-white/80 pl-10 pr-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
          />
        </div>
        <button
          onClick={onSearch}
          className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
            isExpanded
              ? "bg-[#c3a26c] text-white"
              : "bg-white/50 text-stone-600 hover:bg-white/70 border border-white/40"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {isExpanded ? <X className="h-4 w-4" /> : null}
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="rounded-xl border border-white/40 bg-white/30 backdrop-blur-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">
                <Calendar className="h-3 w-3 inline mr-1" />
                Date Range
              </label>
              <select
                value={tempFilters.dateRange}
                onChange={(e) => handleTempFilterChange('dateRange', e.target.value as any)}
                className="w-full rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              >
                {dateRangeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">
                <Users className="h-3 w-3 inline mr-1" />
                Role
              </label>
              <select
                value={tempFilters.role}
                onChange={(e) => handleTempFilterChange('role', e.target.value)}
                className="w-full rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              >
                {roles.map(role => (
                  <option key={role} value={role === 'All Roles' ? '' : role.toLowerCase()}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Module */}
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">
                <Tag className="h-3 w-3 inline mr-1" />
                Module
              </label>
              <select
                value={tempFilters.module}
                onChange={(e) => handleTempFilterChange('module', e.target.value)}
                className="w-full rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              >
                {modules.map(module => (
                  <option key={module} value={module === 'All Modules' ? '' : module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Type */}
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">
                Action Type
              </label>
              <select
                value={tempFilters.actionType}
                onChange={(e) => handleTempFilterChange('actionType', e.target.value)}
                className="w-full rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              >
                {actionTypes.map(action => (
                  <option key={action} value={action === 'All Actions' ? '' : action.toLowerCase()}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Search */}
          <div className="mt-4">
            <label className="text-xs font-medium text-stone-600 block mb-1.5">User</label>
            <input
              type="text"
              value={tempFilters.user}
              onChange={(e) => handleTempFilterChange('user', e.target.value)}
              placeholder="Search by username..."
              className="w-full rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleClearFilters}
              className="text-sm text-stone-500 hover:text-stone-700 transition"
            >
              Clear all
            </button>
            <button
              onClick={handleApplyFilters}
              className="rounded-lg bg-[#c3a26c] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}