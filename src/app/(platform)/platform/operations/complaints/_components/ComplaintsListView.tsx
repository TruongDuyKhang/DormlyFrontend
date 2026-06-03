// app/(platform)/operations/complaints/_components/ComplaintsListView.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, MapPin, User, Calendar, Eye, Paperclip, 
  ChevronLeft, ChevronsLeft, ChevronsRight, Lock, Unlock,
  AlertCircle, AlertTriangle, CheckCircle, ShieldAlert, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Complaint } from './types';
import { getCategoryLabel, getCategoryIcon } from './mockData';

interface ComplaintsListViewProps {
  complaints: Complaint[];
  onComplaintClick: (complaint: Complaint) => void;
}

const ITEMS_PER_PAGE = 10;

// Priority badge component - CHỈ HIỂN THỊ KHI CÓ PRIORITY VÀ KHÔNG PHẢI PENDING
function PriorityBadge({ priority, status }: { priority: string; status: string }) {
  // Không hiển thị priority nếu đang ở trạng thái pending (chưa xử lý)
  if (status === 'pending') return null;
  
  const getConfig = () => {
    switch(priority) {
      case 'critical':
        return { icon: AlertCircle, bgColor: 'bg-red-200', textColor: 'text-red-800', borderColor: 'border-red-300', label: 'Critical' };
      case 'high':
        return { icon: AlertTriangle, bgColor: 'bg-orange-200', textColor: 'text-orange-800', borderColor: 'border-orange-300', label: 'High' };
      case 'medium':
        return { icon: AlertTriangle, bgColor: 'bg-amber-200', textColor: 'text-amber-800', borderColor: 'border-amber-300', label: 'Medium' };
      case 'low':
        return { icon: CheckCircle, bgColor: 'bg-emerald-200', textColor: 'text-emerald-800', borderColor: 'border-emerald-300', label: 'Low' };
      default:
        return { icon: ShieldAlert, bgColor: 'bg-stone-200', textColor: 'text-stone-800', borderColor: 'border-stone-300', label: priority };
    }
  };
  
  const config = getConfig();
  const Icon = config.icon;
  
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border", config.bgColor, config.textColor, config.borderColor)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// Status badge component for complaint
function ComplaintStatusBadge({ status }: { status: string }) {
  const getConfig = () => {
    switch(status) {
      case 'pending':
        return { bgColor: 'bg-amber-200', textColor: 'text-amber-800', borderColor: 'border-amber-300', label: 'New' };
      case 'reviewing':
        return { bgColor: 'bg-blue-200', textColor: 'text-blue-800', borderColor: 'border-blue-300', label: 'Reviewing' };
      case 'investigating':
        return { bgColor: 'bg-purple-200', textColor: 'text-purple-800', borderColor: 'border-purple-300', label: 'Investigating' };
      case 'resolved':
        return { bgColor: 'bg-emerald-200', textColor: 'text-emerald-800', borderColor: 'border-emerald-300', label: 'Resolved' };
      case 'closed':
        return { bgColor: 'bg-stone-200', textColor: 'text-stone-800', borderColor: 'border-stone-300', label: 'Closed' };
      default:
        return { bgColor: 'bg-stone-200', textColor: 'text-stone-800', borderColor: 'border-stone-300', label: status };
    }
  };
  
  const config = getConfig();
  
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border", config.bgColor, config.textColor, config.borderColor)}>
      {config.label}
    </span>
  );
}

// Anonymous/Public badge
function AnonymousBadge({ isAnonymous }: { isAnonymous: boolean }) {
  if (isAnonymous) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-800 border border-stone-300">
        <Lock className="h-3 w-3" />
        Anonymous
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-300">
      <Unlock className="h-3 w-3" />
      Public
    </span>
  );
}

