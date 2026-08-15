// app/(platform)/operations/tickets/_components/TicketDetailModal.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, MapPin, Calendar, Clock, AlertCircle, FileText, 
  MessageCircle, Paperclip, Send, UserCheck, Wrench, CheckCircle,
  XCircle, Download, Home, Layers, Video, File, Eye,
  ChevronDown, Flag, Save, Play, AlertTriangle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ticket, Attachment, TicketPriority } from './types';
import { StatusBadge } from './StatusBadge';
import { fileServeService } from '@/services/fileServeService';

interface TicketDetailModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onReject: (ticketId: string, reason: string) => void;
  onComplete: (ticketId: string) => void;
  onStartWork: (ticketId: string) => void;
  onAddComment: (ticketId: string, comment: string) => void;
  onUpdateTicket: (ticketId: string, priority: TicketPriority, assignedToId: string, assignedToName: string, deadline: string) => void;
  currentUser: { id: string; name: string; role: string };
  assignableUsers?: any[];
}

const priorityOptions: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'text-red-700 bg-red-100 border-red-200' },
  { value: 'medium', label: 'Medium', color: 'text-amber-700 bg-amber-100 border-amber-200' },
  { value: 'low', label: 'Low', color: 'text-emerald-700 bg-emerald-100 border-emerald-200' },
];

function parseDateSecure(dateString: string | null | undefined) {
  if (!dateString) return new Date();
  let formattedStr = dateString;
  if (!dateString.includes('Z') && !dateString.includes('+')) {
    formattedStr = dateString + 'Z';
  }
  return new Date(formattedStr);
}

