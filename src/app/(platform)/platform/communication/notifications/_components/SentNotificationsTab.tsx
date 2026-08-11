// app/(platform)/communication/notifications/_components/SentNotificationsTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, Copy, Trash2, Search, Mail, Bell, Users, Building2, Layers, DoorOpen, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { Notification } from './types';
import { notificationService } from '@/services/notificationService';
import type { NotificationLog } from '@/types/models';

interface SentNotificationsTabProps {
  onDuplicate?: (notification: Notification) => void;
  onUseTemplate?: (notification: Notification) => void;
}

const ITEMS_PER_PAGE = 10;

function mapLogToNotification(log: NotificationLog): Notification {
  return {
    id: log.id || log.eventId,
    title: log.subject || 'Announcement',
    message: log.subject || '',
    priority: 'normal',
    audience: {
      type: 'all',
    },
    delivery: log.channel === 'EMAIL' ? 'email' : 'inapp',
    status: log.status === 'SENT' ? 'sent' : 'draft',
    sentAt: log.createdAt,
    scheduledAt: null,
    createdAt: log.createdAt,
    createdBy: log.recipient || 'Admin',
  };
}

export function SentNotificationsTab({ onDuplicate, onUseTemplate }: SentNotificationsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getLogs({ size: 50 });
      if (res && res.content) {
        const mapped = res.content.map(mapLogToNotification);
        setNotifications(mapped);
      }
    } catch (err) {
      console.error('Failed to load notification logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSearch = () => {
    setSearchQuery(localSearch);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredNotifications = notifications.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('notifications-list-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search sent notifications..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-9 py-2 text-sm backdrop-blur-sm focus:border-[#c3a26c] focus:outline-none"
          />
          {localSearch && (
            <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-medium text-white hover:bg-[#b08f5a] transition"
        >
          Search
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-stone-500 py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading logs from message queue...
        </div>
      )}

      {/* Notifications Table */}
      <div id="notifications-list-top" className="overflow-hidden rounded-2xl border border-white/60 bg-white/30 backdrop-blur-sm">
        <table className="w-full text-left text-sm text-stone-700">
          <thead className="border-b border-white/40 bg-white/40 text-xs font-semibold uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-5 py-3">Subject & Recipient</th>
              <th className="px-5 py-3">Delivery</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((n) => (
                <tr key={n.id} className="hover:bg-white/40 transition">
                  <td className="px-5 py-3 font-medium text-stone-900">
                    <div>{n.title}</div>
                    <div className="text-xs text-stone-500 font-normal">To: {n.createdBy}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-700 uppercase">
                      {n.delivery}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
                      n.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    )}>
                      {n.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-stone-500">
                    {formatDate(n.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-stone-500">
                  No notification logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-stone-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="rounded-lg border border-white/60 bg-white/40 p-1.5 text-stone-600 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="rounded-lg border border-white/60 bg-white/40 p-1.5 text-stone-600 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}