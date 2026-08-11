// app/(platform)/platform/settings/activity-logs/_components/SystemEventsTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight, 
  Server, Search, RefreshCw, Loader2, Filter, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemEvent } from './types';
import { auditLogService } from '@/services/auditLogService';
import type { AuditLogResponseDto } from '@/types/models';

const ITEMS_PER_PAGE = 10;

function formatDateTime(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${timeString}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${timeString}`;
  }
  
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}, ${timeString}`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'success':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Success
        </span>
      );
    case 'warning':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <AlertTriangle className="h-3 w-3" />
          Warning
        </span>
      );
    case 'error':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-medium text-rose-700">
          <XCircle className="h-3 w-3" />
          Error
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-600">
          Info
        </span>
      );
  }
}

function mapAuditToSystemEvent(log: AuditLogResponseDto): SystemEvent {
  const isError = log.action?.includes('FAIL') || log.action?.includes('ERROR') || log.action?.includes('REJECT');
  const isWarn = log.action?.includes('WARN') || log.action?.includes('UPDATE') || log.action?.includes('DELETE');
  const status: 'success' | 'warning' | 'error' = isError ? 'error' : isWarn ? 'warning' : 'success';

  return {
    id: log.id,
    timestamp: log.createdAt,
    event: log.action || 'System Process',
    description: log.newValue || log.oldValue || `System executed action ${log.action} on entity ${log.entityType || 'CORE'} (ID: ${log.entityId || 'N/A'})`,
    source: log.entityType || 'System Engine',
    status,
  };
}

export function SystemEventsTab() {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const loadSystemEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await auditLogService.search({
        size: 100,
      });

      if (res && res.content) {
        const mapped = res.content.map(mapAuditToSystemEvent);
        setEvents(mapped);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to load system events from audit log:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSystemEvents();
  }, [loadSystemEvents]);

  // Filtering
  const filteredEvents = events.filter((e) => {
    const matchesSearch = 
      searchQuery === '' ||
      e.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || e.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const availableSources = Array.from(new Set(events.map((e) => e.source)));

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('system-events-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="system-events-top" className="space-y-4">
      {/* Controls / Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search system events..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-4 py-2 text-sm text-stone-800 placeholder:text-stone-400 backdrop-blur-sm focus:border-[#c3a26c] focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-xs font-medium text-stone-700 backdrop-blur-sm focus:border-[#c3a26c] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>

          {availableSources.length > 0 && (
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-xs font-medium text-stone-700 backdrop-blur-sm focus:border-[#c3a26c] focus:outline-none"
            >
              <option value="all">All Sources</option>
              {availableSources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={loadSystemEvents}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-white/60 transition disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5 text-stone-600", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-6 gap-2 text-xs text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin text-[#c3a26c]" />
          Fetching live system events from audit trail...
        </div>
      )}

      {filteredEvents.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-white/40 bg-white/20">
          <div className="mb-3 rounded-full bg-white/30 p-3">
            <Server className="h-6 w-6 text-stone-400" />
          </div>
          <p className="text-sm font-medium text-stone-500">No system events matched filters</p>
          <p className="text-xs text-stone-400 mt-1">Try broadening your search criteria</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/30 backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="border-b border-white/40 bg-white/50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Event / Action</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {paginatedEvents.map((event, idx) => (
                  <motion.tr
                    key={event.id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-white/40 transition"
                  >
                    <td className="px-4 py-3 text-xs text-stone-600 font-mono whitespace-nowrap">
                      {formatDateTime(event.timestamp)}
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {event.event}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600 max-w-md">
                      <p className="line-clamp-2">{event.description}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">
                      <span className="rounded-md bg-stone-100/80 px-2 py-0.5 font-medium text-stone-700">
                        {event.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/30 p-4 bg-white/20">
              <p className="text-xs font-medium text-stone-500">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} events
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "rounded-md p-1.5 transition",
                    currentPage === 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-600 hover:bg-white/40"
                  )}
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "rounded-md p-1.5 transition",
                    currentPage === 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-600 hover:bg-white/40"
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3 && currentPage < totalPages - 2) {
                        pageNum = currentPage - 2 + i;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      }
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "h-7 w-7 rounded-lg text-xs font-medium transition",
                          currentPage === pageNum
                            ? "bg-[#c3a26c] text-white font-semibold shadow-sm"
                            : "text-stone-600 hover:bg-white/40"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "rounded-md p-1.5 transition",
                    currentPage === totalPages ? "text-stone-300 cursor-not-allowed" : "text-stone-600 hover:bg-white/40"
                  )}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "rounded-md p-1.5 transition",
                    currentPage === totalPages ? "text-stone-300 cursor-not-allowed" : "text-stone-600 hover:bg-white/40"
                  )}
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}