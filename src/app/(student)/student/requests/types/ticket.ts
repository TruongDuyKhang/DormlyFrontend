export type TicketCategory =
  | "MAINTENANCE"
  | "FACILITY"
  | "ROOMMATE"
  | "SECURITY"
  | "BILLING"
  | "OTHER";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" | "CLOSED";

export type TabType = "open" | "in_progress" | "completed";

export interface TicketAssignee {
  id: string;
  fullName: string;
  email: string;
}

export interface TicketAttachment {
  id: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  url: string;
  uploadedById: string;
  createdAt: string;
}

export interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  internal: boolean;
  attachments: TicketAttachment[];
  createdAt: string;
}

export interface TicketSummary {
  id: string;
  code: string;
  title: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  dueDate: string | null;
  reporterId: string;
  reporterName: string;
  assignees: TicketAssignee[];
  createdAt: string;
}

export interface TicketDetail extends TicketSummary {
  description: string;
  buildingNodeId: string | null;
  buildingNodeName: string | null;
  resolutionNote: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  attachments: TicketAttachment[];
  comments: TicketComment[];
}

export interface CreateTicketPayload {
  category: TicketCategory;
  title: string;
  description: string;
  buildingNodeId?: string | null;
}

export interface CreateCommentPayload {
  body: string;
  internal?: boolean;
}