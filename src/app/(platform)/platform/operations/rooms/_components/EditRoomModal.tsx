// app/(platform)/operations/rooms/_components/EditRoomModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, roomTypes, amenitiesList } from './types';

interface EditRoomModalProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
  onSave: (updatedRoom: Room) => void;
}

export function EditRoomModal({ isOpen, room, onClose, onSave }: EditRoomModalProps) {
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  if (!isOpen || !room) return null;
  
  const currentType = (formData.type || room.type) as keyof typeof roomTypes;
  const selectedTypeInfo = roomTypes[currentType];
  
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Archived' },
  ];
  
  const currentStatus = (formData.status || room.status) as string;
  const selectedStatus = statusOptions.find(s => s.value === currentStatus);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...room,
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onClose();
  };
  
  const handleTypeSelect = (type: string) => {
    const typeInfo = roomTypes[type];
    setFormData({ 
      ...formData, 
      type: type as any,
      capacity: typeInfo.capacity,
    });
    setShowTypeDropdown(false);
  };
  
  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = (formData.amenities || room.amenities);
    setFormData({
      ...formData,
      amenities: currentAmenities.includes(amenityId)
        ? currentAmenities.filter(a => a !== amenityId)
        : [...currentAmenities, amenityId],
    });
  };
  
  const currentAmenities = formData.amenities || room.amenities;
  
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
            className="relative w-full max-w-3xl rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <Home className="h-6 w-6 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Edit Room {room.number}</h2>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Room Type */}
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
                                  currentType === key && "bg-[#c3a26c]/10 text-[#c3a26c]",
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
                  
                  {/* Capacity */}
                  <div>
                    <label className="text-sm font-medium text-stone-950 mb-1 block">Capacity</label>
                    <input
                      type="number"
                      defaultValue={room.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      min={1}
                      max={6}
                      className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                    />
                  </div>
                  
                  {/* Monthly Fee */}
                  <div>
                    <label className="text-sm font-medium text-stone-950 mb-1 block">Monthly Fee (VND)</label>
                    <input
                      type="number"
                      defaultValue={room.monthlyFee}
                      onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) })}
                      className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                    />
                  </div>
                  
                  {/* Floor Area */}
                  <div>
                    <label className="text-sm font-medium text-stone-950 mb-1 block">Floor Area (m²)</label>
                    <input
                      type="number"
                      defaultValue={room.floorArea}
                      onChange={(e) => setFormData({ ...formData, floorArea: parseInt(e.target.value) })}
                      className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition"
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  {/* Status */}
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
                                  currentStatus === option.value && "bg-[#c3a26c]/10 text-[#c3a26c]",
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
                  
                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-medium text-stone-950 mb-2 block">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map((amenity) => {
                        const isSelected = currentAmenities.includes(amenity.id);
                        return (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => toggleAmenity(amenity.id)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all",
                              isSelected
                                ? "bg-[#c3a26c] text-white shadow-sm"
                                : "bg-white/40 text-stone-600 border border-white/55 hover:bg-white/60"
                            )}
                          >
                            <amenity.icon className="h-3 w-3" />
                            {amenity.label}
                            {isSelected && <Check className="h-2.5 w-2.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-stone-950 mb-1 block">Description</label>
                    <textarea
                      defaultValue={room.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-xl border border-white/55 bg-white/40 px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 transition resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 mt-4 border-t border-white/40">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition"
                >
                  Save Changes
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