// app/(platform)/platform/residents/documents/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Eye, 
  RefreshCw, 
  Loader2, 
  User, 
  FileText,
  AlertCircle,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userDocumentService } from '@/services/userDocumentService';
import { userService } from '@/services/userService';
import { fileServeService } from '@/services/fileServeService';
import type { UserDocumentResponseDto, UserResponseDto } from '@/types/models';
import { toast } from 'sonner';

interface StudentWithDocs {
  user: UserResponseDto;
  docs: UserDocumentResponseDto[];
}

export default function DocumentVerificationPage() {
  const [studentsWithDocs, setStudentsWithDocs] = useState<StudentWithDocs[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Preview State
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<UserDocumentResponseDto | null>(null);
  const [previewUser, setPreviewUser] = useState<UserResponseDto | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Approve Confirm State
  const [confirmApproveDoc, setConfirmApproveDoc] = useState<UserDocumentResponseDto | null>(null);
  
  // Reject State
  const [rejectingDoc, setRejectingDoc] = useState<UserDocumentResponseDto | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [groupedDocsRes, usersRes] = await Promise.allSettled([
        userDocumentService.listGroupedByUserId(),
        userService.list(),
      ]);

      const grouped = groupedDocsRes.status === 'fulfilled' ? groupedDocsRes.value : {};
      const users = usersRes.status === 'fulfilled' ? usersRes.value : [];
      const userMap = new Map(users.map((u) => [u.id, u]));

      const list: StudentWithDocs[] = [];
      Object.entries(grouped).forEach(([userId, docs]) => {
        const u = userMap.get(userId);
        if (u) {
          list.push({ user: u, docs });
        }
      });

      setStudentsWithDocs(list);
    } catch (err) {
      console.error('Failed to load documents for verification:', err);
      toast.error('Lỗi khi tải danh sách tài liệu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Securely load document blob for preview
  useEffect(() => {
    if (selectedPreviewDoc?.fileUrl) {
      setIsPreviewLoading(true);
      fileServeService.fetchSecureBlob(selectedPreviewDoc.fileUrl)
        .then((url) => setPreviewBlobUrl(url))
        .catch((err) => {
          console.error('Secure preview fetch failed, fallback to url:', err);
          setPreviewBlobUrl(fileServeService.getFileUrl(selectedPreviewDoc.fileUrl));
        })
        .finally(() => setIsPreviewLoading(false));
    } else {
      setPreviewBlobUrl(null);
    }
  }, [selectedPreviewDoc]);

  const handleApprove = async (docId: string) => {
    setIsProcessing(true);
    try {
      await userDocumentService.setDocumentStatus(docId, {
        status: 'APPROVED' as any,
      });
      toast.success('Duyệt tài liệu thành công');
      
      setStudentsWithDocs((prev) =>
        prev.map((item) => ({
          ...item,
          docs: item.docs.map((d) => 
            d.id === docId ? { ...d, status: 'APPROVED', rejectReason: undefined } : d
          )
        }))
      );
      setConfirmApproveDoc(null);
    } catch (e) {
      console.error('Failed to approve document:', e);
      toast.error('Duyệt tài liệu thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (docId: string) => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    setIsProcessing(true);
    try {
      await userDocumentService.setDocumentStatus(docId, {
        status: 'REJECTED' as any,
        rejectReason,
      });
      toast.success('Từ chối tài liệu thành công');

      setStudentsWithDocs((prev) =>
        prev.map((item) => ({
          ...item,
          docs: item.docs.map((d) => 
            d.id === docId ? { ...d, status: 'REJECTED', rejectReason } : d
          )
        }))
      );
      setRejectingDoc(null);
      setRejectReason('');
    } catch (e) {
      console.error('Failed to reject document:', e);
      toast.error('Thực hiện từ chối thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter students based on status and search query
  const filteredStudents = studentsWithDocs.filter((student) => {
    // Filter by status on student's documents
    if (filterStatus !== 'ALL') {
      const hasMatchingDoc = student.docs.some((doc) => {
        if (filterStatus === 'PENDING') return doc.status === 'PENDING';
        if (filterStatus === 'APPROVED') return doc.status === 'APPROVED';
        if (filterStatus === 'REJECTED') return doc.status === 'REJECTED';
        return false;
      });
      if (!hasMatchingDoc) return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const userName = student.user.fullName?.toLowerCase() || '';
      const userEmail = student.user.email?.toLowerCase() || '';
      const userPhone = student.user.phoneNumber?.toLowerCase() || '';
      return userName.includes(q) || userEmail.includes(q) || userPhone.includes(q);
    }
    return true;
  });

  const getStatusCounts = (status: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (status === 'ALL') return studentsWithDocs.length;
    return studentsWithDocs.filter((student) => {
      return student.docs.some((doc) => {
        if (status === 'PENDING') return doc.status === 'PENDING';
        if (status === 'APPROVED') return doc.status === 'APPROVED';
        if (status === 'REJECTED') return doc.status === 'REJECTED';
        return false;
      });
    }).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />

      <div className="relative p-4 sm:p-6 2xl:p-7">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <FileCheck2 className="h-3.5 w-3.5" />
              Document Approval
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Resident Documents
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Quản lý hồ sơ minh chứng sinh viên theo dạng thư mục. Duyệt CCCD và thẻ sinh viên.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition shadow-sm"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Sync API
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/35 p-4 backdrop-blur-sm shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setExpandedStudentId(null);
                }}
                className={cn(
                  'rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition',
                  filterStatus === status
                    ? 'bg-[#c3a26c] text-white shadow-sm'
                    : 'bg-white/40 text-stone-600 hover:bg-white/70'
                )}
              >
                {status === 'ALL' && 'Tất cả'}
                {status === 'PENDING' && 'Chờ duyệt'}
                {status === 'APPROVED' && 'Đã duyệt'}
                {status === 'REJECTED' && 'Từ chối'} ({getStatusCounts(status)})
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm họ tên, email, SĐT..."
              className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-4 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
          </div>
        </div>

        {/* Documents Folders (Students) */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Đang tải hồ sơ sinh viên từ hệ thống...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/20">
            <FileText className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium">Không tìm thấy hồ sơ sinh viên phù hợp.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStudents.map(({ user, docs }) => {
              const isExpanded = expandedStudentId === user.id;
              
              // Calculate summary status of student's folder
              const hasPending = docs.some(d => d.status === 'PENDING');
              const hasRejected = docs.some(d => d.status === 'REJECTED');
              const allApproved = docs.length > 0 && docs.every(d => d.status === 'APPROVED');

              return (
                <div
                  key={user.id}
                  className="overflow-hidden rounded-2xl border border-white/60 bg-white/40 shadow-sm transition-all duration-300"
                >
                  {/* Folder Header */}
                  <button
                    onClick={() => setExpandedStudentId(isExpanded ? null : user.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c3a26c]/15 text-[#c3a26c]">
                        {isExpanded ? <FolderOpen className="h-5 w-5" /> : <Folder className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-stone-800 text-base">{user.fullName || 'Thành viên mới'}</span>
                          <span className="text-[10px] text-stone-500 bg-white/60 px-2 py-0.5 rounded border">
                            {docs.length} tài liệu
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{user.email} • {user.phoneNumber || 'Không có SĐT'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Folder Status Summary */}
                      <span className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider border',
                        allApproved && 'bg-emerald-100 text-emerald-800 border-emerald-200',
                        hasPending && 'bg-amber-100 text-amber-800 border-amber-200',
                        hasRejected && 'bg-rose-100 text-rose-800 border-rose-200'
                      )}>
                        {allApproved && 'Hoàn tất'}
                        {hasPending && 'Chờ duyệt'}
                        {hasRejected && 'Từ chối'}
                      </span>

                      {isExpanded ? <ChevronDown className="h-5 w-5 text-stone-400" /> : <ChevronRight className="h-5 w-5 text-stone-400" />}
                    </div>
                  </button>

                  {/* Folder Contents (Expanded list of documents) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/20 border-t border-white/40 divide-y divide-white/20 px-4"
                      >
                        {docs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#c3a26c]" />
                                <span className="text-sm font-semibold text-stone-700">{doc.documentType}</span>
                              </div>
                              {doc.rejectReason && (
                                <p className="text-xs text-rose-600 mt-1 pl-6">
                                  <strong>Lý do từ chối:</strong> {doc.rejectReason}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pl-6 sm:pl-0">
                              <span className={cn(
                                'px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider',
                                doc.status === 'APPROVED' && 'bg-emerald-100 text-emerald-800 border-emerald-200',
                                doc.status === 'REJECTED' && 'bg-rose-100 text-rose-800 border-rose-200',
                                doc.status === 'PENDING' && 'bg-amber-100 text-amber-800 border-amber-200'
                              )}>
                                {doc.status}
                              </span>

                              <button
                                onClick={() => {
                                  setSelectedPreviewDoc(doc);
                                  setPreviewUser(user);
                                }}
                                className="flex items-center gap-1 rounded bg-white border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
                              >
                                <Eye className="h-3 w-3" />
                                Xem tài liệu
                              </button>

                              {doc.status === 'PENDING' && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setConfirmApproveDoc(doc)}
                                    disabled={isProcessing}
                                    className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => setRejectingDoc(doc)}
                                    disabled={isProcessing}
                                    className="rounded bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700 transition"
                                  >
                                    Từ chối
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Secure Document Preview Modal */}
      <AnimatePresence>
        {selectedPreviewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-lg text-stone-800">
                    {previewUser?.fullName} — {selectedPreviewDoc.documentType}
                  </h3>
                  <p className="text-xs text-stone-500">{previewUser?.email}</p>
                </div>
                <button
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="rounded-full p-2 text-stone-400 hover:bg-stone-100"
                >
                  ✕
                </button>
              </div>

              {selectedPreviewDoc.status === 'REJECTED' && selectedPreviewDoc.rejectReason && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <span className="font-bold">Lý do từ chối trước đó: </span>
                    <span>{selectedPreviewDoc.rejectReason}</span>
                  </div>
                </div>
              )}

              <div className="h-96 w-full rounded-2xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200 relative">
                {isPreviewLoading ? (
                  <div className="flex flex-col items-center gap-2 text-stone-500">
                    <Loader2 className="h-8 w-8 animate-spin text-[#c3a26c]" />
                    <span className="text-xs">Đang tải tệp tin bảo mật...</span>
                  </div>
                ) : previewBlobUrl ? (
                  <img
                    src={previewBlobUrl}
                    alt="Document preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-stone-400">Không có hình ảnh preview</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="rounded-xl border border-stone-300 px-6 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Approve Modal */}
      <AnimatePresence>
        {confirmApproveDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-base text-stone-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Xác nhận phê duyệt
              </h3>
              <p className="text-sm text-stone-600">
                Bạn có chắc chắn muốn duyệt tài liệu <strong>{confirmApproveDoc.documentType}</strong> này không? Học sinh sẽ nhận được trạng thái đã duyệt.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmApproveDoc(null)}
                  className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                  disabled={isProcessing}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => handleApprove(confirmApproveDoc.id)}
                  disabled={isProcessing}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition flex items-center gap-1.5"
                >
                  {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
                  Đồng ý duyệt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {rejectingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-base text-[#26231f] flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-600" />
                Từ chối tài liệu
              </h3>
              <p className="text-sm text-stone-600">
                Nhập lý do từ chối tài liệu <strong>{rejectingDoc.documentType}</strong>. Học sinh sẽ thấy lý do này để tải lên tài liệu mới chính xác hơn.
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do (ví dụ: Hình ảnh bị mờ, không khớp thông tin, CCCD hết hạn)..."
                className="w-full rounded-xl border border-stone-300 p-3 text-sm focus:border-rose-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setRejectingDoc(null);
                    setRejectReason('');
                  }}
                  className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                  disabled={isProcessing}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => handleReject(rejectingDoc.id)}
                  disabled={isProcessing}
                  className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition flex items-center gap-1.5"
                >
                  {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
                  Từ chối
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
