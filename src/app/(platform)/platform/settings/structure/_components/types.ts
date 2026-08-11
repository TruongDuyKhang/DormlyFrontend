// app/(platform)/platform/settings/structure/_components/types.ts

export interface Block {
  id: string;
  name: string;
  code: string;
  description: string;
  genderRestriction: 'all' | 'male' | 'female';
  status: 'active' | 'inactive';
  floorCount: number;
  roomCount: number;
  totalCapacity: number;
  currentOccupancy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  blockId: string;
  blockName: string;
  level: number;
  description: string;
  roomCount: number;
  occupancyRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  genderRestriction: 'all' | 'male' | 'female';
  monthlyFee: number;
  description: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomOccupant {
  assignmentId: string;
  userId: string;
  name: string;
  email: string;
  studentCode?: string;
  major?: string;
  phone?: string;
  startDate?: string;
  endDate?: string;
  status: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  blockId: string;
  blockName: string;
  floorId: string;
  floorLevel: number;
  roomTypeId: string;
  roomTypeName: string;
  capacity: number;
  currentOccupants: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  genderRestriction: 'all' | 'male' | 'female';
  occupants?: RoomOccupant[];
  createdAt: string;
  updatedAt: string;
}