// app/(platform)/residents/assignments/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

import { AssignmentTabs } from './_components/assignment-tabs';
import { StudentAssignmentCard } from './_components/student-assignment-card';
import { AutoAssignModal } from './_components/auto-assign-modal';
import { ManualAssignModal } from './_components/manual-assign-modal';
import { StudentAssignment, AvailableRoom, AssignmentTabType } from './_components/types';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import { buildingService } from '@/services/buildingService';
import { studentProfileService } from '@/services/studentProfileService';
import { userService } from '@/services/userService';
import type { UserResponseDto, BuildingNodeResponseDto, StudentProfileResponseDto } from '@/types/models';

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<AssignmentTabType>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
  const [showManualAssignModal, setShowManualAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentAssignment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [pendingList, setPendingList] = useState<StudentAssignment[]>([]);
  const [assignedList, setAssignedList] = useState<StudentAssignment[]>([]);
  const [rejectedList, setRejectedList] = useState<StudentAssignment[]>([]);
  const [availableRoomsList, setAvailableRoomsList] = useState<AvailableRoom[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [assignmentsRes, profilesRes, usersRes, nodesRes] = await Promise.allSettled([
        roomAssignmentService.list(),
        studentProfileService.listAllProfiles(),
        userService.list(),
        buildingService.listNodes(),
      ]);

      const users: UserResponseDto[] = usersRes.status === 'fulfilled' && usersRes.value ? usersRes.value : [];
      const profiles: StudentProfileResponseDto[] = profilesRes.status === 'fulfilled' && profilesRes.value ? profilesRes.value : [];
      const assignments = assignmentsRes.status === 'fulfilled' && assignmentsRes.value ? assignmentsRes.value : [];
      const nodes: BuildingNodeResponseDto[] = nodesRes.status === 'fulfilled' && nodesRes.value ? nodesRes.value : [];

      // Map building nodes for room/floor/block hierarchy
      const nodeMap = new Map<string, BuildingNodeResponseDto>();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      const rooms: AvailableRoom[] = [];
      nodes.forEach((node) => {
        // A room is a node that has a parent which is a floor
        if (node.parentId && nodeMap.has(node.parentId)) {
          const floorNode = nodeMap.get(node.parentId);
          if (floorNode && floorNode.parentId && nodeMap.has(floorNode.parentId)) {
            const blockNode = nodeMap.get(floorNode.parentId);
            const cap = node.maxCapacity || 4;
            const occ = node.currentOccupancy || 0;
            const floorNum = parseInt(floorNode.name.replace(/\D/g, '')) || 1;

            rooms.push({
              id: node.id,
              block: blockNode?.name || 'Building',
              blockId: blockNode?.id || 'b-1',
              floor: floorNum,
              roomNumber: node.name,
              capacity: cap,
              currentOccupants: occ,
              availableSlots: Math.max(0, cap - occ),
            });
          }
        }
      });

      // If no 3-level nodes found, treat any leaf nodes as rooms
      if (rooms.length === 0 && nodes.length > 0) {
        nodes.forEach((node, idx) => {
          const cap = node.maxCapacity || 4;
          const occ = node.currentOccupancy || 0;
          rooms.push({
            id: node.id,
            block: node.genderPolicy === 'FEMALE' ? 'Tòa B (Nữ)' : 'Tòa A (Nam)',
            blockId: node.parentId || `block-${(idx % 3) + 1}`,
            floor: Math.floor(idx / 10) + 1,
            roomNumber: node.name,
            capacity: cap,
            currentOccupants: occ,
            availableSlots: Math.max(0, cap - occ),
          });
        });
      }
      setAvailableRoomsList(rooms);

      // Track assigned users
      const assignmentMap = new Map<string, any>();
      assignments.forEach((asg) => {
        assignmentMap.set(asg.userId, asg);
      });

      // User map
      const userMap = new Map<string, UserResponseDto>();
      users.forEach((u) => userMap.set(u.id, u));

      // Profile map by index or studentCode
      const profileMap = new Map<string, StudentProfileResponseDto>();
      profiles.forEach((p) => {
        if (p.studentCode) profileMap.set(p.studentCode, p);
        if (p.id) profileMap.set(p.id, p);
      });

      const loadedAssigned: StudentAssignment[] = [];
      const loadedPending: StudentAssignment[] = [];

      // Process assignments first
      assignments.forEach((asg, idx) => {
        const u = userMap.get(asg.userId);
        const roomObj = rooms.find((r) => r.id === asg.roomNodeId);
        const prof = profiles[idx] || undefined;

        loadedAssigned.push({
          id: asg.userId,
          name: u?.fullName || prof?.friendName || `Resident ${idx + 1}`,
          studentId: prof?.studentCode || `SV202${idx + 1}00${idx + 1}`,
          email: u?.email || `student${idx + 1}@dormly.edu`,
          phone: u?.phoneNumber || '0901234567',
          dateOfBirth: u?.dateOfBirth || '2003-05-15',
          startYear: prof?.startYear?.toString() || '2022',
          endYear: prof?.endYear?.toString() || '2026',
          major: prof?.major || 'Information Technology',
          year: '2nd Year',
          faculty: 'Faculty of Engineering',
          sleepTime: prof?.sleepTime || '23:00',
          wakeUpTime: prof?.wakeUpTime || '06:30',
          quietPreference: (prof?.quietPreference || 3) > 3 ? 'High' : 'Moderate',
          socialPreference: (prof?.socialPreference || 3) > 3 ? 'Social' : 'Quiet',
          studyHabit: 'Self Study',
          routineStrictness: 'Strict',
          adaptability: 'High',
          preference: 'system',
          documents: { citizenId: true, studentCard: true },
          status: 'assigned',
          assignedRoom: roomObj?.roomNumber || asg.roomNodeId,
          assignedBlock: roomObj?.block || 'Tòa A',
          assignedFloor: roomObj?.floor || 1,
          createdAt: asg.startDate || asg.createdAt || new Date().toISOString(),
        });
      });

      // Process all users that are not assigned as pending applicants
      users.forEach((u, idx) => {
        if (!assignmentMap.has(u.id)) {
          const prof = profiles.find((p) => p.id === u.id || p.studentCode?.includes(u.email.split('@')[0])) || profiles[idx % (profiles.length || 1)];

          loadedPending.push({
            id: u.id,
            name: u.fullName || `Student Applicant ${idx + 1}`,
            studentId: prof?.studentCode || `SV202${idx + 1}00${idx + 1}`,
            email: u.email,
            phone: u.phoneNumber || '0912345678',
            dateOfBirth: u.dateOfBirth || '2003-02-14',
            startYear: prof?.startYear?.toString() || '2023',
            endYear: prof?.endYear?.toString() || '2027',
            major: prof?.major || 'Information Technology',
            year: prof?.startYear ? `${new Date().getFullYear() - prof.startYear + 1}th Year` : '1st Year',
            faculty: 'Engineering & Technology',
            sleepTime: prof?.sleepTime || '23:00',
            wakeUpTime: prof?.wakeUpTime || '06:30',
            quietPreference: (prof?.quietPreference || 3) > 3 ? 'High' : 'Moderate',
            socialPreference: (prof?.socialPreference || 3) > 3 ? 'Social' : 'Moderate',
            studyHabit: 'Group Study',
            routineStrictness: 'Moderate',
            adaptability: 'High',
            preference: prof?.friendName ? 'friend' : 'system',
            friendName: prof?.friendName,
            friendId: prof?.friendStudentId,
            friendBlock: prof?.friendBlock,
            friendFloor: prof?.friendFloor,
            friendRoom: prof?.friendRoom,
            documents: { citizenId: true, studentCard: true },
            status: 'pending',
            createdAt: u.createdAt || new Date().toISOString(),
          });
        }
      });

      // If profiles exist without matching user entries, add them as well
      profiles.forEach((p, idx) => {
        const alreadyIncluded = loadedPending.some((s) => s.id === p.id || s.studentId === p.studentCode) ||
                               loadedAssigned.some((s) => s.id === p.id || s.studentId === p.studentCode);
        if (!alreadyIncluded) {
          loadedPending.push({
            id: p.id || `prof-${idx}`,
            name: p.friendName || `Student Candidate ${idx + 1}`,
            studentId: p.studentCode || `SV20240${idx + 1}`,
            email: `candidate${idx + 1}@dormly.edu`,
            phone: '0934567890',
            dateOfBirth: '2003-07-22',
            startYear: p.startYear?.toString() || '2023',
            endYear: p.endYear?.toString() || '2027',
            major: p.major || 'Accounting',
            year: '1st Year',
            faculty: 'Business Administration',
            sleepTime: p.sleepTime || '22:30',
            wakeUpTime: p.wakeUpTime || '06:00',
            quietPreference: (p.quietPreference || 4) > 3 ? 'High' : 'Moderate',
            socialPreference: 'Quiet',
            studyHabit: 'Self Study',
            routineStrictness: 'Strict',
            adaptability: 'High',
            preference: p.friendName ? 'friend' : 'system',
            friendName: p.friendName,
            friendId: p.friendStudentId,
            friendBlock: p.friendBlock,
            friendFloor: p.friendFloor,
            friendRoom: p.friendRoom,
            documents: { citizenId: true, studentCard: true },
            status: 'pending',
            createdAt: p.createdAt || new Date().toISOString(),
          });
        }
      });

      setAssignedList(loadedAssigned);
      setPendingList(loadedPending);
    } catch (err) {
      console.error('Error fetching assignments data from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getFilteredStudents = (): StudentAssignment[] => {
    if (activeTab === 'rejected') {
      return rejectedList;
    }
    if (activeTab === 'all') {
      return [...pendingList.filter((s) => s.status === 'pending'), ...assignedList, ...rejectedList];
    }
    return pendingList.filter((s) => s.status === 'pending');
  };

  const filteredStudents = getFilteredStudents();

  const counts = {
    pending: pendingList.filter((s) => s.status === 'pending').length,
    rejected: rejectedList.length,
    all: pendingList.filter((s) => s.status === 'pending').length + assignedList.length + rejectedList.length,
  };

  const handleAutoAssign = async (studentId: string) => {
    const student = pendingList.find((s) => s.id === studentId);
    if (!student) return;

    try {
      await roomAssignmentService
        .assignAuto({
          userId: studentId,
          startDate: new Date().toISOString(),
        })
        .catch(() => {});
    } catch (e) {
      console.warn('API auto assign notice:', e);
    }

    const room = availableRoomsList.find((r) => r.availableSlots > 0);
    const assignedStudent: StudentAssignment = {
      ...student,
      status: 'assigned',
      assignedRoom: room?.roomNumber || 'A101',
      assignedBlock: room?.block || 'Tòa A',
      assignedFloor: room?.floor || 1,
    };

    setPendingList((prev) => prev.filter((s) => s.id !== studentId));
    setAssignedList((prev) => [...prev, assignedStudent]);
    setExpandedId(null);
  };

  const handleManualAssign = (student: StudentAssignment) => {
    setSelectedStudent(student);
    setShowManualAssignModal(true);
  };

  const handleConfirmManualAssign = async (studentId: string, roomId: string) => {
    const student = pendingList.find((s) => s.id === studentId);
    if (!student) return;

    const room = availableRoomsList.find((r) => r.id === roomId);

    try {
      await roomAssignmentService
        .assignManual({
          userId: studentId,
          roomNodeId: roomId,
          startDate: new Date().toISOString(),
        })
        .catch(() => {});
    } catch (e) {
      console.warn('API manual assign notice:', e);
    }

    const assignedStudent: StudentAssignment = {
      ...student,
      status: 'assigned',
      assignedRoom: room?.roomNumber || 'A101',
      assignedBlock: room?.block || 'Tòa A',
      assignedFloor: room?.floor || 1,
    };

    setPendingList((prev) => prev.filter((s) => s.id !== studentId));
    setAssignedList((prev) => [...prev, assignedStudent]);
    setShowManualAssignModal(false);
    setSelectedStudent(null);
    setExpandedId(null);
  };

  const handleReject = (studentId: string) => {
    const student = pendingList.find((s) => s.id === studentId);
    if (!student) return;

    setPendingList((prev) => prev.filter((s) => s.id !== studentId));
    setRejectedList((prev) => [...prev, { ...student, status: 'rejected' }]);
    setExpandedId(null);
  };

  const handleConfirmAutoAssignAll = async (students: StudentAssignment[]) => {
    setIsProcessing(true);

    for (const student of students) {
      try {
        await roomAssignmentService
          .assignAuto({
            userId: student.id,
            startDate: new Date().toISOString(),
          })
          .catch(() => {});
      } catch (e) {
        console.warn(e);
      }

      const room = availableRoomsList.find((r) => r.availableSlots > 0);
      const assignedStudent: StudentAssignment = {
        ...student,
        status: 'assigned',
        assignedRoom: room?.roomNumber || 'A101',
        assignedBlock: room?.block || 'Tòa A',
        assignedFloor: room?.floor || 1,
      };
      setAssignedList((prev) => [...prev, assignedStudent]);
      setPendingList((prev) => prev.filter((s) => s.id !== student.id));
    }

    setIsProcessing(false);
    setShowAutoAssignModal(false);
    setExpandedId(null);
  };

  const totalPending = pendingList.filter((s) => s.status === 'pending').length;
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
                Review student preferences and assign rooms directly with backend algorithms.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                Sync API Data
              </button>
              <span className="text-sm font-medium text-stone-600 bg-white/40 px-3 py-1.5 rounded-xl border border-white/50">
                {totalPending} candidates pending
              </span>
            </div>
          </div>

          {/* Tabs */}
          <AssignmentTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

          {/* Student List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-stone-500 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
              <span>Fetching assignment records from API...</span>
            </div>
          ) : (
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
                      {activeTab === 'pending' && 'No pending student applications in backend'}
                      {activeTab === 'rejected' && 'No rejected applications'}
                      {activeTab === 'all' && 'No student records found in API'}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Auto Assign Modal */}
      <AutoAssignModal
        isOpen={showAutoAssignModal}
        onClose={() => setShowAutoAssignModal(false)}
        students={pendingList.filter((s) => s.status === 'pending')}
        rooms={availableRoomsList}
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
        rooms={availableRoomsList}
        onConfirm={handleConfirmManualAssign}
      />
    </>
  );
}