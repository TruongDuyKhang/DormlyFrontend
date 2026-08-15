// app/(platform)/operations/tickets/page.tsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { Ticket, FilterOptions, TicketPriority, TicketStatus } from './_components/types';
import { FilterBar } from './_components/FilterBar';
import { StatusCards } from './_components/StatusCards';
import { TicketsListView } from './_components/TicketsListView';
import { TicketDetailModal } from './_components/TicketDetailModal';
import { ticketService } from '@/services/ticketService';
import { userService } from '@/services/userService';
import { useAuth } from '@/app/(auth)/context/auth-context';
import type { TicketSummaryResponseDto, TicketDetailResponseDto } from '@/types/models';
import { toast } from 'sonner';

function parseDateSecure(dateStr: string | null | undefined): string {
  if (!dateStr) return new Date().toISOString();
  let s = dateStr;
  if (!s.includes('Z') && !s.includes('+')) {
    s = s + 'Z';
  }
  return new Date(s).toISOString();
}

function mapDtoToTicket(dto: TicketSummaryResponseDto): Ticket {
  let status: TicketStatus = 'pending';
  if (dto.status === 'OPEN') status = 'pending';
  else if (dto.status === 'IN_PROGRESS') status = 'in_progress';
  else if (dto.status === 'RESOLVED') status = 'done';
  else if (dto.status === 'CLOSED') status = 'rejected';

  let priority: TicketPriority = 'medium';
  if (dto.priority === 'CRITICAL' || dto.priority === 'HIGH') priority = 'high';
  else if (dto.priority === 'LOW') priority = 'low';

  const creationTime = parseDateSecure(dto.createdAt);

  return {
    id: dto.id,
    title: dto.title || 'Untitled Ticket',
    description: '',
    category: (dto.category?.toLowerCase() as any) || 'other',
    priority,
    status,
    blockId: 'b-1',
    blockName: dto.buildingNodeName || 'Building A',
    floorLevel: 1,
    roomNumber: dto.buildingNodeName || 'Room 101',
    createdBy: {
      id: dto.reporterName || 'resident',
      name: dto.reporterName || 'Resident',
      studentId: dto.reporterName || 'STU001',
    },
    assignedTo: dto.assignees && dto.assignees.length > 0 ? {
      id: dto.assignees[0].userId,
      name: dto.assignees[0].fullName,
      role: 'manager',
    } : undefined,
    attachments: [],
    comments: [],
    timeline: [
      {
        id: `t-created-${dto.id}`,
        action: 'Ticket Created',
        description: 'Ticket submitted into system',
        author: dto.reporterName || 'Resident',
        authorRole: 'student',
        timestamp: creationTime,
      },
    ],
    createdAt: creationTime,
    updatedAt: parseDateSecure(dto.createdAt),
    deadline: dto.dueDate ? parseDateSecure(dto.dueDate) : undefined,
  };
}

function mapDetailDtoToTicket(dto: TicketDetailResponseDto): Ticket {
  let status: TicketStatus = 'pending';
  if (dto.status === 'OPEN') status = 'pending';
  else if (dto.status === 'IN_PROGRESS') status = 'in_progress';
  else if (dto.status === 'RESOLVED') status = 'done';
  else if (dto.status === 'CLOSED') status = 'rejected';

  let priority: TicketPriority = 'medium';
  if (dto.priority === 'CRITICAL' || dto.priority === 'HIGH') priority = 'high';
  else if (dto.priority === 'LOW') priority = 'low';

  const creationTime = parseDateSecure(dto.createdAt);

  const mappedAttachments = (dto.attachments || []).map((att) => {
    const isImg = /\.(jpg|jpeg|png|gif)$/i.test(att.storedFileName);
    const isVid = /\.(mp4|webm|ogg)$/i.test(att.storedFileName);
    return {
      id: att.id,
      fileName: att.fileName,
      fileSize: att.fileSize || 0,
      fileType: isImg ? 'image' : isVid ? 'video' : 'document' as any,
      fileUrl: ticketService.getAttachmentUrl(att.storedFileName),
    };
  });

  const mappedComments = (dto.comments || []).map((c) => ({
    id: c.id,
    authorId: c.userId,
    authorName: c.fullName || 'Anonymous',
    authorRole: (c.role?.toLowerCase() as any) || 'student',
    content: c.content,
    createdAt: parseDateSecure(c.createdAt),
  }));

  const timeline = [
    {
      id: `t-created-${dto.id}`,
      action: 'Ticket Created',
      description: 'Ticket submitted into system',
      author: dto.reporterName || 'Resident',
      authorRole: 'student',
      timestamp: creationTime,
    }
  ];

  if (dto.resolvedAt) {
    timeline.push({
      id: `t-resolved-${dto.id}`,
      action: 'Ticket Resolved',
      description: dto.resolutionNote || 'Ticket was resolved',
      author: 'Staff',
      authorRole: 'manager',
      timestamp: parseDateSecure(dto.resolvedAt),
    });
  }

  return {
    id: dto.id,
    title: dto.title || 'Untitled Ticket',
    description: dto.description || '',
    category: (dto.category?.toLowerCase() as any) || 'other',
    priority,
    status,
    blockId: 'b-1',
    blockName: dto.buildingNodeName || 'Building A',
    floorLevel: 1,
    roomNumber: dto.buildingNodeName || 'Room 101',
    createdBy: {
      id: dto.reporterId || 'resident',
      name: dto.reporterName || 'Resident',
      studentId: dto.reporterName || 'STU001',
    },
    assignedTo: dto.assignees && dto.assignees.length > 0 ? {
      id: dto.assignees[0].userId,
      name: dto.assignees[0].fullName,
      role: 'manager',
    } : undefined,
    attachments: mappedAttachments,
    comments: mappedComments,
    timeline,
    createdAt: creationTime,
    updatedAt: parseDateSecure(dto.createdAt),
    deadline: dto.dueDate ? parseDateSecure(dto.dueDate) : undefined,
    resolutionNote: dto.resolutionNote,
    rejectedReason: dto.status === 'CLOSED' ? dto.resolutionNote : undefined,
  };
}

