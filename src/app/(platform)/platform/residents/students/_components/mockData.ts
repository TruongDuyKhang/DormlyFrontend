// app/(platform)/residents/students/_components/mockData.ts

import { Student, Block, Room, Floor, StudentWithLocation, RoomTypeInfo } from './types';
import { Bed, Users, Crown } from 'lucide-react';

export const roomTypes: Record<string, RoomTypeInfo> = {
  single: { 
    label: 'Single Room',
    displayName: 'Single Room',
    icon: Bed,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    capacity: 1, 
    basePrice: 3500000 
  },
  double: { 
    label: 'Double Room',
    displayName: 'Double Room',
    icon: Users,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    capacity: 2, 
    basePrice: 2500000 
  },
  quad: { 
    label: 'Quad Room',
    displayName: 'Quad Room',
    icon: Users,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    capacity: 4, 
    basePrice: 1800000 
  },
  vip: { 
    label: 'VIP Suite',
    displayName: 'VIP Suite',
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    capacity: 2, 
    basePrice: 6000000 
  },
};

const generateDetailedStudent = (blockNum: number, floorNum: number, roomNum: number, idx: number): Student => {
  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ'];
  const middleNames = ['Văn', 'Thị', 'Minh', 'Thúy', 'Hữu', 'Thanh', 'Ngọc', 'Quang', 'Phương', 'Đức'];
  const lastNames = ['Anh', 'Bình', 'Hương', 'Linh', 'Mạnh', 'Quân', 'Thắng', 'Yến', 'Khoa', 'Tú'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${middleName} ${lastName}`;
  
  const majors = ['Computer Science', 'Software Engineering', 'Business Administration', 'Marketing', 'Finance', 'Psychology', 'Economics', 'Architecture', 'Civil Engineering', 'Mathematics'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  
  return {
    id: `s-${blockNum}-${floorNum}-${roomNum}-${idx}`,
    name: fullName,
    email: `${lastName.toLowerCase()}.${firstName.toLowerCase()}@student.edu`,
    studentId: `STU${String(blockNum).padStart(2, '0')}${String(floorNum).padStart(2, '0')}${String(roomNum).padStart(2, '0')}${idx}`,
    major: majors[Math.floor(Math.random() * majors.length)],
    year: years[Math.floor(Math.random() * years.length)],
    phone: `+84 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
    emergencyContact: `+84 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
    status: 'active',
    joinedDate: `2024-${Math.floor(Math.random() * 8 + 8)}-${Math.floor(Math.random() * 28 + 1)}`,
    dateOfBirth: `${Math.floor(Math.random() * 12 + 1)}/${Math.floor(Math.random() * 28 + 1)}/${2000 + Math.floor(Math.random() * 6)}`,
    nationality: 'Vietnamese',
    idCardNumber: `${Math.floor(Math.random() * 100000000000)}`.padStart(12, '0'),
    emergencyName: `${firstName} ${middleName} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    emergencyRelationship: ['Father', 'Mother', 'Sibling', 'Guardian'][Math.floor(Math.random() * 4)],
  };
};

const generateRooms = (floorNum: number, blockNum: number, occupancyFactor: number): Room[] => {
  const roomTypesList: ('single' | 'double' | 'quad' | 'vip')[] = ['single', 'double', 'double', 'quad', 'vip', 'double', 'single', 'quad'];
  
  return Array.from({ length: 8 }, (_, i) => {
    const roomType = roomTypesList[i % roomTypesList.length];
    const capacity = roomTypes[roomType].capacity;
    const roomId = `${blockNum}${floorNum}${String(i + 1).padStart(2, '0')}`;
    const isOccupied = Math.random() < occupancyFactor;
    const studentCount = isOccupied ? Math.min(Math.floor(Math.random() * (capacity + 1)), capacity) : 0;
    const students: Student[] = [];
    for (let s = 0; s < studentCount; s++) {
      students.push(generateDetailedStudent(blockNum, floorNum, i + 1, s));
    }
    return {
      id: roomId,
      number: `${roomId}`,
      type: roomType,
      capacity,
      students,
      status: Math.random() > 0.9 ? 'maintenance' : 'active',
      amenities: ['wifi', 'ac'],
      floorArea: roomType === 'vip' ? 32 : roomType === 'single' ? 18 : roomType === 'double' ? 24 : 36,
      monthlyFee: roomTypes[roomType].basePrice,
      description: `${roomTypes[roomType].displayName} with modern amenities.`,
    };
  });
};

export const blocks: Block[] = [1, 2, 3, 4, 5].map((blockNum) => {
  const floors: Floor[] = [1, 2, 3, 4, 5].map((floorLevel) => {
    const occupancyFactor = 0.5 + (Math.random() * 0.4);
    const rooms = generateRooms(floorLevel, blockNum, occupancyFactor);
    const occupiedRooms = rooms.filter(r => r.students.length > 0 && r.status === 'active').length;
    return {
      level: floorLevel,
      rooms,
      totalRooms: rooms.length,
      occupiedRooms,
      occupancyRate: Math.round((occupiedRooms / rooms.length) * 100),
    };
  });
  
  const totalRooms = floors.reduce((acc, f) => acc + f.totalRooms, 0);
  const totalStudents = floors.reduce((acc, f) => acc + f.rooms.reduce((a, r) => a + r.students.length, 0), 0);
  const occupancyRate = Math.round((totalStudents / (totalRooms * 2)) * 100);
  
  return {
    id: `block-${blockNum}`,
    name: `Block ${blockNum}`,
    floors,
    totalRooms,
    totalStudents,
    occupancyRate,
  };
});

export const allStudents: StudentWithLocation[] = blocks.flatMap(block => 
  block.floors.flatMap(floor =>
    floor.rooms.flatMap(room =>
      room.students.map(student => ({
        ...student,
        blockId: block.id,
        blockName: block.name,
        floorLevel: floor.level,
        roomNumber: room.number
      }))
    )
  )
);