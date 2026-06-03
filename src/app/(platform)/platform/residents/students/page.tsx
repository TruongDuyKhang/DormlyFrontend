// app/(platform)/residents/students/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Block, Floor, Room, StudentWithLocation, NavigationView, SearchResult } from './_components/types';
import { blocks, allStudents } from './_components/mockData';
import { BlocksView } from './_components/BlocksView';
import { FloorsView } from './_components/FloorsView';
import { RoomsView } from './_components/RoomsView';
import { RoomStudentsView } from './_components/RoomStudentsView';
import { StudentDetailModal } from './_components/StudentDetailModal';
import { SearchSection } from './_components/SearchSection';
import { BreadcrumbNav } from './_components/BreadcrumbNav';

export default function StudentsPage() {
  const [currentView, setCurrentView] = useState<NavigationView>('blocks');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithLocation | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const handleSearch = () => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const results = allStudents.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(student => ({
        student,
        blockId: student.blockId,
        blockName: student.blockName,
        floorLevel: student.floorLevel,
        roomNumber: student.roomNumber
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
    const block = blocks.find(b => b.id === result.blockId);
    if (block) {
      const floor = block.floors.find(f => f.level === result.floorLevel);
      if (floor) {
        const room = floor.rooms.find(r => r.number === result.roomNumber);
        if (room) {
          setSelectedBlock(block);
          setSelectedFloor(floor);
          setSelectedRoom(room);
          setSelectedStudent(result.student);
          setCurrentView('students');
          setShowSearchResults(false);
          setSearchQuery('');
        }
      }
    }
  };

  const handleViewStudentDetail = (student: StudentWithLocation) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  const handleViewRoomFromDetail = () => {
    if (selectedStudent) {
      setShowStudentDetail(false);
    }
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
    return 'text-stone-500';
  };

  // Get current objects
  const currentBlock = blocks.find(b => b.id === selectedBlock?.id);
  const currentFloor = currentBlock?.floors.find(f => f.level === selectedFloor?.level);
  const currentRoom = currentFloor?.rooms.find(r => r.id === selectedRoom?.id);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
      >
        {/* Background gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#9b7a4a]/16 blur-3xl" />

        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
                <Building2 className="h-3.5 w-3.5" />
                Residence Explorer
              </div>
              <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
                Navigate residence blocks
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Select a block, then floor, then room to view resident information.
              </p>
            </div>

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
          </div>

          {/* Breadcrumb */}
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
              setSelectedStudent(null);
            }}
            onBackToRooms={() => {
              setCurrentView('rooms');
              setSelectedRoom(null);
              setSelectedStudent(null);
            }}
          />

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {currentView === 'blocks' && (
              <BlocksView
                blocks={blocks}
                hoveredBlockId={hoveredBlockId}
                onHover={setHoveredBlockId}
                onSelect={handleBlockSelect}
                getOccupancyColor={getOccupancyColor}
              />
            )}

            {currentView === 'floors' && selectedBlock && (
              <FloorsView
                floors={selectedBlock.floors}
                onFloorSelect={handleFloorSelect}
                onBack={handleBack}
                getOccupancyColor={getOccupancyColor}
              />
            )}

            {currentView === 'rooms' && selectedFloor && (
              <RoomsView
                rooms={selectedFloor.rooms}
                onRoomSelect={handleRoomSelect}
                onBack={handleBack}
              />
            )}

            {currentView === 'students' && currentRoom && (
              <RoomStudentsView
                room={currentRoom}
                block={selectedBlock}
                floor={selectedFloor}
                onBack={handleBack}
                onViewStudentDetail={handleViewStudentDetail}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {showStudentDetail && selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            onClose={() => setShowStudentDetail(false)}
            onViewRoom={handleViewRoomFromDetail}
          />
        )}
      </AnimatePresence>
    </>
  );
}