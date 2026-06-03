// app/(platform)/operations/complaints/_components/mockData.ts - English version

import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus, ComplaintCategoryGroup } from './types';

// Category groups mapping
export const categoryToGroup: Record<ComplaintCategory, ComplaintCategoryGroup> = {
  // Policy violations
  smoking: 'policy',
  noise_late: 'policy',
  cooking: 'policy',
  // Conflicts
  roommate: 'conflict',
  argument: 'conflict',
  harassment: 'conflict',
  // Environment
  common_dirty: 'environment',
  bathroom: 'environment',
  noise_upstairs: 'environment',
  // Management complaints
  slow_response: 'management',
  no_response: 'management',
};

// Category display info - ENGLISH
export const categories: { value: ComplaintCategory; label: string; icon: string; group: ComplaintCategoryGroup }[] = [
  // Policy violations
  { value: 'smoking', label: 'Smoking in Room', icon: '🚬', group: 'policy' },
  { value: 'noise_late', label: 'Noise After 11 PM', icon: '🔊', group: 'policy' },
  { value: 'cooking', label: 'Unauthorized Cooking', icon: '🍳', group: 'policy' },
  // Conflicts
  { value: 'roommate', label: 'Roommate Conflict', icon: '👥', group: 'conflict' },
  { value: 'argument', label: 'Verbal Argument', icon: '💢', group: 'conflict' },
  { value: 'harassment', label: 'Harassment', icon: '⚠️', group: 'conflict' },
  // Environment
  { value: 'common_dirty', label: 'Common Area Dirty', icon: '🗑️', group: 'environment' },
  { value: 'bathroom', label: 'Bathroom Hygiene Issue', icon: '🚽', group: 'environment' },
  { value: 'noise_upstairs', label: 'Noise from Upstairs', icon: '🔊', group: 'environment' },
  // Management complaints
  { value: 'slow_response', label: 'Slow Manager Response', icon: '⏰', group: 'management' },
  { value: 'no_response', label: 'No Response from Manager', icon: '📵', group: 'management' },
];

export const groups: { value: ComplaintCategoryGroup; label: string; color: string }[] = [
  { value: 'policy', label: 'Policy Violation', color: 'text-red-700 bg-red-100 border-red-200' },
  { value: 'conflict', label: 'Conflict', color: 'text-purple-700 bg-purple-100 border-purple-200' },
  { value: 'environment', label: 'Environment', color: 'text-blue-700 bg-blue-100 border-blue-200' },
  { value: 'management', label: 'Management Complaint', color: 'text-slate-700 bg-slate-100 border-slate-200' },
];

const blocks = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'];
const students = [
  { id: 's1', name: 'Nguyen Hai Anh', studentId: 'STU001' },
  { id: 's2', name: 'Tran Minh Quan', studentId: 'STU002' },
  { id: 's3', name: 'Pham Thuc Linh', studentId: 'STU003' },
  { id: 's4', name: 'Le Thi Yen', studentId: 'STU004' },
  { id: 's5', name: 'Hoang Van Manh', studentId: 'STU005' },
];

export const managers = [
  { id: 'm1', name: 'Mai Tran', role: 'Senior Manager', avatar: 'MT', department: 'Operations' },
  { id: 'm2', name: 'Linh Vo', role: 'Facility Manager', avatar: 'LV', department: 'Maintenance' },
  { id: 'm3', name: 'Khoa Nguyen', role: 'Technical Lead', avatar: 'KN', department: 'Technical' },
];

const complaintTitlesByCategory: Record<ComplaintCategory, string[]> = {
  smoking: ['Smoking detected in room', 'Cigarette smell in hallway', 'Repeated smoking violation'],
  noise_late: ['Loud music after midnight', 'Party noise past quiet hours', 'Shouting late at night'],
  cooking: ['Cooking smell in room', 'Unauthorized cooking equipment', 'Fire alarm triggered by cooking'],
  roommate: ['Roommate refuses to clean', 'Roommate steals food', 'Roommate has unauthorized guests'],
  argument: ['Loud argument in common area', 'Verbal fight in hallway', 'Argument over parking space'],
  harassment: ['Unwanted comments', 'Intimidating behavior', 'Repeated unwanted attention'],
  common_dirty: ['Trash left in hallway', 'Kitchen never cleaned', 'Lounge area always messy'],
  bathroom: ['Toilet not flushing', 'Shower drain clogged', 'Bathroom never cleaned'],
  noise_upstairs: ['Footsteps stomping above', 'Furniture dragging noise', 'Loud TV from upstairs'],
  slow_response: ['Maintenance request ignored for days', 'No reply to email', 'Manager never available'],
  no_response: ['Complaint submitted weeks ago', 'No acknowledgment received', 'Followed up multiple times'],
};

