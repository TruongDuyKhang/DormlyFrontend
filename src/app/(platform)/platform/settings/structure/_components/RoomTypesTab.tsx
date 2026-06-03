// app/(platform)/settings/structure/_components/RoomTypesTab.tsx
'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Bed, DollarSign, Wifi, Wind, Bath, Tv, Fan, Flame, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomType } from './types';
import { roomTypes as initialRoomTypes } from './mockData';
import { RoomTypeFormModal } from './RoomTypeFormModal';
import { ConfirmModal } from './ConfirmModal';

export function RoomTypesTab() {
  const [roomTypes, setRoomTypes] = useState(initialRoomTypes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type: RoomType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      setRoomTypes(prev => prev.filter(t => t.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = (data: Partial<RoomType>) => {
    if (editingType) {
      setRoomTypes(prev => prev.map(t =>
        t.id === editingType.id
          ? { ...t, ...data, updatedAt: new Date().toISOString() }
          : t
      ));
    } else {
      const newType: RoomType = {
        id: `type-${Date.now()}`,
        ...data as any,
        isActive: true,
        amenities: data.amenities || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRoomTypes(prev => [...prev, newType]);
    }
    setIsModalOpen(false);
  };

  const getGenderLabel = (gender: string) => {
    switch(gender) {
      case 'male': return 'Male Only';
      case 'female': return 'Female Only';
      default: return 'All Genders';
    }
  };

  const getGenderColor = (gender: string) => {
    switch(gender) {
      case 'male': return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'female': return 'bg-pink-200 text-pink-800 border-pink-300';
      default: return 'bg-emerald-200 text-emerald-800 border-emerald-300';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  // Map amenities to icons (giống phong cách Sidebar)
  const getAmenityIcon = (amenity: string) => {
    switch(amenity) {
      case 'wifi': return <Wifi className="h-3 w-3" />;
      case 'ac': return <Wind className="h-3 w-3" />;
      case 'private_bathroom': return <Bath className="h-3 w-3" />;
      case 'desk': return <Square className="h-3 w-3" />;
      case 'wardrobe': return <Square className="h-3 w-3" />;
      case 'tv': return <Tv className="h-3 w-3" />;
      case 'mini_fridge': return <Flame className="h-3 w-3" />;
      case 'fan': return <Fan className="h-3 w-3" />;
      case 'water_heater': return <Flame className="h-3 w-3" />;
      case 'balcony': return <Square className="h-3 w-3" />;
      default: return null;
    }
  };

  const getAmenityLabel = (amenity: string) => {
    const labels: Record<string, string> = {
      wifi: 'Wi-Fi',
      ac: 'AC',
      private_bathroom: 'Private Bath',
      desk: 'Desk',
      wardrobe: 'Wardrobe',
      tv: 'TV',
      mini_fridge: 'Mini Fridge',
      fan: 'Fan',
      water_heater: 'Water Heater',
      balcony: 'Balcony',
    };
    return labels[amenity] || amenity;
  };

  const activeTypes = roomTypes.filter(t => t.isActive).length;

  return (
    <>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Room Type
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{roomTypes.length}</p>
            <p className="text-xs text-stone-500">Total Types</p>
          </div>
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{activeTypes}</p>
            <p className="text-xs text-stone-500">Active Types</p>
          </div>
        </div>

        {/* Room Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roomTypes.map((type) => (
            <div
              key={type.id}
              className={cn(
                "rounded-xl border bg-white p-5 shadow-sm transition-all",
                !type.isActive && "border-stone-200 opacity-60",
                type.isActive && "border-stone-200 hover:shadow-md"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
                    <Tag className="h-5 w-5 text-[#c3a26c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">{type.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold border", getGenderColor(type.genderRestriction))}>
                        {getGenderLabel(type.genderRestriction)}
                      </span>
                      {type.isActive ? (
                        <span className="rounded-md bg-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-md bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-600 border border-stone-300">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(type)}
                    className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(type.id)}
                    className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-stone-600">
                    <Bed className="h-4 w-4 text-stone-400" />
                    <span>Capacity: {type.capacity} beds</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <DollarSign className="h-4 w-4 text-stone-400" />
                    <span>{formatCurrency(type.monthlyFee)}/month</span>
                  </div>
                </div>
                <p className="text-sm text-stone-500 line-clamp-2">{type.description || 'No description'}</p>
                
                {/* Amenities preview with icons */}
                {type.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {type.amenities.slice(0, 4).map(amenity => (
                      <span key={amenity} className="inline-flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded-full">
                        {getAmenityIcon(amenity)}
                        {getAmenityLabel(amenity)}
                      </span>
                    ))}
                    {type.amenities.length > 4 && (
                      <span className="text-xs text-stone-400">+{type.amenities.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {roomTypes.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            No room types added yet. Click "Add Room Type" to create one.
          </div>
        )}
      </div>

      <RoomTypeFormModal
        isOpen={isModalOpen}
        roomType={editingType}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Room Type"
        message="Are you sure you want to delete this room type? Rooms using this type will need to be reassigned. This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
}