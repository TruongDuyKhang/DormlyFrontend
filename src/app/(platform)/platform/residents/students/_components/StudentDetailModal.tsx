// app/(platform)/residents/students/_components/StudentDetailModal.tsx
'use client';

import { motion } from 'framer-motion';
import { X, User, Home, Mail, Phone, GraduationCap, Calendar, Clock, BookOpen, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudentWithLocation } from './types';

interface StudentDetailModalProps {
  student: StudentWithLocation | null;
  onClose: () => void;
  onViewRoom: () => void;
}

export function StudentDetailModal({ student, onClose, onViewRoom }: StudentDetailModalProps) {
  if (!student) return null;

  return (
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
                <p className="text-sm text-stone-500 font-mono">{student.studentId}</p>
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
                <span className="text-sm">
                  {student.blockName} • Floor {student.floorLevel} • Room {student.roomNumber}
                </span>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Personal Information</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                  <span className="text-xs text-stone-500">Date of Birth</span>
                  <span className="text-sm font-medium text-stone-950">{student.dateOfBirth}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                  <span className="text-xs text-stone-500">Nationality</span>
                  <span className="text-sm font-medium text-stone-950">{student.nationality}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                  <span className="text-xs text-stone-500">ID Card Number</span>
                  <span className="text-sm font-medium text-stone-950 font-mono">{student.idCardNumber}</span>
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
                  <p className="text-sm font-medium text-stone-950 mt-1">{student.joinedDate}</p>
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
                  <span className="text-sm text-stone-700">{student.phone}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Emergency Contact</p>
              <div className="rounded-xl bg-amber-50/70 border border-amber-200/50 p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-base font-semibold text-stone-950">{student.emergencyName}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{student.emergencyRelationship}</p>
                  </div>
                  <a 
                    href={`tel:${student.emergencyContact}`} 
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-sm font-medium text-[#c3a26c] hover:bg-white transition"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {student.emergencyContact}
                  </a>
                </div>
              </div>
            </div>

            {/* Documents Summary */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Documents</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                  <span className="text-sm text-stone-700">Student ID Card</span>
                  <span className="text-xs font-medium text-emerald-600">Verified</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                  <span className="text-sm text-stone-700">Health Declaration</span>
                  <span className="text-xs font-medium text-emerald-600">Verified</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-2.5">
                  <span className="text-sm text-stone-700">Student Certificate</span>
                  <span className="text-xs font-medium text-amber-600">Pending</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewRoom}
                className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                View Room
              </motion.button>
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
  );
}