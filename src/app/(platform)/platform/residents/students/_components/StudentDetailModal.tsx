// app/(platform)/residents/students/_components/StudentDetailModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Home, Mail, Phone, GraduationCap, Calendar, Clock, BookOpen, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentWithLocation } from './types';
import { userDocumentService } from '@/services/userDocumentService';
import { fileServeService } from '@/services/fileServeService';
import type { UserDocumentResponseDto } from '@/types/models';

interface StudentDetailModalProps {
  student: StudentWithLocation | null;
  onClose: () => void;
  onViewRoom: () => void;
}

export function StudentDetailModal({ student, onClose, onViewRoom }: StudentDetailModalProps) {
  const [documents, setDocuments] = useState<UserDocumentResponseDto[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDocType, setPreviewDocType] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    if (student?.id) {
      setIsLoadingDocs(true);
      userDocumentService.getDocumentsByUserId(student.id)
        .then((res) => {
          setDocuments(res);
        })
        .catch((err) => console.error('Failed to fetch user documents:', err))
        .finally(() => setIsLoadingDocs(false));
    }
  }, [student?.id]);

  if (!student) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handlePreviewDoc = async (doc: UserDocumentResponseDto) => {
    if (!doc.fileUrl) return;
    setIsPreviewLoading(true);
    setPreviewDocType(doc.documentType);
    try {
      const secureUrl = await fileServeService.fetchSecureBlob(doc.fileUrl);
      setPreviewUrl(secureUrl);
    } catch (e) {
      console.error('Failed to load secure document blob:', e);
      // Fallback
      setPreviewUrl(fileServeService.getFileUrl(doc.fileUrl));
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const isAssigned = student.roomNumber && student.roomNumber !== 'Chưa xếp phòng';

  return (
    <>
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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#c3a26c]/30">
                <User className="h-7 w-7 text-[#c3a26c]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">{student.name}</h2>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-sm text-stone-500 font-mono">{student.studentId || 'No Student ID'}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/40">
            
            {/* LEFT COLUMN */}
            <div className="p-5 space-y-5">
              {/* Location */}
              <div className="rounded-xl bg-white/50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-2">Current Residence</p>
                <div className="flex items-center gap-2 text-stone-700">
                  <Home className="h-4 w-4 text-[#c3a26c] shrink-0" />
                  <span className="text-sm font-medium">
                    {isAssigned ? (
                      `${student.blockName} • Floor ${student.floorLevel} • Room ${student.roomNumber}`
                    ) : (
                      'Chưa xếp phòng (Pending Room Assignment)'
                    )}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Personal Information</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                    <span className="text-xs text-stone-500">Date of Birth</span>
                    <span className="text-sm font-medium text-stone-950">{formatDate(student.dateOfBirth)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                    <span className="text-xs text-stone-500">Nationality</span>
                    <span className="text-sm font-medium text-stone-950">{student.nationality || 'Việt Nam'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                    <span className="text-xs text-stone-500">ID Card Number</span>
                    <span className="text-sm font-medium text-stone-950 font-mono">{student.idCardNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Academic Information</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/40 px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-stone-500" />
                      <span className="text-xs text-stone-500">Major</span>
                    </div>
                    <p className="text-sm font-medium text-stone-950 mt-1 truncate">{student.major}</p>
                  </div>
                  <div className="rounded-lg bg-white/40 px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-stone-500" />
                      <span className="text-xs text-stone-500">Year</span>
                    </div>
                    <p className="text-sm font-medium text-stone-950 mt-1">{student.year}</p>
                  </div>
                  <div className="rounded-lg bg-white/40 px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-stone-500" />
                      <span className="text-xs text-stone-500">Joined</span>
                    </div>
                    <p className="text-sm font-medium text-stone-950 mt-1">{formatDate(student.joinedDate)}</p>
                  </div>
                  <div className="rounded-lg bg-white/40 px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-stone-500" />
                      <span className="text-xs text-stone-500">Status</span>
                    </div>
                    <p className="text-sm font-medium text-emerald-600 mt-1 capitalize">{student.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="p-5 space-y-5">
              {/* Contact Information */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Contact Information</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-lg bg-white/40 px-3 py-2.5">
                    <Mail className="h-4 w-4 text-stone-500 shrink-0" />
                    <span className="text-sm text-stone-700 truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white/40 px-3 py-2.5">
                    <Phone className="h-4 w-4 text-stone-500 shrink-0" />
                    <span className="text-sm text-stone-700">{student.phone || 'Chưa cung cấp'}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Emergency Contact</p>
                <div className="rounded-xl bg-amber-50/70 border border-amber-200/50 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-base font-semibold text-stone-950">Phụ huynh sinh viên</p>
                      <p className="text-xs text-stone-500 mt-0.5">Bố / Mẹ</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-sm font-medium text-[#c3a26c]">
                      <Phone className="h-3.5 w-3.5" />
                      Liên hệ khẩn cấp
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents Summary */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Documents</p>
                {isLoadingDocs ? (
                  <div className="flex items-center justify-center py-6 text-stone-500 gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#c3a26c]" />
                    <span className="text-xs">Loading documents...</span>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="rounded-lg bg-white/20 border border-dashed border-stone-300 p-4 text-center text-stone-400 text-xs">
                    No documents found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((d) => (
                      <div key={d.id} className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2 border border-white/30">
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-xs font-semibold text-stone-800">{d.documentType}</span>
                          {d.rejectReason && (
                            <p className="text-[10px] text-rose-600 mt-0.5 truncate">Reason: {d.rejectReason}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider',
                            d.status === 'APPROVED' && 'bg-emerald-100 text-emerald-800 border-emerald-200',
                            d.status === 'REJECTED' && 'bg-rose-100 text-rose-800 border-rose-200',
                            d.status === 'PENDING' && 'bg-amber-100 text-amber-800 border-amber-200'
                          )}>
                            {d.status}
                          </span>
                          <button
                            onClick={() => handlePreviewDoc(d)}
                            className="rounded bg-white border border-stone-300 px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-50 transition"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                {isAssigned && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onViewRoom}
                    className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    View Room
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Document Image Preview Sub-modal */}
      <AnimatePresence>
        {previewUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-lg text-stone-800">
                  {previewDocType} — {student.name}
                </h3>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="rounded-full p-2 text-stone-400 hover:bg-stone-100"
                >
                  ✕
                </button>
              </div>
              <div className="h-[450px] w-full rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
                {isPreviewLoading ? (
                  <div className="flex flex-col items-center gap-2 text-stone-500">
                    <Loader2 className="h-8 w-8 animate-spin text-[#c3a26c]" />
                    <span className="text-xs">Fetching secure file...</span>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Document file preview"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="rounded-xl border border-stone-300 px-6 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}