// app/(platform)/platform/settings/activity-logs/_components/SystemEventsTab.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemEvent } from './types';
import { mockSystemEvents } from './mockData';

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

function getStatusIcon(status: string) {
  switch(status) {
    case 'success': return <div className="h-2 w-2 rounded-full bg-emerald-500" />;
    case 'warning': return <div className="h-2 w-2 rounded-full bg-amber-500" />;
    case 'error': return <div className="h-2 w-2 rounded-full bg-red-500" />;
    default: return <div className="h-2 w-2 rounded-full bg-stone-400" />;
  }
}

export function SystemEventsTab() {
  const [events] = useState<SystemEvent[]>(mockSystemEvents);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('system-events-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-white/30 p-3">
          <Server className="h-6 w-6 text-stone-400" />
        </div>
        <p className="text-sm font-medium text-stone-500">No system events found</p>
        <p className="text-xs text-stone-400 mt-1">System events will appear here</p>
      </div>
    );
  }

  return (
    <div id="system-events-top">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/40 bg-stone-100/50">
            <tr>
              <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Time</th>
              <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Event</th>
              <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Description</th>
              <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Source</th>
              <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {paginatedEvents.map((event, idx) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="hover:bg-white/20 transition"
              >
                <td className="px-4 py-3 text-sm text-stone-600 font-mono whitespace-nowrap">
                  {formatDateTime(event.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-stone-800">{event.event}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-stone-600 line-clamp-2 max-w-md">{event.description}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-500">{event.source}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(event.status)}
                    <span className="text-xs text-stone-600 capitalize">{event.status}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-white/30 pt-4">
          <p className="text-xs font-medium text-stone-500">
            {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, events.length)} of {events.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={cn(
                "rounded-md p-1.5 transition",
                currentPage === 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-white/40"
              )}
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "rounded-md p-1.5 transition",
                currentPage === 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-white/40"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            
            <div className="flex gap-0.5">
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
                      "h-7 w-7 rounded-md text-xs font-medium transition",
                      currentPage === pageNum
                        ? "bg-[#c3a26c] text-white font-semibold"
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
                currentPage === totalPages ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-white/40"
              )}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={cn(
                "rounded-md p-1.5 transition",
                currentPage === totalPages ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-white/40"
              )}
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}