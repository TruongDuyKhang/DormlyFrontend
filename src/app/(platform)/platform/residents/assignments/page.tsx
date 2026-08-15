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
import { userDocumentService } from '@/services/userDocumentService';
import type { UserResponseDto, BuildingNodeResponseDto, StudentProfileResponseDto } from '@/types/models';
import { toast } from 'sonner';

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
      const [assignmentsRes, profilesRes, usersRes, nodesRes, groupedDocsRes] = await Promise.allSettled([
        roomAssignmentService.list(),
        studentProfileService.listAllProfiles(),
        userService.list(),
        buildingService.listNodes(),
        userDocumentService.listGroupedByUserId(),
      ]);

      const users: UserResponseDto[] = usersRes.status === 'fulfilled' && usersRes.value ? usersRes.value : [];
      const profiles: StudentProfileResponseDto[] = profilesRes.status === 'fulfilled' && profilesRes.value ? profilesRes.value : [];
      const assignments = assignmentsRes.status === 'fulfilled' && assignmentsRes.value ? assignmentsRes.value : [];
      const nodes: BuildingNodeResponseDto[] = nodesRes.status === 'fulfilled' && nodesRes.value ? nodesRes.value : [];
      const groupedDocs = groupedDocsRes.status === 'fulfilled' && groupedDocsRes.value ? groupedDocsRes.value : {};

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

      const loadedAssigned: StudentAssignment[] = [];
      const loadedPending: StudentAssignment[] = [];
      const loadedRejected: StudentAssignment[] = [];

      // Process assignments first
      assignments.forEach((asg, idx) => {
        const u = userMap.get(asg.userId);
        const roomObj = rooms.find((r) => r.id === asg.roomNodeId);
        const prof = profiles.find((p) => p.id === asg.userId || (u && p.studentCode?.includes(u.email.split('@')[0])));

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
          year: prof?.startYear ? `${new Date().getFullYear() - prof.startYear + 1}th Year` : '2nd Year',
          faculty: 'Faculty of Engineering',
          sleepTime: prof?.sleepTime || '23:00',
          wakeUpTime: prof?.wakeUpTime || '06:30',
          quietPreference: (prof?.quietPreference || 3) > 3 ? 'High' : 'Moderate',
          socialPreference: (prof?.socialPreference || 3) > 3 ? 'Social' : 'Quiet',
          studyHabit: 'Self Study',
          routineStrictness: 'Strict',
          adaptability: 'High',
          preference: prof?.roommatePreference === 'friend' ? 'friend' : 'system',
          friendName: prof?.friendName,
          friendId: prof?.friendStudentId,
          friendBlock: prof?.friendBlock,
          friendFloor: prof?.friendFloor,
          friendRoom: prof?.friendRoom,
          documents: { citizenId: true, studentCard: true },
          status: 'assigned',
          assignedRoom: roomObj?.roomNumber || asg.roomNodeId,
          assignedBlock: roomObj?.block || 'Tòa A',
          assignedFloor: roomObj?.floor || 1,
          createdAt: asg.startDate || asg.createdAt || new Date().toISOString(),
        });
      });

      // Process all users that are not assigned as pending/rejected applicants
      users.forEach((u, idx) => {
        if (!assignmentMap.has(u.id)) {
          const prof = profiles.find((p) => p.id === u.id || p.studentCode?.includes(u.email.split('@')[0])) || profiles[idx % (profiles.length || 1)];
          const userDocs = groupedDocs[u.id] || [];
          
          const isCitizenIdApproved = userDocs.some(d => d.documentType === 'CCCD_FRONT' && d.status === 'APPROVED');
          const isStudentCardApproved = userDocs.some(d => d.documentType === 'STUDENT_CARD' && d.status === 'APPROVED');
          const rejectedDoc = userDocs.find(d => d.status === 'REJECTED');

          const studentObj: StudentAssignment = {
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
            preference: prof?.roommatePreference === 'friend' ? 'friend' : 'system',
            friendName: prof?.friendName,
            friendId: prof?.friendStudentId,
            friendBlock: prof?.friendBlock,
            friendFloor: prof?.friendFloor,
            friendRoom: prof?.friendRoom,
            documents: { citizenId: isCitizenIdApproved, studentCard: isStudentCardApproved },
            status: rejectedDoc ? 'rejected' : 'pending',
            rejectionReason: rejectedDoc?.rejectReason,
            createdAt: u.createdAt || new Date().toISOString(),
          };

          if (rejectedDoc) {
            loadedRejected.push(studentObj);
          } else {
            loadedPending.push(studentObj);
          }
        }
      });

      // If profiles exist without matching user entries, add them as well
      profiles.forEach((p, idx) => {
        const alreadyIncluded = loadedPending.some((s) => s.id === p.id || s.studentId === p.studentCode) ||
                               loadedAssigned.some((s) => s.id === p.id || s.studentId === p.studentCode) ||
                               loadedRejected.some((s) => s.id === p.id || s.studentId === p.studentCode);
        if (!alreadyIncluded && p.id) {
          const u = userMap.get(p.id);
          const userDocs = groupedDocs[p.id] || [];
          
          const isCitizenIdApproved = userDocs.some(d => d.documentType === 'CCCD_FRONT' && d.status === 'APPROVED');
          const isStudentCardApproved = userDocs.some(d => d.documentType === 'STUDENT_CARD' && d.status === 'APPROVED');
          const rejectedDoc = userDocs.find(d => d.status === 'REJECTED');

          const studentObj: StudentAssignment = {
            id: p.id,
            name: u?.fullName || p.friendName || `Student Candidate ${idx + 1}`,
            studentId: p.studentCode || `SV20240${idx + 1}`,
            email: u?.email || `candidate${idx + 1}@dormly.edu`,
            phone: u?.phoneNumber || '0934567890',
            dateOfBirth: u?.dateOfBirth || '2003-07-22',
            startYear: p.startYear?.toString() || '2023',
            endYear: p.endYear?.toString() || '2027',
            major: p.major || 'Accounting',
            year: p.startYear ? `${new Date().getFullYear() - p.startYear + 1}th Year` : '1st Year',
            faculty: 'Business Administration',
            sleepTime: p.sleepTime || '22:30',
            wakeUpTime: p.wakeUpTime || '06:00',
            quietPreference: (p.quietPreference || 4) > 3 ? 'High' : 'Moderate',
            socialPreference: 'Quiet',
            studyHabit: 'Self Study',
            routineStrictness: 'Strict',
            adaptability: 'High',
            preference: p.roommatePreference === 'friend' ? 'friend' : 'system',
            friendName: p.friendName,
            friendId: p.friendStudentId,
            friendBlock: p.friendBlock,
            friendFloor: p.friendFloor,
            friendRoom: p.friendRoom,
            documents: { citizenId: isCitizenIdApproved, studentCard: isStudentCardApproved },
            status: rejectedDoc ? 'rejected' : 'pending',
            rejectionReason: rejectedDoc?.rejectReason,
            createdAt: p.createdAt || new Date().toISOString(),
          };

          if (rejectedDoc) {
            loadedRejected.push(studentObj);
          } else {
            loadedPending.push(studentObj);
          }
        }
      });

      setAssignedList(loadedAssigned);
      setPendingList(loadedPending);
      setRejectedList(loadedRejected);
    } catch (err) {
      console.error('Error fetching assignments data from API:', err);
      toast.error('Lỗi khi đồng bộ dữ liệu xếp phòng');
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
      return [...pendingList, ...assignedList, ...rejectedList];
    }
    return pendingList;
  };

  const filteredStudents = getFilteredStudents();

  const counts = {
    pending: pendingList.length,
    rejected: rejectedList.length,
    all: pendingList.length + assignedList.length + rejectedList.length,
  };

  const handleAutoAssign = async (studentId: string) => {
    const student = pendingList.find((s) => s.id === studentId);
    if (!student) return;

    setIsProcessing(true);
    try {
      await roomAssignmentService.assignAuto({
        userId: studentId,
        startDate: new Date().toISOString(),
      });
      toast.success(`Xếp phòng tự động thành công cho sinh viên ${student.name}`);
      await loadData();
      setExpandedId(null);
    } catch (e: any) {
      console.error('Auto assign error:', e);
      const errMsg = e.response?.data?.message || e.message || 'Lỗi không mong muốn xảy ra';
      toast.error(`Lỗi xếp phòng tự động: ${errMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAssign = (student: StudentAssignment) => {
    setSelectedStudent(student);
    setShowManualAssignModal(true);
  };

  const handleConfirmManualAssign = async (studentId: string, roomId: string) => {
    const student = pendingList.find((s) => s.id === studentId);
    if (!student) return;

    setIsProcessing(true);
    try {
      await roomAssignmentService.assignManual({
        userId: studentId,
        roomNodeId: roomId,
        startDate: new Date().toISOString(),
      });

      toast.success(`Xếp phòng thủ công thành công cho sinh viên ${student.name}`);
      await loadData();
      setShowManualAssignModal(false);
      setSelectedStudent(null);
      setExpandedId(null);
    } catch (e: any) {
      console.error('Manual assign error:', e);
      const errMsg = e.response?.data?.message || e.message || 'Lỗi không mong muốn xảy ra';
      toast.error(`Lỗi xếp phòng thủ công: ${errMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (studentId: string, reason: string) => {
    setIsProcessing(true);
    try {
      const docs = await userDocumentService.getDocumentsByUserId(studentId);
      if (docs.length > 0) {
        await Promise.all(
          docs.map((doc) =>
            userDocumentService.setDocumentStatus(doc.id, {
              status: 'REJECTED' as any,
              rejectReason: reason || 'Từ chối xếp phòng bởi Admin',
            })
          )
        );
      }
      toast.success('Từ chối xếp phòng thành công');
      await loadData();
      setExpandedId(null);
    } catch (e: any) {
      console.error('Reject assignment error:', e);
      toast.error('Lỗi khi thực hiện từ chối đơn gán phòng');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAutoAssignAll = async (students: StudentAssignment[]) => {
    setIsProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const student of students) {
      try {
        await roomAssignmentService.assignAuto({
          userId: student.id,
          startDate: new Date().toISOString(),
        });
        successCount++;
      } catch (e: any) {
        console.error(`Auto assign failed for ${student.name}:`, e);
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Đã tự động xếp phòng thành công cho ${successCount} sinh viên`);
    }
    if (failCount > 0) {
      toast.error(`Xếp phòng thất bại cho ${failCount} sinh viên`);
    }

    await loadData();
    setIsProcessing(false);
    setShowAutoAssignModal(false);
    setExpandedId(null);
  };

  const totalPending = pendingList.length;
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
                Xếp phòng cho sinh viên tự động bằng thuật toán tương đồng tính cách và sở thích sinh hoạt hoặc thủ công.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition shadow-sm"
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
              <span>Đang tải thông tin xếp phòng từ máy chủ...</span>
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
                      Không có sinh viên nào trong danh sách.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Auto Assign Dialog */}
      <AutoAssignModal
        isOpen={showAutoAssignModal}
        onClose={() => setShowAutoAssignModal(false)}
        students={pendingList}
        rooms={availableRoomsList}
        onConfirm={handleConfirmAutoAssignAll}
        isProcessing={isProcessing}
      />

      {/* Manual Assign Dialog */}
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