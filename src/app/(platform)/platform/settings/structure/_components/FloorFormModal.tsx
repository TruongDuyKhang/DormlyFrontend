// app/(platform)/settings/structure/_components/FloorFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Floor, Block } from './types';

interface FloorFormModalProps {
  isOpen: boolean;
  floor: Floor | null;
  selectedBlock: Block | null;
  blocks?: Block[];
  onClose: () => void;
  onSave: (data: { blockId: string; level: number; description: string }) => void;
}

export function FloorFormModal({ isOpen, floor, selectedBlock, blocks = [], onClose, onSave }: FloorFormModalProps) {
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
  }, [floor, selectedBlock, blocks, isOpen]);

  const selectedBlockObj = blocks.find((b) => b.id === formData.blockId) || selectedBlock;

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
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-800">
                    {floor ? 'Edit Floor' : 'Add New Floor'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Configure floor details for {selectedBlockObj?.name || 'Building'}
                  </p>
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
              {/* Block Selection if multiple available */}
              {blocks.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Residence Block
                  </label>
                  <select
                    value={formData.blockId}
                    onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 focus:border-[#c3a26c] focus:outline-none"
                  >
                    {blocks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Floor Level
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Standard floor with study lounge and laundry facilities"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-700 focus:border-[#c3a26c] focus:outline-none"
                />
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
                  Save Floor
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}