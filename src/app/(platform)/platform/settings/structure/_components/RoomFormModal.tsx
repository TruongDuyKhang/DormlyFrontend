// app/(platform)/settings/structure/_components/RoomFormModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, DoorClosed, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Floor, RoomType, Block } from './types';

// Custom Dropdown Component
interface DropdownOption {
  value: string;
  label: string;
}

function CustomDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled = false
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: DropdownOption[]; 
  placeholder: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all duration-200",
          disabled 
            ? "border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
            : "border-stone-300 bg-white text-stone-700 hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30",
          !value && "text-stone-400"
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-stone-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 max-h-60 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-left text-sm transition hover:bg-stone-50",
                value === option.value && "bg-[#c3a26c]/10 text-[#c3a26c] font-medium"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface RoomFormModalProps {
  isOpen: boolean;
  room: Room | null;
  blocks?: Block[];
  floors?: Floor[];
  roomTypes?: RoomType[];
  selectedBlockId?: string;
  selectedFloorId?: string;
  onClose: () => void;
  onSave: (data: Partial<Room>) => void;
}

export function RoomFormModal({ 
  isOpen, 
  room, 
  blocks = [], 
  floors = [], 
  roomTypes = [], 
  selectedBlockId, 
  selectedFloorId, 
  onClose, 
  onSave 
}: RoomFormModalProps) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    blockId: '',
    floorId: '',
    roomTypeId: '',
    capacity: 4,
    genderRestriction: 'all' as 'all' | 'male' | 'female',
    currentOccupants: 0,
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        blockId: room.blockId,
        floorId: room.floorId,
        roomTypeId: room.roomTypeId,
        capacity: room.capacity,
        genderRestriction: room.genderRestriction,
        currentOccupants: room.currentOccupants,
      });
    } else {
      const defaultBlockId = selectedBlockId || blocks[0]?.id || '';
      const availableFloors = floors.filter((f) => f.blockId === defaultBlockId);
      const defaultFloorId = selectedFloorId || availableFloors[0]?.id || '';
      const defaultRoomTypeId = roomTypes[0]?.id || '';
      
      setFormData({
        roomNumber: '',
        blockId: defaultBlockId,
        floorId: defaultFloorId,
        roomTypeId: defaultRoomTypeId,
        capacity: 4,
        genderRestriction: 'all',
        currentOccupants: 0,
      });
    }
  }, [room, selectedBlockId, selectedFloorId, blocks, floors, roomTypes, isOpen]);

  // Filter floors based on selected block
  const availableFloors = floors.filter((f) => f.blockId === formData.blockId);

  const handleBlockChange = (blockId: string) => {
    const blockFloors = floors.filter((f) => f.blockId === blockId);
    setFormData({
      ...formData,
      blockId,
      floorId: blockFloors[0]?.id || '',
    });
  };

  const handleRoomTypeChange = (roomTypeId: string) => {
    const selectedType = roomTypes.find((rt) => rt.id === roomTypeId);
    setFormData({
      ...formData,
      roomTypeId,
      capacity: selectedType?.capacity || 4,
      genderRestriction: selectedType?.genderRestriction || 'all',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBlock = blocks.find((b) => b.id === formData.blockId);
    const selectedFloor = floors.find((f) => f.id === formData.floorId);
    const selectedType = roomTypes.find((rt) => rt.id === formData.roomTypeId);

    onSave({
      ...formData,
      blockName: selectedBlock?.name || '',
      floorLevel: selectedFloor?.level || 1,
      roomTypeName: selectedType?.name || 'Standard Room',
      status: 'available',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/10 text-[#c3a26c]">
                  <DoorClosed className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-800">
                    {room ? 'Edit Room' : 'Add New Room'}
                  </h3>
                  <p className="text-xs text-stone-500">Configure room specifications</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Block & Floor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Block
                  </label>
                  <CustomDropdown
                    value={formData.blockId}
                    onChange={handleBlockChange}
                    options={blocks.map((b) => ({ value: b.id, label: b.name }))}
                    placeholder="Select Block"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Floor
                  </label>
                  <CustomDropdown
                    value={formData.floorId}
                    onChange={(val) => setFormData({ ...formData, floorId: val })}
                    options={availableFloors.map((f) => ({ value: f.id, label: `Floor ${f.level}` }))}
                    placeholder="Select Floor"
                    disabled={!formData.blockId}
                  />
                </div>
              </div>

              {/* Room Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Room Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="e.g. A101"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              {/* Room Type */}
              {roomTypes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Room Type
                  </label>
                  <CustomDropdown
                    value={formData.roomTypeId}
                    onChange={handleRoomTypeChange}
                    options={roomTypes.map((rt) => ({
                      value: rt.id,
                      label: `${rt.name} (${rt.capacity} beds)`,
                    }))}
                    placeholder="Select Room Type"
                  />
                </div>
              )}

              {/* Capacity & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 focus:border-[#c3a26c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Gender Policy
                  </label>
                  <select
                    value={formData.genderRestriction}
                    onChange={(e) => setFormData({ ...formData, genderRestriction: e.target.value as any })}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 focus:border-[#c3a26c] focus:outline-none"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  Save Room
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}