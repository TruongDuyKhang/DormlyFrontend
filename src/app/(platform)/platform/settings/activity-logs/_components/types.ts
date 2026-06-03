// app/(platform)/platform/settings/activity-logs/_components/types.ts

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: 'student' | 'manager' | 'admin' | 'system';
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  status?: 'success' | 'failed' | 'pending';
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  source: string;
}

export interface FilterOptions {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
  user: string;
  role: string;
  module: string;
  actionType: string;
  search: string;
}

export interface KPIData {
  totalActivities: number;
  todayActivities: number;
  failedEvents: number;
  systemEvents: number;
}

export type ExportFormat = 'csv' | 'excel' | 'pdf';