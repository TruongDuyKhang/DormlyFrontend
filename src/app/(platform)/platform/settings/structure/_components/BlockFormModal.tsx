'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Building2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Block } from './types';

interface BlockFormModalProps {
  isOpen: boolean;
  block: Block | null;
  onClose: () => void;
  onSave: (data: Partial<Block>) => void;
}

// CustomSelect dùng portal — dropdown render thẳng vào document.body,
// không bao giờ bị cắt bởi overflow của modal hay form.
function CustomSelect({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  // Tính toán vị trí dropdown dựa trên vị trí trigger button
  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Đóng nếu click ra ngoài trigger và dropdown
      if (triggerRef.current && !triggerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    // Cập nhật vị trí khi scroll hoặc resize
    const handleRepositionOrClose = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleRepositionOrClose, true);
    window.addEventListener('resize', handleRepositionOrClose);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleRepositionOrClose, true);
      window.removeEventListener('resize', handleRepositionOrClose);
    };
  }, [isOpen]);

  const dropdown = isOpen
    ? createPortal(
        <div
          style={dropdownStyle}
          className="rounded-xl border border-stone-200 bg-white shadow-lg overflow-hidden"
        >
          <div className="max-h-48 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(e) => {
                  // onMouseDown evita que el blur del trigger cierre el dropdown antes de seleccionar
                  e.preventDefault();
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm transition hover:bg-stone-50',
                  value === option.value && 'bg-[#c3a26c]/10 text-[#c3a26c] font-medium'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
        className={cn(
          'w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all duration-200',
          'border-stone-300 bg-white text-stone-700',
          'hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30',
          !value && 'text-stone-400'
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {dropdown}
    </>
  );
}

export function BlockFormModal({ isOpen, block, onClose, onSave }: BlockFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    genderRestriction: 'all' as 'all' | 'male' | 'female',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (block) {
      setFormData({
        name: block.name,
        code: block.code,
        description: block.description,
        genderRestriction: block.genderRestriction,
        status: block.status,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        genderRestriction: 'all',
        status: 'active',
      });
    }
  }, [block, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const genderOptions = [
    { value: 'all', label: 'All Genders' },
    { value: 'male', label: 'Male Only' },
    { value: 'female', label: 'Female Only' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
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
            className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40 rounded-t-2xl">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  {block ? 'Edit Block' : 'Add New Block'}
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                {block ? 'Update block information' : 'Create a new residence block'}
              </p>
            </div>

            {/* Form — KHÔNG có overflow-y-auto để dropdown không bị cắt */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Block Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Block A"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Block Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., A"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Describe this block..."
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
                />
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
                  <label className="text-sm font-medium text-stone-700 block mb-1">Status</label>
                  <CustomSelect
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value as any })}
                    options={statusOptions}
                    placeholder="Select status"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {block ? 'Save Changes' : 'Create Block'}
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