// app/(platform)/platform/settings/activity-logs/_components/mockData.ts

import { ActivityLog, SystemEvent, KPIData, FilterOptions } from './types';

// 50+ Activity Logs để hiện phân trang
export const mockActivityLogs: ActivityLog[] = [
  // Today's logs (May 31, 2025)
  { id: '1', timestamp: '2025-05-31T09:30:00Z', user: 'Nguyen Van A', role: 'manager', action: 'Assigned Student', module: 'Rooms', details: 'Assigned student Nguyen Van B to Room 201, Block A', ipAddress: '192.168.1.1', status: 'success' },
  { id: '2', timestamp: '2025-05-31T10:15:00Z', user: 'Tran Thi B', role: 'student', action: 'Created Ticket', module: 'Tickets', details: 'Created maintenance ticket #T-1001 for electrical issue', ipAddress: '192.168.1.45', status: 'success' },
  { id: '3', timestamp: '2025-05-31T10:20:00Z', user: 'Admin', role: 'admin', action: 'Approved Account', module: 'Residents', details: 'Approved student registration for Le Van C', ipAddress: '192.168.1.10', status: 'success' },
  { id: '4', timestamp: '2025-05-31T11:05:00Z', user: 'System', role: 'system', action: 'Auto Notification Sent', module: 'Notifications', details: 'Sent payment reminder to 45 students', ipAddress: '', status: 'success' },
  { id: '5', timestamp: '2025-05-31T08:30:00Z', user: 'Pham Van D', role: 'manager', action: 'Updated Room', module: 'Rooms', details: 'Changed room capacity for Room 305 from 4 to 6', ipAddress: '192.168.1.23', status: 'success' },
  { id: '6', timestamp: '2025-05-31T14:20:00Z', user: 'Nguyen Thi E', role: 'student', action: 'Submitted Complaint', module: 'Complaints', details: 'Filed complaint about noise from neighboring room', ipAddress: '192.168.1.67', status: 'success' },
  { id: '7', timestamp: '2025-05-31T07:45:00Z', user: 'Tran Van F', role: 'manager', action: 'Created Room', module: 'Rooms', details: 'Created new room 401 in Block D', ipAddress: '192.168.1.34', status: 'success' },
  { id: '8', timestamp: '2025-05-31T13:00:00Z', user: 'Le Thi G', role: 'student', action: 'Updated Profile', module: 'Residents', details: 'Updated phone number and emergency contact', ipAddress: '192.168.1.89', status: 'success' },
  { id: '9', timestamp: '2025-05-31T15:30:00Z', user: 'Admin', role: 'admin', action: 'Deleted User', module: 'Residents', details: 'Deleted inactive student account for Tran Van H', ipAddress: '192.168.1.10', status: 'success' },
  { id: '10', timestamp: '2025-05-31T16:45:00Z', user: 'System', role: 'system', action: 'Backup Completed', module: 'System', details: 'Database backup completed successfully', ipAddress: '', status: 'success' },
  { id: '11', timestamp: '2025-05-31T17:00:00Z', user: 'Nguyen Van I', role: 'student', action: 'Login', module: 'Authentication', details: 'User logged in from new device', ipAddress: '192.168.1.55', status: 'success' },
  { id: '12', timestamp: '2025-05-31T18:30:00Z', user: 'Pham Thi K', role: 'manager', action: 'Assigned Ticket', module: 'Tickets', details: 'Assigned ticket #T-1002 to maintenance staff', ipAddress: '192.168.1.12', status: 'success' },
  
  // Yesterday's logs (May 30, 2025)
  { id: '13', timestamp: '2025-05-30T09:00:00Z', user: 'Tran Van L', role: 'student', action: 'Created Complaint', module: 'Complaints', details: 'Reported issue with air conditioning', ipAddress: '192.168.1.78', status: 'success' },
  { id: '14', timestamp: '2025-05-30T10:30:00Z', user: 'Admin', role: 'admin', action: 'Resolved Complaint', module: 'Complaints', details: 'Resolved complaint #C-101 about noise', ipAddress: '192.168.1.10', status: 'success' },
  { id: '15', timestamp: '2025-05-30T11:15:00Z', user: 'Le Van M', role: 'manager', action: 'Transferred Student', module: 'Rooms', details: 'Transferred student from Room 102 to Room 205', ipAddress: '192.168.1.34', status: 'success' },
  { id: '16', timestamp: '2025-05-30T13:45:00Z', user: 'Nguyen Thi N', role: 'student', action: 'Login Failed', module: 'Authentication', details: 'Failed login attempt - incorrect password', ipAddress: '192.168.1.99', status: 'failed' },
  { id: '17', timestamp: '2025-05-30T14:20:00Z', user: 'System', role: 'system', action: 'AI Rule Triggered', module: 'AI Assistant', details: 'Rule "power outage" triggered, created ticket #T-1024', ipAddress: '', status: 'success' },
  { id: '18', timestamp: '2025-05-30T15:00:00Z', user: 'Pham Van O', role: 'manager', action: 'Updated Room', module: 'Rooms', details: 'Changed status of Room 308 to under maintenance', ipAddress: '192.168.1.23', status: 'success' },
  { id: '19', timestamp: '2025-05-30T16:30:00Z', user: 'Tran Thi P', role: 'student', action: 'Created Ticket', module: 'Tickets', details: 'Reported water leakage in bathroom', ipAddress: '192.168.1.45', status: 'success' },
  { id: '20', timestamp: '2025-05-30T17:45:00Z', user: 'Admin', role: 'admin', action: 'Approved Account', module: 'Residents', details: 'Approved 3 new student registrations', ipAddress: '192.168.1.10', status: 'success' },
  { id: '21', timestamp: '2025-05-30T19:00:00Z', user: 'Le Thi Q', role: 'student', action: 'Logout', module: 'Authentication', details: 'User logged out', ipAddress: '192.168.1.67', status: 'success' },
  { id: '22', timestamp: '2025-05-30T20:30:00Z', user: 'System', role: 'system', action: 'Cache Cleaned', module: 'System', details: 'Redis cache cleaned automatically', ipAddress: '', status: 'success' },
  
 

];

