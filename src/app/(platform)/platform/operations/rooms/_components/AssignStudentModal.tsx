// app/(platform)/operations/rooms/_components/AssignStudentModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Search, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Student } from './types';

interface AssignStudentModalProps {
  isOpen: boolean;
  room: Room | null;
  unassignedStudents: Student[];
  onClose: () => void;
  onAssign: (studentId: string) => void;
}

export function AssignStudentModal({ isOpen, room, unassignedStudents, onClose, onAssign }: AssignStudentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  if (!isOpen || !room) return null;
  
  const availableSlots = room.capacity - room.students.length;
  
  const filteredStudents = unassignedStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.major.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAssign = () => {
    if (selectedStudentId) {
      onAssign(selectedStudentId);
      setSelectedStudentId(null);
      setSearchQuery('');
    }
  };
  
  const selectedStudent = unassignedStudents.find(s => s.id === selectedStudentId);
  
  return (
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
            className="relative w-full max-w-2xl rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Assign Student to Room {room.number}</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Room Info */}
              <div className="rounded-xl bg-stone-100/50 p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-500">Available slots</p>
                  <p className="text-xl font-semibold text-stone-950">{availableSlots} / {room.capacity}</p>
                </div>
                <div className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  availableSlots > 0 ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                )}>
                  {availableSlots > 0 ? `${availableSlots} spot(s) left` : 'Room full'}
                </div>
              </div>
              
              {availableSlots > 0 ? (
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search unassigned students by name, ID, or major..."
                      className="w-full rounded-xl border border-white/55 bg-white/40 pl-9 pr-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                    />
                  </div>
                  
                  {/* Student List */}
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudentId(student.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                            selectedStudentId === student.id
                              ? "border-[#c3a26c] bg-[#c3a26c]/10"
                              : "border-white/50 bg-white/30 hover:bg-white/40"
                          )}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/20">
                            <User className="h-5 w-5 text-[#c3a26c]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-950">{student.name}</p>
                            <p className="text-xs text-stone-500">{student.studentId} • {student.major} • {student.year}</p>
                          </div>
                          {selectedStudentId === student.id && (
                            <div className="h-5 w-5 rounded-full bg-[#c3a26c] flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-stone-500">
                        No unassigned students found
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Student Preview */}
                  {selectedStudent && (
                    <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/50 p-3">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-1">Selected Student</p>
                      <p className="font-semibold text-stone-950">{selectedStudent.name}</p>
                      <p className="text-xs text-stone-500">{selectedStudent.studentId} • {selectedStudent.major}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAssign}
                      disabled={!selectedStudentId}
                      className={cn(
                        "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
                        selectedStudentId ? "bg-[#c3a26c] hover:bg-[#b08f5a]" : "bg-stone-300 cursor-not-allowed"
                      )}
                    >
                      Assign Student
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-stone-500">This room is already full.</p>
                  <button
                    onClick={onClose}
                    className="mt-3 rounded-lg bg-stone-200 px-4 py-2 text-sm text-stone-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}