// app/(platform)/platform/settings/activity-logs/_components/ExportModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileSpreadsheet, FileText, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivityLog, ExportFormat } from './types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityLog[];
}

export function ExportModal({ isOpen, onClose, activities }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { value: 'csv' as const, label: 'CSV', icon: FileText, color: 'text-emerald-600' },
    { value: 'excel' as const, label: 'Excel', icon: FileSpreadsheet, color: 'text-blue-600' },
    { value: 'pdf' as const, label: 'PDF', icon: FileJson, color: 'text-red-600' },
  ];

  const exportToCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Details', 'Status'];
    const rows = activities.map(a => [
      a.timestamp,
      a.user,
      a.role,
      a.action,
      a.module,
      a.details,
      a.status || 'success',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Simulate Excel export (in production, use xlsx library)
    alert('Excel export would be implemented with xlsx library');
  };

  const exportToPDF = () => {
    // Simulate PDF export (in production, use jsPDF or similar)
    alert('PDF export would be implemented with jsPDF library');
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (selectedFormat === 'csv') exportToCSV();
      else if (selectedFormat === 'excel') exportToExcel();
      else if (selectedFormat === 'pdf') exportToPDF();
      setIsExporting(false);
      onClose();
    }, 1000);
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
            className="relative w-full max-w-md rounded-2xl border border-white/60 bg-[#f3eee6] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#c3a26c]/20 to-[#c3a26c]/5 px-6 py-4 border-b border-white/40 rounded-t-2xl">
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-stone-500 hover:bg-white/50 transition">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-[#c3a26c]" />
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  Export Logs
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                Export {activities.length} activities to file
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setSelectedFormat(format.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                        selectedFormat === format.value
                          ? "border-[#c3a26c] bg-[#c3a26c]/10"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      )}
                    >
                      <format.icon className={cn("h-5 w-5", format.color)} />
                      <span className="text-sm font-medium text-stone-700">{format.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="rounded-xl bg-stone-100 p-3 text-center">
                <p className="text-xs text-stone-600">
                  Exporting <span className="font-semibold">{activities.length}</span> records
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-stone-300 bg-white/50 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}