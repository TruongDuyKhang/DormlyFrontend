// app/(platform)/communication/notifications/_components/SentNotificationsTab.tsx
'use client';

import { useState } from 'react';
import { Eye, Copy, Trash2, Search, Mail, Bell, Users, Building2, Layers, DoorOpen, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { Notification } from './types';
import { sentNotifications } from './mockData';

interface SentNotificationsTabProps {
  onDuplicate?: (notification: Notification) => void;
  onUseTemplate?: (notification: Notification) => void;
}

const ITEMS_PER_PAGE = 10;

export function SentNotificationsTab({ onDuplicate, onUseTemplate }: SentNotificationsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [notifications, setNotifications] = useState(sentNotifications);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSearch = () => {
    setSearchQuery(localSearch);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // Filter notifications based on search
  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list
    document.getElementById('notifications-list-top')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  const getAudienceIcon = (audience: Notification['audience']) => {
    switch (audience.type) {
      case 'all': return <Users className="h-3.5 w-3.5" />;
      case 'block': return <Building2 className="h-3.5 w-3.5" />;
      case 'floor': return <Layers className="h-3.5 w-3.5" />;
      case 'room': return <DoorOpen className="h-3.5 w-3.5" />;
    }
  };
  
  const getAudienceText = (audience: Notification['audience']) => {
    switch (audience.type) {
      case 'all': return 'All Residents';
      case 'block': return `Block ${audience.value?.toUpperCase()}`;
      case 'floor': {
        const [block, floor] = (audience.value || '').split('-');
        return `Block ${block?.toUpperCase()} • Floor ${floor}`;
      }
      case 'room': {
        const [block, floor, room] = (audience.value || '').split('-');
        return `Block ${block?.toUpperCase()} • Floor ${floor} • Room ${room}`;
      }
      default: return 'Unknown';
    }
  };
  
  const getDeliveryIcon = (delivery: string) => {
    if (delivery === 'inapp') return <Bell className="h-3.5 w-3.5" />;
    if (delivery === 'email') return <Mail className="h-3.5 w-3.5" />;
    return (
      <div className="flex items-center gap-0.5">
        <Bell className="h-3 w-3" />
        <Mail className="h-3 w-3" />
      </div>
    );
  };
  
  const handleDuplicate = (notification: Notification) => {
    if (onDuplicate) {
      onDuplicate(notification);
    } else {
      console.log('Duplicate', notification);
    }
  };
  
  const handleView = (notification: Notification) => {
    console.log('View', notification);
  };
  
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <div id="notifications-list-top" className="space-y-4">
      {/* Search with Button */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search notifications..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-xl bg-[#c3a26c] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#b08f5a] transition flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
      
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          Showing {paginatedNotifications.length} of {filteredNotifications.length} notifications
        </p>
      </div>
      
      {/* Notifications List */}
      <div className="space-y-3">
        {paginatedNotifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h4 className="text-sm font-semibold text-stone-900">{notification.title}</h4>
                  <PriorityBadge priority={notification.priority} size="sm" />
                  <div className="flex items-center gap-1 text-xs text-stone-400">
                    {getDeliveryIcon(notification.delivery)}
                  </div>
                </div>
                <p className="text-sm text-stone-600 mb-3 line-clamp-2">{notification.message}</p>
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <div className="flex items-center gap-1">
                    {getAudienceIcon(notification.audience)}
                    <span>{getAudienceText(notification.audience)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Sent by {notification.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatDate(notification.sentAt!)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => handleView(notification)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(notification)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredNotifications.length === 0 && (
        <div className="py-12 text-center text-stone-500">
          {searchQuery ? 'No notifications match your search' : 'No sent notifications found'}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
          <p className="text-sm text-stone-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={cn(
                "rounded-lg p-2 transition",
                currentPage === 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-stone-100"
              )}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "rounded-lg p-2 transition",
                currentPage === 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-stone-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-sm font-medium transition",
                      currentPage === pageNum
                        ? "bg-[#c3a26c] text-white"
                        : "text-stone-600 hover:bg-stone-100"
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
                "rounded-lg p-2 transition",
                currentPage === totalPages ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-stone-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={cn(
                "rounded-lg p-2 transition",
                currentPage === totalPages ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-stone-100"
              )}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}