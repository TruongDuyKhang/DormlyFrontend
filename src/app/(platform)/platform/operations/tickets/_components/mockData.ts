// app/(platform)/operations/tickets/_components/mockData.ts

import { Ticket, TicketCategory, TicketPriority, TicketStatus } from './types';

const categories: { value: TicketCategory; label: string }[] = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'ac', label: 'Air Conditioner' },
  { value: 'plumbing', label: 'Plumbing / Water Leak' },
  { value: 'internet', label: 'Internet / WiFi' },
  { value: 'lock', label: 'Door Lock' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'other', label: 'Other' },
];

const blocksListData = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'];

const students = [
  { id: 's1', name: 'Nguyễn Hải Anh', studentId: 'STU001' },
  { id: 's2', name: 'Trần Minh Quân', studentId: 'STU002' },
  { id: 's3', name: 'Phạm Thúc Linh', studentId: 'STU003' },
  { id: 's4', name: 'Lê Thị Yên', studentId: 'STU004' },
  { id: 's5', name: 'Hoàng Văn Mạnh', studentId: 'STU005' },
];

export const managers = [
  { id: 'm1', name: 'Mai Tran', role: 'manager' },
  { id: 'm2', name: 'Linh Vo', role: 'manager' },
  { id: 'm3', name: 'Khoa Nguyen', role: 'technician' },
];

const generateTimeline = (ticketId: string, createdAt: string, status: TicketStatus, assignedTo?: string): any[] => {
  const timeline = [];
  const createdDate = new Date(createdAt);
  
  timeline.push({
    id: `${ticketId}-timeline-1`,
    action: 'Ticket Created',
    description: 'Student reported an issue',
    author: students[Math.floor(Math.random() * students.length)].name,
    authorRole: 'student',
    timestamp: createdAt,
    icon: 'FileText',
  });
  
  if (status !== 'pending') {
    const assignedDate = new Date(createdDate.getTime() + 30 * 60000);
    timeline.push({
      id: `${ticketId}-timeline-2`,
      action: 'Ticket Assigned',
      description: `Assigned to ${assignedTo || managers[0].name}`,
      author: managers[0].name,
      authorRole: 'manager',
      timestamp: assignedDate.toISOString(),
      icon: 'UserCheck',
    });
  }
  
  if (status === 'in_progress' || status === 'done') {
    const progressDate = new Date(createdDate.getTime() + 2 * 3600000);
    timeline.push({
      id: `${ticketId}-timeline-3`,
      action: 'Work Started',
      description: 'Technician began repair work',
      author: managers[1].name,
      authorRole: 'technician',
      timestamp: progressDate.toISOString(),
      icon: 'Wrench',
    });
  }
  
  if (status === 'done') {
    const doneDate = new Date(createdDate.getTime() + 5 * 3600000);
    timeline.push({
      id: `${ticketId}-timeline-4`,
      action: 'Ticket Completed',
      description: 'Issue has been resolved',
      author: managers[1].name,
      authorRole: 'technician',
      timestamp: doneDate.toISOString(),
      icon: 'CheckCircle',
    });
  }
  
  if (status === 'rejected') {
    const rejectDate = new Date(createdDate.getTime() + 60 * 60000);
    timeline.push({
      id: `${ticketId}-timeline-2`,
      action: 'Ticket Rejected',
      description: 'Ticket was rejected',
      author: managers[0].name,
      authorRole: 'manager',
      timestamp: rejectDate.toISOString(),
      icon: 'XCircle',
    });
  }
  
  return timeline;
};

const generateComments = (ticketId: string): any[] => {
  const comments = [];
  
  if (Math.random() > 0.5) {
    comments.push({
      id: `${ticketId}-comment-1`,
      authorId: managers[0].id,
      authorName: managers[0].name,
      authorRole: 'manager',
      content: 'We will inspect this issue this afternoon.',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    });
  }
  
  if (Math.random() > 0.7) {
    comments.push({
      id: `${ticketId}-comment-2`,
      authorId: students[0].id,
      authorName: students[0].name,
      authorRole: 'student',
      content: 'The AC is still not working properly.',
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    });
  }
  
  return comments;
};