// Category badge
function CategoryBadge({ category }: { category: string }) {
  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'smoking':
      case 'cooking':
      case 'noise_late':
        return 'bg-red-200 text-red-800 border-red-300';
      case 'roommate':
      case 'argument':
      case 'harassment':
        return 'bg-purple-200 text-purple-800 border-purple-300';
      case 'common_dirty':
      case 'bathroom':
      case 'noise_upstairs':
        return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'slow_response':
      case 'no_response':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      default:
        return 'bg-stone-200 text-stone-800 border-stone-300';
    }
  };
  
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border", getCategoryColor(category))}>
      <span className="text-sm">{getCategoryIcon(category)}</span>
      {getCategoryLabel(category)}
    </span>
  );
}

export function ComplaintsListView({ complaints, onComplaintClick }: ComplaintsListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(complaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComplaints = complaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('complaints-list-top')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-white/30 p-3">
          <Eye className="h-6 w-6 text-stone-400" />
        </div>
        <p className="text-sm font-medium text-stone-500">No complaints found</p>
        <p className="text-xs text-stone-400 mt-1">Try adjusting your filters or search criteria</p>
      </div>
    );
  }
  
  return (
    <div id="complaints-list-top">
      <div className="space-y-2.5">
        {paginatedComplaints.map((complaint, idx) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => onComplaintClick(complaint)}
            className="group cursor-pointer rounded-xl border border-white/40 bg-white/25 p-3.5 transition-all duration-200 hover:bg-white/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Row 1: ID + Priority (chỉ hiển thị khi không pending) + Status + Anonymous + Category + Attachments */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-stone-600">{complaint.id}</span>
                  
                  {/* Priority Badge - CHỈ HIỂN THỊ KHI KHÔNG PENDING */}
                  <PriorityBadge priority={complaint.priority} status={complaint.status} />
                  
                  {/* Status Badge */}
                  <ComplaintStatusBadge status={complaint.status} />
                  
                  {/* Anonymous / Public Badge */}
                  <AnonymousBadge isAnonymous={complaint.isAnonymous} />
                  
                  {/* Category Badge */}
                  <CategoryBadge category={complaint.category} />
                  
                  {/* Attachments Count */}
                  {complaint.attachments.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-800 border border-stone-300">
                      <Paperclip className="h-3 w-3" />
                      {complaint.attachments.length}
                    </span>
                  )}
                </div>
                
                {/* Row 2: Title */}
                <h3 className="mt-1.5 font-semibold text-stone-950 text-[15px]">{complaint.title}</h3>
                
                {/* Row 3: Location + Reporter + Date */}
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px] text-stone-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {complaint.blockName} • F{complaint.floorLevel} • R{complaint.roomNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    {complaint.isAnonymous ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                    {complaint.isAnonymous ? 'Anonymous' : complaint.createdBy?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(complaint.createdAt)}
                  </span>
                </div>
                
                {/* Row 4: Description (truncated) */}
                <p className="mt-1.5 text-[13px] text-stone-600 leading-relaxed line-clamp-2">{complaint.description}</p>
                
                {/* Attachments Preview */}
                {complaint.attachments.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    {complaint.attachments.slice(0, 3).map((att) => (
                      <div key={att.id} className="flex items-center gap-1 rounded-md bg-white/60 px-1.5 py-0.5 text-[11px] font-medium text-stone-600">
                        {att.fileType === 'image' ? (
                          <span>🖼️</span>
                        ) : att.fileType === 'video' ? (
                          <span>🎬</span>
                        ) : (
                          <span>📄</span>
                        )}
                        <span className="max-w-[100px] truncate">{att.fileName}</span>
                      </div>
                    ))}
                    {complaint.attachments.length > 3 && (
                      <span className="text-[11px] text-stone-500">+{complaint.attachments.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right side: Assigned To + Arrow (chỉ hiển thị khi có assignedTo) */}
              <div className="flex items-center gap-3 shrink-0">
                {complaint.assignedTo && (
                  <div className="text-right">
                    <p className="text-[11px] text-stone-500 font-medium">Assigned to</p>
                    <p className="text-xs font-semibold text-stone-800">{complaint.assignedTo.name}</p>
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
          <p className="text-xs font-medium text-stone-500">
            {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, complaints.length)} of {complaints.length}
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