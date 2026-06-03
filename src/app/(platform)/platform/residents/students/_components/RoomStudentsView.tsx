// app/(platform)/residents/students/_components/RoomStudentsView.tsx
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Users, User, GraduationCap, Calendar, Mail, Eye, Home, Wifi, Snowflake, Tv, Bath, Coffee, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Block, Floor, StudentWithLocation } from './types';
import { roomTypes } from './mockData';

interface RoomStudentsViewProps {
  room: Room;
  block: Block | null;
  floor: Floor | null;
  onBack: () => void;
  onViewStudentDetail: (student: StudentWithLocation) => void;
}

const amenitiesList = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'bath', label: 'Private Bathroom', icon: Bath },
  { id: 'coffee', label: 'Coffee Machine', icon: Coffee },
  { id: 'desk', label: 'Study Desk', icon: Zap },
];

const getAmenityIcon = (id: string) => {
  const amenity = amenitiesList.find(a => a.id === id);
  return amenity?.icon;
};

const getAmenityLabel = (id: string) => {
  const amenity = amenitiesList.find(a => a.id === id);
  return amenity?.label;
};

export function RoomStudentsView({ room, block, floor, onBack, onViewStudentDetail }: RoomStudentsViewProps) {
  const roomTypeInfo = roomTypes[room.type];
  const RoomIcon = roomTypeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-5"
    >
      <div className="rounded-2xl border border-white/55 bg-white/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl overflow-hidden">
        {/* Room Header */}
        <div className="border-b border-white/30 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                {block?.name} • Floor {floor?.level}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                  Room {room.number}
                </h2>
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", roomTypeInfo.bgColor, roomTypeInfo.color)}>
                  {roomTypeInfo.displayName}
                </span>
              </div>
            </div>
            <div className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              room.students.length > 0 ? "bg-[#c3a26c]/20 text-[#c3a26c]" : "bg-stone-200/50 text-stone-500"
            )}>
              {room.students.length}/{room.capacity} occupied
            </div>
          </div>
        </div>
        
        {/* Room Details Section */}
        <div className="px-6 pt-4 pb-2 border-b border-white/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-white/40 p-2.5">
              <p className="text-xs text-stone-500">Room Type</p>
              <p className="text-sm font-semibold text-stone-950">{roomTypeInfo.displayName}</p>
            </div>
            <div className="rounded-lg bg-white/40 p-2.5">
              <p className="text-xs text-stone-500">Capacity</p>
              <p className="text-sm font-semibold text-stone-950">{room.capacity} students</p>
            </div>
            <div className="rounded-lg bg-white/40 p-2.5">
              <p className="text-xs text-stone-500">Monthly Fee</p>
              <p className="text-sm font-semibold text-stone-950">{room.monthlyFee.toLocaleString()} VND</p>
            </div>
            <div className="rounded-lg bg-white/40 p-2.5">
              <p className="text-xs text-stone-500">Floor Area</p>
              <p className="text-sm font-semibold text-stone-950">{room.floorArea} m²</p>
            </div>
          </div>
          
          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-stone-500 mb-1">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {room.amenities.map(amenityId => {
                  const AmenityIcon = getAmenityIcon(amenityId);
                  return (
                    <span key={amenityId} className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-0.5 text-xs text-stone-600">
                      {AmenityIcon && <AmenityIcon className="h-3 w-3" />}
                      {getAmenityLabel(amenityId)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Description */}
          {room.description && (
            <div className="mt-3">
              <p className="text-xs text-stone-500">Description</p>
              <p className="text-xs text-stone-600 mt-0.5">{room.description}</p>
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Current Residents</p>
          {room.students.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {room.students.map((student, idx) => {
                const studentWithLocation: StudentWithLocation = {
                  ...student,
                  blockId: block?.id || '',
                  blockName: block?.name || '',
                  floorLevel: floor?.level || 0,
                  roomNumber: room.number
                };
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-xl border border-white/50 bg-white/40 p-4 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c3a26c]/20">
                        <User className="h-5 w-5 text-[#c3a26c]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="font-semibold text-stone-950">{student.name}</h3>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {student.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 font-mono">{student.studentId}</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <GraduationCap className="h-3 w-3" />
                            <span className="truncate">{student.major}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <Calendar className="h-3 w-3" />
                            <span>{student.year}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-600 col-span-2">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{student.email}</span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onViewStudentDetail(studentWithLocation)}
                          className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg border border-[#c3a26c]/40 bg-[#c3a26c]/10 px-2 py-1.5 text-xs font-medium text-[#8b6b3e] transition hover:bg-[#c3a26c]/20"
                        >
                          <Eye className="h-3 w-3" />
                          View Full Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-stone-300 mb-3" />
              <p className="text-stone-500 font-medium">No residents assigned to this room</p>
              <p className="text-xs text-stone-400 mt-1">This room is currently vacant</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-start pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-white/55 bg-white/32 px-5 py-2.5 text-sm text-stone-600 transition hover:bg-white/45"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Rooms
        </button>
      </div>
    </motion.div>
  );
}