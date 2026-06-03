// app/(platform)/operations/tickets/_components/TicketsListView.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, User, Calendar, Paperclip, Image, Video, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ticket } from './types';
import { StatusBadge } from './StatusBadge';

interface TicketsListViewProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

const ITEMS_PER_PAGE = 10;

export function TicketsListView({ tickets, onTicketClick }: TicketsListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isOverdue = (ticket: Ticket) => {
    if (!ticket.deadline) return false;
    if (ticket.status === 'done' || ticket.status === 'rejected') return false;
    return new Date(ticket.deadline) < new Date();
  };
  
  const getAttachmentIcon = (fileType: string) => {
    if (fileType === 'image') return <Image className="h-3 w-3" />;
    if (fileType === 'video') return <Video className="h-3 w-3" />;
    return <Paperclip className="h-3 w-3" />;
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('tickets-list-top')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-white/30 p-3">
          <Paperclip className="h-6 w-6 text-stone-400" />
        </div>
        <p className="text-sm font-medium text-stone-500">No tickets found</p>
        <p className="text-xs text-stone-400 mt-1">Try adjusting your filters or search criteria</p>
      </div>
    );
  }
  
  return (
    <div id="tickets-list-top">
      <div className="space-y-2.5">
        {paginatedTickets.map((ticket, idx) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => onTicketClick(ticket)}
            className="group cursor-pointer rounded-xl border border-white/40 bg-white/25 p-3.5 transition-all duration-200 hover:bg-white/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-stone-500">{ticket.id}</span>
                  {/* Chỉ hiển thị priority nếu ticket có priority và không phải pending */}
                  {ticket.priority && ticket.status !== 'pending' && (
                    <StatusBadge type="priority" value={ticket.priority} size="sm" />
                  )}
                  <StatusBadge type="status" value={ticket.status} size="sm" />
                  {isOverdue(ticket) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 border border-red-200">
                      <Calendar className="h-3 w-3" />
                      Overdue
                    </span>
                  )}
                  {ticket.attachments.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 border border-stone-200">
                      <Paperclip className="h-3 w-3" />
                      {ticket.attachments.length}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 font-medium text-stone-950 text-[15px]">{ticket.title}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {ticket.blockName} • F{ticket.floorLevel} • R{ticket.roomNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {ticket.createdBy.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] text-stone-600 leading-relaxed line-clamp-2">{ticket.description}</p>
                
                {ticket.attachments.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    {ticket.attachments.slice(0, 3).map((att) => (
                      <div key={att.id} className="flex items-center gap-1 rounded-md bg-white/50 px-1.5 py-0.5 text-[11px] text-stone-500">
                        {getAttachmentIcon(att.fileType)}
                        <span className="max-w-[100px] truncate">{att.fileName}</span>
                      </div>
                    ))}
                    {ticket.attachments.length > 3 && (
                      <span className="text-[11px] text-stone-400">+{ticket.attachments.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {/* Chỉ hiển thị assigned to nếu ticket đã được assign và không phải pending */}
                {ticket.assignedTo && ticket.status !== 'pending' && (
                  <div className="text-right">
                    <p className="text-[11px] text-stone-500">Assigned to</p>
                    <p className="text-xs font-medium text-stone-800">{ticket.assignedTo.name}</p>
                  </div>
                )}
                <ChevronRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-[#c3a26c]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between border-t border-white/30 pt-4">
          <p className="text-xs text-stone-500">
            {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, tickets.length)} of {tickets.length}
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
                        ? "bg-[#c3a26c] text-white"
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