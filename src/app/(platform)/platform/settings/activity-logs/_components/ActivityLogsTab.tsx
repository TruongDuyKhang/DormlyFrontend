// app/(platform)/platform/settings/activity-logs/_components/ActivityLogsTab.tsx
'use client';

import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { ActivityLog, FilterOptions } from './types';
import { mockActivityLogs, mockKPIData } from './mockData';
import { KPICards } from './KPICards';
import { FilterBar } from './FilterBar';
import { ActivityTable } from './ActivityTable';
import { ExportModal } from './ExportModal';

export function ActivityLogsTab() {
  const [activities] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>(mockActivityLogs);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'today',
    startDate: '',
    endDate: '',
    user: '',
    role: '',
    module: '',
    actionType: '',
    search: '',
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleSearch = () => {
    let filtered = [...activities];

    // Date filtering
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    if (filters.dateRange === 'today') {
      filtered = filtered.filter(a => new Date(a.timestamp) >= today);
    } else if (filters.dateRange === 'week') {
      filtered = filtered.filter(a => new Date(a.timestamp) >= weekAgo);
    } else if (filters.dateRange === 'month') {
      filtered = filtered.filter(a => new Date(a.timestamp) >= monthAgo);
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(a => a.role === filters.role);
    }

    // Module filter
    if (filters.module) {
      filtered = filtered.filter(a => a.module === filters.module);
    }

    // Action type filter
    if (filters.actionType) {
      filtered = filtered.filter(a => a.action.toLowerCase().includes(filters.actionType.toLowerCase()));
    }

    // User filter
    if (filters.user) {
      filtered = filtered.filter(a => a.user.toLowerCase().includes(filters.user.toLowerCase()));
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.action.toLowerCase().includes(query) ||
        a.details.toLowerCase().includes(query) ||
        a.module.toLowerCase().includes(query) ||
        a.user.toLowerCase().includes(query)
      );
    }

    setFilteredActivities(filtered);
  };

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <KPICards data={mockKPIData} />

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export Logs
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Activity Table - đã có phân trang bên trong */}
      <div className="rounded-xl border border-white/40 bg-white/30 backdrop-blur-sm overflow-hidden">
        <ActivityTable activities={filteredActivities} />
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activities={filteredActivities}
      />
    </div>
  );
}