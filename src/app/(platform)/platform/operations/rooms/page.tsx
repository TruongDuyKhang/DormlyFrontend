// app/(platform)/operations/rooms/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, Bed, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/_components/ui/input';

import { Block, Floor, Room, Student } from './_components/types';
import { BlocksView } from './_components/BlocksView';
import { FloorsView } from './_components/FloorsView';
import { RoomsView } from './_components/RoomsView';
import { RoomDetailView } from './_components/RoomDetailView';
import { RoomDetailModal } from './_components/RoomDetailModal';
import { EditRoomModal } from './_components/EditRoomModal';
import { ArchiveConfirmModal } from './_components/ArchiveConfirmModal';
import { AssignStudentModal } from './_components/AssignStudentModal';
import { TransferModal } from './_components/TransferModal';
import { MoveOutModal } from './_components/MoveOutModal';
import { AddRoomModal } from './_components/AddRoomModal';
import { initialBlocks, studentsDB } from './_components/mockData';

type NavigationView = 'blocks' | 'floors' | 'rooms' | 'roomDetail';

export default function RoomsPage() {
  const [currentView, setCurrentView] = useState<NavigationView>('blocks');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [roomsData, setRoomsData] = useState<Block[]>(initialBlocks);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ room: Room; block: Block; floor: Floor }[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal state
  const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMoveOutModal, setShowMoveOutModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  
  const [selectedStudentForTransfer, setSelectedStudentForTransfer] = useState<Student | null>(null);
  const [selectedStudentForMoveOut, setSelectedStudentForMoveOut] = useState<Student | null>(null);
  
  // Get current objects
  const currentBlock = roomsData.find((b: Block) => b.id === selectedBlock?.id);
  const currentFloor = currentBlock?.floors.find((f: Floor) => f.level === selectedFloor?.level);
  const currentRoom = currentFloor?.rooms.find((r: Room) => r.id === selectedRoom?.id);
  
  // Get unassigned students
  const getUnassignedStudents = (): Student[] => {
    const assignedIds = new Set<string>();
    roomsData.forEach((block: Block) => {
      block.floors.forEach((floor: Floor) => {
        floor.rooms.forEach((room: Room) => {
          room.students.forEach((s: Student) => assignedIds.add(s.id));
        });
      });
    });
    return studentsDB.filter((s: Student) => !assignedIds.has(s.id));
  };
  
  // Search handler
  const handleSearch = () => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const results: { room: Room; block: Block; floor: Floor }[] = [];
      roomsData.forEach((block: Block) => {
        block.floors.forEach((floor: Floor) => {
          floor.rooms.forEach((room: Room) => {
            if (
              room.number.toLowerCase().includes(query) ||
              room.type.toLowerCase().includes(query) ||
              room.students.some((s: Student) => s.name.toLowerCase().includes(query))
            ) {
              results.push({ room, block, floor });
            }
          });
        });
      });
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
    }
  };
  
  const handleSearchResultClick = (result: { room: Room; block: Block; floor: Floor }) => {
    setSelectedBlock(result.block);
    setSelectedFloor(result.floor);
    setSelectedRoom(result.room);
    setCurrentView('roomDetail');
    setShowSearchResults(false);
    setSearchQuery('');
  };
  
  // Navigation
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
    setCurrentView('roomDetail');
    setShowRoomDetailModal(true);
  };
  
  const handleBack = () => {
    if (currentView === 'floors') {
      setCurrentView('blocks');
      setSelectedBlock(null);
    } else if (currentView === 'rooms') {
      setCurrentView('floors');
      setSelectedFloor(null);
    } else if (currentView === 'roomDetail') {
      setCurrentView('rooms');
      setSelectedRoom(null);
    }
  };
  
  // Room actions
  const handleEditRoom = (updatedRoom: Room) => {
    setRoomsData((prev: Block[]) => {
      const newData = [...prev];
      for (const block of newData) {
        for (const floor of block.floors) {
          const roomIndex = floor.rooms.findIndex((r: Room) => r.id === updatedRoom.id);
          if (roomIndex !== -1) {
            floor.rooms[roomIndex] = updatedRoom;
            break;
          }
        }
      }
      return newData;
    });
  };
  
  const handleArchiveRoom = () => {
    if (!currentRoom) return;
    const newStatus = currentRoom.status === 'active' ? 'inactive' : 'active';
    handleEditRoom({ ...currentRoom, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] });
    setShowArchiveModal(false);
    setShowRoomDetailModal(false);
  };
  
  const handleAssignStudent = (studentId: string) => {
    if (!currentRoom) return;
    const student = getUnassignedStudents().find((s: Student) => s.id === studentId);
    if (student) {
      handleEditRoom({
        ...currentRoom,
        students: [...currentRoom.students, student],
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }
    setShowAssignModal(false);
  };
  
  const handleTransfer = (studentId: string, targetBlockId: string, targetFloorLevel: number, targetRoomId: string) => {
    setRoomsData((prev: Block[]) => {
      const newData = [...prev];
      let studentToTransfer: Student | null = null;
      
      // Remove from current room
      for (const block of newData) {
        for (const floor of block.floors) {
          for (const room of floor.rooms) {
            const idx = room.students.findIndex((s: Student) => s.id === studentId);
            if (idx !== -1) {
              studentToTransfer = room.students[idx];
              room.students.splice(idx, 1);
              room.updatedAt = new Date().toISOString().split('T')[0];
              break;
            }
          }
          if (studentToTransfer) break;
        }
        if (studentToTransfer) break;
      }
      
      // Add to target room
      if (studentToTransfer) {
        for (const block of newData) {
          if (block.id === targetBlockId) {
            for (const floor of block.floors) {
              if (floor.level === targetFloorLevel) {
                for (const room of floor.rooms) {
                  if (room.id === targetRoomId) {
                    room.students.push(studentToTransfer!);
                    room.updatedAt = new Date().toISOString().split('T')[0];
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }
      
      // Recalculate occupancy
      for (const block of newData) {
        for (const floor of block.floors) {
          const occupied = floor.rooms.filter((r: Room) => r.students.length > 0 && r.status === 'active').length;
          floor.occupiedRooms = occupied;
          floor.occupancyRate = Math.round((occupied / floor.totalRooms) * 100);
        }
        const totalStudents = block.floors.reduce((acc: number, f: Floor) => acc + f.rooms.reduce((a: number, r: Room) => a + r.students.length, 0), 0);
        block.totalStudents = totalStudents;
        block.occupancyRate = Math.round((totalStudents / (block.totalRooms * 2)) * 100);
      }
      
      return newData;
    });
    setShowTransferModal(false);
    setSelectedStudentForTransfer(null);
  };
  
  const handleMoveOut = (studentId: string, reason: string, moveOutDate: string) => {
    if (!currentRoom) return;
    handleEditRoom({
      ...currentRoom,
      students: currentRoom.students.filter((s: Student) => s.id !== studentId),
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setShowMoveOutModal(false);
    setSelectedStudentForMoveOut(null);
  };
  
  const handleAddRoom = (roomData: Room) => {
    if (!currentFloor || !currentBlock) return;
    setRoomsData((prev: Block[]) => {
      const newData = [...prev];
      for (const block of newData) {
        if (block.id === currentBlock.id) {
          for (const floor of block.floors) {
            if (floor.level === currentFloor.level) {
              floor.rooms.push(roomData);
              floor.totalRooms = floor.rooms.length;
              const occupied = floor.rooms.filter((r: Room) => r.students.length > 0 && r.status === 'active').length;
              floor.occupiedRooms = occupied;
              floor.occupancyRate = Math.round((occupied / floor.totalRooms) * 100);
              break;
            }
          }
          block.totalRooms = block.floors.reduce((acc: number, f: Floor) => acc + f.totalRooms, 0);
          const totalStudents = block.floors.reduce((acc: number, f: Floor) => acc + f.rooms.reduce((a: number, r: Room) => a + r.students.length, 0), 0);
          block.totalStudents = totalStudents;
          block.occupancyRate = Math.round((totalStudents / (block.totalRooms * 2)) * 100);
          break;
        }
      }
      return newData;
    });
    setShowAddRoomModal(false);
  };
  
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
                <Bed className="h-3.5 w-3.5" />
                Room Management
              </div>
              <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
                Residence rooms
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Manage blocks, floors, rooms, and resident assignments.
              </p>
            </div>
            
            {/* Search */}
            <div className="flex gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by room number, type, or resident name"
                  className="h-11 rounded-full border-white/55 bg-white/34 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] focus-visible:ring-stone-500/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-2 z-20 max-h-80 overflow-y-auto rounded-2xl border border-white/60 bg-[#f3eee6]/98 shadow-2xl backdrop-blur-xl"
                    >
                      {searchResults.map((result) => (
                        <button
                          key={result.room.id}
                          onClick={() => handleSearchResultClick(result)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/40"
                        >
                          <div className="rounded-full bg-stone-100 p-2">
                            {result.room.type === 'vip' ? <Crown className="h-4 w-4" /> : <Bed className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-950">Room {result.room.number}</p>
                            <p className="text-xs text-stone-500">
                              {result.block.name} • Floor {result.floor.level} • {result.room.type}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-stone-400" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={isSearching}
                className="h-11 px-5 rounded-full bg-[#c3a26c] text-white font-medium text-sm shadow-sm hover:bg-[#b08f5a] transition flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </motion.button>
            </div>
          </div>
          
          {/* Breadcrumb */}
          {currentView !== 'blocks' && (
            <div className="mb-6 flex items-center gap-2 text-sm">
              <button onClick={() => {
                setCurrentView('blocks');
                setSelectedBlock(null);
                setSelectedFloor(null);
                setSelectedRoom(null);
              }} className="text-stone-500 hover:text-stone-700 transition">
                All Blocks
              </button>
              {selectedBlock && (
                <>
                  <ChevronRight className="h-3 w-3 text-stone-400" />
                  <button
                    onClick={() => {
                      setCurrentView('floors');
                      setSelectedFloor(null);
                      setSelectedRoom(null);
                    }}
                    className={cn(
                      "transition-colors",
                      currentView === 'floors' ? 'text-stone-950 font-medium' : 'text-stone-500 hover:text-stone-700'
                    )}
                  >
                    {selectedBlock.name}
                  </button>
                </>
              )}
              {selectedFloor && (
                <>
                  <ChevronRight className="h-3 w-3 text-stone-400" />
                  <button
                    onClick={() => {
                      setCurrentView('rooms');
                      setSelectedRoom(null);
                    }}
                    className={cn(
                      "transition-colors",
                      currentView === 'rooms' ? 'text-stone-950 font-medium' : 'text-stone-500 hover:text-stone-700'
                    )}
                  >
                    Floor {selectedFloor.level}
                  </button>
                </>
              )}
              {selectedRoom && (
                <>
                  <ChevronRight className="h-3 w-3 text-stone-400" />
                  <span className="text-stone-950 font-medium">Room {selectedRoom.number}</span>
                </>
              )}
            </div>
          )}
          
          {/* Views */}
          <AnimatePresence mode="wait">
            {currentView === 'blocks' && (
              <BlocksView
                blocks={roomsData}
                hoveredBlockId={hoveredBlockId}
                onHover={setHoveredBlockId}
                onSelect={handleBlockSelect}
              />
            )}
            
            {currentView === 'floors' && currentBlock && (
              <FloorsView
                block={currentBlock}
                onFloorSelect={handleFloorSelect}
                onBack={handleBack}
              />
            )}
            
            {currentView === 'rooms' && currentFloor && currentBlock && (
              <RoomsView
                floor={currentFloor}
                blockName={currentBlock.name}
                onRoomSelect={handleRoomSelect}
                onBack={handleBack}
                onAddRoom={() => setShowAddRoomModal(true)}
              />
            )}
            
            {currentView === 'roomDetail' && currentRoom && currentBlock && currentFloor && (
              <RoomDetailView
                room={currentRoom}
                block={currentBlock}
                floor={currentFloor}
                onBack={handleBack}
                onEdit={() => setShowEditModal(true)}
                onArchive={() => setShowArchiveModal(true)}
                onAssign={() => setShowAssignModal(true)}
                onTransfer={(student) => {
                  setSelectedStudentForTransfer(student);
                  setShowTransferModal(true);
                }}
                onMoveOut={(student) => {
                  setSelectedStudentForMoveOut(student);
                  setShowMoveOutModal(true);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Modals */}
      <AnimatePresence>
        {showEditModal && currentRoom && (
          <EditRoomModal
            isOpen={showEditModal}
            room={currentRoom}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditRoom}
          />
        )}
        
        {showArchiveModal && currentRoom && (
          <ArchiveConfirmModal
            isOpen={showArchiveModal}
            room={currentRoom}
            onClose={() => setShowArchiveModal(false)}
            onConfirm={handleArchiveRoom}
          />
        )}
        
        {showAssignModal && currentRoom && (
          <AssignStudentModal
            isOpen={showAssignModal}
            room={currentRoom}
            unassignedStudents={getUnassignedStudents()}
            onClose={() => setShowAssignModal(false)}
            onAssign={handleAssignStudent}
          />
        )}
        
        {showTransferModal && selectedStudentForTransfer && currentRoom && currentBlock && currentFloor && (
          <TransferModal
            isOpen={showTransferModal}
            student={selectedStudentForTransfer}
            currentRoom={currentRoom}
            currentBlock={currentBlock}
            currentFloor={currentFloor}
            blocks={roomsData}
            onTransfer={handleTransfer}
            onClose={() => {
              setShowTransferModal(false);
              setSelectedStudentForTransfer(null);
            }}
          />
        )}
        
        {showMoveOutModal && selectedStudentForMoveOut && currentRoom && (
          <MoveOutModal
            isOpen={showMoveOutModal}
            student={selectedStudentForMoveOut}
            room={currentRoom}
            onMoveOut={handleMoveOut}
            onClose={() => {
              setShowMoveOutModal(false);
              setSelectedStudentForMoveOut(null);
            }}
          />
        )}
        
        {showAddRoomModal && currentBlock && currentFloor && (
          <AddRoomModal
            isOpen={showAddRoomModal}
            blockId={currentBlock.id}
            floorLevel={currentFloor.level}
            existingRoomNumbers={currentFloor.rooms.map((r: Room) => r.number)}
            onClose={() => setShowAddRoomModal(false)}
            onAdd={handleAddRoom}
          />
        )}
      </AnimatePresence>
    </>
  );
}