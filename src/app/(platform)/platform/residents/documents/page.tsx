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
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userDocumentService } from '@/services/userDocumentService';
import { userService } from '@/services/userService';
import { fileServeService } from '@/services/fileServeService';
import type { UserDocumentResponseDto, UserResponseDto } from '@/types/models';

interface DocumentWithUser {
  doc: UserDocumentResponseDto;
  user?: UserResponseDto;
}

export default function DocumentVerificationPage() {
  const [documents, setDocuments] = useState<DocumentWithUser[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentWithUser | null>(null);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
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

      const list: DocumentWithUser[] = [];
      Object.entries(grouped).forEach(([userId, docs]) => {
        const u = userMap.get(userId);
        docs.forEach((doc) => {
          list.push({ doc, user: u });
        });
      });

      setDocuments(list);
    } catch (err) {
      console.error('Failed to load documents for verification:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (docId: string) => {
    setIsProcessing(true);
    try {
      await userDocumentService.setDocumentStatus(docId, {
        status: 'APPROVED' as any,
      });
      setDocuments((prev) =>
        prev.map((item) =>
          item.doc.id === docId ? { ...item, doc: { ...item.doc, status: 'APPROVED' } } : item
        )
      );
    } catch (e) {
      console.error('Failed to approve document:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (docId: string) => {
    if (!rejectReason.trim()) return;
    setIsProcessing(true);
    try {
      await userDocumentService.setDocumentStatus(docId, {
        status: 'REJECTED' as any,
        rejectReason,
      });
      setDocuments((prev) =>
        prev.map((item) =>
          item.doc.id === docId
            ? { ...item, doc: { ...item.doc, status: 'REJECTED', rejectReason } }
            : item
        )
      );
      setRejectingDocId(null);
      setRejectReason('');
    } catch (e) {
      console.error('Failed to reject document:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredDocs = documents.filter((item) => {
    if (filterStatus !== 'ALL' && item.doc.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const userName = item.user?.fullName?.toLowerCase() || '';
      const userEmail = item.user?.email?.toLowerCase() || '';
      const docType = item.doc.documentType?.toLowerCase() || '';
      return userName.includes(q) || userEmail.includes(q) || docType.includes(q);
    }
    return true;
  });

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
              Verify student identity documents, student cards, and residency contracts.
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
          <div className="flex items-center gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition',
                  filterStatus === status
                    ? 'bg-[#c3a26c] text-white shadow-sm'
                    : 'bg-white/40 text-stone-600 hover:bg-white/70'
                )}
              >
                {status} ({documents.filter((d) => status === 'ALL' || d.doc.status === status).length})
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student name, email..."
              className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-4 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
          </div>
        </div>

        {/* Documents Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Loading documents from backend...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/20">
            <FileText className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium">No documents found matching the filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map(({ doc, user }) => (
              <div
                key={doc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-sm shadow-sm hover:border-[#c3a26c]/60 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c3a26c]/10 text-[#c3a26c]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-800 text-base">
                        {user?.fullName || 'Resident Applicant'}
                      </span>
                      <span className="text-xs font-mono text-stone-500 bg-white/60 px-2 py-0.5 rounded-md">
                        {doc.documentType}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{user?.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border',
                      doc.status === 'APPROVED' && 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      doc.status === 'REJECTED' && 'bg-rose-100 text-rose-800 border-rose-200',
                      doc.status === 'PENDING' && 'bg-amber-100 text-amber-800 border-amber-200'
                    )}
                  >
                    {doc.status}
                  </span>

                  <button
                    onClick={() => setSelectedPreviewDoc({ doc, user })}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    <Eye className="h-3.5 w-3.5 text-stone-500" />
                    Preview
                  </button>

                  {doc.status === 'PENDING' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApprove(doc.id)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectingDocId(doc.id)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition shadow-sm"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-stone-800">
                  {selectedPreviewDoc.user?.fullName} — {selectedPreviewDoc.doc.documentType}
                </h3>
                <p className="text-xs text-stone-500">{selectedPreviewDoc.user?.email}</p>
              </div>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="h-96 w-full rounded-2xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
              {selectedPreviewDoc.doc.fileUrl ? (
                <img
                  src={fileServeService.getFileUrl(selectedPreviewDoc.doc.fileUrl)}
                  alt="Document preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-sm text-stone-400">No file preview available</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-800">Reject Document</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection (e.g. Photo blurry, expired card)..."
              className="w-full rounded-xl border border-stone-300 p-3 text-sm focus:border-rose-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectingDocId(null);
                  setRejectReason('');
                }}
                className="rounded-xl border px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingDocId)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
