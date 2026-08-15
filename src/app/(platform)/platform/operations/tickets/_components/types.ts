// app/(platform)/operations/tickets/_components/types.ts

export type TicketPriority = 'high' | 'medium' | 'low';
export type TicketStatus = 'pending' | 'assigned' | 'in_progress' | 'done' | 'rejected';
export type TicketCategory = 'electrical' | 'ac' | 'plumbing' | 'internet' | 'lock' | 'bathroom' | 'other';

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document';
  fileSize: number;
  uploadedAt: string;
}

export interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'manager' | 'admin' | 'technician';
  content: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface TicketTimeline {
  id: string;
  action: string;
  description: string;
  author: string;
  authorRole: string;
  timestamp: string;
  icon?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority | null;
  status: TicketStatus;
  blockId: string;
  blockName: string;
  floorLevel: number;
  roomNumber: string;
  createdBy: {
    id: string;
    name: string;
    studentId: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: 'manager' | 'technician' | 'admin';
    avatar?: string;
  };
  assignedBy?: {
    id: string;
    name: string;
  };
  attachments: Attachment[];
  comments: TicketComment[];
  timeline: TicketTimeline[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  rejectedReason?: string;
  resolutionNote?: string;
  deadline?: string;
}

export interface FilterOptions {
  blockId: string;
  floorLevel: string;
  roomNumber: string;
  category: string;
  priority: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}