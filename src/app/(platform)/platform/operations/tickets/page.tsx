// app/(platform)/operations/tickets/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Ticket, FilterOptions, TicketPriority, TicketStatus } from './_components/types';
import { tickets as initialTickets } from './_components/mockData';
import { FilterBar } from './_components/FilterBar';
import { StatusCards } from './_components/StatusCards';
import { TicketsListView } from './_components/TicketsListView';
import { TicketDetailModal } from './_components/TicketDetailModal';

const currentUser = { id: 'admin-1', name: 'System Admin', role: 'admin' };

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' = all tickets
  const [tickets, setTickets] = useState(initialTickets);
  const [filters, setFilters] = useState<FilterOptions>({
    blockId: '',
    floorLevel: '',
    roomNumber: '',
    category: '',
    priority: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  
  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];
    
    // Status filter from cards
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.id.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.createdBy.name.toLowerCase().includes(query) ||
        ticket.roomNumber.toLowerCase().includes(query) ||
        ticket.blockName.toLowerCase().includes(query)
      );
    }
    
    // Block filter
    if (filters.blockId) {
      filtered = filtered.filter(ticket => ticket.blockId === filters.blockId);
    }
    
    // Floor filter
    if (filters.floorLevel) {
      filtered = filtered.filter(ticket => ticket.floorLevel === parseInt(filters.floorLevel));
    }
    
    // Room filter
    if (filters.roomNumber) {
      filtered = filtered.filter(ticket => ticket.roomNumber.includes(filters.roomNumber));
    }
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(ticket => ticket.category === filters.category);
    }
    
    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }
    
    // Status filter from filters
    if (filters.status && !statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }
    
    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) <= toDate);
    }
    
    return filtered;
  }, [tickets, searchQuery, filters, statusFilter]);
  
  // Handle status card click
  const handleStatusCardClick = (status: string) => {
    if (statusFilter === status) {
      setStatusFilter('');
    } else {
      setStatusFilter(status);
      setFilters(prev => ({ ...prev, status: '' }));
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
    setFilters({
      blockId: '',
      floorLevel: '',
      roomNumber: '',
      category: '',
      priority: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    });
  };
  
  // Check if any filter is active
  const hasActiveFilters = statusFilter !== '' || searchQuery !== '' || 
    Object.values(filters).some(v => v !== '');
  
  // Get status label for display
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'New';
      case 'assigned': return 'Assigned';
      case 'in_progress': return 'Working';
      case 'done': return 'Resolved';
      case 'rejected': return 'Closed';
      default: return status;
    }
  };
  
  // Handle update ticket (assign priority, manager, deadline) - Chỉ dành cho Admin ở tab New
  const handleUpdateTicket = (ticketId: string, priority: TicketPriority, assignedToId: string, assignedToName: string, deadline: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          priority,
          status: 'assigned' as TicketStatus,
          assignedTo: { id: assignedToId, name: assignedToName, role: 'manager' },
          assignedBy: { id: currentUser.id, name: currentUser.name },
          deadline,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...ticket.timeline,
            {
              id: `timeline-${Date.now()}`,
              action: 'Ticket Assigned',
              description: `Assigned to ${assignedToName} with ${priority} priority`,
              author: currentUser.name,
              authorRole: 'admin',
              timestamp: new Date().toISOString(),
              icon: 'UserCheck',
            },
            {
              id: `timeline-${Date.now() + 1}`,
              action: 'Priority Set',
              description: `Priority set to ${priority.toUpperCase()}`,
              author: currentUser.name,
              authorRole: 'admin',
              timestamp: new Date().toISOString(),
              icon: 'Flag',
            },
            ...(deadline ? [{
              id: `timeline-${Date.now() + 2}`,
              action: 'Deadline Set',
              description: `Deadline set to ${new Date(deadline).toLocaleDateString()}`,
              author: currentUser.name,
              authorRole: 'admin',
              timestamp: new Date().toISOString(),
              icon: 'Calendar',
            }] : [])
          ]
        };
      }
      return ticket;
    }));
    // Clear pending filter if active to show the ticket moved to assigned
    if (statusFilter === 'pending') {
      setStatusFilter('');
    }
  };
  
  // Handle start work - Chỉ dành cho người được assign ở tab Assigned
  const handleStartWork = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'in_progress' as TicketStatus,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...ticket.timeline,
            {
              id: `timeline-${Date.now()}`,
              action: 'Work Started',
              description: 'Work has been started on this ticket',
              author: currentUser.name,
              authorRole: currentUser.role,
              timestamp: new Date().toISOString(),
              icon: 'PlayCircle',
            }
          ]
        };
      }
      return ticket;
    }));
  };
  
  // Handle complete ticket - Chỉ dành cho người đang làm ở tab Working
  const handleComplete = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'done' as TicketStatus,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [
            ...ticket.timeline,
            {
              id: `timeline-${Date.now()}`,
              action: 'Ticket Completed',
              description: 'Issue has been resolved',
              author: currentUser.name,
              authorRole: currentUser.role,
              timestamp: new Date().toISOString(),
              icon: 'CheckCircle',
            }
          ]
        };
      }
      return ticket;
    }));
  };
  
  // Handle reject ticket - Chỉ dành cho Admin ở tab New hoặc Assigned
  const handleReject = (ticketId: string, reason: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'rejected' as TicketStatus,
          rejectedReason: reason,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...ticket.timeline,
            {
              id: `timeline-${Date.now()}`,
              action: 'Ticket Rejected',
              description: `Rejected: ${reason}`,
              author: currentUser.name,
              authorRole: currentUser.role,
              timestamp: new Date().toISOString(),
              icon: 'XCircle',
            }
          ]
        };
      }
      return ticket;
    }));
  };
  
  // Handle add comment - Tất cả role đều có thể comment
  const handleAddComment = (ticketId: string, comment: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          comments: [
            ...ticket.comments,
            {
              id: `comment-${Date.now()}`,
              authorId: currentUser.id,
              authorName: currentUser.name,
              authorRole: currentUser.role as any,
              content: comment,
              createdAt: new Date().toISOString(),
            }
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return ticket;
    }));
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
      >
        {/* Background gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#9b7a4a]/16 blur-3xl" />
        
        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <AlertCircle className="h-3.5 w-3.5" />
              Maintenance & Incidents
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Ticket Management
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage and track all maintenance requests and incident reports.
            </p>
          </div>
          
          {/* Status Cards - 5 tabs */}
          <StatusCards
            tickets={tickets}
            selectedStatus={statusFilter}
            onStatusClick={handleStatusCardClick}
          />
          
          {/* Filter Bar */}
          <div className="mt-5">
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
            />
          </div>
          
          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500">Active filters:</span>
              {statusFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                  Status: {getStatusLabel(statusFilter)}
                  <button onClick={() => setStatusFilter('')} className="hover:text-stone-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:text-stone-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#c3a26c] hover:underline ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}
          
          {/* Tickets List View */}
          <div className="mt-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              {/* Results summary */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-600">
                    {statusFilter ? getStatusLabel(statusFilter) : 'All Tickets'}
                  </span>
                  <span className="text-sm text-stone-500">({filteredTickets.length} tickets)</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#c3a26c] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              
              <TicketsListView
                tickets={filteredTickets}
                onTicketClick={setSelectedTicket}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Ticket Detail Modal */}
      <TicketDetailModal
        isOpen={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onReject={handleReject}
        onComplete={handleComplete}
        onStartWork={handleStartWork}
        onAddComment={handleAddComment}
        onUpdateTicket={handleUpdateTicket}
        currentUser={currentUser}
      />
    </>
  );
}

// Helper function for cn (if not already imported)
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}