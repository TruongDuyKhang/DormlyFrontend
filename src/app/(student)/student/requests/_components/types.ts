// app/(student)/requests/_components/types.ts

export type RequestStatus = "pending" | "assigned" | "in_progress" | "resolved" | "rejected" | "approved";
export type RequestCategory = "maintenance" | "complaint" | "transfer";
export type RequestSubType = 
  | "electrical" | "plumbing" | "internet" | "furniture" | "equipment" | "hygiene"
  | "noise" | "cleanliness" | "conflict" | "rule_violation" | "other";

export interface Attachment {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
  size?: string;
}

export interface Comment {
  id: string;
  author: "student" | "manager" | "admin";
  authorName: string;
  content: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface RequestTimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  status: RequestStatus;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  category: RequestCategory;
  subType: RequestSubType;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  comments: Comment[];
  timeline: RequestTimelineItem[];
  assignedTo?: string;
}

export type TabType = "open" | "in_progress" | "completed";