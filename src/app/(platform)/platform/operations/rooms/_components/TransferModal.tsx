// app/(platform)/operations/rooms/_components/TransferModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, MoveRight, ChevronDown, Check, Bed, Users, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block, Room, Student } from './types';

interface TransferModalProps {
  isOpen: boolean;
  student: Student | null;
  currentRoom: Room | null;
  currentBlock: Block | null;
  currentFloor: any | null;
  blocks: Block[];
  onTransfer: (studentId: string, targetBlockId: string, targetFloorLevel: number, targetRoomId: string) => void;
  onClose: () => void;
}

const getRoomIcon = (type: string) => {
  switch(type) {
    case 'single': return Bed;
    case 'double': return Users;
    case 'quad': return Users;
    case 'vip': return Crown;
    default: return Bed;
  }
};

export function TransferModal({ 
  isOpen, 
  student, 
  currentRoom, 
  currentBlock, 
  currentFloor, 
  blocks, 
  onTransfer, 
  onClose 
}: TransferModalProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [selectedFloorLevel, setSelectedFloorLevel] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  
  const blockContainerRef = useRef<HTMLDivElement>(null);
  const floorContainerRef = useRef<HTMLDivElement>(null);
  const roomContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (blockContainerRef.current && !blockContainerRef.current.contains(event.target as Node)) {
        setShowBlockDropdown(false);
      }
      if (floorContainerRef.current && !floorContainerRef.current.contains(event.target as Node)) {
        setShowFloorDropdown(false);
      }
      if (roomContainerRef.current && !roomContainerRef.current.contains(event.target as Node)) {
        setShowRoomDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const selectedFloor = selectedBlock?.floors.find(f => f.level === selectedFloorLevel);
  const selectedRoom = selectedFloor?.rooms.find(r => r.id === selectedRoomId);
  
  const isTransferValid = selectedRoom && 
    selectedRoom.students.length < selectedRoom.capacity && 
    selectedRoom.status === 'active' &&
    selectedRoom.id !== currentRoom?.id;
  
  if (!isOpen || !student) return null;
  
  const handleTransfer = () => {
    if (student && selectedRoom && isTransferValid) {
      onTransfer(student.id, selectedBlockId, selectedFloorLevel!, selectedRoomId);
      onClose();
    }
  };
  
  const resetSelection = () => {
    setSelectedBlockId('');
    setSelectedFloorLevel(null);
    setSelectedRoomId('');
  };
  
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
            className="relative w-full max-w-4xl rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="h-6 w-6 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Transfer Resident</h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">Move {student.name} to a different room</p>
            </div>
            
            {/* Content - compact but readable */}
            <div className="p-6 space-y-5">
              {/* Current Room Summary */}
              <div className="rounded-xl bg-stone-100/50 border border-stone-200/50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-1">Current Location</p>
                    <p className="font-semibold text-stone-950">{currentBlock?.name}</p>
                    <p className="text-sm text-stone-600">Floor {currentFloor?.level} • Room {currentRoom?.number}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-1">Current Status</p>
                    <p className="text-sm text-stone-600">{currentRoom?.type} • {currentRoom?.students.length}/{currentRoom?.capacity} occupied</p>
                  </div>
                </div>
              </div>
              
              {/* Selection Flow - 3 column layout on large screens */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Block Selection */}
                <div className="relative" ref={blockContainerRef}>
                  <label className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-1 block">1. Select Block</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBlockDropdown(!showBlockDropdown);
                      setShowFloorDropdown(false);
                      setShowRoomDropdown(false);
                    }}
                    className="w-full flex items-center justify-between rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                  >
                    <span className={cn(!selectedBlockId && "text-stone-400")}>
                      {selectedBlockId ? selectedBlock?.name : 'Select Block'}
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showBlockDropdown && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {showBlockDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-white/60 bg-[#f3eee6] shadow-xl overflow-hidden"
                      >
                        <div className="divide-y divide-white/40 max-h-64 overflow-y-auto">
                          {blocks.map((block) => (
                            <button
                              key={block.id}
                              type="button"
                              onClick={() => {
                                setSelectedBlockId(block.id);
                                setSelectedFloorLevel(null);
                                setSelectedRoomId('');
                                setShowBlockDropdown(false);
                              }}
                              className={cn(
                                "w-full px-4 py-2.5 text-left transition hover:bg-white/50 flex items-center justify-between",
                                selectedBlockId === block.id && "bg-[#c3a26c]/10"
                              )}
                            >
                              <div>
                                <span className="font-medium text-stone-800">{block.name}</span>
                                <p className="text-xs text-stone-400">{block.totalRooms} rooms</p>
                              </div>
                              <span className="text-sm font-medium text-stone-600">{block.occupancyRate}%</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Floor Selection */}
                <div className="relative" ref={floorContainerRef}>
                  <label className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-1 block">2. Select Floor</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFloorDropdown(!showFloorDropdown);
                      setShowBlockDropdown(false);
                      setShowRoomDropdown(false);
                    }}
                    disabled={!selectedBlockId}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition",
                      selectedBlockId 
                        ? "border-white/55 bg-white/40 text-stone-700 cursor-pointer" 
                        : "border-white/30 bg-white/20 text-stone-400 cursor-not-allowed"
                    )}
                  >
                    <span>{selectedFloorLevel ? `Floor ${selectedFloorLevel}` : 'Select Floor'}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showFloorDropdown && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {showFloorDropdown && selectedBlock && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-white/60 bg-[#f3eee6] shadow-xl overflow-hidden"
                      >
                        <div className="divide-y divide-white/40 max-h-64 overflow-y-auto">
                          {selectedBlock.floors.map((floor) => (
                            <button
                              key={floor.level}
                              type="button"
                              onClick={() => {
                                setSelectedFloorLevel(floor.level);
                                setSelectedRoomId('');
                                setShowFloorDropdown(false);
                              }}
                              className={cn(
                                "w-full px-4 py-2.5 text-left transition hover:bg-white/50 flex items-center justify-between",
                                selectedFloorLevel === floor.level && "bg-[#c3a26c]/10"
                              )}
                            >
                              <div>
                                <span className="font-medium text-stone-800">Floor {floor.level}</span>
                                <p className="text-xs text-stone-400">{floor.totalRooms} rooms</p>
                              </div>
                              <span className="text-sm font-medium text-stone-600">{floor.occupancyRate}% full</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Room Selection */}
                <div className="relative" ref={roomContainerRef}>
                  <label className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-1 block">3. Select Room</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoomDropdown(!showRoomDropdown);
                      setShowBlockDropdown(false);
                      setShowFloorDropdown(false);
                    }}
                    disabled={!selectedFloorLevel}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition",
                      selectedFloorLevel 
                        ? "border-white/55 bg-white/40 text-stone-700 cursor-pointer" 
                        : "border-white/30 bg-white/20 text-stone-400 cursor-not-allowed"
                    )}
                  >
                    <span>{selectedRoomId ? `Room ${selectedRoom?.number}` : 'Select Room'}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showRoomDropdown && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {showRoomDropdown && selectedFloor && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-white/60 bg-[#f3eee6] shadow-xl overflow-hidden"
                      >
                        <div className="divide-y divide-white/40 max-h-80 overflow-y-auto">
                          {selectedFloor.rooms
                            .filter(r => r.id !== currentRoom?.id && r.students.length < r.capacity && r.status === 'active')
                            .map((room) => {
                              const RoomIcon = getRoomIcon(room.type);
                              return (
                                <button
                                  key={room.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRoomId(room.id);
                                    setShowRoomDropdown(false);
                                  }}
                                  className={cn(
                                    "w-full px-4 py-2.5 text-left transition hover:bg-white/50 flex items-center justify-between",
                                    selectedRoomId === room.id && "bg-[#c3a26c]/10"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <RoomIcon className="h-4 w-4 text-stone-500" />
                                    <div>
                                      <span className="font-medium text-stone-800">Room {room.number}</span>
                                      <p className="text-xs text-stone-400">{room.type} • {room.floorArea}m²</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={cn(
                                      "text-xs px-1.5 py-0.5 rounded-full",
                                      room.students.length === room.capacity 
                                        ? "bg-red-100 text-red-600" 
                                        : "bg-emerald-100 text-emerald-600"
                                    )}>
                                      {room.students.length}/{room.capacity}
                                    </span>
                                    <p className="text-xs font-medium text-stone-700 mt-0.5">
                                      {room.monthlyFee.toLocaleString()}đ
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          {selectedFloor.rooms.filter(r => r.id !== currentRoom?.id && r.students.length < r.capacity && r.status === 'active').length === 0 && (
                            <div className="px-4 py-6 text-center text-sm text-stone-500">
                              No available rooms on this floor
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Selected Room Preview - Compact */}
              {selectedRoom && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-emerald-50/70 border border-emerald-200/60 p-4 mt-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Selected Room</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-stone-600">{selectedBlock?.name} • Floor {selectedFloorLevel}</p>
                      <p className="text-lg font-semibold text-stone-950">Room {selectedRoom.number}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-stone-600">{selectedRoom.type}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-stone-600">{selectedRoom.capacity} beds</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-stone-500">Monthly Fee</p>
                      <p className="text-xl font-bold text-emerald-700">{selectedRoom.monthlyFee.toLocaleString()} VND</p>
                      <p className="text-xs text-emerald-600 mt-1">
                        {selectedRoom.capacity - selectedRoom.students.length} spot(s) available
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="border-t border-white/40 p-4 bg-white/20">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTransfer}
                  disabled={!isTransferValid}
                  className={cn(
                    "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition flex items-center justify-center gap-2",
                    isTransferValid 
                      ? "bg-[#c3a26c] text-white hover:bg-[#b08f5a]" 
                      : "bg-stone-300 text-stone-500 cursor-not-allowed"
                  )}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Confirm Transfer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    resetSelection();
                    onClose();
                  }}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}