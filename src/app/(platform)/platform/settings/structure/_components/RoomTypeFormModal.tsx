// app/(platform)/settings/structure/_components/RoomTypeFormModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomType } from './types';

interface RoomTypeFormModalProps {
  isOpen: boolean;
  roomType: RoomType | null;
  onClose: () => void;
  onSave: (data: Partial<RoomType>) => void;
}

const amenityOptions = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'private_bathroom', label: 'Private Bathroom' },
  { id: 'desk', label: 'Study Desk' },
  { id: 'wardrobe', label: 'Wardrobe' },
  { id: 'tv', label: 'TV' },
  { id: 'mini_fridge', label: 'Mini Fridge' },
  { id: 'fan', label: 'Ceiling Fan' },
  { id: 'water_heater', label: 'Water Heater' },
  { id: 'balcony', label: 'Balcony' },
];

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
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
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all duration-200",
          "border-stone-300 bg-white text-stone-700",
          "hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30",
          !value && "text-stone-400"
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
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

export function RoomTypeFormModal({ isOpen, roomType, onClose, onSave }: RoomTypeFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 4,
    genderRestriction: 'all' as 'all' | 'male' | 'female',
    monthlyFee: 3500000,
    description: '',
    amenities: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    if (roomType) {
      setFormData({
        name: roomType.name,
        capacity: roomType.capacity,
        genderRestriction: roomType.genderRestriction,
        monthlyFee: roomType.monthlyFee,
        description: roomType.description,
        amenities: roomType.amenities,
        isActive: roomType.isActive,
      });
    } else {
      setFormData({
        name: '',
        capacity: 4,
        genderRestriction: 'all',
        monthlyFee: 3500000,
        description: '',
        amenities: [],
        isActive: true,
      });
    }
  }, [roomType, isOpen]);

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const genderOptions = [
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
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40 shrink-0">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  {roomType ? 'Edit Room Type' : 'Add New Room Type'}
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                {roomType ? 'Update room type configuration' : 'Define a new room type for the residence'}
              </p>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Type Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Standard 4-Bed"
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Capacity *</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Gender Restriction</label>
                    <CustomSelect
                      value={formData.genderRestriction}
                      onChange={(value) => setFormData({ ...formData, genderRestriction: value as any })}
                      options={genderOptions}
                      placeholder="Select gender restriction"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1">Monthly Fee (VND) *</label>
                    <input
                      type="number"
                      min={0}
                      step={100000}
                      value={formData.monthlyFee}
                      onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) })}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                      required
                    />
                    <p className="text-xs text-stone-400 mt-1">{formatCurrency(formData.monthlyFee)} VND/month</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Describe this room type..."
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {amenityOptions.map(amenity => {
                      const isSelected = formData.amenities.includes(amenity.id);
                      return (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => toggleAmenity(amenity.id)}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                            isSelected
                              ? "bg-[#c3a26c] text-white"
                              : "bg-white/60 text-stone-600 border border-stone-200 hover:bg-white"
                          )}
                        >
                          {amenity.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-2">Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isActive}
                        onChange={() => setFormData({ ...formData, isActive: true })}
                        className="w-4 h-4 text-[#c3a26c] focus:ring-[#c3a26c]/30"
                      />
                      <span className="text-sm text-stone-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.isActive}
                        onChange={() => setFormData({ ...formData, isActive: false })}
                        className="w-4 h-4 text-[#c3a26c] focus:ring-[#c3a26c]/30"
                      />
                      <span className="text-sm text-stone-700">Inactive</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {roomType ? 'Save Changes' : 'Create Room Type'}
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