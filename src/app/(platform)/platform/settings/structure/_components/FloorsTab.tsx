// app/(platform)/settings/structure/_components/FloorsTab.tsx
'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Layers, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Floor, Block } from './types';
import { floors as initialFloors, blocks } from './mockData';
import { FloorFormModal } from './FloorFormModal';
import { ConfirmModal } from './ConfirmModal';

export function FloorsTab() {
  const [floors, setFloors] = useState(initialFloors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingFloor(null);
    setSelectedBlock(null);
    setIsModalOpen(true);
  };

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      setFloors(prev => prev.filter(f => f.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = (data: { blockId: string; level: number; description: string }) => {
    const block = blocks.find(b => b.id === data.blockId);
    if (editingFloor) {
      setFloors(prev => prev.map(f =>
        f.id === editingFloor.id
          ? { ...f, ...data, blockName: block?.name || '', updatedAt: new Date().toISOString() }
          : f
      ));
    } else {
      const newFloor: Floor = {
        id: `floor-${Date.now()}`,
        ...data,
        blockName: block?.name || '',
        roomCount: 0,
        occupancyRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setFloors(prev => [...prev, newFloor]);
    }
    setIsModalOpen(false);
  };

  const floorsByBlock = blocks.map(block => ({
    ...block,
    floors: floors.filter(f => f.blockId === block.id).sort((a, b) => a.level - b.level),
  })).filter(b => b.floors.length > 0);

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-amber-600';
    if (rate >= 70) return 'text-emerald-600';
    return 'text-stone-500';
  };

  const getOccupancyBg = (rate: number) => {
    if (rate >= 90) return 'bg-amber-100';
    if (rate >= 70) return 'bg-emerald-100';
    return 'bg-stone-100';
  };

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
            Add Floor
          </button>
        </div>

        {/* Floors by Block */}
        <div className="space-y-5">
          {floorsByBlock.map((block) => (
            <div key={block.id} className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm">
              <div className="bg-stone-100 px-5 py-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-stone-500" />
                  <h3 className="font-semibold text-stone-900">{block.name}</h3>
                  <span className="text-sm text-stone-400">({block.floors.length} floors)</span>
                </div>
              </div>
              <div className="divide-y divide-stone-100">
                {block.floors.map((floor) => (
                  <div key={floor.id} className="flex items-center justify-between p-4 hover:bg-stone-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
                        <Layers className="h-5 w-5 text-[#c3a26c]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-stone-900">Floor {floor.level}</p>
                          {floor.description && (
                            <span className="text-sm text-stone-400">• {floor.description}</span>
                          )}
                        </div>
                        {floor.description && (
                          <p className="text-sm text-stone-500 mt-0.5">{floor.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-sm text-stone-600">{floor.roomCount} rooms</span>
                          <span className="text-stone-300">•</span>
                          <span className={cn("text-sm font-medium", getOccupancyColor(floor.occupancyRate))}>
                            {floor.occupancyRate}% occupied
                          </span>
                          <span className={cn("ml-1 inline-block h-2 w-2 rounded-full", getOccupancyBg(floor.occupancyRate).replace('bg-', 'bg-'))} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(floor)}
                        className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(floor.id)}
                        className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {floorsByBlock.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            No floors added yet. Click "Add Floor" to create one.
          </div>
        )}
      </div>

      <FloorFormModal
        isOpen={isModalOpen}
        floor={editingFloor}
        selectedBlock={selectedBlock}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Floor"
        message="Are you sure you want to delete this floor? All rooms on this floor will also be removed. This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
}