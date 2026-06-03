// app/(platform)/operations/complaints/_components/types.ts

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintStatus = 'pending' | 'reviewing' | 'investigating' | 'resolved' | 'closed';
export type ComplaintCategory = 
  | 'smoking' | 'noise_late' | 'cooking'
  | 'roommate' | 'argument' | 'harassment'
  | 'common_dirty' | 'bathroom' | 'noise_upstairs'
  | 'slow_response' | 'no_response';

export type ComplaintCategoryGroup = 'policy' | 'conflict' | 'environment' | 'management';

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document';
  fileSize: number;
  uploadedAt: string;
}

export interface ComplaintComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'manager' | 'admin';
  content: string;
  createdAt: string;
  isInternal?: boolean;
  attachments?: Attachment[];
}

export interface ComplaintTimeline {
  id: string;
  action: string;
  description: string;
  author: string;
  authorRole: string;
  timestamp: string;
  icon?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  categoryGroup: ComplaintCategoryGroup;  // THÊM DÒNG NÀY
  priority: ComplaintPriority;
  status: ComplaintStatus;
  isAnonymous: boolean;
  blockId: string;
  blockName: string;
  floorLevel: number;
  roomNumber: string;
  createdBy: {
    id: string;
    name: string;
    studentId: string;
    avatar?: string;
  } | null;
  assignedTo?: {
    id: string;
    name: string;
    role: 'manager' | 'admin';
  };
  assignedBy?: {
    id: string;
    name: string;
  };
  attachments: Attachment[];
  comments: ComplaintComment[];
  timeline: ComplaintTimeline[];
  investigationNotes?: string;
  resolution?: string;
  rejectedReason?: string;  // THÊM DÒNG NÀY
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
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