const generateTimeline = (complaintId: string, createdAt: string, status: ComplaintStatus): any[] => {
  const timeline = [];
  const createdDate = new Date(createdAt);
  
  timeline.push({
    id: `${complaintId}-timeline-1`,
    action: 'Complaint Submitted',
    description: 'Student filed a complaint',
    author: 'Student',
    authorRole: 'student',
    timestamp: createdAt,
    icon: 'FileText',
  });
  
  if (status !== 'pending') {
    const reviewingDate = new Date(createdDate.getTime() + 30 * 60000);
    timeline.push({
      id: `${complaintId}-timeline-2`,
      action: 'Under Review',
      description: 'Complaint is being reviewed by management',
      author: managers[0].name,
      authorRole: 'manager',
      timestamp: reviewingDate.toISOString(),
      icon: 'Eye',
    });
  }
  
  if (status === 'investigating' || status === 'resolved' || status === 'closed') {
    const investigatingDate = new Date(createdDate.getTime() + 2 * 3600000);
    timeline.push({
      id: `${complaintId}-timeline-3`,
      action: 'Investigation Started',
      description: 'Formal investigation has been initiated',
      author: managers[1].name,
      authorRole: 'manager',
      timestamp: investigatingDate.toISOString(),
      icon: 'Search',
    });
  }
  
  if (status === 'resolved' || status === 'closed') {
    const resolvedDate = new Date(createdDate.getTime() + 5 * 3600000);
    timeline.push({
      id: `${complaintId}-timeline-4`,
      action: 'Resolution Proposed',
      description: 'Resolution has been proposed',
      author: managers[0].name,
      authorRole: 'manager',
      timestamp: resolvedDate.toISOString(),
      icon: 'CheckCircle',
    });
  }
  
  if (status === 'closed') {
    const closedDate = new Date(createdDate.getTime() + 7 * 3600000);
    timeline.push({
      id: `${complaintId}-timeline-5`,
      action: 'Complaint Closed',
      description: 'Complaint has been closed',
      author: managers[0].name,
      authorRole: 'manager',
      timestamp: closedDate.toISOString(),
      icon: 'Archive',
    });
  }
  
  return timeline;
};

export const complaints: Complaint[] = Array.from({ length: 45 }, (_, i) => {
  const statuses: ComplaintStatus[] = ['pending', 'reviewing', 'investigating', 'resolved', 'closed'];
  const priorities: ComplaintPriority[] = ['low', 'medium', 'high', 'critical'];
  
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const categoryIndex = Math.floor(Math.random() * categories.length);
  const category = categories[categoryIndex].value;
  const group = categoryToGroup[category];
  const titles = complaintTitlesByCategory[category];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const isAnonymous = Math.random() > 0.6;
  const student = isAnonymous ? null : students[Math.floor(Math.random() * students.length)];
  const block = blocks[Math.floor(Math.random() * blocks.length)];
  const floor = Math.floor(Math.random() * 5) + 1;
  const room = `${Math.floor(Math.random() * 8) + 1}${Math.floor(Math.random() * 8) + 1}`;
  const createdAt = new Date(Date.now() - Math.random() * 14 * 86400000).toISOString();
  
  const assignedTo = status !== 'pending' && Math.random() > 0.3 ? managers[Math.floor(Math.random() * managers.length)] : undefined;
  
  return {
    id: `COMP-${String(i + 1).padStart(4, '0')}`,
    title,
    description: `This complaint was filed regarding ${categories[categoryIndex].label.toLowerCase()}. The issue has been reported and requires attention.`,
    category,
    categoryGroup: group,
    priority,
    status,
    isAnonymous,
    blockId: `block-${blocks.indexOf(block) + 1}`,
    blockName: block,
    floorLevel: floor,
    roomNumber: `${block.charAt(block.length - 1)}${floor}${room}`,
    createdBy: student,
    assignedTo: assignedTo ? {
      id: assignedTo.id,
      name: assignedTo.name,
      role: 'manager',
    } : undefined,
    assignedBy: assignedTo ? {
      id: managers[0].id,
      name: managers[0].name,
    } : undefined,
    attachments: [],
    comments: [],
    timeline: generateTimeline(`comp-${i}`, createdAt, status),
    investigationNotes: status === 'investigating' || status === 'resolved' || status === 'closed' 
      ? 'Investigation in progress. Interviewing witnesses and reviewing evidence.' 
      : undefined,
    resolution: status === 'resolved' || status === 'closed'
      ? 'Issue has been resolved. Corrective actions have been implemented.'
      : undefined,
    createdAt,
    updatedAt: new Date().toISOString(),
    resolvedAt: status === 'resolved' || status === 'closed' ? new Date().toISOString() : undefined,
    closedAt: status === 'closed' ? new Date().toISOString() : undefined,
  };
});

export const getCategoryLabel = (value: string): string => {
  const cat = categories.find(c => c.value === value);
  return cat?.label || value;
};

export const getCategoryIcon = (value: string): string => {
  const cat = categories.find(c => c.value === value);
  return cat?.icon || '📝';
};

export const getGroupLabel = (value: string): string => {
  const grp = groups.find(g => g.value === value);
  return grp?.label || value;
};

export const getPriorityLabel = (priority: ComplaintPriority): string => {
  switch(priority) {
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return priority;
  }
};

export const getPriorityColor = (priority: ComplaintPriority): string => {
  switch(priority) {
    case 'critical': return 'text-red-700 bg-red-100 border-red-200';
    case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
    case 'medium': return 'text-amber-700 bg-amber-100 border-amber-200';
    case 'low': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    default: return 'text-stone-600 bg-stone-100 border-stone-200';
  }
};

export const getStatusLabel = (status: ComplaintStatus): string => {
  switch(status) {
    case 'pending': return 'New';
    case 'reviewing': return 'Reviewing';
    case 'investigating': return 'Investigating';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    default: return status;
  }
};

export const getStatusColor = (status: ComplaintStatus): string => {
  switch(status) {
    case 'pending': return 'text-amber-700 bg-amber-100 border-amber-200';
    case 'reviewing': return 'text-blue-700 bg-blue-100 border-blue-200';
    case 'investigating': return 'text-purple-700 bg-purple-100 border-purple-200';
    case 'resolved': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    case 'closed': return 'text-stone-600 bg-stone-100 border-stone-200';
    default: return 'text-stone-600 bg-stone-100 border-stone-200';
  }
};

export const blocksList = blocks.map((name, idx) => ({
  id: `block-${idx + 1}`,
  name,
}));