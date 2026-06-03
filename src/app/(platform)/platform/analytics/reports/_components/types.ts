// app/(platform)/analytics/reports/_components/types.ts

export type ReportCategory = 'students' | 'rooms' | 'tickets' | 'complaints' | 'operations' | 'system';
export type ReportFormat = 'pdf' | 'excel';
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type ScheduleStatus = 'active' | 'paused';

export interface GeneratedReport {
  id: string;
  name: string;
  category: ReportCategory;
  createdBy: string;
  dateGenerated: string;
  format: ReportFormat;
  size: string;
  url: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: ReportFrequency;
  recipients: string[];
  lastRun: string | null;
  nextRun: string;
  status: ScheduleStatus;
}

export interface ReportTemplate {
  id: string;
  name: string;
  category: ReportCategory;
  description: string;
  filters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportFormData {
  category: ReportCategory;
  name: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  filters: {
    blockId?: string;
    floorLevel?: string;
    faculty?: string;
    category?: string;
    priority?: string;
    status?: string;
  };
  format: ReportFormat;
}

export interface FilterOption {
  value: string;
  label: string;
}