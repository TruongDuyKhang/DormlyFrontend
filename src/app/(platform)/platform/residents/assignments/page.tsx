// app/(platform)/residents/assignments/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { AssignmentTabs } from './_components/assignment-tabs';
import { StudentAssignmentCard } from './_components/student-assignment-card';
import { AutoAssignModal } from './_components/auto-assign-modal';
import { ManualAssignModal } from './_components/manual-assign-modal';
import { StudentAssignment, AvailableRoom } from './_components/types';
import { pendingStudents, availableRooms } from './_components/mockData';

type TabType = 'pending' | 'rejected' | 'all';

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
  const [showManualAssignModal, setShowManualAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentAssignment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [pendingList, setPendingList] = useState<StudentAssignment[]>(pendingStudents);
  const [assignedList, setAssignedList] = useState<StudentAssignment[]>([]);
  const [rejectedList, setRejectedList] = useState<StudentAssignment[]>([]);

  const getFilteredStudents = (): StudentAssignment[] => {
    if (activeTab === 'rejected') {
      return rejectedList;
    }
    if (activeTab === 'all') {
      return [...pendingList.filter(s => s.status === 'pending'), ...assignedList, ...rejectedList];
    }
    return pendingList.filter(s => s.status === 'pending');
  };

  const filteredStudents = getFilteredStudents();

  const counts = {
    pending: pendingList.filter(s => s.status === 'pending').length,
    rejected: rejectedList.length,
    all: pendingList.filter(s => s.status === 'pending').length + assignedList.length + rejectedList.length,
  };

  const handleAutoAssign = (studentId: string) => {
    const student = pendingList.find(s => s.id === studentId);
    if (!student) return;

    const room = availableRooms.find(r => r.availableSlots > 0);
    if (!room) {
      alert('No available rooms found!');
      return;
    }

    const assignedStudent: StudentAssignment = {
      ...student,
      status: 'assigned',
      assignedRoom: room.roomNumber,
      assignedBlock: room.block,
      assignedFloor: room.floor,
    };

    setPendingList(prev => prev.filter(s => s.id !== studentId));
    setAssignedList(prev => [...prev, assignedStudent]);
    setExpandedId(null);

    room.availableSlots -= 1;
    room.currentOccupants += 1;
  };

  const handleManualAssign = (student: StudentAssignment) => {
    setSelectedStudent(student);
    setShowManualAssignModal(true);
  };

  const handleConfirmManualAssign = (studentId: string, roomId: string) => {
    const student = pendingList.find(s => s.id === studentId);
    if (!student) return;

    const room = availableRooms.find(r => r.id === roomId);
    if (!room) return;

    const assignedStudent: StudentAssignment = {
      ...student,
      status: 'assigned',
      assignedRoom: room.roomNumber,
      assignedBlock: room.block,
      assignedFloor: room.floor,
    };

    setPendingList(prev => prev.filter(s => s.id !== studentId));
    setAssignedList(prev => [...prev, assignedStudent]);
    setShowManualAssignModal(false);
    setSelectedStudent(null);
    setExpandedId(null);

    room.availableSlots -= 1;
    room.currentOccupants += 1;
  };

  const handleReject = (studentId: string) => {
    const student = pendingList.find(s => s.id === studentId);
    if (!student) return;

    setPendingList(prev => prev.filter(s => s.id !== studentId));
    setRejectedList(prev => [...prev, { ...student, status: 'rejected' }]);
    setExpandedId(null);
  };

  const handleConfirmAutoAssignAll = (students: StudentAssignment[]) => {
    setIsProcessing(true);

    students.forEach((student) => {
      const room = availableRooms.find(r => r.availableSlots > 0);
      if (room) {
        const assignedStudent: StudentAssignment = {
          ...student,
          status: 'assigned',
          assignedRoom: room.roomNumber,
          assignedBlock: room.block,
          assignedFloor: room.floor,
        };
        room.availableSlots -= 1;
        room.currentOccupants += 1;
        setAssignedList(prev => [...prev, assignedStudent]);
        setPendingList(prev => prev.filter(s => s.id !== student.id));
      }
    });

    setIsProcessing(false);
    setShowAutoAssignModal(false);
    setExpandedId(null);
  };

  const totalPending = pendingList.filter(s => s.status === 'pending').length;

  // Determine if actions should be shown based on tab
  const showActions = activeTab === 'pending';

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
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5" />
                Room Assignment
              </div>
              <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
                Assign Rooms
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Review student preferences and assign rooms accordingly.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">
                {totalPending} students pending
              </span>
            </div>
          </div>

          {/* Tabs */}
          <AssignmentTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />

          {/* Student List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentAssignmentCard
                    key={student.id}
                    student={student}
                    isExpanded={expandedId === student.id}
                    onToggle={() => setExpandedId(expandedId === student.id ? null : student.id)}
                    onAutoAssign={handleAutoAssign}
                    onManualAssign={handleManualAssign}
                    onReject={handleReject}
                    isAssigned={student.status === 'assigned'}
                    showActions={showActions}
                  />
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-white/55 bg-white/32 px-5 py-16 text-center">
                  <div className="mb-4 flex justify-center">
                    <Sparkles className="h-10 w-10 text-stone-400" />
                  </div>
                  <p className="text-sm font-medium text-stone-600">
                    {activeTab === 'pending' && 'No pending students'}
                    {activeTab === 'rejected' && 'No rejected students'}
                    {activeTab === 'all' && 'No students found'}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Auto Assign Modal */}
      <AutoAssignModal
        isOpen={showAutoAssignModal}
        onClose={() => setShowAutoAssignModal(false)}
        students={pendingList.filter(s => s.status === 'pending')}
        rooms={availableRooms}
        onConfirm={handleConfirmAutoAssignAll}
        isProcessing={isProcessing}
      />

      {/* Manual Assign Modal */}
      <ManualAssignModal
        isOpen={showManualAssignModal}
        onClose={() => {
          setShowManualAssignModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        rooms={availableRooms}
        onConfirm={handleConfirmManualAssign}
      />
    </>
  );
}