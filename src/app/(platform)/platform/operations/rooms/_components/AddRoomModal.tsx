// app/(platform)/operations/rooms/_components/AddRoomModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { roomTypes, amenitiesList, Room } from './types';

interface AddRoomModalProps {
  isOpen: boolean;
  blockId: string;
  floorLevel: number;
  existingRoomNumbers: string[];
  onClose: () => void;
  onAdd: (roomData: Room) => void;
}

export function AddRoomModal({ isOpen, blockId, floorLevel, existingRoomNumbers, onClose, onAdd }: AddRoomModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    type: 'double' as 'single' | 'double' | 'quad' | 'vip',
    capacity: 2,
    monthlyFee: 2500000,
    floorArea: 24,
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    amenities: [] as string[],
    description: '',
  });
  
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  if (!isOpen) return null;
  
  const isNumberDuplicate = existingRoomNumbers.includes(formData.number);
  const isValid = formData.number.trim() !== '' && !isNumberDuplicate && formData.monthlyFee > 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const newRoom: Room = {
        id: `${blockId}-f${floorLevel}-r${formData.number}`,
        number: formData.number,
        type: formData.type,
        capacity: formData.capacity,
        students: [],
        status: formData.status,
        amenities: formData.amenities,
        floorArea: formData.floorArea,
        monthlyFee: formData.monthlyFee,
        description: formData.description,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onAdd(newRoom);
      onClose();
    }
  };
  
  const handleTypeSelect = (type: string) => {
    const typeInfo = roomTypes[type];
    setFormData({
      ...formData,
      type: type as any,
      capacity: typeInfo.capacity,
      floorArea: type === 'single' ? 18 : type === 'double' ? 24 : type === 'quad' ? 36 : 32,
    });
    setShowTypeDropdown(false);
  };
  
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Archived' },
  ];
  
  const selectedStatus = statusOptions.find(s => s.value === formData.status);
  
  const toggleAmenity = (amenityId: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenityId)
        ? formData.amenities.filter(a => a !== amenityId)
        : [...formData.amenities, amenityId],
    });
  };
  
  const selectedTypeInfo = roomTypes[formData.type];
  
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
                <Plus className="h-6 w-6 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Add New Room</h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">Block {blockId.split('-')[1]} • Floor {floorLevel}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Room Number */}
              <div>
                <label className="text-sm font-medium text-stone-950 mb-1 block">Room Number *</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., 101, 102, 201"
                  className={cn(
                    "w-full rounded-xl border bg-white/40 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition",
                    isNumberDuplicate && formData.number ? "border-red-400 bg-red-50/30" : "border-white/55"
                  )}
                />
                {isNumberDuplicate && (
                  <p className="text-xs text-red-500 mt-1">Room number already exists on this floor</p>
                )}
              </div>
              
              {/* Room Type - Custom Dropdown with rounded corners */}
              <div>
                <label className="text-sm font-medium text-stone-950 mb-1 block">Room Type</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowStatusDropdown(false);
                    }}
                    className="w-full flex items-center justify-between rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                  >
                    <span className="flex items-center gap-2">
                      <selectedTypeInfo.icon className="h-4 w-4" />
                      {selectedTypeInfo.displayName}
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showTypeDropdown && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {showTypeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 z-10 rounded-xl border border-white/60 bg-[#f3eee6] shadow-xl overflow-hidden"
                      >
                        {Object.entries(roomTypes).map(([key, value]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleTypeSelect(key)}
                            className={cn(
                              "w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition hover:bg-white/50",
                              formData.type === key && "bg-[#c3a26c]/10 text-[#c3a26c]",
                              "first:rounded-t-xl last:rounded-b-xl"
                            )}
                          >
                            <value.icon className="h-4 w-4" />
                            {value.displayName}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Monthly Fee */}
                <div>
                  <label className="text-sm font-medium text-stone-950 mb-1 block">Monthly Fee (VND) *</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) || 0 })}
                    placeholder="Enter monthly fee"
                    className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                  />
                </div>
                
                {/* Floor Area */}
                <div>
                  <label className="text-sm font-medium text-stone-950 mb-1 block">Floor Area (m²)</label>
                  <input
                    type="number"
                    value={formData.floorArea}
                    onChange={(e) => setFormData({ ...formData, floorArea: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                  />
                </div>
              </div>
              
              {/* Status - Custom Dropdown with rounded corners */}
              <div>
                <label className="text-sm font-medium text-stone-950 mb-1 block">Status</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowTypeDropdown(false);
                    }}
                    className="w-full flex items-center justify-between rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                  >
                    <span>{selectedStatus?.label}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showStatusDropdown && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {showStatusDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 z-10 rounded-xl border border-white/60 bg-[#f3eee6] shadow-xl overflow-hidden"
                      >
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, status: option.value as any });
                              setShowStatusDropdown(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2.5 text-sm text-left transition hover:bg-white/50",
                              formData.status === option.value && "bg-[#c3a26c]/10 text-[#c3a26c]",
                              "first:rounded-t-xl last:rounded-b-xl"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Amenities - Custom Checkbox */}
              <div>
                <label className="text-sm font-medium text-stone-950 mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-3">
                  {amenitiesList.map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all",
                          isSelected
                            ? "bg-[#c3a26c] text-white shadow-sm"
                            : "bg-white/40 text-stone-600 border border-white/55 hover:bg-white/60"
                        )}
                      >
                        <amenity.icon className="h-3.5 w-3.5" />
                        {amenity.label}
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="text-sm font-medium text-stone-950 mb-1 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Describe the room features and amenities..."
                  className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isValid}
                  className={cn(
                    "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
                    isValid ? "bg-[#c3a26c] hover:bg-[#b08f5a]" : "bg-stone-300 cursor-not-allowed"
                  )}
                >
                  Create Room
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}