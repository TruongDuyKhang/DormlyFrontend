// app/(platform)/settings/structure/_components/FloorFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Floor, Block } from './types';
import { blocks } from './mockData';

interface FloorFormModalProps {
  isOpen: boolean;
  floor: Floor | null;
  selectedBlock: Block | null;
  onClose: () => void;
  onSave: (data: { blockId: string; level: number; description: string }) => void;
}

export function FloorFormModal({ isOpen, floor, selectedBlock, onClose, onSave }: FloorFormModalProps) {
  const [formData, setFormData] = useState({
    blockId: '',
    level: 1,
    description: '',
  });

  useEffect(() => {
    if (floor) {
      setFormData({
        blockId: floor.blockId,
        level: floor.level,
        description: floor.description,
      });
    } else if (selectedBlock) {
      setFormData({
        blockId: selectedBlock.id,
        level: 1,
        description: '',
      });
    } else {
      setFormData({
        blockId: blocks[0]?.id || '',
        level: 1,
        description: '',
      });
    }
  }, [floor, selectedBlock, isOpen]);

  const selectedBlockObj = blocks.find(b => b.id === formData.blockId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
            className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  {floor ? 'Edit Floor' : 'Add New Floor'}
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                {floor ? 'Update floor information' : 'Add a new floor to a block'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Block *</label>
                <select
                  value={formData.blockId}
                  onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                  required
                  disabled={!!selectedBlock}
                >
                  {blocks.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Floor Level *</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Room Count</label>
                  <input
                    type="text"
                    value={floor ? `${floor.roomCount} rooms` : 'Will be auto-calculated'}
                    disabled
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="e.g., Ground floor, Main entrance..."
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {floor ? 'Save Changes' : 'Create Floor'}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}