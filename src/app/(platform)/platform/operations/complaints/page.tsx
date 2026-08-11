// app/(platform)/operations/complaints/page.tsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { Complaint, FilterOptions, ComplaintPriority, ComplaintStatus } from './_components/types';
import { FilterBar } from './_components/FilterBar';
import { StatusCards } from './_components/StatusCards';
import { ComplaintsListView } from './_components/ComplaintsListView';
import { ComplaintDetailModal } from './_components/ComplaintDetailModal';
import { transferRequestService } from '@/services/transferRequestService';
import type { TransferRequestResponseDto } from '@/types/models';

const currentUser = { id: 'admin-1', name: 'System Admin', role: 'admin' };

function mapTransferRequestToComplaint(tr: TransferRequestResponseDto): Complaint {
  let status: ComplaintStatus = 'pending';
  if (tr.status === 'APPROVED') status = 'resolved';
  else if (tr.status === 'REJECTED') status = 'closed';

  return {
    id: tr.id,
    title: `Room Transfer / Dispute Request`,
    description: tr.reason || 'Resident requested room relocation or accommodation adjustment.',
    category: 'roommate',
    categoryGroup: 'conflict',
    isAnonymous: false,
    priority: 'medium',
    status,
    blockId: 'b-1',
    blockName: 'Building A',
    floorLevel: 1,
    roomNumber: '101',
    createdBy: {
      id: tr.userId,
      name: 'Resident',
      studentId: 'STU-ROOM',
    },
    assignedTo: tr.reviewedBy ? {
      id: 'mgr',
      name: tr.reviewedBy,
      role: 'manager',
    } : undefined,
    attachments: [],
    comments: [],
    timeline: [
      {
        id: `tl-${tr.id}`,
        action: 'Request Submitted',
        description: tr.reason,
        author: 'Resident',
        authorRole: 'student',
        timestamp: tr.createdAt,
      },
    ],
    createdAt: tr.createdAt,
    updatedAt: tr.reviewedAt || tr.createdAt,
    resolvedAt: tr.status === 'APPROVED' ? tr.reviewedAt : undefined,
    closedAt: tr.status === 'REJECTED' ? tr.reviewedAt : undefined,
  };
}

export default function ComplaintsPage() {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const loadComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await transferRequestService.listAll();
      if (data && data.length > 0) {
        const mapped = data.map(mapTransferRequestToComplaint);
        setComplaints(mapped);
      }
    } catch (err) {
      console.error('Failed to load transfer requests/complaints:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints];

    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.id.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query) ||
          c.createdBy?.name?.toLowerCase().includes(query) ||
          c.roomNumber.toLowerCase().includes(query) ||
          c.blockName.toLowerCase().includes(query)
      );
    }

    if (filters.blockId) filtered = filtered.filter((c) => c.blockId === filters.blockId);
    if (filters.floorLevel) filtered = filtered.filter((c) => c.floorLevel === parseInt(filters.floorLevel));
    if (filters.roomNumber) filtered = filtered.filter((c) => c.roomNumber.includes(filters.roomNumber));
    if (filters.category) filtered = filtered.filter((c) => c.category === filters.category);
    if (filters.priority) filtered = filtered.filter((c) => c.priority === filters.priority);
    if (filters.status && !statusFilter) filtered = filtered.filter((c) => c.status === filters.status);
    if (filters.dateFrom) filtered = filtered.filter((c) => new Date(c.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) filtered = filtered.filter((c) => new Date(c.createdAt) <= new Date(filters.dateTo));

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

  const hasActiveFilters = statusFilter !== '' || searchQuery !== '' || Object.values(filters).some((v) => v !== '');

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'New';
      case 'reviewing':
        return 'Reviewing';
      case 'investigating':
        return 'Investigating';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  // Handlers
  const handleAssign = (complaintId: string, managerId: string, managerName: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'reviewing',
            assignedTo: { id: managerId, name: managerName, role: 'manager' },
            assignedBy: { id: currentUser.id, name: currentUser.name },
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const handleStartInvestigation = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'investigating',
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const handleResolve = async (complaintId: string) => {
    try {
      await transferRequestService
        .updateStatus(complaintId, { status: 'APPROVED' })
        .catch(() => {});
    } catch (e) {
      console.warn(e);
    }
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'resolved',
            resolvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const handleCloseComplaint = async (complaintId: string) => {
    try {
      await transferRequestService
        .updateStatus(complaintId, { status: 'REJECTED' })
        .catch(() => {});
    } catch (e) {
      console.warn(e);
    }
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'closed',
            closedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const handleAddComment = (complaintId: string, content: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            comments: [
              ...c.comments,
              {
                id: `comm-${Date.now()}`,
                authorId: currentUser.id,
                authorName: currentUser.name,
                authorRole: currentUser.role as any,
                content,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return c;
      })
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#9b7a4a]/16 blur-3xl" />

        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <AlertCircle className="h-3.5 w-3.5" />
              Resident Relations
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Complaints & Grievances
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage and resolve resident complaints, conflicts, and disciplinary issues.
            </p>
          </div>

          {/* Status Cards */}
          <StatusCards
            complaints={complaints}
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

          {/* Active Filters */}
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

          {/* Complaints List */}
          <div className="mt-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-600">
                    {statusFilter ? getStatusLabel(statusFilter) : 'All Requests'}
                  </span>
                  <span className="text-sm text-stone-500">({filteredComplaints.length} requests)</span>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Fetching requests...
                  </div>
                )}
              </div>

              <ComplaintsListView
                complaints={filteredComplaints}
                onComplaintClick={setSelectedComplaint}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <ComplaintDetailModal
        isOpen={!!selectedComplaint}
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onReject={(id, reason) => handleCloseComplaint(id)}
        onAssign={handleAssign}
        onStartInvestigation={handleStartInvestigation}
        onResolve={handleResolve}
        onCloseComplaint={handleCloseComplaint}
        onAddComment={handleAddComment}
        currentUser={currentUser}
      />
    </>
  );
}