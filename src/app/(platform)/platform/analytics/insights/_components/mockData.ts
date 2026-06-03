// app/(platform)/analytics/insights/_components/mockData.ts

import { 
  KpiData, 
  OccupancyData, 
  TicketData, 
  ComplaintData, 
  RoomStatusData,
  StudentByBlockData,
  StudentByFacultyData,
  StudentStatusData,
  TicketCategoryData,
  ComplaintTypeData,
  ManagerPerformanceData
} from './types';

// KPI Data
export const overviewKpis: KpiData[] = [
  { label: 'Total Students', value: 1247, change: 5.2, trend: 'up' },
  { label: 'Occupancy Rate', value: '87%', change: 3.1, trend: 'up' },
  { label: 'Active Tickets', value: 42, change: -8, trend: 'down' },
  { label: 'Active Complaints', value: 18, change: -12, trend: 'down' },
  { label: 'Available Beds', value: 187, change: -2, trend: 'down' },
  { label: 'Avg Resolution Time', value: '2.4 days', change: -0.3, trend: 'down' },
];

export const residentsKpis: KpiData[] = [
  { label: 'Active Students', value: 1120, change: 3.2, trend: 'up' },
  { label: 'Graduated', value: 89, change: 12, trend: 'up' },
  { label: 'Leave of Absence', value: 23, change: -5, trend: 'down' },
  { label: 'Pending Approval', value: 15, change: 7, trend: 'up' },
];

export const operationsKpis: KpiData[] = [
  { label: 'Open Tickets', value: 42, change: -8, trend: 'down' },
  { label: 'Assigned Tickets', value: 18, change: 3, trend: 'up' },
  { label: 'Working Tickets', value: 15, change: 2, trend: 'up' },
  { label: 'Resolved Tickets', value: 124, change: 18, trend: 'up' },
  { label: 'Overdue Tickets', value: 4, change: -2, trend: 'down' },
];

export const performanceKpis: KpiData[] = [
  { label: 'Tickets Completed', value: 124, change: 18, trend: 'up' },
  { label: 'Complaints Resolved', value: 56, change: 12, trend: 'up' },
  { label: 'Avg Response Time', value: '1.2 hours', change: -0.4, trend: 'down' },
  { label: 'SLA Compliance Rate', value: '94%', change: 2.1, trend: 'up' },
];

// Occupancy Trend Data
export const occupancyTrendData: OccupancyData[] = [
  { month: 'Jan', rate: 82 },
  { month: 'Feb', rate: 84 },
  { month: 'Mar', rate: 85 },
  { month: 'Apr', rate: 86 },
  { month: 'May', rate: 87 },
  { month: 'Jun', rate: 88 },
  { month: 'Jul', rate: 89 },
  { month: 'Aug', rate: 91 },
  { month: 'Sep', rate: 90 },
  { month: 'Oct', rate: 89 },
  { month: 'Nov', rate: 88 },
  { month: 'Dec', rate: 87 },
];

// Ticket Volume Data
export const ticketVolumeData: TicketData[] = [
  { month: 'Jan', count: 34 },
  { month: 'Feb', count: 38 },
  { month: 'Mar', count: 42 },
  { month: 'Apr', count: 45 },
  { month: 'May', count: 48 },
  { month: 'Jun', count: 52 },
  { month: 'Jul', count: 55 },
  { month: 'Aug', count: 58 },
  { month: 'Sep', count: 54 },
  { month: 'Oct', count: 50 },
  { month: 'Nov', count: 46 },
  { month: 'Dec', count: 42 },
];

// Complaint Trend Data
export const complaintTrendData: ComplaintData[] = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 14 },
  { month: 'Mar', count: 16 },
  { month: 'Apr', count: 15 },
  { month: 'May', count: 18 },
  { month: 'Jun', count: 20 },
  { month: 'Jul', count: 22 },
  { month: 'Aug', count: 19 },
  { month: 'Sep', count: 17 },
  { month: 'Oct', count: 15 },
  { month: 'Nov', count: 13 },
  { month: 'Dec', count: 11 },
];

// Room Status Distribution
export const roomStatusData: RoomStatusData[] = [
  { name: 'Occupied', value: 1120, color: '#c3a26c' },
  { name: 'Available', value: 187, color: '#a3b8a3' },
  { name: 'Maintenance', value: 45, color: '#d4c5a9' },
];

// Students by Block
export const studentsByBlockData: StudentByBlockData[] = [
  { block: 'Block A', students: 286 },
  { block: 'Block B', students: 254 },
  { block: 'Block C', students: 228 },
  { block: 'Block D', students: 212 },
  { block: 'Block E', students: 187 },
];

// Students by Faculty
export const studentsByFacultyData: StudentByFacultyData[] = [
  { faculty: 'Computer Science', students: 312 },
  { faculty: 'Engineering', students: 278 },
  { faculty: 'Business', students: 245 },
  { faculty: 'Psychology', students: 156 },
  { faculty: 'Mathematics', students: 98 },
  { faculty: 'Physics', students: 76 },
  { faculty: 'Economics', students: 82 },
];

