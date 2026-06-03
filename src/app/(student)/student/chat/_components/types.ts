// app/(student)/chat/_components/types.ts

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar?: string;
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
  isPinned?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  role: 'student' | 'manager' | 'admin';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  studentId?: string;
  department?: string;
  email?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'manager' | 'admin';
  avatar?: string;
  department?: string;
  studentId?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface AiMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface AiSuggestion {
  id: string;
  question: string;
  answer: string;
  category: 'transfer' | 'maintenance' | 'documents' | 'policy' | 'event';
}

export const userToParticipant = (user: User): Participant => {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    status: user.status || 'offline',
    lastSeen: user.lastSeen,
    studentId: user.studentId,
    department: user.department,
    email: user.email,
  };
};