// app/(platform)/analytics/reports/_components/ScheduledReportsTab.tsx
'use client';

import { useState } from 'react';
import { Play, Pause, Edit, Trash2, Mail, Calendar, Clock, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScheduledReport } from './types';
import { scheduledReports, frequencyOptions } from './mockData';

export function ScheduledReportsTab() {
  const [reports, setReports] = useState(scheduledReports);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getFrequencyLabel = (frequency: string) => {
    return frequencyOptions.find(f => f.value === frequency)?.label || frequency;
  };
  
  const toggleStatus = (id: string) => {
    setReports(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r
    ));
  };
  
  const handleEdit = (report: ScheduledReport) => {
    console.log('Edit', report);
  };
  
  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };
  
  const handleRunNow = (report: ScheduledReport) => {
    console.log('Run now', report);
  };
  
  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Frequency</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Recipients</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Last Run</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Next Run</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-stone-50 transition">
                <td className="px-5 py-3 text-sm font-medium text-stone-900">{report.name}</td>
                <td className="px-5 py-3 text-sm text-stone-600">{getFrequencyLabel(report.frequency)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-stone-400" />
                    <span className="text-sm text-stone-600">{report.recipients.join(', ')}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-stone-600">{formatDate(report.lastRun)}</td>
                <td className="px-5 py-3 text-sm text-stone-600">{formatDate(report.nextRun)}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    report.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                  )}>
                    <div className={cn("h-1.5 w-1.5 rounded-full", report.status === 'active' ? "bg-emerald-500" : "bg-stone-400")} />
                    {report.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleStatus(report.id)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 transition"
                      title={report.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {report.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleRunNow(report)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 transition"
                      title="Run Now"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(report)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 transition"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
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
      {reports.length === 0 && (
        <div className="py-12 text-center text-stone-500">
          No scheduled reports
        </div>
      )}
    </div>
  );
}