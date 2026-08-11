// app/(platform)/settings/structure/_components/RoomTypesTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Tag, Bed, DollarSign, Wifi, Wind, Bath, Tv, Fan, Flame, Square, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RoomType } from './types';
import { RoomTypeFormModal } from './RoomTypeFormModal';
import { ConfirmModal } from './ConfirmModal';
import { buildingService } from '@/services/buildingService';
import type { NodeTypeResponseDto } from '@/types/models';

function mapNodeTypeToRoomType(nt: NodeTypeResponseDto): RoomType {
  return {
    id: nt.id,
    name: nt.name,
    capacity: 4,
    genderRestriction: 'all',
    monthlyFee: 1500000,
    description: nt.description || 'Standard accommodation category designed for comfortable communal living.',
    amenities: ['wifi', 'ac', 'private_bathroom', 'desk'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function RoomTypesTab() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRoomTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const types = await buildingService.listNodeTypes();
      if (types && types.length > 0) {
        const mapped = types.map(mapNodeTypeToRoomType);
        setRoomTypes(mapped);
      } else {
        setRoomTypes([]);
      }
    } catch (err) {
      console.error('Failed to load node types from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoomTypes();
  }, [loadRoomTypes]);

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

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      try {
        await buildingService.deleteNodeType(deletingId).catch(() => {});
      } catch (err) {
        console.warn(err);
      }
      setRoomTypes((prev) => prev.filter((t) => t.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = async (data: Partial<RoomType>) => {
    if (editingType) {
      setRoomTypes((prev) =>
        prev.map((t) =>
          t.id === editingType.id
            ? { ...t, ...data, updatedAt: new Date().toISOString() }
            : t
        )
      );
    } else {
      let createdId = `type-${Date.now()}`;
      try {
        const res = await buildingService
          .createNodeType({
            name: data.name || 'Standard Room',
            level: 2,
            description: data.description,
          })
          .catch(() => null);
        if (res?.id) createdId = res.id;
      } catch (err) {
        console.warn(err);
      }

      const newType: RoomType = {
        id: createdId,
        name: data.name || 'Standard Room',
        capacity: data.capacity || 4,
        genderRestriction: data.genderRestriction || 'all',
        monthlyFee: data.monthlyFee || 1500000,
        description: data.description || '',
        isActive: true,
        amenities: data.amenities || ['wifi', 'ac', 'desk'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRoomTypes((prev) => [...prev, newType]);
    }
    setIsModalOpen(false);
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Male Only';
      case 'female':
        return 'Female Only';
      default:
        return 'All Genders';
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'female':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'ac':
        return <Wind className="h-3 w-3" />;
      case 'private_bathroom':
        return <Bath className="h-3 w-3" />;
      case 'desk':
        return <Square className="h-3 w-3" />;
      case 'wardrobe':
        return <Square className="h-3 w-3" />;
      case 'tv':
        return <Tv className="h-3 w-3" />;
      case 'fan':
        return <Fan className="h-3 w-3" />;
      case 'heater':
        return <Flame className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return 'Wi-Fi';
      case 'ac':
        return 'Air Conditioning';
      case 'private_bathroom':
        return 'Private Bathroom';
      case 'desk':
        return 'Study Desk';
      case 'wardrobe':
        return 'Wardrobe';
      case 'tv':
        return 'TV';
      case 'fan':
        return 'Fan';
      case 'heater':
        return 'Water Heater';
      default:
        return amenity;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {roomTypes.length} Room Types Configured
            </span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#c3a26c]" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadRoomTypes}
              className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Sync API
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Room Type
            </button>
          </div>
        </div>

        {/* Room Types Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Loading node types from API...</span>
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/20">
            <Tag className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium">No node types found in API.</p>
            <p className="text-xs text-stone-400 mt-1">Click &quot;Add Room Type&quot; to configure your accommodation categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((type) => (
              <div
                key={type.id}
                className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-sm p-5 hover:border-[#c3a26c]/60 transition-all space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-[#c3a26c]" />
                      <h3 className="font-semibold text-stone-800 text-lg">{type.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                      <Bed className="h-3.5 w-3.5" />
                      <span>{type.capacity} occupants</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getGenderColor(type.genderRestriction)
                    )}
                  >
                    {getGenderLabel(type.genderRestriction)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2">{type.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 pt-2 border-t border-white/40">
                  <span className="text-2xl font-bold text-[#c3a26c]">
                    {formatCurrency(type.monthlyFee)}
                  </span>
                  <span className="text-xs text-stone-500">VND/month</span>
                </div>

                {/* Amenities */}
                {type.amenities && type.amenities.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-medium text-stone-500">Included Amenities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {type.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/60 text-xs text-stone-600"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{getAmenityLabel(amenity)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-white/40">
                  <button
                    onClick={() => handleEdit(type)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-white/60 transition"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(type.id)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-white/60 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
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
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Room Type"
        message="Are you sure you want to delete this room type?"
      />
    </>
  );
}