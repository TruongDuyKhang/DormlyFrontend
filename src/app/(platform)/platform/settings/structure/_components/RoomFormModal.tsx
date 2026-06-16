// app/(platform)/settings/structure/_components/RoomFormModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, DoorClosed, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Floor, RoomType, Block } from './types';
import { blocks, floors, roomTypes } from './mockData';

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
  const selectedOption = options.find(opt => opt.value === value);

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
  onClose: () => void;
  onSave: (data: Partial<Room>) => void;
  selectedBlockId?: string;
  selectedFloorId?: string;
}

export function RoomFormModal({ isOpen, room, onClose, onSave, selectedBlockId, selectedFloorId }: RoomFormModalProps) {
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
      setFormData({
        roomNumber: '',
        blockId: selectedBlockId || (blocks.length > 0 ? blocks[0].id : ''),
        floorId: selectedFloorId || '',
        roomTypeId: roomTypes.length > 0 ? roomTypes[0].id : '',
        capacity: 4,
        genderRestriction: 'all',
        currentOccupants: 0,
      });
    }
  }, [room, isOpen, selectedBlockId, selectedFloorId]);

  // Get floors for selected block
  const availableFloors = floors.filter(f => f.blockId === formData.blockId);
  
  // Get selected room type
  const selectedRoomType = roomTypes.find(rt => rt.id === formData.roomTypeId);
  
  // Update capacity when room type changes
  useEffect(() => {
    if (selectedRoomType) {
      setFormData(prev => ({
        ...prev,
        capacity: selectedRoomType.capacity,
        genderRestriction: selectedRoomType.genderRestriction,
      }));
    }
  }, [formData.roomTypeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const block = blocks.find(b => b.id === formData.blockId);
    const floor = floors.find(f => f.id === formData.floorId);
    const roomType = roomTypes.find(rt => rt.id === formData.roomTypeId);
    
    onSave({
      ...formData,
      blockName: block?.name || '',
      floorLevel: floor?.level || 0,
      roomTypeName: roomType?.name || '',
      status: 'available' as const,
    });
    onClose();
  };

  // Options
  const blockOptions: DropdownOption[] = blocks
    .filter(b => b.status === 'active')
    .map(b => ({ value: b.id, label: `${b.name} (${b.code})` }));

  const floorOptions: DropdownOption[] = availableFloors
    .map(f => ({ value: f.id, label: `Floor ${f.level}${f.description ? ` - ${f.description}` : ''}` }));

  const roomTypeOptions: DropdownOption[] = roomTypes
    .filter(rt => rt.isActive)
    .map(rt => ({ value: rt.id, label: `${rt.name} (${rt.capacity} beds)` }));

  const genderOptions: DropdownOption[] = [
    { value: 'all', label: 'All Genders' },
    { value: 'male', label: 'Male Only' },
    { value: 'female', label: 'Female Only' },
  ];

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
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <DoorClosed className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  {room ? 'Edit Room' : 'Add New Room'}
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                {room ? 'Update room information' : 'Add a new room to the residence'}
              </p>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Room Number *</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g., A101"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Block *</label>
                    <CustomDropdown
                      value={formData.blockId}
                      onChange={(value) => setFormData({ ...formData, blockId: value, floorId: '' })}
                      options={blockOptions}
                      placeholder="Select block"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Floor *</label>
                    <CustomDropdown
                      value={formData.floorId}
                      onChange={(value) => setFormData({ ...formData, floorId: value })}
                      options={floorOptions}
                      placeholder={availableFloors.length > 0 ? "Select floor" : "No floors available"}
                      disabled={availableFloors.length === 0}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Room Type *</label>
                    <CustomDropdown
                      value={formData.roomTypeId}
                      onChange={(value) => setFormData({ ...formData, roomTypeId: value })}
                      options={roomTypeOptions}
                      placeholder="Select room type"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Gender Restriction</label>
                    <CustomDropdown
                      value={formData.genderRestriction}
                      onChange={(value) => setFormData({ ...formData, genderRestriction: value as any })}
                      options={genderOptions}
                      placeholder="Select gender"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-stone-400 mt-1">Auto-set from room type</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Current Occupants</label>
                  <input
                    type="number"
                    min={0}
                    max={formData.capacity}
                    value={formData.currentOccupants}
                    onChange={(e) => setFormData({ ...formData, currentOccupants: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {room ? 'Save Changes' : 'Create Room'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}