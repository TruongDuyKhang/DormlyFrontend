// app/(platform)/analytics/reports/_components/mockData.ts

import { GeneratedReport, ScheduledReport, ReportTemplate, ReportCategory } from './types';

export const generatedReports: GeneratedReport[] = [
  {
    id: 'rpt-1',
    name: 'Monthly Operations Report',
    category: 'operations',
    createdBy: 'Mai Tran',
    dateGenerated: '2025-05-31T10:30:00',
    format: 'pdf',
    size: '2.4 MB',
    url: '#',
  },
  {
    id: 'rpt-2',
    name: 'Occupancy Summary',
    category: 'rooms',
    createdBy: 'Linh Vo',
    dateGenerated: '2025-05-30T14:15:00',
    format: 'excel',
    size: '1.8 MB',
    url: '#',
  },
  {
    id: 'rpt-3',
    name: 'Student Status Report',
    category: 'students',
    createdBy: 'Khoa Nguyen',
    dateGenerated: '2025-05-29T09:00:00',
    format: 'pdf',
    size: '3.1 MB',
    url: '#',
  },
  {
    id: 'rpt-4',
    name: 'Maintenance Ticket Analysis',
    category: 'tickets',
    createdBy: 'Mai Tran',
    dateGenerated: '2025-05-28T16:20:00',
    format: 'excel',
    size: '1.2 MB',
    url: '#',
  },
  {
    id: 'rpt-5',
    name: 'Complaint Resolution Report',
    category: 'complaints',
    createdBy: 'Thuy Pham',
    dateGenerated: '2025-05-27T11:45:00',
    format: 'pdf',
    size: '2.1 MB',
    url: '#',
  },
];

export const scheduledReports: ScheduledReport[] = [
  {
    id: 'sch-1',
    name: 'Monthly Operations Report',
    frequency: 'monthly',
    recipients: ['admin@dormly.com', 'manager@dormly.com'],
    lastRun: '2025-05-01T08:00:00',
    nextRun: '2025-06-01T08:00:00',
    status: 'active',
  },
  {
    id: 'sch-2',
    name: 'Weekly Occupancy Update',
    frequency: 'weekly',
    recipients: ['manager@dormly.com'],
    lastRun: '2025-05-26T08:00:00',
    nextRun: '2025-06-02T08:00:00',
    status: 'active',
  },
  {
    id: 'sch-3',
    name: 'Quarterly Student Summary',
    frequency: 'quarterly',
    recipients: ['admin@dormly.com'],
    lastRun: '2025-04-01T08:00:00',
    nextRun: '2025-07-01T08:00:00',
    status: 'paused',
  },
];

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Monthly Dormitory Summary',
    category: 'operations',
    description: 'Complete overview of dormitory operations including occupancy, tickets, and complaints.',
    filters: { dateRange: 'last_month' },
    createdAt: '2025-01-15T10:00:00',
    updatedAt: '2025-05-20T14:30:00',
  },
  {
    id: 'tpl-2',
    name: 'Student Occupancy Report',
    category: 'students',
    description: 'Student distribution by block, floor, and faculty.',
    filters: { status: 'active', groupBy: 'block' },
    createdAt: '2025-02-10T09:15:00',
    updatedAt: '2025-05-25T11:00:00',
  },
  {
    id: 'tpl-3',
    name: 'Maintenance Performance Report',
    category: 'tickets',
    description: 'Ticket volume, resolution time, and SLA compliance.',
    filters: { category: 'all', status: 'resolved' },
    createdAt: '2025-03-05T13:20:00',
    updatedAt: '2025-05-28T16:00:00',
  },
  {
    id: 'tpl-4',
    name: 'Complaint Analysis Report',
    category: 'complaints',
    description: 'Complaint types, resolution rate, and response time.',
    filters: { type: 'all', status: 'resolved' },
    createdAt: '2025-04-12T10:45:00',
    updatedAt: '2025-05-29T09:30:00',
  },
  {
    id: 'tpl-5',
    name: 'Room Utilization Report',
    category: 'rooms',
    description: 'Occupancy rate, available rooms, and maintenance status.',
    filters: { occupancy: 'all' },
    createdAt: '2025-05-01T08:00:00',
    updatedAt: '2025-05-30T14:00:00',
  },
];

export const categoryOptions = [
  { value: 'students', label: 'Students' },
  { value: 'rooms', label: 'Rooms' },
  { value: 'tickets', label: 'Tickets' },
  { value: 'complaints', label: 'Complaints' },
  { value: 'operations', label: 'Operations' },
  { value: 'system', label: 'System' },
];

export const formatOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
];

export const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

export const blocksList = [
  { value: 'block-a', label: 'Block A' },
  { value: 'block-b', label: 'Block B' },
  { value: 'block-c', label: 'Block C' },
  { value: 'block-d', label: 'Block D' },
  { value: 'block-e', label: 'Block E' },
];

export const facultiesList = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'mathematics', label: 'Mathematics' },
];

export const ticketCategories = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'internet', label: 'Internet' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'hygiene', label: 'Hygiene' },
];

export const ticketPriorities = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const ticketStatuses = [
  { value: 'open', label: 'Open' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];