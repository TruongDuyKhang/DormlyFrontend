// app/(platform)/communication/notifications/_components/TemplatesTab.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, Search, Copy, FileText, X, Save, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { NotificationTemplate, NotificationPriority, NotificationDelivery } from './types';
import { notificationTemplates } from './mockData';

interface TemplatesTabProps {
  onUseTemplate?: (template: NotificationTemplate) => void;
}

export function TemplatesTab({ onUseTemplate }: TemplatesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [templates, setTemplates] = useState(notificationTemplates);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [editForm, setEditForm] = useState<Partial<NotificationTemplate>>({});
  
  const handleSearch = () => {
    setSearchQuery(localSearch);
  };
  
  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };
  
  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUseTemplate = (template: NotificationTemplate) => {
    if (onUseTemplate) {
      onUseTemplate(template);
    }
  };
  
  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setEditForm({
      title: template.title,
      message: template.message,
      priority: template.priority,
      delivery: template.delivery,
      variables: template.variables,
    });
  };
  
  const handleSaveEdit = () => {
    if (editingTemplate && editForm.title && editForm.message) {
      setTemplates(prev => prev.map(t =>
        t.id === editingTemplate.id
          ? {
              ...t,
              title: editForm.title!,
              message: editForm.message!,
              priority: editForm.priority as NotificationPriority,
              delivery: editForm.delivery as NotificationDelivery,
              variables: editForm.variables || [],
              updatedAt: new Date().toISOString(),
            }
          : t
      ));
      setEditingTemplate(null);
      setEditForm({});
    }
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };
  
  const priorityOptions = [
    { value: 'normal', label: 'Normal', bgColor: 'bg-blue-200', textColor: 'text-blue-800' },
    { value: 'important', label: 'Important', bgColor: 'bg-amber-200', textColor: 'text-amber-800' },
    { value: 'emergency', label: 'Emergency', bgColor: 'bg-red-200', textColor: 'text-red-800' },
  ];
  
  const deliveryOptions = [
    { value: 'inapp', label: 'In-app Only' },
    { value: 'email', label: 'Email Only' },
    { value: 'both', label: 'Both' },
  ];
  
  return (
    <div className="space-y-4">
      {/* Search with Button */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-xl bg-[#c3a26c] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#b08f5a] transition flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
      
      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm" onClick={() => setEditingTemplate(null)}>
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40">
              <button onClick={() => setEditingTemplate(null)} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <Edit className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">Edit Template</h2>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Template Name</label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Message</label>
                <textarea
                  value={editForm.message || ''}
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm resize-none"
                />
                {editForm.variables && editForm.variables.length > 0 && (
                  <p className="text-xs text-stone-400 mt-1">Variables: {editForm.variables.join(', ')}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Priority</label>
                  <select
                    value={editForm.priority || 'normal'}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as NotificationPriority })}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm"
                  >
                    {priorityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Delivery</label>
                  <select
                    value={editForm.delivery || 'both'}
                    onChange={(e) => setEditForm({ ...editForm, delivery: e.target.value as NotificationDelivery })}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm"
                  >
                    {deliveryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded-xl bg-[#c3a26c] py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c3a26c]/10">
                  <FileText className="h-4 w-4 text-[#c3a26c]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">{template.title}</h4>
                  <PriorityBadge priority={template.priority} size="sm" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-500 line-clamp-3 mb-3">{template.message}</p>
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div className="text-xs text-stone-400">
                {template.delivery === 'both' ? 'In-app + Email' : template.delivery}
                {template.variables && template.variables.length > 0 && ` • ${template.variables.length} variables`}
              </div>
              <button
                onClick={() => handleUseTemplate(template)}
                className="rounded-lg bg-[#c3a26c] px-3 py-1 text-xs font-semibold text-white hover:bg-[#b08f5a] transition flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center text-stone-500">
          {searchQuery ? 'No templates match your search' : 'No templates found'}
        </div>
      )}
    </div>
  );
}