// app/(platform)/residents/assignments/_components/student-assignment-card.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  ChevronRight, 
  Mail, 
  GraduationCap, 
  Sparkles, 
  UserPlus, 
  Check, 
  X, 
  Building2,
  Clock,
  Phone,
  Calendar,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentAssignment } from './types';

interface StudentAssignmentCardProps {
  student: StudentAssignment;
  isExpanded: boolean;
  onToggle: () => void;
  onAutoAssign: (studentId: string) => void;
  onManualAssign: (student: StudentAssignment) => void;
  onReject: (studentId: string) => void;
  isAssigned?: boolean;
  showActions?: boolean;
}

export function StudentAssignmentCard({
  student,
  isExpanded,
  onToggle,
  onAutoAssign,
  onManualAssign,
  onReject,
  isAssigned = false,
  showActions = true,
}: StudentAssignmentCardProps) {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showConfirmAutoAssign, setShowConfirmAutoAssign] = useState(false);

  const handleReject = () => {
    if (showRejectReason && rejectReason.trim()) {
      onReject(student.id);
      setShowRejectReason(false);
      setRejectReason('');
    } else {
      setShowRejectReason(true);
    }
  };

  const handleAutoAssignClick = () => {
    setShowConfirmAutoAssign(true);
  };

  const confirmAutoAssign = () => {
    onAutoAssign(student.id);
    setShowConfirmAutoAssign(false);
  };

  const getPreferenceLabel = () => {
    if (student.preference === 'friend') {
      return `Live with: ${student.friendName}`;
    }
    return 'System assignment';
  };


  const isMissingStudentId = !student.studentId || student.studentId.trim() === '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[1.5rem] border border-white/55 bg-white/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl transition-all duration-300 hover:border-white/70"
      >
        {/* Header */}
        <motion.button
          onClick={onToggle}
          className="w-full px-5 py-4 text-left transition-colors hover:bg-white/20"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <div className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center font-semibold text-white shrink-0',
                isAssigned ? 'bg-emerald-500/80' : 'bg-amber-500/80'
              )}>
                {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold tracking-tight text-stone-950 truncate">{student.name}</h3>
                  {isMissingStudentId && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                      <AlertCircle className="h-3 w-3" />
                      Missing ID
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  {student.studentId ? (
                    <span className="font-mono">{student.studentId}</span>
                  ) : (
                    <span className="font-mono text-red-500">No Student ID</span>
                  )}
                  <span className="text-stone-300">•</span>
                  <GraduationCap className="h-3 w-3" />
                  {student.major}
                  <span className="text-stone-300">•</span>
                  <span>{student.year}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="hidden text-right md:block">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Preference</p>
                <p className="mt-1 text-xs font-medium text-stone-700">{getPreferenceLabel()}</p>
              </div>
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="h-5 w-5 text-stone-400" />
              </motion.div>
            </div>
          </div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="border-t border-white/30"
            >
              <div className="space-y-4 px-5 py-5">
                {/* Student Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/30 px-3 py-2.5">
                    <p className="text-xs text-stone-500 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                    <p className="mt-1 text-sm font-medium text-stone-900">{student.email}</p>
                  </div>
                  <div className="rounded-lg bg-white/30 px-3 py-2.5">
                    <p className="text-xs text-stone-500 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</p>
                    <p className="mt-1 text-sm font-medium text-stone-900">{student.phone}</p>
                  </div>
                  <div className="rounded-lg bg-white/30 px-3 py-2.5">
                    <p className="text-xs text-stone-500 flex items-center gap-1"><Calendar className="h-3 w-3" /> Date of Birth</p>
                    <p className="mt-1 text-sm font-medium text-stone-900">{student.dateOfBirth}</p>
                  </div>
                  <div className="rounded-lg bg-white/30 px-3 py-2.5">
                    <p className="text-xs text-stone-500 flex items-center gap-1"><BookOpen className="h-3 w-3" /> Faculty</p>
                    <p className="mt-1 text-sm font-medium text-stone-900">{student.faculty}</p>
                  </div>
                  <div className="rounded-lg bg-white/30 px-3 py-2.5">
                    <p className="text-xs text-stone-500">Student ID</p>
                    <p className={cn(
                      'mt-1 text-sm font-medium',
                      student.studentId ? 'text-stone-900' : 'text-red-500'
                    )}>
                      {student.studentId || 'Missing Student ID'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/30 px-3 py-2.5">
                    <p className="text-xs text-stone-500">Academic Year</p>
                    <p className="mt-1 text-sm font-medium text-stone-900">{student.startYear} - {student.endYear}</p>
                  </div>
                  <div className="rounded-lg bg-white/30 px-3 py-2.5">
                    <p className="text-xs text-stone-500">Documents</p>
                    <div className="mt-1 flex gap-3">
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                        <img src="/check-circle.svg" alt="Verified" className="h-4 w-4" />
                        Citizen ID
                      </span>
                      <span className={cn(
                        'text-xs font-medium flex items-center gap-1',
                        student.documents.studentCard ? 'text-emerald-600' : 'text-red-500'
                      )}>
                        <img src={student.documents.studentCard ? '/check-circle.svg' : '/x-circle.svg'} alt="Status" className="h-4 w-4" />
                        Student Card
                      </span>
                    </div>
                  </div>
                </div>

                {/* Friend Request */}
                {student.preference === 'friend' && student.friendName && (
                  <div className="rounded-lg bg-emerald-50/50 border border-emerald-200/60 px-3 py-2.5">
                    <p className="text-xs text-emerald-700 flex items-center gap-1"><UserPlus className="h-3 w-3" /> Friend Request</p>
                    <div className="mt-1 grid grid-cols-2 gap-1 text-sm">
                      <span><strong>Name:</strong> {student.friendName}</span>
                      <span><strong>ID:</strong> {student.friendId || 'Not provided'}</span>
                      <span><strong>Block:</strong> {student.friendBlock}</span>
                      <span><strong>Floor:</strong> {student.friendFloor}</span>
                      <span className="col-span-2"><strong>Room:</strong> {student.friendRoom}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {showActions && (
                  <>
                    {!isAssigned ? (
                      <div className="flex gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAutoAssignClick}
                          className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Auto Assign
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onManualAssign(student)}
                          className="flex-1 rounded-xl border border-stone-300 bg-white/40 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-white/60 transition flex items-center justify-center gap-2"
                        >
                          <Building2 className="h-4 w-4" />
                          Manual Assign
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleReject}
                          className="flex-1 rounded-xl border border-red-300 bg-white/40 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 transition flex items-center justify-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50/50 px-4 py-3">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-emerald-700">
                          Assigned to <strong>{student.assignedBlock}{student.assignedFloor} - {student.assignedRoom}</strong>
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Reject Reason Input */}
                {showRejectReason && !isAssigned && showActions && (
                  <div className="rounded-xl border border-red-200/60 bg-red-50/40 px-4 py-3">
                    <p className="text-xs font-semibold text-red-700 mb-2">Rejection Reason</p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      className="w-full rounded-lg border border-red-200 bg-white/60 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                      rows={2}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          if (rejectReason.trim()) {
                            onReject(student.id);
                            setShowRejectReason(false);
                            setRejectReason('');
                          }
                        }}
                        className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectReason(false);
                          setRejectReason('');
                        }}
                        className="rounded-lg border border-stone-300 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirm Auto Assign Modal - English */}
      <AnimatePresence>
        {showConfirmAutoAssign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-5 border-b border-white/40">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-[#c3a26c]" />
                  <h2 className="text-xl font-semibold text-stone-950">Confirm Auto Assign</h2>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  Are you sure you want to auto assign <strong>{student.name}</strong> to a room?
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">This action will:</p>
                    <ul className="mt-2 text-sm text-amber-700 space-y-1">
                      <li>• Assign a room based on student preferences</li>
                      <li>• Update room occupancy status</li>
                      <li>• Cannot be undone after confirmation</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/40 p-4 bg-white/20 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmAutoAssign(false)}
                  className="rounded-xl border border-stone-300 bg-white/50 px-6 py-2.5 text-sm font-medium text-stone-700 hover:bg-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAutoAssign}
                  className="rounded-xl bg-[#c3a26c] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#b08f5a] transition flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}