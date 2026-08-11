// app/(platform)/platform/settings/activity-logs/_components/ActivityLogsTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { ActivityLog, FilterOptions, KPIData } from './types';
import { KPICards } from './KPICards';
import { FilterBar } from './FilterBar';
import { ActivityTable } from './ActivityTable';
import { ExportModal } from './ExportModal';
import { auditLogService } from '@/services/auditLogService';
import type { AuditLogResponseDto } from '@/types/models';

function mapAuditToActivityLog(dto: AuditLogResponseDto): ActivityLog {
  return {
    id: dto.id,
    timestamp: dto.createdAt,
    user: dto.userId || 'Admin User',
    role: 'admin',
    action: dto.action || 'System Operation',
    module: dto.entityType || 'System',
    details: dto.newValue || dto.oldValue || `Executed ${dto.action} on ${dto.entityType || 'Entity'}`,
    ipAddress: dto.ipAddress || '127.0.0.1',
    status: 'success',
  };
}

export function ActivityLogsTab() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await auditLogService.search({ size: 100 });
      if (res && res.content) {
        const mapped = res.content.map(mapAuditToActivityLog);
        setActivities(mapped);
        setFilteredActivities(mapped);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSearch = () => {
    let filtered = [...activities];

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    if (filters.dateRange === 'today') {
      filtered = filtered.filter((a) => new Date(a.timestamp) >= today);
    } else if (filters.dateRange === 'week') {
      filtered = filtered.filter((a) => new Date(a.timestamp) >= weekAgo);
    } else if (filters.dateRange === 'month') {
      filtered = filtered.filter((a) => new Date(a.timestamp) >= monthAgo);
    }

    if (filters.role) {
      filtered = filtered.filter((a) => a.role === filters.role);
    }

    if (filters.module) {
      filtered = filtered.filter((a) => a.module === filters.module);
    }

    if (filters.actionType) {
      filtered = filtered.filter((a) =>
        a.action.toLowerCase().includes(filters.actionType.toLowerCase())
      );
    }

    if (filters.user) {
      filtered = filtered.filter((a) =>
        a.user.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.action.toLowerCase().includes(query) ||
          a.details.toLowerCase().includes(query) ||
          a.module.toLowerCase().includes(query) ||
          a.user.toLowerCase().includes(query)
      );
    }

    setFilteredActivities(filtered);
  };

  const kpiData: KPIData = {
    totalActivities: activities.length,
    todayActivities: activities.filter((a) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(a.timestamp) >= today;
    }).length,
    failedEvents: activities.filter((a) => a.status === 'failed').length,
    systemEvents: activities.filter((a) => a.role === 'system').length,
  };

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <KPICards data={kpiData} />

      {/* Export Button & Loading indicator */}
      <div className="flex justify-between items-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading audit records from server...
          </div>
        ) : (
          <div className="text-xs text-stone-500">{filteredActivities.length} logs recorded</div>
        )}
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

      {/* Activity Table */}
      <ActivityTable activities={filteredActivities} />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activities={filteredActivities}
      />
    </div>
  );
}