// Secure Authenticated Image Component
function SecureImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [objectUrl, setObjectUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!src) return;

    fileServeService.fetchSecureBlob(src)
      .then((url) => {
        if (active) {
          setObjectUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load secure image:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-stone-100/50 w-full h-full min-h-[80px]">
        <Loader2 className="h-4 w-4 animate-spin text-[#c3a26c]" />
      </div>
    );
  }

  if (!objectUrl) {
    return (
      <div className="flex items-center justify-center bg-stone-100/50 w-full h-full min-h-[80px] text-xs text-stone-400">
        No image
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={objectUrl}
      alt={alt}
      className={className}
    />
  );
}

// Attachment Viewer Modal
function AttachmentViewer({ attachment, onClose }: { attachment: Attachment | null; onClose: () => void }) {
  if (!attachment) return null;
  
  const isImage = attachment.fileType === 'image';
  const isVideo = attachment.fileType === 'video';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden bg-stone-900 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-3 border-b border-white/10 bg-stone-800">
          <p className="text-sm text-white">{attachment.fileName}</p>
        </div>
        <div className="p-4 flex items-center justify-center bg-stone-900 min-h-[350px]">
          {isImage && (
            <SecureImage
              src={attachment.fileUrl}
              alt={attachment.fileName}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          )}
          {isVideo && (
            <video
              src={attachment.fileUrl}
              controls
              autoPlay
              className="max-w-full max-h-[70vh] rounded-lg"
            />
          )}
        </div>
        <div className="p-3 border-t border-white/10 bg-stone-800 flex justify-end">
          <a
            href={attachment.fileUrl}
            download={attachment.fileName}
            className="flex items-center gap-2 rounded-lg bg-[#c3a26c] px-4 py-2 text-sm text-white hover:bg-[#b08f5a] transition"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Attachment Gallery
function AttachmentGallery({ attachments, onView }: { attachments: Attachment[]; onView: (attachment: Attachment) => void }) {
  if (attachments.length === 0) {
    return (
      <div className="text-center py-6 text-stone-400 text-sm border border-dashed border-stone-300 rounded-lg bg-white/20">
        No attachments
      </div>
    );
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {attachments.map((att) => (
        <div
          key={att.id}
          className="group relative rounded-lg border border-white/40 bg-white/40 overflow-hidden cursor-pointer hover:shadow-md transition"
          onClick={() => onView(att)}
        >
          {att.fileType === 'image' && (
            <div className="aspect-video bg-stone-100 flex items-center justify-center overflow-hidden">
              <SecureImage
                src={att.fileUrl}
                alt={att.fileName}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          )}
          {att.fileType === 'video' && (
            <div className="aspect-video bg-stone-800 flex items-center justify-center relative">
              <video src={att.fileUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="rounded-full bg-white/20 p-2">
                  <Video className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          )}
          {att.fileType === 'document' && (
            <div className="aspect-video bg-stone-100 flex flex-col items-center justify-center gap-1">
              <File className="h-7 w-7 text-stone-400" />
              <p className="text-xs text-stone-600 text-center px-1 truncate max-w-full">{att.fileName}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <Eye className="h-5 w-5 text-white" />
            <span className="text-xs text-white">View</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
            <p className="text-[10px] text-white truncate">{att.fileName}</p>
            <p className="text-[9px] text-white/70">{formatFileSize(att.fileSize)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Timeline Item
function TimelineItem({ event, isLast }: { event: any; isLast: boolean }) {
  const formatTime = (timestamp: string) => {
    return parseDateSecure(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'UserCheck': return <UserCheck className="h-4 w-4" />;
      case 'Wrench': return <Wrench className="h-4 w-4" />;
      case 'CheckCircle': return <CheckCircle className="h-4 w-4" />;
      case 'XCircle': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-stone-500">
          {getIcon(event.icon || 'Clock')}
        </div>
        {!isLast && <div className="h-full w-px bg-white/40 my-1" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-stone-950">{event.action}</span>
          <span className="text-xs text-stone-400">{formatTime(event.timestamp)}</span>
        </div>
        <p className="text-sm text-stone-600 mt-0.5">{event.description}</p>
        <p className="text-xs text-stone-400 mt-1">by {event.author}</p>
      </div>
    </div>
  );
}

// Comment Item
function CommentItem({ comment }: { comment: any }) {
  const formatDateTime = (timestamp: string) => {
    return parseDateSecure(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="rounded-lg bg-white/40 p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c3a26c]/20 text-xs font-semibold text-[#c3a26c]">
            {comment.authorName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-stone-950">{comment.authorName}</span>
          <span className="text-xs text-stone-400 capitalize">{comment.authorRole}</span>
        </div>
        <span className="text-xs text-stone-400">{formatDateTime(comment.createdAt)}</span>
      </div>
      <p className="text-sm text-stone-600 ml-9">{comment.content}</p>
    </div>
  );
}

// Assign Manager Dropdown
function AssignManagerDropdown({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedId,
  managersList
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (id: string, name: string) => void;
  selectedId: string;
  managersList: { id: string; name: string; role: string; avatar: string; department: string }[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredManagers = managersList.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 z-30 w-full rounded-lg border border-white/60 bg-[#ebe4d8] shadow-lg overflow-hidden">
        <div className="p-2 border-b border-white/40 bg-[#ebe4d8]">
          <input
            type="text"
            placeholder="Search managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-white/55 bg-white/40 px-2 py-1.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#c3a26c]/30"
            autoFocus
          />
        </div>
        <div className="max-h-56 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {filteredManagers.map((manager) => (
            <button
              key={manager.id}
              onClick={() => {
                onSelect(manager.id, manager.name);
                onClose();
              }}
              className={cn(
                "w-full px-3 py-2.5 text-left transition hover:bg-white/40 flex items-center gap-3",
                selectedId === manager.id && "bg-[#c3a26c]/10"
              )}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c3a26c]/20 text-sm font-semibold text-[#c3a26c] flex-shrink-0">
                {manager.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-950">{manager.name}</p>
                <p className="text-xs text-stone-500">{manager.role}</p>
                <p className="text-[10px] text-stone-400">{manager.department}</p>
              </div>
              {selectedId === manager.id && <CheckCircle className="h-4 w-4 text-[#c3a26c] flex-shrink-0" />}
            </button>
          ))}
          {filteredManagers.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-stone-400">
              No managers found
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function TicketDetailModal({ 
  isOpen, 
  ticket, 
  onClose, 
  onReject, 
  onComplete, 
  onStartWork,
  onAddComment,
  onUpdateTicket,
  currentUser,
  assignableUsers
}: TicketDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [viewingAttachment, setViewingAttachment] = useState<Attachment | null>(null);
  
  // Form state for admin update
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>('medium');
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const assignButtonRef = useRef<HTMLDivElement>(null);

  // Dynamic managers list from users API
  const managersList = useMemo(() => {
    if (assignableUsers && assignableUsers.length > 0) {
      return assignableUsers
        .filter(u => u.roles && u.roles.some((role: string) => ['ADMIN', 'STAFF', 'MANAGER'].includes(role.toUpperCase())))
        .map(u => ({
          id: u.id,
          name: u.fullName || u.email,
          role: u.roles.join(', '),
          avatar: u.fullName ? u.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST',
          department: 'Dormitory'
        }));
    }
    // Fallback static list
    return [
      { id: 'm1', name: 'Mai Tran', role: 'Senior Manager', avatar: 'MT', department: 'Operations' },
      { id: 'm2', name: 'Linh Vo', role: 'Facility Manager', avatar: 'LV', department: 'Maintenance' },
      { id: 'm3', name: 'Khoa Nguyen', role: 'Technical Lead', avatar: 'KN', department: 'Technical' },
      { id: 'm4', name: 'Thuy Pham', role: 'Residence Manager', avatar: 'TP', department: 'Residence' },
      { id: 'm5', name: 'Anh Le', role: 'Maintenance Staff', avatar: 'AL', department: 'Maintenance' },
    ];
  }, [assignableUsers]);
  
  // Set defaults when ticket changes
  useEffect(() => {
    if (ticket) {
      setSelectedPriority(ticket.priority || 'medium');
      setSelectedManagerId(ticket.assignedTo?.id || '');
      setDeadline(ticket.deadline ? new Date(ticket.deadline).toISOString().split('T')[0] : '');
    }
  }, [ticket]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);
  
  if (!isOpen || !ticket) return null;
  
  const formatDate = (dateString: string) => {
    return parseDateSecure(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isOverdue = ticket.deadline && new Date(ticket.deadline) < new Date() && ticket.status !== 'done';
  const displayStatus = isOverdue && ticket.status !== 'done' ? 'overdue' : ticket.status;
  
  const isPending = ticket.status === 'pending';
  const isAssigned = ticket.status === 'assigned';
  const isInProgress = ticket.status === 'in_progress';
  const canUpdateAssign = isPending;
  
  const selectedManager = managersList.find(m => m.id === selectedManagerId);
  
  const handleUpdate = () => {
    if (selectedPriority && selectedManagerId && deadline) {
      onUpdateTicket(ticket.id, selectedPriority, selectedManagerId, selectedManager?.name || '', deadline);
    }
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(ticket.id, newComment);
      setNewComment('');
    }
  };
  
  const canReject = (isPending || isAssigned || isInProgress);
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-[1100px] max-h-[90vh] rounded-2xl border border-white/60 bg-[#ebe4d8] shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40 shrink-0">
                <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition z-10">
                  <X className="h-5 w-5" />
                </button>
                
                <div className="flex items-center justify-between flex-wrap gap-3 pr-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c3a26c]/20">
                      <AlertCircle className="h-5 w-5 text-[#c3a26c]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-stone-500">{ticket.id}</span>
                        {isOverdue && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-semibold border border-red-200">
                            <AlertTriangle className="h-3 w-3" />
                            Overdue
                          </span>
                        )}
                        <StatusBadge type="status" value={displayStatus as any} size="md" />
                      </div>
                      <h2 className="text-xl font-semibold text-stone-950 mt-1">{ticket.title}</h2>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Based on Status */}
                  <div className="flex gap-2 flex-wrap items-center">
                    {/* Nhận việc (Accept Job) button: show for pending or assigned */}
                    {(isPending || isAssigned) && (
                      <button
                        onClick={() => {
                          onUpdateTicket(
                            ticket.id, 
                            ticket.priority || 'medium', 
                            currentUser.id, 
                            currentUser.name, 
                            ticket.deadline ? new Date(ticket.deadline).toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                          );
                          onStartWork(ticket.id);
                        }}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition flex items-center gap-2 whitespace-nowrap"
                      >
                        <UserCheck className="h-4 w-4" />
                        Nhận việc
                      </button>
                    )}

                    {/* PENDING: Show Update & Assign */}
                    {canUpdateAssign && (
                      <button
                        onClick={handleUpdate}
                        disabled={!selectedPriority || !selectedManagerId || !deadline}
                        className="rounded-lg bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        <Save className="h-4 w-4" />
                        Update & Assign
                      </button>
                    )}
                    
                    {/* ASSIGNED: Show Start Work */}
                    {isAssigned && (
                      <button
                        onClick={() => onStartWork(ticket.id)}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition flex items-center gap-2 whitespace-nowrap"
                      >
                        <Play className="h-4 w-4" />
                        Start Work
                      </button>
                    )}
                    
                    {/* IN PROGRESS: Show Complete */}
                    {isInProgress && (
                      <button
                        onClick={() => onComplete(ticket.id)}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition flex items-center gap-2 whitespace-nowrap"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete Work
                      </button>
                    )}
                    
                    {/* REJECT: Show for pending/assigned/in_progress */}
                    {canReject && (
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="rounded-lg border border-red-300 bg-white/40 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-2 whitespace-nowrap"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div 
                className="flex-1 overflow-y-auto overscroll-contain"
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}
                onWheel={(e) => {
                  const element = e.currentTarget;
                  const isAtTop = element.scrollTop === 0;
                  const isAtBottom = element.scrollHeight - element.clientHeight === element.scrollTop;
                  
                  if ((isAtTop && (e as any).deltaY < 0) || (isAtBottom && (e as any).deltaY > 0)) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  
                  {/* LEFT COLUMN */}
                  <div className="space-y-5">
                    {/* Location Box */}
                    <div className="rounded-xl border border-white/40 bg-white/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-stone-500" />
                        <h3 className="text-sm font-semibold text-stone-700">Location</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pl-6">
                        <div className="text-sm text-stone-600">Block: <span className="font-medium text-stone-800">{ticket.blockName}</span></div>
                        <div className="text-sm text-stone-600">Floor: <span className="font-medium text-stone-800">{ticket.floorLevel}</span></div>
                        <div className="text-sm text-stone-600">Room: <span className="font-medium text-stone-800">{ticket.roomNumber}</span></div>
                      </div>
                    </div>
                    
                    {/* Description Box */}
                    <div className="rounded-xl border border-white/40 bg-white/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-stone-500" />
                        <h3 className="text-sm font-semibold text-stone-700">Description</h3>
                      </div>
                      <div className="pl-6">
                        <p className="text-sm text-stone-700 leading-relaxed">{ticket.description}</p>
                      </div>
                    </div>
                    
                    {/* Reported By Box */}
                    <div className="rounded-xl border border-white/40 bg-white/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-stone-500" />
                        <h3 className="text-sm font-semibold text-stone-700">Reported By</h3>
                      </div>
                      <div className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/20">
                            <User className="h-5 w-5 text-[#c3a26c]" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-950">{ticket.createdBy.name}</p>
                            <p className="text-xs text-stone-500">{ticket.createdBy.studentId}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-xs text-stone-500">Created</p>
                            <p className="text-sm text-stone-700">{formatDate(ticket.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Attachments Box */}
                    <div className="rounded-xl border border-white/40 bg-white/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Paperclip className="h-4 w-4 text-stone-500" />
                        <h3 className="text-sm font-semibold text-stone-700">Attachments ({ticket.attachments.length})</h3>
                      </div>
                      <div className="pl-6">
                        <AttachmentGallery attachments={ticket.attachments} onView={setViewingAttachment} />
                      </div>
                    </div>
                  </div>
                  
                  {/* RIGHT COLUMN */}
                  <div className="space-y-5">
                    {/* Assignment Box */}
                    {canUpdateAssign ? (
                      <div className="rounded-xl border border-white/40 bg-white/30 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <UserCheck className="h-4 w-4 text-stone-500" />
                          <h3 className="text-sm font-semibold text-stone-700">Assignment</h3>
                        </div>
                        
                        {/* Priority Selection */}
                        <div className="mb-4">
                          <label className="text-sm font-medium text-stone-700 block mb-2">Priority Level</label>
                          <div className="flex gap-3">
                            {priorityOptions.map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => setSelectedPriority(opt.value)}
                                className={cn(
                                  "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition border",
                                  selectedPriority === opt.value
                                    ? opt.color + " border-current shadow-sm"
                                    : "bg-white/40 text-stone-600 border-white/55 hover:bg-white/60"
                                )}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Assign Manager */}
                        <div className="mb-4 relative" ref={assignButtonRef}>
                          <label className="text-sm font-medium text-stone-700 block mb-2">Assign To</label>
                          <button
                            onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                            className="w-full flex items-center justify-between rounded-lg border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 hover:bg-white/60 transition"
                          >
                            <span className="truncate">{selectedManager?.name || 'Select a manager'}</span>
                            <ChevronDown className={cn("h-4 w-4 flex-shrink-0 transition", showAssignDropdown && "rotate-180")} />
                          </button>
                          <AssignManagerDropdown
                            isOpen={showAssignDropdown}
                            onClose={() => setShowAssignDropdown(false)}
                            onSelect={(id, name) => setSelectedManagerId(id)}
                            selectedId={selectedManagerId}
                            managersList={managersList}
                          />
                        </div>
                        
                        {/* Deadline */}
                        <div>
                          <label className="text-sm font-medium text-stone-700 block mb-2">Deadline</label>
                          <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full rounded-lg border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                          />
                        </div>
                      </div>
                    ) : ticket.assignedTo && (
                      <div className="rounded-xl border border-white/40 bg-white/30 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <UserCheck className="h-4 w-4 text-stone-500" />
                          <h3 className="text-sm font-semibold text-stone-700">Assignment</h3>
                        </div>
                        <div className="pl-6 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                              <UserCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-stone-950">{ticket.assignedTo.name}</p>
                              <p className="text-xs text-stone-500 capitalize">{ticket.assignedTo.role}</p>
                            </div>
                          </div>
                          {ticket.priority && (
                            <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-stone-400" />
                              <span className="text-sm text-stone-600">Priority:</span>
                              <StatusBadge type="priority" value={ticket.priority} size="sm" />
                            </div>
                          )}
                          {ticket.deadline && (
                            <div className="flex items-center gap-2">
                              <Calendar className={cn("h-4 w-4", isOverdue ? "text-red-500" : "text-stone-400")} />
                              <span className="text-sm text-stone-600">Deadline:</span>
                              <span className={cn("text-sm font-medium", isOverdue ? "text-red-600" : "text-stone-700")}>
                                {formatDate(ticket.deadline)}
                              </span>
                            </div>
                          )}
                          {ticket.assignedBy && (
                            <p className="text-xs text-stone-500 mt-2">Assigned by: {ticket.assignedBy.name}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Timeline Box */}
                    <div className="rounded-xl border border-white/40 bg-white/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-stone-500" />
                        <h3 className="text-sm font-semibold text-stone-700">Timeline</h3>
                      </div>
                      <div className="max-h-[220px] overflow-y-auto pr-2 space-y-0 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {ticket.timeline.map((event, idx) => (
                          <TimelineItem key={event.id} event={event} isLast={idx === ticket.timeline.length - 1} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Comments Box */}
                    <div className="rounded-xl border border-white/40 bg-white/30 p-4 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="h-4 w-4 text-stone-500" />
                        <h3 className="text-sm font-semibold text-stone-700">Comments ({ticket.comments.length})</h3>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto mb-4 overscroll-contain max-h-[240px]" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {ticket.comments.map((comment) => (
                          <CommentItem key={comment.id} comment={comment} />
                        ))}
                        {ticket.comments.length === 0 && (
                          <p className="text-sm text-stone-400 text-center py-4">No comments yet</p>
                        )}
                      </div>
                      
                      {/* Add Comment */}
                      <div className="flex gap-2 pt-3 border-t border-white/40">
                        <input
                           type="text"
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                           placeholder="Write a comment..."
                           className="flex-1 rounded-lg border border-white/55 bg-white/40 px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                        />
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="rounded-lg bg-[#c3a26c] px-3 py-2 text-white hover:bg-[#b08f5a] transition disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Rejection Reason Box */}
                    {ticket.status === 'rejected' && ticket.rejectedReason && (
                      <div className="rounded-xl border border-red-200 bg-red-50/80 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <h3 className="text-sm font-semibold text-red-700">Rejection Reason</h3>
                        </div>
                        <p className="text-sm text-red-700 pl-6">{ticket.rejectedReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Reject Modal */}
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-[450px] rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-100/50 to-red-50/30 px-5 py-4 border-b border-white/40">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-stone-950">Reject Ticket</h2>
                </div>
                <p className="text-sm text-stone-500 mt-1">Provide a reason for rejection</p>
              </div>
              <div className="p-5">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={4}
                  className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
                  autoFocus
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      if (rejectReason.trim()) {
                        onReject(ticket.id, rejectReason);
                        setShowRejectModal(false);
                        setRejectReason('');
                      }
                    }}
                    disabled={!rejectReason.trim()}
                    className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50"
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Attachment Viewer */}
      <AnimatePresence>
        {viewingAttachment && (
          <AttachmentViewer attachment={viewingAttachment} onClose={() => setViewingAttachment(null)} />
        )}
      </AnimatePresence>
    </>
  );
}