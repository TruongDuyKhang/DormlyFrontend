export type TicketCategory =
  | "MAINTENANCE"
  | "FACILITY"
  | "ROOMMATE"
  | "SECURITY"
  | "BILLING"
  | "OTHER";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" | "CLOSED";

export interface TicketAssignee {
  id: string;
  fullName: string;
  email: string;
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