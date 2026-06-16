// app/(platform)/residents/assignments/_components/types.ts

// ============================================================
// STUDENT ASSIGNMENT
// ============================================================

export interface StudentAssignment {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  startYear: string;
  endYear: string;
  major: string;
  year: string;
  faculty: string;
  
  // Lifestyle preferences
  sleepTime: string;
  wakeUpTime: string;
  quietPreference: string;
  socialPreference: string;
  studyHabit: string;
  routineStrictness: string;
  adaptability: string;
  
  // Roommate preference
  preference: 'system' | 'friend';
  friendName?: string;
  friendId?: string;
  friendBlock?: string;
  friendFloor?: string;
  friendRoom?: string;
  
  // Documents
  documents: {
    citizenId: boolean;
    studentCard: boolean;
  };
  
  // Assignment status
  status: 'pending' | 'assigned' | 'rejected';
  assignedRoom?: string;
  assignedBlock?: string;
  assignedFloor?: number;
  rejectionReason?: string;
  createdAt: string;
}

// ============================================================
// AVAILABLE ROOM
// ============================================================

export interface AvailableRoom {
  id: string;
  block: string;
  blockId: string;
  floor: number;
  roomNumber: string;
  capacity: number;
  currentOccupants: number;
  availableSlots: number;
}

// ============================================================
// ASSIGNMENT RESULT
// ============================================================

export interface AssignmentResult {
  studentId: string;
  studentName: string;
  roomId: string;
  roomNumber: string;
  block: string;
  floor: number;
  success: boolean;
  message?: string;
}

// ============================================================
// FILTER / TAB TYPES
// ============================================================

export type AssignmentTabType = 'pending' | 'rejected' | 'all';

export interface TabCounts {
  pending: number;
  rejected: number;
  all: number;
}

// ============================================================
// COMPONENT PROPS
// ============================================================

export interface AssignmentTabsProps {
  activeTab: AssignmentTabType;
  onTabChange: (tab: AssignmentTabType) => void;
  counts: TabCounts;
}

export interface StudentAssignmentCardProps {
  student: StudentAssignment;
  isExpanded: boolean;
  onToggle: () => void;
  onAutoAssign: (studentId: string) => void;
  onManualAssign: (student: StudentAssignment) => void;
  onReject: (studentId: string) => void;
  isAssigned?: boolean;
  showActions?: boolean;
}

export interface AutoAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentAssignment[];
  rooms: AvailableRoom[];
  onConfirm: (students: StudentAssignment[]) => void;
  isProcessing?: boolean;
}

export interface ManualAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentAssignment | null;
  rooms: AvailableRoom[];
  onConfirm: (studentId: string, roomId: string) => void;
}