// 30+ System Events
export const mockSystemEvents: SystemEvent[] = [
  { id: '1', timestamp: '2025-05-31T10:00:00Z', event: 'Daily Backup Completed', description: 'Database backup completed successfully. Size: 2.4GB', status: 'success', source: 'System Scheduler' },
  { id: '2', timestamp: '2025-05-31T10:05:00Z', event: 'AI Knowledge Base Updated', description: 'Added 3 new FAQs to knowledge base', status: 'success', source: 'AI Assistant' },
  { id: '3', timestamp: '2025-05-31T11:00:00Z', event: 'Auto Ticket Created', description: 'AI automatically created ticket from student chat: "AC not working"', status: 'success', source: 'AI Assistant' },
  { id: '4', timestamp: '2025-05-31T09:30:00Z', event: 'Scheduled Notification Sent', description: 'Sent 128 notification reminders for maintenance schedule', status: 'success', source: 'Notifications Service' },
  { id: '5', timestamp: '2025-05-31T14:00:00Z', event: 'Cache Cleaned', description: 'Redis cache cleaned automatically', status: 'success', source: 'Cache Service' },
  { id: '6', timestamp: '2025-05-31T16:30:00Z', event: 'Email Sent', description: 'Bulk email sent to 250 students about event', status: 'success', source: 'Email Service' },
  { id: '7', timestamp: '2025-05-30T23:00:00Z', event: 'System Error', description: 'Email service timeout after 30 seconds', status: 'error', source: 'Email Service' },
  { id: '8', timestamp: '2025-05-30T14:00:00Z', event: 'AI Rule Triggered', description: 'Rule "power outage" triggered, created ticket #T-1024', status: 'success', source: 'AI Assistant' },
  { id: '9', timestamp: '2025-05-30T08:00:00Z', event: 'Cache Cleaned', description: 'Redis cache cleaned automatically', status: 'success', source: 'Cache Service' },
  { id: '10', timestamp: '2025-05-29T20:30:00Z', event: 'Authentication Failure', description: 'Multiple failed login attempts from IP 203.0.113.45', status: 'warning', source: 'Security Service' },
  { id: '11', timestamp: '2025-05-29T10:00:00Z', event: 'Daily Backup Completed', description: 'Database backup completed. Size: 2.3GB', status: 'success', source: 'System Scheduler' },
  { id: '12', timestamp: '2025-05-29T15:30:00Z', event: 'AI Model Updated', description: 'GPT model updated to latest version', status: 'success', source: 'AI Assistant' },
  { id: '13', timestamp: '2025-05-28T22:15:00Z', event: 'Database Connection Lost', description: 'Connection to primary database lost for 30 seconds', status: 'error', source: 'Database Service' },
  { id: '14', timestamp: '2025-05-28T09:00:00Z', event: 'Scheduled Maintenance', description: 'System maintenance completed. Downtime: 15 minutes', status: 'success', source: 'System Scheduler' },
  { id: '15', timestamp: '2025-05-28T12:00:00Z', event: 'Auto Ticket Created', description: '5 tickets auto-created from student chats', status: 'success', source: 'AI Assistant' },
  { id: '16', timestamp: '2025-05-27T18:00:00Z', event: 'API Rate Limit Hit', description: 'External API rate limit exceeded', status: 'warning', source: 'Integration Service' },
  { id: '17', timestamp: '2025-05-27T08:00:00Z', event: 'Daily Backup Completed', description: 'Incremental backup completed', status: 'success', source: 'System Scheduler' },
  { id: '18', timestamp: '2025-05-26T23:45:00Z', event: 'System Error', description: 'Payment gateway timeout', status: 'error', source: 'Payment Service' },
  { id: '19', timestamp: '2025-05-26T11:00:00Z', event: 'AI Knowledge Base Updated', description: 'Added 7 new documents to knowledge base', status: 'success', source: 'AI Assistant' },
  { id: '20', timestamp: '2025-05-26T08:30:00Z', event: 'Scheduled Notification Sent', description: 'Sent 300 push notifications', status: 'success', source: 'Notifications Service' },
  { id: '21', timestamp: '2025-05-25T16:00:00Z', event: 'Cache Rebuilt', description: 'Cache rebuilt after schema change', status: 'success', source: 'Cache Service' },
  { id: '22', timestamp: '2025-05-25T10:00:00Z', event: 'Daily Backup Completed', description: 'Full backup completed. Size: 2.5GB', status: 'success', source: 'System Scheduler' },
  { id: '23', timestamp: '2025-05-24T14:30:00Z', event: 'AI Rule Triggered', description: 'Rule "water leakage" triggered, created ticket', status: 'success', source: 'AI Assistant' },
  { id: '24', timestamp: '2025-05-24T09:00:00Z', event: 'Authentication Failure', description: 'Suspicious login attempts detected', status: 'warning', source: 'Security Service' },
  { id: '25', timestamp: '2025-05-23T22:00:00Z', event: 'Database Replication Lag', description: 'Replication lag exceeded threshold', status: 'warning', source: 'Database Service' },
];

export const mockKPIData: KPIData = {
  totalActivities: 12847,
  todayActivities: 324,
  failedEvents: 2,
  systemEvents: 183,
};

export const modules = [
  'All Modules',
  'Residents',
  'Rooms',
  'Tickets',
  'Complaints',
  'Chat',
  'Notifications',
  'AI Assistant',
  'Authentication',
  'System',
];

export const roles = ['All Roles', 'Student', 'Manager', 'Admin', 'System'];

export const actionTypes = [
  'All Actions',
  'Create',
  'Update',
  'Delete',
  'Approve',
  'Assign',
  'Transfer',
  'Login',
  'Logout',
];

export const defaultFilterOptions: FilterOptions = {
  dateRange: 'today',
  startDate: '',
  endDate: '',
  user: '',
  role: '',
  module: '',
  actionType: '',
  search: '',
};