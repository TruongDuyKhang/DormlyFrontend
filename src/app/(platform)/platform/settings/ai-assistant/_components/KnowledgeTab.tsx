// app/(platform)/platform/settings/ai-assistant/_components/KnowledgeTab.tsx
'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle, BookOpen, Zap, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KnowledgeItem } from './types';
import { defaultKnowledge } from './mockData';
import { ConfirmModal } from './ConfirmModal';

interface KnowledgeTabProps {
  knowledge: KnowledgeItem[];
  onSave: (knowledge: KnowledgeItem[]) => void;
}

export function KnowledgeTab({ knowledge: initialKnowledge, onSave }: KnowledgeTabProps) {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(initialKnowledge);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredKnowledge = knowledge.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      setKnowledge(prev => prev.filter(item => item.id !== deletingId));
      onSave(knowledge.filter(item => item.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSaveItem = (data: Partial<KnowledgeItem>) => {
    if (editingItem) {
      const updated = knowledge.map(item =>
        item.id === editingItem.id
          ? { ...item, ...data }
          : item
      );
      setKnowledge(updated);
      onSave(updated);
    } else {
      const newItem: KnowledgeItem = {
        id: `kb-${Date.now()}`,
        question: data.question || '',
        answer: data.answer || '',
        category: data.category || 'general',
        isActive: true,
      };
      const updated = [...knowledge, newItem];
      setKnowledge(updated);
      onSave(updated);
    }
    setIsModalOpen(false);
  };

  const toggleActive = (id: string) => {
    const updated = knowledge.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    setKnowledge(updated);
    onSave(updated);
  };

  const categories = [
    { value: 'rules', label: 'Rules', color: 'bg-blue-100 text-blue-700' },
    { value: 'utilities', label: 'Utilities', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-amber-100 text-amber-700' },
    { value: 'facilities', label: 'Facilities', color: 'bg-purple-100 text-purple-700' },
    { value: 'general', label: 'General', color: 'bg-stone-100 text-stone-700' },
  ];

  const getCategoryStyle = (category: string) => {
    return categories.find(c => c.value === category)?.color || categories[4].color;
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Q&A
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{knowledge.length}</p>
            <p className="text-xs text-stone-500">Total Q&A</p>
          </div>
          <div className="rounded-xl bg-white/40 p-3 text-center">
            <p className="text-2xl font-semibold text-stone-800">{knowledge.filter(k => k.isActive).length}</p>
            <p className="text-xs text-stone-500">Active</p>
          </div>
        </div>

        {/* Knowledge Table */}
        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-stone-600 px-5 py-3">Question</th>
                  <th className="text-left text-xs font-semibold text-stone-600 px-5 py-3">Answer</th>
                  <th className="text-left text-xs font-semibold text-stone-600 px-5 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-stone-600 px-5 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-stone-600 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredKnowledge.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-stone-800 line-clamp-2">{item.question}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-stone-600 line-clamp-2 max-w-md">{item.answer}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", getCategoryStyle(item.category))}>
                        {categories.find(c => c.value === item.category)?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(item.id)}
                        className="flex items-center gap-1.5"
                      >
                        {item.isActive ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs text-emerald-600">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-stone-400" />
                            <span className="text-xs text-stone-500">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredKnowledge.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-stone-300" />
            <p>No Q&A found. Click "Add Q&A" to create one.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <KnowledgeFormModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Q&A"
        message="This question and answer will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
}

// Knowledge Form Modal Component
function KnowledgeFormModal({ item, onClose, onSave }: {
  item: KnowledgeItem | null;
  onClose: () => void;
  onSave: (data: Partial<KnowledgeItem>) => void;
}) {
  const [formData, setFormData] = useState({
    question: item?.question || '',
    answer: item?.answer || '',
    category: item?.category || 'general',
  });

  const categories = [
    { value: 'rules', label: 'Rules' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'general', label: 'General' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40 rounded-t-2xl">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#c3a26c]" />
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              {item ? 'Edit Q&A' : 'Add Q&A'}
            </h2>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            {item ? 'Update question and answer' : 'Add new knowledge for AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Question *</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g., What time does the gate close?"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Answer *</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={3}
              placeholder="Write the answer here..."
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30 resize-none"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {item ? 'Save Changes' : 'Create Q&A'}
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
    </div>
  );
}