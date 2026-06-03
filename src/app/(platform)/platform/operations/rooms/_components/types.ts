// app/(platform)/operations/rooms/_components/types.ts

import { LucideIcon } from 'lucide-react';
import { Bed, Users, Crown, Wifi, Snowflake, Tv, Bath, Coffee, Zap } from 'lucide-react';

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  phone: string;
  emergencyContact: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  dateOfBirth: string;
  nationality: string;
  idCardNumber: string;
  emergencyName: string;
  emergencyRelationship: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'quad' | 'vip';
  capacity: number;
  students: Student[];
  status: 'active' | 'inactive' | 'maintenance';
  amenities: string[];
  floorArea: number;
  monthlyFee: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  level: number;
  rooms: Room[];
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export interface Block {
  id: string;
  name: string;
  code: string;
  floors: Floor[];
  totalRooms: number;
  totalStudents: number;
  occupancyRate: number;
  address: string;
}

export interface RoomTypeInfo {
  label: string;
  displayName: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  capacity: number;
  basePrice: number;
}

export const roomTypes: Record<string, RoomTypeInfo> = {
  single: { 
    label: 'Single Room',
    displayName: 'Single Room',
    icon: Bed,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-200',
    capacity: 1, 
    basePrice: 3500000 
  },
  double: { 
    label: 'Double Room',
    displayName: 'Double Room',
    icon: Users,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-200',
    capacity: 2, 
    basePrice: 2500000 
  },
  quad: { 
    label: 'Quad Room',
    displayName: 'Quad Room',
    icon: Users,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-200',
    capacity: 4, 
    basePrice: 1800000 
  },
  vip: { 
    label: 'VIP Suite',
    displayName: 'VIP Suite',
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    capacity: 2, 
    basePrice: 6000000 
  },
};

export const amenitiesList = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'bath', label: 'Private Bathroom', icon: Bath },
  { id: 'coffee', label: 'Coffee Machine', icon: Coffee },
  { id: 'desk', label: 'Study Desk', icon: Zap },
];