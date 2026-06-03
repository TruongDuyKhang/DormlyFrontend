// app/(student)/profile/_components/types.ts

export interface Student {
  id: string;
  fullName: string;
  studentId: string;
  universityEmail: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  faculty: string;
  major: string;
  academicYear: string;
  avatar?: string;
}

export interface EmergencyContact {
  name: string;
  phoneNumber: string;
  relationship: string;
}