// app/(platform)/operations/complaints/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Complaint, FilterOptions, ComplaintPriority, ComplaintStatus } from './_components/types';
import { complaints as initialComplaints } from './_components/mockData';
import { FilterBar } from './_components/FilterBar';
import { StatusCards } from './_components/StatusCards';
import { ComplaintsListView } from './_components/ComplaintsListView';
import { ComplaintDetailModal } from './_components/ComplaintDetailModal';

const currentUser = { id: 'admin-1', name: 'System Admin', role: 'admin' };

export default function ComplaintsPage() {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [complaints, setComplaints] = useState(initialComplaints);
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
  
  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints];
    
    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        (c.createdBy?.name?.toLowerCase().includes(query)) ||
        c.roomNumber.toLowerCase().includes(query) ||
        c.blockName.toLowerCase().includes(query)
      );
    }
    
    if (filters.blockId) filtered = filtered.filter(c => c.blockId === filters.blockId);
    if (filters.floorLevel) filtered = filtered.filter(c => c.floorLevel === parseInt(filters.floorLevel));
    if (filters.roomNumber) filtered = filtered.filter(c => c.roomNumber.includes(filters.roomNumber));
    if (filters.category) filtered = filtered.filter(c => c.category === filters.category);
    if (filters.priority) filtered = filtered.filter(c => c.priority === filters.priority);
    if (filters.status && !statusFilter) filtered = filtered.filter(c => c.status === filters.status);
    if (filters.dateFrom) filtered = filtered.filter(c => new Date(c.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) filtered = filtered.filter(c => new Date(c.createdAt) <= new Date(filters.dateTo));
    
    return filtered;
  }, [complaints, searchQuery, filters, statusFilter]);
  
  const handleStatusCardClick = (status: string) => {
    if (statusFilter === status) setStatusFilter('');
    else setStatusFilter(status);
  };
  
  const clearAllFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
    setFilters({
      blockId: '', floorLevel: '', roomNumber: '', category: '', priority: '', status: '', dateFrom: '', dateTo: '',
    });
  };
  
  const hasActiveFilters = statusFilter !== '' || searchQuery !== '' || Object.values(filters).some(v => v !== '');
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'New';
      case 'reviewing': return 'Reviewing';
      case 'investigating': return 'Investigating';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };
  
  // Handlers
  const handleAssign = (complaintId: string, managerId: string, managerName: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'reviewing',
          assignedTo: { id: managerId, name: managerName, role: 'manager' },
          assignedBy: { id: currentUser.id, name: currentUser.name },
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, {
            id: `timeline-${Date.now()}`,
            action: 'Complaint Assigned',
            description: `Assigned to ${managerName}`,
            author: currentUser.name,
            authorRole: currentUser.role,
            timestamp: new Date().toISOString(),
            icon: 'UserCheck',
          }]
        };
      }
      return c;
    }));
    if (statusFilter === 'pending') setStatusFilter('');
  };
  
  const handleStartInvestigation = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const newStatus = c.status === 'pending' ? 'reviewing' : 'investigating';
        return {
          ...c,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, {
            id: `timeline-${Date.now()}`,
            action: newStatus === 'reviewing' ? 'Review Started' : 'Investigation Started',
            description: newStatus === 'reviewing' ? 'Complaint is under review' : 'Formal investigation has been initiated',
            author: currentUser.name,
            authorRole: currentUser.role,
            timestamp: new Date().toISOString(),
            icon: newStatus === 'reviewing' ? 'Eye' : 'Search',
          }]
        };
      }
      return c;
    }));
  };
  
  const handleResolve = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, {
            id: `timeline-${Date.now()}`,
            action: 'Complaint Resolved',
            description: 'Resolution has been proposed',
            author: currentUser.name,
            authorRole: currentUser.role,
            timestamp: new Date().toISOString(),
            icon: 'CheckCircle',
          }]
        };
      }
      return c;
    }));
  };
  
  const handleCloseComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'closed',
          closedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, {
            id: `timeline-${Date.now()}`,
            action: 'Complaint Closed',
            description: 'Complaint has been closed',
            author: currentUser.name,
            authorRole: currentUser.role,
            timestamp: new Date().toISOString(),
            icon: 'Archive',
          }]
        };
      }
      return c;
    }));
  };
  
  const handleReject = (complaintId: string, reason: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'closed',
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, {
            id: `timeline-${Date.now()}`,
            action: 'Complaint Rejected',
            description: `Rejected: ${reason}`,
            author: currentUser.name,
            authorRole: currentUser.role,
            timestamp: new Date().toISOString(),
            icon: 'XCircle',
          }]
        };
      }
      return c;
    }));
  };
  
  const handleAddComment = (complaintId: string, comment: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          comments: [...c.comments, {
            id: `comment-${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role as any,
            content: comment,
            createdAt: new Date().toISOString(),
          }],
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));
  };
  
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }} className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
        
        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <AlertCircle className="h-3.5 w-3.5" />
              Complaints & Feedback
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">Complaint Management</h1>
            <p className="mt-2 text-sm text-stone-600">Manage and track all student complaints and feedback reports.</p>
          </div>
          
          {/* Status Cards */}
          <StatusCards complaints={complaints} selectedStatus={statusFilter} onStatusClick={handleStatusCardClick} />
          
          {/* Filter Bar */}
          <div className="mt-5"><FilterBar filters={filters} onFilterChange={setFilters} onSearch={setSearchQuery} searchQuery={searchQuery} /></div>
          
          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500">Active filters:</span>
              {statusFilter && (<span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">Status: {getStatusLabel(statusFilter)}<button onClick={() => setStatusFilter('')} className="hover:text-stone-900"><X className="h-3 w-3" /></button></span>)}
              {searchQuery && (<span className="inline-flex items-center gap-1 rounded-full bg-stone-200/80 px-2 py-0.5 text-xs text-stone-700">Search: {searchQuery}<button onClick={() => setSearchQuery('')} className="hover:text-stone-900"><X className="h-3 w-3" /></button></span>)}
              <button onClick={clearAllFilters} className="text-xs text-[#c3a26c] hover:underline ml-2">Clear all filters</button>
            </div>
          )}
          
          {/* Complaints List View */}
          <div className="mt-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-600">{statusFilter ? getStatusLabel(statusFilter) : 'All Complaints'}</span>
                  <span className="text-sm text-stone-500">({filteredComplaints.length} complaints)</span>
                </div>
                {hasActiveFilters && <button onClick={clearAllFilters} className="text-xs text-[#c3a26c] hover:underline">Clear all filters</button>}
              </div>
              <ComplaintsListView complaints={filteredComplaints} onComplaintClick={setSelectedComplaint} />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        isOpen={!!selectedComplaint}
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onReject={handleReject}
        onResolve={handleResolve}
        onCloseComplaint={handleCloseComplaint}
        onStartInvestigation={handleStartInvestigation}
        onAssign={handleAssign}
        onAddComment={handleAddComment}
        currentUser={currentUser}
      />
    </>
  );
}