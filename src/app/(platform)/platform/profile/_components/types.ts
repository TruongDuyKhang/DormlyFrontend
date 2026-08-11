// app/(platform)/platform/profile/_components/types.ts

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  joinDate: string;
  bio: string;
  avatar?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed';
  entityType?: string;
}