export const tickets: Ticket[] = Array.from({ length: 25 }, (_, i) => {
  const statuses: TicketStatus[] = ['pending', 'assigned', 'in_progress', 'done', 'rejected'];
  const priorities: TicketPriority[] = ['high', 'medium', 'low'];
  const categoriesList: TicketCategory[] = ['electrical', 'ac', 'plumbing', 'internet', 'lock', 'bathroom', 'other'];
  
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
  const student = students[Math.floor(Math.random() * students.length)];
  const block = blocksListData[Math.floor(Math.random() * blocksListData.length)];
  const floor = Math.floor(Math.random() * 5) + 1;
  const room = `${Math.floor(Math.random() * 8) + 1}${Math.floor(Math.random() * 8) + 1}`;
  const createdAt = new Date(Date.now() - Math.random() * 7 * 86400000).toISOString();
  
  const assignedTo = status !== 'pending' && Math.random() > 0.3 ? managers[Math.floor(Math.random() * managers.length)] : undefined;
  
  return {
    id: `TICKET-${String(i + 1).padStart(4, '0')}`,
    title: `${categories.find(c => c.value === category)?.label} issue in Room ${room}`,
    description: `The ${categories.find(c => c.value === category)?.label.toLowerCase()} is not working properly. Need immediate assistance.`,
    category,
    priority,
    status,
    blockId: `block-${blocksListData.indexOf(block) + 1}`,
    blockName: block,
    floorLevel: floor,
    roomNumber: `${block.charAt(block.length - 1)}${floor}${room}`,
    createdBy: {
      id: student.id,
      name: student.name,
      studentId: student.studentId,
    },
    assignedTo: assignedTo ? {
      id: assignedTo.id,
      name: assignedTo.name,
      role: assignedTo.role as 'manager' | 'technician',
    } : undefined,
    assignedBy: assignedTo ? {
      id: managers[0].id,
      name: managers[0].name,
    } : undefined,
    attachments: [],
    comments: generateComments(`ticket-${i}`),
    timeline: generateTimeline(`ticket-${i}`, createdAt, status, assignedTo?.name),
    createdAt,
    updatedAt: new Date().toISOString(),
    completedAt: status === 'done' ? new Date().toISOString() : undefined,
    deadline: priority === 'high' ? new Date(Date.now() + 86400000).toISOString() : undefined,
  };
});

export const getCategoryLabel = (value: string): string => {
  const cat = categories.find(c => c.value === value);
  return cat?.label || value;
};

export const getPriorityLabel = (priority: TicketPriority): string => {
  switch(priority) {
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return priority;
  }
};

export const getPriorityColor = (priority: TicketPriority): string => {
  switch(priority) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-amber-600 bg-amber-100';
    case 'low': return 'text-emerald-600 bg-emerald-100';
    default: return 'text-stone-600 bg-stone-100';
  }
};

export const getStatusLabel = (status: TicketStatus): string => {
  switch(status) {
    case 'pending': return 'Pending';
    case 'assigned': return 'Assigned';
    case 'in_progress': return 'In Progress';
    case 'done': return 'Done';
    case 'rejected': return 'Rejected';
    default: return status;
  }
};

export const getStatusColor = (status: TicketStatus): string => {
  switch(status) {
    case 'pending': return 'text-amber-600 bg-amber-100';
    case 'assigned': return 'text-blue-600 bg-blue-100';
    case 'in_progress': return 'text-purple-600 bg-purple-100';
    case 'done': return 'text-emerald-600 bg-emerald-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    default: return 'text-stone-600 bg-stone-100';
  }
};

export const blocksList = blocksListData.map((name, idx) => ({
  id: `block-${idx + 1}`,
  name,
}));