// Student Status Distribution
export const studentStatusData: StudentStatusData[] = [
  { status: 'Active', count: 1120 },
  { status: 'Graduated', count: 89 },
  { status: 'Leave of Absence', count: 23 },
  { status: 'Pending', count: 15 },
];

// Registration Trend
export const registrationTrendData: TicketData[] = [
  { month: 'Jan', count: 45 },
  { month: 'Feb', count: 52 },
  { month: 'Mar', count: 58 },
  { month: 'Apr', count: 62 },
  { month: 'May', count: 68 },
  { month: 'Jun', count: 75 },
  { month: 'Jul', count: 82 },
  { month: 'Aug', count: 88 },
  { month: 'Sep', count: 85 },
  { month: 'Oct', count: 78 },
  { month: 'Nov', count: 65 },
  { month: 'Dec', count: 48 },
];

// Tickets by Category
export const ticketsByCategoryData: TicketCategoryData[] = [
  { category: 'Electrical', count: 42 },
  { category: 'Plumbing', count: 28 },
  { category: 'Internet', count: 35 },
  { category: 'Equipment', count: 18 },
  { category: 'Hygiene', count: 22 },
];

// Ticket Status Distribution
export const ticketStatusDistributionData: { name: string; value: number; color: string }[] = [
  { name: 'Open', value: 42, color: '#f59e0b' },
  { name: 'Assigned', value: 18, color: '#3b82f6' },
  { name: 'Working', value: 15, color: '#8b5cf6' },
  { name: 'Resolved', value: 124, color: '#10b981' },
];

// Average Resolution Time Trend
export const resolutionTimeTrendData: { month: string; days: number }[] = [
  { month: 'Jan', days: 3.2 },
  { month: 'Feb', days: 3.0 },
  { month: 'Mar', days: 2.9 },
  { month: 'Apr', days: 2.8 },
  { month: 'May', days: 2.7 },
  { month: 'Jun', days: 2.6 },
  { month: 'Jul', days: 2.5 },
  { month: 'Aug', days: 2.4 },
  { month: 'Sep', days: 2.4 },
  { month: 'Oct', days: 2.3 },
  { month: 'Nov', days: 2.3 },
  { month: 'Dec', days: 2.2 },
];

// Complaints by Type
export const complaintsByTypeData: ComplaintTypeData[] = [
  { type: 'Noise', count: 38 },
  { type: 'Cleanliness', count: 25 },
  { type: 'Conflict', count: 18 },
  { type: 'Rule Violation', count: 22 },
  { type: 'Other', count: 15 },
];

// Complaints Resolution Trend
export const complaintsResolutionTrendData: ComplaintData[] = [
  { month: 'Jan', count: 8 },
  { month: 'Feb', count: 10 },
  { month: 'Mar', count: 12 },
  { month: 'Apr', count: 14 },
  { month: 'May', count: 15 },
  { month: 'Jun', count: 16 },
  { month: 'Jul', count: 18 },
  { month: 'Aug', count: 17 },
  { month: 'Sep', count: 15 },
  { month: 'Oct', count: 14 },
  { month: 'Nov', count: 12 },
  { month: 'Dec', count: 11 },
];

// Manager Performance Data
export const managerPerformanceData: ManagerPerformanceData[] = [
  { manager: 'Mai Tran', ticketsHandled: 48, complaintsHandled: 32, avgResolutionTime: 2.1, slaScore: 96 },
  { manager: 'Linh Vo', ticketsHandled: 42, complaintsHandled: 28, avgResolutionTime: 2.3, slaScore: 94 },
  { manager: 'Khoa Nguyen', ticketsHandled: 35, complaintsHandled: 22, avgResolutionTime: 2.0, slaScore: 97 },
  { manager: 'Thuy Pham', ticketsHandled: 38, complaintsHandled: 25, avgResolutionTime: 2.4, slaScore: 92 },
  { manager: 'Anh Le', ticketsHandled: 28, complaintsHandled: 18, avgResolutionTime: 2.6, slaScore: 90 },
];

// SLA Compliance Trend
export const slaComplianceTrendData: { month: string; rate: number }[] = [
  { month: 'Jan', rate: 88 },
  { month: 'Feb', rate: 89 },
  { month: 'Mar', rate: 90 },
  { month: 'Apr', rate: 91 },
  { month: 'May', rate: 92 },
  { month: 'Jun', rate: 92 },
  { month: 'Jul', rate: 93 },
  { month: 'Aug', rate: 94 },
  { month: 'Sep', rate: 94 },
  { month: 'Oct', rate: 95 },
  { month: 'Nov', rate: 95 },
  { month: 'Dec', rate: 96 },
];

// Monthly Completion Trend
export const monthlyCompletionTrendData: TicketData[] = [
  { month: 'Jan', count: 28 },
  { month: 'Feb', count: 32 },
  { month: 'Mar', count: 36 },
  { month: 'Apr', count: 42 },
  { month: 'May', count: 48 },
  { month: 'Jun', count: 52 },
  { month: 'Jul', count: 58 },
  { month: 'Aug', count: 62 },
  { month: 'Sep', count: 58 },
  { month: 'Oct', count: 54 },
  { month: 'Nov', count: 48 },
  { month: 'Dec', count: 44 },
];