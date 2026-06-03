// app/(platform)/residents/students/_components/types.ts

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

export interface StudentWithLocation extends Student {
  blockId: string;
  blockName: string;
  floorLevel: number;
  roomNumber: string;
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
}

export interface Floor {
  level: number;
  rooms: Room[];
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export interface Block {
  id: string;
  name: string;
  floors: Floor[];
  totalRooms: number;
  totalStudents: number;
  occupancyRate: number;
}

export interface RoomTypeInfo {
  label: string;
  displayName: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  capacity: number;
  basePrice: number;
}

export interface SearchResult {
  student: StudentWithLocation;
  blockId: string;
  blockName: string;
  floorLevel: number;
  roomNumber: string;
}

export type NavigationView = 'blocks' | 'floors' | 'rooms' | 'students';