export default function TicketsPage() {
  const { user: authUser } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' = all tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
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

  const currentUser = useMemo(() => {
    if (!authUser) return { id: 'admin-1', name: 'System Admin', role: 'admin' };
    const normalized = (authUser.roles || []).map((r) => r.toLowerCase().replace("role_", ""));
    const isAdm = normalized.some((r) => ["admin", "manager"].includes(r));
    return {
      id: authUser.id,
      name: authUser.fullname || 'Staff User',
      role: isAdm ? 'admin' : 'staff',
    };
  }, [authUser]);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pageResult, allUsers] = await Promise.allSettled([
        ticketService.listTickets({ size: 100 }),
        userService.list(),
      ]);
      
      if (pageResult.status === 'fulfilled' && pageResult.value?.content) {
        const mapped = pageResult.value.content.map(mapDtoToTicket);
        setTickets(mapped);
      }
      if (allUsers.status === 'fulfilled' && allUsers.value) {
        setUsersList(allUsers.value);
      }
    } catch (err) {
      console.error('Failed to load tickets/users from backend API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleTicketClick = async (ticket: Ticket) => {
    try {
      const details = await ticketService.getTicketDetail(ticket.id);
      const fullTicket = mapDetailDtoToTicket(details);
      setSelectedTicket(fullTicket);
    } catch (e) {
      console.error("Failed to load ticket details:", e);
      setSelectedTicket(ticket);
    }
  };

  // Filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query) ||
          ticket.createdBy.name.toLowerCase().includes(query) ||
          ticket.roomNumber.toLowerCase().includes(query) ||
          ticket.blockName.toLowerCase().includes(query)
      );
    }

    if (filters.blockId) {
      filtered = filtered.filter((ticket) => ticket.blockId === filters.blockId);
    }

    if (filters.floorLevel) {
      filtered = filtered.filter((ticket) => ticket.floorLevel === parseInt(filters.floorLevel));
    }

    if (filters.roomNumber) {
      filtered = filtered.filter((ticket) => ticket.roomNumber.includes(filters.roomNumber));
    }

    if (filters.category) {
      filtered = filtered.filter((ticket) => ticket.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter((ticket) => ticket.priority === filters.priority);
    }

    if (filters.status && !statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((ticket) => new Date(ticket.createdAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter((ticket) => new Date(ticket.createdAt) <= toDate);
    }

    return filtered;
  }, [tickets, searchQuery, filters, statusFilter]);

  const handleStatusCardClick = (status: string) => {
    if (statusFilter === status) {
      setStatusFilter('');
    } else {
      setStatusFilter(status);
      setFilters((prev) => ({ ...prev, status: '' }));
    }
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

  const hasActiveFilters =
    statusFilter !== '' || searchQuery !== '' || Object.values(filters).some((v) => v !== '');

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'New';
      case 'assigned':
        return 'Assigned';
      case 'in_progress':
        return 'Working';
      case 'done':
        return 'Resolved';
      case 'rejected':
        return 'Closed';
      default:
        return status;
    }
  };

  const handleUpdateTicket = async (
    ticketId: string,
    priority: TicketPriority,
    assignedToId: string,
    assignedToName: string,
    deadline: string
  ) => {
    try {
      if (assignedToId) {
        await ticketService.updateAssignees(ticketId, { assigneeIds: [assignedToId] }).catch(() => {});
      }
      if (priority) {
        const pUpper = priority === 'high' ? 'HIGH' : priority === 'low' ? 'LOW' : 'MEDIUM';
        await ticketService.updatePriority(ticketId, { priority: pUpper as any }).catch(() => {});
      }
      if (deadline) {
        await ticketService.updateDueDate(ticketId, { dueDate: deadline }).catch(() => {});
      }
    } catch (e) {
      console.warn(e);
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const updated = {
            ...ticket,
            priority,
            status: 'assigned' as TicketStatus,
            assignedTo: { id: assignedToId, name: assignedToName, role: 'manager' },
            assignedBy: { id: currentUser.id, name: currentUser.name },
            deadline,
            updatedAt: new Date().toISOString(),
          };
          setSelectedTicket((curr) => curr && curr.id === ticketId ? { ...curr, ...updated } : curr);
          return updated;
        }
        return ticket;
      })
    );
  };

  const handleStartWork = async (ticketId: string) => {
    try {
      await ticketService.updateStatus(ticketId, { status: 'IN_PROGRESS' }).catch(() => {});
    } catch (e) {
      console.warn(e);
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const updated = {
            ...ticket,
            status: 'in_progress' as TicketStatus,
            updatedAt: new Date().toISOString(),
          };
          setSelectedTicket((curr) => curr && curr.id === ticketId ? { ...curr, ...updated } : curr);
          return updated;
        }
        return ticket;
      })
    );
  };

  const handleComplete = async (ticketId: string, resolutionNote?: string) => {
    try {
      const note = resolutionNote?.trim() || 'Đã hoàn thành xử lý công việc';
      await ticketService.updateStatus(ticketId, { status: 'RESOLVED', resolutionNote: note });
      toast.success('Đã hoàn thành xử lý ticket thành công!');

      setTickets((prev) =>
        prev.map((ticket) => {
          if (ticket.id === ticketId) {
            const updated = {
              ...ticket,
              status: 'done' as TicketStatus,
              resolutionNote: note,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setSelectedTicket((curr) => (curr && curr.id === ticketId ? { ...curr, ...updated } : curr));
            return updated;
          }
          return ticket;
        })
      );
    } catch (e: any) {
      console.error('Failed to complete ticket:', e);
      toast.error(e?.response?.data?.message || 'Hoàn thành ticket thất bại!');
    }
  };

  const handleReject = async (ticketId: string, reason: string) => {
    try {
      await ticketService.updateStatus(ticketId, { status: 'CLOSED', resolutionNote: reason }).catch(() => {});
    } catch (e) {
      console.warn(e);
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const updated = {
            ...ticket,
            status: 'rejected' as TicketStatus,
            rejectedReason: reason,
            resolutionNote: reason,
            updatedAt: new Date().toISOString(),
          };
          setSelectedTicket((curr) => curr && curr.id === ticketId ? { ...curr, ...updated } : curr);
          return updated;
        }
        return ticket;
      })
    );
  };

  const handleAddComment = async (ticketId: string, comment: string) => {
    try {
      const response = await ticketService.addAdminComment(ticketId, { content: comment });
      const newCommentObj = {
        id: response?.id || `comment-${Date.now()}`,
        authorId: response?.userId || currentUser.id,
        authorName: response?.fullName || currentUser.name,
        authorRole: (response?.role?.toLowerCase() as any) || (currentUser.role as any),
        content: comment,
        createdAt: response?.createdAt || new Date().toISOString(),
      };

      setTickets((prev) =>
        prev.map((ticket) => {
          if (ticket.id === ticketId) {
            const updated = {
              ...ticket,
              comments: [...ticket.comments, newCommentObj],
              updatedAt: new Date().toISOString(),
            };
            setSelectedTicket((curr) => curr && curr.id === ticketId ? { ...curr, ...updated } : curr);
            return updated;
          }
          return ticket;
        })
      );
    } catch (e) {
      console.warn(e);
    }
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

          <StatusCards
            tickets={tickets}
            selectedStatus={statusFilter}
            onStatusClick={handleStatusCardClick}
          />

          <div className="mt-5">
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
            />
          </div>

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

          <div className="mt-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm overflow-hidden">
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-600">
                    {statusFilter ? getStatusLabel(statusFilter) : 'All Tickets'}
                  </span>
                  <span className="text-sm text-stone-500">({filteredTickets.length} tickets)</span>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Updating...
                  </div>
                )}
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
                onTicketClick={handleTicketClick}
              />
            </div>
          </div>
        </div>
      </motion.div>

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
        assignableUsers={usersList}
      />
    </>
  );
}
