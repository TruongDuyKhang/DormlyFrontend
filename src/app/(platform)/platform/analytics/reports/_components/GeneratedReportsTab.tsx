// app/(platform)/analytics/reports/_components/GeneratedReportsTab.tsx
'use client';

import { useState } from 'react';
import { Download, Eye, Trash2, RefreshCw, Search, FileText, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GeneratedReport } from './types';
import { generatedReports } from './mockData';

export function GeneratedReportsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState(generatedReports);
  
  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
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
  
  const getFormatIcon = (format: string) => {
    if (format === 'pdf') return <FileText className="h-4 w-4" />;
    return <FileSpreadsheet className="h-4 w-4" />;
  };
  
  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };
  
  const handleDownload = (report: GeneratedReport) => {
    console.log('Download', report);
  };
  
  const handlePreview = (report: GeneratedReport) => {
    console.log('Preview', report);
  };
  
  const handleRegenerate = (report: GeneratedReport) => {
    console.log('Regenerate', report);
  };
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports..."
          className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
        />
      </div>
      
      {/* Reports Table */}
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Report Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Created By</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Format</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-stone-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-stone-900">{report.name}</td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", getCategoryBadge(report.category))}>
                      {report.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-stone-600">{report.createdBy}</td>
                  <td className="px-5 py-3 text-sm text-stone-600">{formatDate(report.dateGenerated)}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-stone-600">
                      {getFormatIcon(report.format)}
                      {report.format.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handlePreview(report)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(report)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRegenerate(report)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                        title="Regenerate"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete"
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
        {filteredReports.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            No reports found
          </div>
        )}
      </div>
    </div>
  );
}