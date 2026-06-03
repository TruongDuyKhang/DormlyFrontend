// app/(platform)/analytics/reports/_components/CreateReportTab.tsx
'use client';

import { useState } from 'react';
import { Calendar, FileText, FileSpreadsheet, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterSelect } from './FilterSelect';
import { CreateReportFormData, ReportCategory, ReportFormat } from './types';
import { categoryOptions, formatOptions, blocksList, facultiesList, ticketCategories, ticketPriorities, ticketStatuses } from './mockData';

export function CreateReportTab() {
  const [formData, setFormData] = useState<CreateReportFormData>({
    category: 'operations',
    name: '',
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(),
    },
    filters: {},
    format: 'pdf',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const dateRangePresets = [
    { label: 'This Month', getValue: () => ({ from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() }) },
    { label: 'Last Month', getValue: () => ({ from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), to: new Date(new Date().getFullYear(), new Date().getMonth(), 0) }) },
    { label: 'Last 30 Days', getValue: () => ({ from: new Date(Date.now() - 30 * 86400000), to: new Date() }) },
    { label: 'Last 90 Days', getValue: () => ({ from: new Date(Date.now() - 90 * 86400000), to: new Date() }) },
    { label: 'This Year', getValue: () => ({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }) },
  ];
  
  const handleDateRangePreset = (preset: typeof dateRangePresets[0]) => {
    const range = preset.getValue();
    setFormData(prev => ({ ...prev, dateRange: range }));
  };
  
  const handleGenerate = () => {
    if (!formData.name) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Generate report', formData);
    }, 1500);
  };
  
  const renderCategoryFilters = () => {
    switch (formData.category) {
      case 'students':
        return (
          <div className="grid grid-cols-2 gap-3">
            <FilterSelect
              value={formData.filters.blockId || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, blockId: value } }))}
              options={blocksList}
              placeholder="All Blocks"
            />
            <FilterSelect
              value={formData.filters.faculty || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, faculty: value } }))}
              options={facultiesList}
              placeholder="All Faculties"
            />
          </div>
        );
      case 'tickets':
        return (
          <div className="grid grid-cols-2 gap-3">
            <FilterSelect
              value={formData.filters.category || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, category: value } }))}
              options={ticketCategories}
              placeholder="All Categories"
            />
            <FilterSelect
              value={formData.filters.priority || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, priority: value } }))}
              options={ticketPriorities}
              placeholder="All Priorities"
            />
            <FilterSelect
              value={formData.filters.status || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, status: value } }))}
              options={ticketStatuses}
              placeholder="All Statuses"
            />
          </div>
        );
      case 'rooms':
        return (
          <div className="grid grid-cols-2 gap-3">
            <FilterSelect
              value={formData.filters.blockId || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, blockId: value } }))}
              options={blocksList}
              placeholder="All Blocks"
            />
            <FilterSelect
              value={formData.filters.floorLevel || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, filters: { ...prev.filters, floorLevel: value } }))}
              options={[
                { value: '1', label: 'Floor 1' },
                { value: '2', label: 'Floor 2' },
                { value: '3', label: 'Floor 3' },
                { value: '4', label: 'Floor 4' },
                { value: '5', label: 'Floor 5' },
              ]}
              placeholder="All Floors"
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Form */}
      <div className="space-y-5">
        {/* Report Name */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-1">Report Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Monthly Operations Report"
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
          />
        </div>
        
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-1">Report Category</label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFormData(prev => ({ ...prev, category: cat.value as ReportCategory, filters: {} }))}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  formData.category === cat.value
                    ? "bg-[#c3a26c] text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Date Range */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-1">Date Range</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {dateRangePresets.map(preset => (
              <button
                key={preset.label}
                onClick={() => handleDateRangePreset(preset)}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 hover:bg-stone-200 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-500 block mb-1">From</label>
              <input
                type="date"
                value={formData.dateRange.from.toISOString().split('T')[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, from: new Date(e.target.value) } }))}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">To</label>
              <input
                type="date"
                value={formData.dateRange.to.toISOString().split('T')[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, dateRange: { ...prev.dateRange, to: new Date(e.target.value) } }))}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-1">Filters</label>
          {renderCategoryFilters()}
          {formData.category !== 'students' && formData.category !== 'tickets' && formData.category !== 'rooms' && (
            <p className="text-sm text-stone-400 text-center py-4">No additional filters available for this category</p>
          )}
        </div>
        
        {/* Output Format */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-1">Output Format</label>
          <div className="flex gap-3">
            {formatOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFormData(prev => ({ ...prev, format: opt.value as ReportFormat }))}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition",
                  formData.format === opt.value
                    ? "border-[#c3a26c] bg-[#c3a26c]/10 text-[#c3a26c]"
                    : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                )}
              >
                {opt.value === 'pdf' ? <FileText className="h-4 w-4" /> : <FileSpreadsheet className="h-4 w-4" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!formData.name || isGenerating}
          className={cn(
            "w-full rounded-lg py-2.5 text-sm font-semibold transition flex items-center justify-center gap-2",
            !formData.name || isGenerating
              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
              : "bg-[#c3a26c] text-white hover:bg-[#b08f5a]"
          )}
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Generate Report
            </>
          )}
        </button>
      </div>
      
      {/* Right Column - Preview */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-stone-400" />
          <h3 className="text-base font-semibold text-stone-900">Report Preview</h3>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg bg-white p-4 border border-stone-200">
            <p className="text-sm font-medium text-stone-900">{formData.name || 'Untitled Report'}</p>
            <p className="text-xs text-stone-500 mt-1">
              {categoryOptions.find(c => c.value === formData.category)?.label} • {formData.format.toUpperCase()}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              {formData.dateRange.from.toLocaleDateString()} - {formData.dateRange.to.toLocaleDateString()}
            </p>
          </div>
          <div className="text-center py-8 text-stone-400 text-sm">
            Preview will appear here
          </div>
        </div>
      </div>
    </div>
  );
}