// app/(platform)/analytics/reports/_components/TemplatesTab.tsx
'use client';

import { useState } from 'react';
import { Copy, Edit, Download, Trash2, MoreVertical, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportTemplate } from './types';
import { reportTemplates } from './mockData';

export function TemplatesTab() {
  const [templates, setTemplates] = useState(reportTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      students: 'bg-blue-100 text-blue-700',
      rooms: 'bg-emerald-100 text-emerald-700',
      tickets: 'bg-amber-100 text-amber-700',
      complaints: 'bg-purple-100 text-purple-700',
      operations: 'bg-stone-100 text-stone-700',
      system: 'bg-slate-100 text-slate-700',
    };
    return styles[category] || 'bg-stone-100 text-stone-700';
  };
  
  const handleDuplicate = (template: ReportTemplate) => {
    console.log('Duplicate', template);
  };
  
  const handleEdit = (template: ReportTemplate) => {
    console.log('Edit', template);
  };
  
  const handleGenerate = (template: ReportTemplate) => {
    console.log('Generate', template);
  };
  
  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full rounded-lg border border-stone-200 bg-white py-2 px-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
        />
      </div>
      
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
                  <h4 className="text-sm font-semibold text-stone-900">{template.name}</h4>
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", getCategoryBadge(template.category))}>
                    {template.category}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-stone-500 line-clamp-2 mb-3">{template.description}</p>
            <p className="text-xs text-stone-400 mb-4">
              Updated: {new Date(template.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => handleGenerate(template)}
                className="flex-1 rounded-lg bg-[#c3a26c] py-1.5 text-xs font-semibold text-white hover:bg-[#b08f5a] transition"
              >
                Generate Report
              </button>
              <button
                onClick={() => handleDuplicate(template)}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
                title="Duplicate"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleEdit(template)}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
                title="Edit"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center text-stone-500">
          No templates found
        </div>
      )}
    </div>
  );
}