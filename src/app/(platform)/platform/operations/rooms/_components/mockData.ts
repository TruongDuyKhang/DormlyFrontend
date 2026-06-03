// app/(platform)/operations/rooms/_components/mockData.ts

import { Student, Block, Room, Floor } from './types';
import { roomTypes, amenitiesList } from './types';

// Generate student
export const generateStudent = (id: string, name: string, studentId: string): Student => {
  const majors = ['Computer Science', 'Engineering', 'Business', 'Psychology', 'Mathematics', 'Physics', 'Economics', 'Architecture'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  
  return {
    id,
    name,
    email: `${name.toLowerCase().replace(/ /g, '.')}@student.edu`,
    studentId,
    major: majors[Math.floor(Math.random() * majors.length)],
    year: years[Math.floor(Math.random() * years.length)],
    phone: `+84 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
    emergencyContact: `+84 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
    status: 'active',
    joinedDate: `2024-${Math.floor(Math.random() * 8 + 8)}-${Math.floor(Math.random() * 28 + 1)}`,
    dateOfBirth: `${Math.floor(Math.random() * 12 + 1)}/${Math.floor(Math.random() * 28 + 1)}/${2000 + Math.floor(Math.random() * 6)}`,
    nationality: 'Vietnamese',
    idCardNumber: `${Math.floor(Math.random() * 100000000000)}`.padStart(12, '0'),
    emergencyName: `Emergency Contact ${name.split(' ')[0]}`,
    emergencyRelationship: ['Father', 'Mother', 'Sibling'][Math.floor(Math.random() * 3)],
  };
};

// Students database
export const studentsDB: Student[] = [
  generateStudent('s1', 'Nguyễn Hải Anh', 'STU001'),
  generateStudent('s2', 'Trần Minh Quân', 'STU002'),
  generateStudent('s3', 'Phạm Thúc Linh', 'STU003'),
  generateStudent('s4', 'Lê Thị Yên', 'STU004'),
  generateStudent('s5', 'Hoàng Văn Mạnh', 'STU005'),
  generateStudent('s6', 'Võ Minh Khoa', 'STU006'),
  generateStudent('s7', 'Ngô Thị Hương', 'STU007'),
  generateStudent('s8', 'Bùi Văn Tú', 'STU008'),
  generateStudent('s9', 'Dương Thị Liêu', 'STU009'),
  generateStudent('s10', 'Mai Thị Thanh', 'STU010'),
  generateStudent('s11', 'Lý Hoàng Nam', 'STU011'),
  generateStudent('s12', 'Đặng Thu Hà', 'STU012'),
];

// Generate rooms for a floor
export const generateRooms = (blockId: string, blockNum: number, floorNum: number): Room[] => {
  const roomTypesList: ('single' | 'double' | 'quad' | 'vip')[] = ['single', 'double', 'double', 'quad', 'vip', 'double', 'single', 'quad', 'double', 'vip'];
  const roomNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
  
  return roomNumbers.map((roomNum, idx) => {
    const roomType = roomTypesList[idx % roomTypesList.length];
    const capacity = roomTypes[roomType].capacity;
    const studentCount = Math.random() > 0.4 ? Math.floor(Math.random() * (capacity + 1)) : 0;
    const roomStudents: Student[] = [];
    
    for (let i = 0; i < studentCount; i++) {
      const studentIdx = (blockNum * 10 + floorNum * 10 + idx + i) % studentsDB.length;
      roomStudents.push({ ...studentsDB[studentIdx] });
    }
    
    const amenities = amenitiesList.filter(() => Math.random() > 0.5).map(a => a.id);
    if (roomType === 'vip') {
      amenities.push('wifi', 'ac', 'tv', 'bath', 'coffee', 'desk');
    }
    
    return {
      id: `${blockId}-f${floorNum}-r${roomNum}`,
      number: `${blockNum}${floorNum}${roomNum}`,
      type: roomType,
      capacity,
      students: roomStudents,
      status: Math.random() > 0.9 ? 'maintenance' : 'active',
      amenities: [...new Set(amenities)],
      floorArea: roomType === 'vip' ? 32 : roomType === 'single' ? 18 : roomType === 'double' ? 24 : 36,
      monthlyFee: roomTypes[roomType].basePrice,
      description: `${roomTypes[roomType].label} with modern amenities and comfortable living space.`,
      createdAt: '2024-08-01',
      updatedAt: new Date().toISOString().split('T')[0],
    };
  });
};

// Generate floors for a block
export const generateFloors = (blockId: string, blockNum: number): Floor[] => {
  const floorLevels = [1, 2, 3, 4, 5];
  return floorLevels.map((level) => {
    const rooms = generateRooms(blockId, blockNum, level);
    const occupiedRooms = rooms.filter(r => r.students.length > 0 && r.status === 'active').length;
    return {
      id: `${blockId}-f${level}`,
      level,
      rooms,
      totalRooms: rooms.length,
      occupiedRooms,
      occupancyRate: Math.round((occupiedRooms / rooms.length) * 100),
    };
  });
};

// Generate blocks
export const generateBlocks = (): Block[] => {
  return [1, 2, 3, 4, 5].map((blockNum) => {
    const blockId = `block-${blockNum}`;
    const floors = generateFloors(blockId, blockNum);
    const totalRooms = floors.reduce((acc: number, f: Floor) => acc + f.totalRooms, 0);
    const totalStudents = floors.reduce((acc: number, f: Floor) => acc + f.rooms.reduce((a: number, r: Room) => a + r.students.length, 0), 0);
    const occupancyRate = Math.round((totalStudents / (totalRooms * 2)) * 100);
    
    return {
      id: blockId,
      name: `Block ${blockNum}`,
      code: `B${blockNum}`,
      floors,
      totalRooms,
      totalStudents,
      occupancyRate,
      address: `123 Residence Street, District ${blockNum}, Hanoi`,
    };
  });
};

export const initialBlocks = generateBlocks();