// app/(platform)/residents/students/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Block, Floor, Room, StudentWithLocation, NavigationView, SearchResult } from './_components/types';
import { BlocksView } from './_components/BlocksView';
import { FloorsView } from './_components/FloorsView';
import { RoomsView } from './_components/RoomsView';
import { RoomStudentsView } from './_components/RoomStudentsView';
import { StudentDetailModal } from './_components/StudentDetailModal';
import { SearchSection } from './_components/SearchSection';
import { BreadcrumbNav } from './_components/BreadcrumbNav';
import { buildingService } from '@/services/buildingService';
import { studentProfileService } from '@/services/studentProfileService';
import { userService } from '@/services/userService';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import type { UserResponseDto, BuildingNodeResponseDto, StudentProfileResponseDto } from '@/types/models';

export default function StudentsPage() {
  const [currentView, setCurrentView] = useState<NavigationView>('blocks');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithLocation | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  const [blocksData, setBlocksData] = useState<Block[]>([]);
  const [allStudentsData, setAllStudentsData] = useState<StudentWithLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [nodesListRes, treeRes, profilesRes, usersRes, assignmentsRes] = await Promise.allSettled([
        buildingService.listNodes(),
        buildingService.getNodeTreeByLevel(1),
        studentProfileService.listAllProfiles(),
        userService.list(),
        roomAssignmentService.list(),
      ]);

      const users: UserResponseDto[] = usersRes.status === 'fulfilled' && usersRes.value ? usersRes.value : [];
      const profiles: StudentProfileResponseDto[] = profilesRes.status === 'fulfilled' && profilesRes.value ? profilesRes.value : [];
      const assignments = assignmentsRes.status === 'fulfilled' && assignmentsRes.value ? assignmentsRes.value : [];
      const allNodes: BuildingNodeResponseDto[] = nodesListRes.status === 'fulfilled' && nodesListRes.value ? nodesListRes.value : [];

      const nodeMap = new Map<string, BuildingNodeResponseDto>();
      allNodes.forEach((n) => nodeMap.set(n.id, n));

      const userMap = new Map<string, UserResponseDto>();
      users.forEach((u) => userMap.set(u.id, u));

      // 1. Build Room -> Students mapping strictly from real assignments
      const studentsByRoomNodeId = new Map<string, StudentWithLocation[]>();
      const studentsList: StudentWithLocation[] = [];
      const assignedUserIds = new Set<string>();

      // Filter for active assignments only (matching Rooms & Beds page)
      const activeAssignments = assignments.filter(
        (asg) => !asg.endDate || new Date(asg.endDate).getTime() > Date.now()
      );

      activeAssignments.forEach((asg, idx) => {
        assignedUserIds.add(asg.userId);
        const u = userMap.get(asg.userId);
        const prof = profiles.find((p) => p.id === asg.userId || (u && p.studentCode?.includes(u.email.split('@')[0]))) || profiles[idx % (profiles.length || 1)];

        let blockName = 'Chưa xác định';
        let blockId = '';
        let floorLevel = 1;
        let roomNumber = 'N/A';

        if (asg.roomNodeId && nodeMap.has(asg.roomNodeId)) {
          const rNode = nodeMap.get(asg.roomNodeId)!;
          roomNumber = rNode.name;
          if (rNode.parentId && nodeMap.has(rNode.parentId)) {
            const fNode = nodeMap.get(rNode.parentId)!;
            floorLevel = parseInt(fNode.name.replace(/\D/g, '')) || 1;
            if (fNode.parentId && nodeMap.has(fNode.parentId)) {
              const bNode = nodeMap.get(fNode.parentId)!;
              blockName = bNode.name;
              blockId = bNode.id;
            }
          }
        }

        const studentObj: StudentWithLocation = {
          id: asg.userId,
          name: u?.fullName || prof?.friendName || `Cư dân ${idx + 1}`,
          email: u?.email || `student${idx + 1}@dormly.edu`,
          studentId: prof?.studentCode || `SV202${idx + 1}00${idx + 1}`,
          major: prof?.major || 'Công nghệ Thông tin',
          year: prof?.startYear ? `${new Date().getFullYear() - prof.startYear + 1}th Year` : '2nd Year',
          phone: u?.phoneNumber || '0901234567',
          emergencyContact: '0987654321',
          status: 'active',
          joinedDate: asg.startDate || u?.createdAt || new Date().toISOString(),
          dateOfBirth: u?.dateOfBirth || '2003-02-14',
          nationality: 'Việt Nam',
          idCardNumber: prof?.identityNumber || '079300012345',
          emergencyName: 'Phụ huynh',
          emergencyRelationship: 'Bố/Mẹ',
          blockId,
          blockName,
          floorLevel,
          roomNumber,
        };

        studentsList.push(studentObj);

        if (asg.roomNodeId) {
          const list = studentsByRoomNodeId.get(asg.roomNodeId) || [];
          list.push(studentObj);
          studentsByRoomNodeId.set(asg.roomNodeId, list);
        }
      });

      // 2. Include unassigned users in student directory (with room = 'Chưa xếp phòng')
      users.forEach((u, idx) => {
        if (!assignedUserIds.has(u.id)) {
          const prof = profiles.find((p) => p.id === u.id || p.studentCode?.includes(u.email.split('@')[0]));
          studentsList.push({
            id: u.id,
            name: u.fullName || `Sinh viên ${idx + 1}`,
            email: u.email,
            studentId: prof?.studentCode || `SV202${idx + 1}00${idx + 1}`,
            major: prof?.major || 'Công nghệ Thông tin',
            year: prof?.startYear ? `${new Date().getFullYear() - prof.startYear + 1}th Year` : '1st Year',
            phone: u.phoneNumber || '0912345678',
            emergencyContact: '0987654321',
            status: 'active',
            joinedDate: u.createdAt || new Date().toISOString(),
            dateOfBirth: u.dateOfBirth || '2003-02-14',
            nationality: 'Việt Nam',
            idCardNumber: prof?.identityNumber || '079300012345',
            emergencyName: 'Phụ huynh',
            emergencyRelationship: 'Bố/Mẹ',
            blockId: '',
            blockName: 'Chưa xếp phòng',
            floorLevel: 0,
            roomNumber: 'Chưa xếp phòng',
          });
        }
      });

      // 3. Assemble 3-Level Building Structure (Blocks -> Floors -> Rooms) strictly from backend nodes
      let assembledBlocks: Block[] = [];

      if (allNodes.length > 0) {
        const rootNodes = allNodes.filter((n) => !n.parentId);
        
        assembledBlocks = rootNodes.map((bNode) => {
          const floorNodes = allNodes.filter((n) => n.parentId === bNode.id);
          const floors: Floor[] = floorNodes.map((fNode, fIdx) => {
            const floorNum = parseInt(fNode.name.replace(/\D/g, '')) || fIdx + 1;
            const roomNodes = allNodes.filter((n) => n.parentId === fNode.id);

            const rooms: Room[] = roomNodes.map((rNode) => {
              // ONLY match students actually assigned to this room node ID
              const assignedStudents = studentsByRoomNodeId.get(rNode.id) || [];
              return {
                id: rNode.id,
                number: rNode.name,
                type: 'quad',
                capacity: rNode.maxCapacity || 4,
                students: assignedStudents,
                status: rNode.status === 'MAINTENANCE' ? 'maintenance' : 'active',
                amenities: ['Điều hòa', 'Wifi', 'Ban công', 'Bàn học'],
                floorArea: 28,
                monthlyFee: 1500000,
                description: rNode.description || 'Phòng 4 người tiêu chuẩn',
              };
            });

            const totalRooms = rooms.length;
            const totalStudentsOnFloor = rooms.reduce((acc, r) => acc + r.students.length, 0);
            const occupiedRooms = rooms.filter((r) => r.students.length > 0).length;
            const totalBedsOnFloor = rooms.reduce((acc, r) => acc + r.capacity, 0) || (totalRooms * 4);

            return {
              level: floorNum,
              rooms,
              totalRooms,
              occupiedRooms,
              occupancyRate: totalBedsOnFloor > 0 ? Math.round((totalStudentsOnFloor / totalBedsOnFloor) * 100) : 0,
            };
          });

          const totalRooms = floors.reduce((acc, f) => acc + f.totalRooms, 0);
          const totalStudents = floors.reduce(
            (acc, f) => acc + f.rooms.reduce((rAcc, r) => rAcc + r.students.length, 0),
            0
          );
          const totalBeds = floors.reduce(
            (acc, f) => acc + f.rooms.reduce((rAcc, r) => rAcc + r.capacity, 0),
            0
          ) || (totalRooms * 4);

          return {
            id: bNode.id,
            name: bNode.name,
            floors,
            totalRooms,
            totalStudents,
            occupancyRate: totalBeds > 0 ? Math.round((totalStudents / totalBeds) * 100) : 0,
          };
        });
      }

      setBlocksData(assembledBlocks);
      setAllStudentsData(studentsList);
    } catch (err) {
      console.error('Error fetching students and building data from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const results = allStudentsData
        .filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((student) => ({
          student,
          blockId: student.blockId,
          blockName: student.blockName,
          floorLevel: student.floorLevel,
          roomNumber: student.roomNumber,
        }));
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.blockId) {
      const block = blocksData.find((b) => b.id === result.blockId || b.name === result.blockName) || blocksData[0];
      if (block) {
        const floor = block.floors.find((f) => f.level === result.floorLevel) || block.floors[0];
        if (floor) {
          const room = floor.rooms.find((r) => r.number === result.roomNumber) || floor.rooms[0];
          if (room) {
            setSelectedBlock(block);
            setSelectedFloor(floor);
            setSelectedRoom(room);
            setSelectedStudent(result.student);
            setCurrentView('students');
            setShowSearchResults(false);
            setSearchQuery('');
            return;
          }
        }
      }
    }
    // If not assigned to a room, view detail modal directly
    setSelectedStudent(result.student);
    setShowStudentDetail(true);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleViewStudentDetail = (student: StudentWithLocation) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  const handleViewRoomFromDetail = () => {
    if (selectedStudent && selectedStudent.roomNumber && selectedStudent.roomNumber !== 'Chưa xếp phòng') {
      const block = blocksData.find((b) => b.id === selectedStudent.blockId || b.name === selectedStudent.blockName);
      if (block) {
        const floor = block.floors.find((f) => f.level === selectedStudent.floorLevel);
        if (floor) {
          const room = floor.rooms.find((r) => r.number === selectedStudent.roomNumber);
          if (room) {
            setSelectedBlock(block);
            setSelectedFloor(floor);
            setSelectedRoom(room);
            setCurrentView('students');
          }
        }
      }
    }
    setShowStudentDetail(false);
  };

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
    setCurrentView('floors');
  };

  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloor(floor);
    setCurrentView('rooms');
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView('students');
  };

  const handleBack = () => {
    if (currentView === 'floors') {
      setCurrentView('blocks');
      setSelectedBlock(null);
    } else if (currentView === 'rooms') {
      setCurrentView('floors');
      setSelectedFloor(null);
    } else if (currentView === 'students') {
      setCurrentView('rooms');
      setSelectedRoom(null);
      setSelectedStudent(null);
    }
  };

  const handleReset = () => {
    setCurrentView('blocks');
    setSelectedBlock(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
    setSelectedStudent(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-600';
    if (rate >= 50) return 'text-amber-600';
    if (rate > 0) return 'text-blue-600';
    return 'text-stone-500';
  };

  const currentBlock = blocksData.find((b) => b.id === selectedBlock?.id);
  const currentFloor = currentBlock?.floors.find((f) => f.level === selectedFloor?.level);
  const currentRoom = currentFloor?.rooms.find((r) => r.id === selectedRoom?.id);

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
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <Building2 className="h-3.5 w-3.5" />
              Resident Directory
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
                  Students & Residents
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                  Browse residents by building structure or search directly from live backend records.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                  Sync API
                </button>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <SearchSection
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
            onClear={() => {
              setSearchQuery('');
              setSearchResults([]);
              setShowSearchResults(false);
            }}
            isSearching={isSearching}
            showResults={showSearchResults}
            searchResults={searchResults}
            onResultClick={handleSearchResultClick}
          />

          {/* Breadcrumb Navigation */}
          <div className="mt-6">
            <BreadcrumbNav
              currentView={currentView}
              selectedBlock={selectedBlock}
              selectedFloor={selectedFloor}
              selectedRoom={selectedRoom}
              onReset={handleReset}
              onBackToFloors={() => {
                setCurrentView('floors');
                setSelectedFloor(null);
                setSelectedRoom(null);
              }}
              onBackToRooms={() => {
                setCurrentView('rooms');
                setSelectedRoom(null);
              }}
            />
          </div>

          {/* Views with animation */}
          <div className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-stone-500 gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
                <span>Loading building directory and students from backend API...</span>
              </div>
            ) : blocksData.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 py-12 text-center text-stone-500 bg-white/20">
                <Building2 className="mx-auto h-8 w-8 text-stone-400 mb-2" />
                <p className="text-sm font-medium">No residence blocks found in backend API.</p>
                <p className="text-xs text-stone-400 mt-1">Please create buildings in Residence Structure settings.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {currentView === 'blocks' && (
                  <BlocksView
                    key="blocks"
                    blocks={blocksData}
                    hoveredBlockId={hoveredBlockId}
                    onHover={setHoveredBlockId}
                    onSelect={handleBlockSelect}
                    getOccupancyColor={getOccupancyColor}
                  />
                )}

                {currentView === 'floors' && currentBlock && (
                  <FloorsView
                    key="floors"
                    floors={currentBlock.floors}
                    onFloorSelect={handleFloorSelect}
                    onBack={handleBack}
                    getOccupancyColor={getOccupancyColor}
                  />
                )}

                {currentView === 'rooms' && currentBlock && currentFloor && (
                  <RoomsView
                    key="rooms"
                    rooms={currentFloor.rooms}
                    onRoomSelect={handleRoomSelect}
                    onBack={handleBack}
                  />
                )}

                {currentView === 'students' && currentBlock && currentFloor && currentRoom && (
                  <RoomStudentsView
                    key="students"
                    room={currentRoom}
                    block={currentBlock}
                    floor={currentFloor}
                    onBack={handleBack}
                    onViewStudentDetail={handleViewStudentDetail}
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>

      {/* Student Detail Modal */}
      {showStudentDetail && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setShowStudentDetail(false)}
          onViewRoom={handleViewRoomFromDetail}
        />
      )}
    </>
  );
}