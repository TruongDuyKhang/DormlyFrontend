// app/(platform)/settings/structure/_components/BlocksTab.tsx
'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block } from './types';
import { blocks as initialBlocks } from './mockData';
import { BlockFormModal } from './BlockFormModal';
import { ConfirmModal } from './ConfirmModal';

export function BlocksTab() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const handleEdit = (block: Block) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      setBlocks(prev => prev.filter(b => b.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = (data: Partial<Block>) => {
    if (editingBlock) {
      setBlocks(prev => prev.map(b =>
        b.id === editingBlock.id
          ? { ...b, ...data, updatedAt: new Date().toISOString() }
          : b
      ));
    } else {
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        ...data as any,
        floorCount: 0,
        roomCount: 0,
        totalCapacity: 0,
        currentOccupancy: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBlocks(prev => [...prev, newBlock]);
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

  // Calculate stats
  const totalBlocks = blocks.length;
  const totalFloors = blocks.reduce((acc, b) => acc + b.floorCount, 0);
  const totalRooms = blocks.reduce((acc, b) => acc + b.roomCount, 0);
  const totalOccupancy = Math.round(
    blocks.reduce((acc, b) => acc + b.currentOccupancy, 0) / 
    blocks.reduce((acc, b) => acc + b.totalCapacity, 0) * 100
  );

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
            Add Block
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{totalBlocks}</p>
            <p className="text-xs text-stone-500">Total Blocks</p>
          </div>
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{totalFloors}</p>
            <p className="text-xs text-stone-500">Total Floors</p>
          </div>
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{totalRooms}</p>
            <p className="text-xs text-stone-500">Total Rooms</p>
          </div>
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{totalOccupancy}%</p>
            <p className="text-xs text-stone-500">Overall Occupancy</p>
          </div>
        </div>

        {/* Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={cn(
                "rounded-xl border bg-white p-5 shadow-sm transition-all",
                block.status === 'inactive' ? "border-stone-200 opacity-60" : "border-stone-200 hover:shadow-md"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15">
                    <Building2 className="h-5 w-5 text-[#c3a26c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">{block.name}</h3>
                    <p className="text-sm text-stone-500">Code: {block.code}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(block)}
                    className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(block.id)}
                    className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="h-4 w-4 text-stone-400" />
                  <span className="line-clamp-1">{block.description || 'No description'}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold border", getGenderColor(block.genderRestriction))}>
                    {getGenderLabel(block.genderRestriction)}
                  </span>
                  <span className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-semibold border",
                    block.status === 'active' 
                      ? "bg-emerald-200 text-emerald-800 border-emerald-300" 
                      : "bg-stone-200 text-stone-600 border-stone-300"
                  )}>
                    {block.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-stone-500">Floors</p>
                    <p className="text-lg font-semibold text-stone-800">{block.floorCount}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Rooms</p>
                    <p className="text-lg font-semibold text-stone-800">{block.roomCount}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Occupancy</p>
                    <p className="text-lg font-semibold text-stone-800">
                      {Math.round((block.currentOccupancy / block.totalCapacity) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#c3a26c]"
                    style={{ width: `${(block.currentOccupancy / block.totalCapacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {blocks.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            No blocks added yet. Click "Add Block" to create one.
          </div>
        )}
      </div>

      <BlockFormModal
        isOpen={isModalOpen}
        block={editingBlock}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Block"
        message="Are you sure you want to delete this block? All floors and rooms in this block will also be removed. This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
}