// app/(student)/community/_components/types.ts


export type FeedType = "news" | "school" | "community";

export interface FeedPost {
  id: string;
  type: FeedType;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  author: string;
  likes: number;
  comments: number;
}

export type EventStatus = "upcoming" | "ongoing" | "past";

export interface EventParticipant {
  name: string;
  avatar: string;
  studentId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  participants: number;
  maxParticipants: number;
  status: EventStatus;
  joined: boolean;
  participantsList?: EventParticipant[];
}

export type PollStatus = "active" | "closed";
export type PollCategory = "event" | "facility" | "policy" | "activity" | "other";
export type PollCreatorRole = "admin" | "manager" | "student_club";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollVoter {
  name: string;
  avatar: string;
  votedAt?: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  status: PollStatus;
  category: PollCategory;
  createdAt: string;
  endsAt?: string;
  createdBy: string;
  createdByRole: PollCreatorRole;
  userVoted?: string;
  recentVoters?: PollVoter[];
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
  event: string;
  date: string;
  likes: number;
  photographer?: string;
}

export interface JoinEventFormData {
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePollData {
  title: string;
  description: string;
  category: PollCategory;
  options: string[];
  endsAt?: string;
}

export interface CreatePollFormData {
  title: string;
  description: string;
  category: PollCategory;
  options: string[];
  endDate?: string;
  endTime?: string;
}