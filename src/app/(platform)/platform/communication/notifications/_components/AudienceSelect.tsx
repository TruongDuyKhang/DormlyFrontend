// app/(platform)/communication/notifications/_components/AudienceSelect.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Users, Building2, Layers, DoorOpen, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AudienceFilter, Block } from './types';
import { blocks } from './mockData';
import { userService } from '@/services/userService';
import type { UserResponseDto } from '@/types/models';

interface AudienceSelectProps {
  value: AudienceFilter;
  onChange: (value: AudienceFilter) => void;
}

const audienceTypes = [
  { value: 'all', label: 'All Residents', icon: Users, description: 'Send to all residents' },
  { value: 'block', label: 'Specific Block', icon: Building2, description: 'Select a block' },
  { value: 'floor', label: 'Specific Floor', icon: Layers, description: 'Select a block and floor' },
  { value: 'room', label: 'Specific Room', icon: DoorOpen, description: 'Select a block, floor, and room' },
  { value: 'user', label: 'Specific Resident', icon: User, description: 'Send to a specific resident' },
];

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all duration-200",
          "border-stone-300 bg-white text-stone-700",
          "hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30",
          !value && "text-stone-400"
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 max-h-60 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-left text-sm transition hover:bg-stone-50",
                value === option.value && "bg-[#c3a26c]/10 text-[#c3a26c] font-medium"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AudienceSelect({ value, onChange }: AudienceSelectProps) {
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [userList, setUserList] = useState<UserResponseDto[]>([]);
  const [customEmail, setCustomEmail] = useState<string>('');

  useEffect(() => {
    userService.list()
      .then((users) => setUserList(users || []))
      .catch(() => {});
  }, []);
  
  const currentType = audienceTypes.find(t => t.value === value.type);
  const CurrentIcon = currentType?.icon;
  
  const getDisplayText = () => {
    switch (value.type) {
      case 'all': return 'All Residents';
      case 'block': return `Block ${value.value?.toUpperCase()}`;
      case 'floor': {
        const [block, floor] = (value.value || '').split('-');
        return `Block ${block?.toUpperCase()} • Floor ${floor}`;
      }
      case 'room': {
        const [block, floor, room] = (value.value || '').split('-');
        return `Block ${block?.toUpperCase()} • Floor ${floor} • Room ${room}`;
      }
      case 'user': {
        return value.value ? `Resident Email: ${value.value}` : 'Select specific resident';
      }
      default: return 'Select audience';
    }
  };
  
  const handleTypeChange = (type: string) => {
    if (type === 'all') {
      onChange({ type: 'all' });
    } else if (type === 'block') {
      onChange({ type: 'block', value: blocks[0]?.id });
      setSelectedBlock(blocks[0]?.id);
    } else if (type === 'floor') {
      onChange({ type: 'floor', value: `${blocks[0]?.id}-1` });
      setSelectedBlock(blocks[0]?.id);
      setSelectedFloor(1);
    } else if (type === 'room') {
      onChange({ type: 'room', value: `${blocks[0]?.id}-1-101` });
      setSelectedBlock(blocks[0]?.id);
      setSelectedFloor(1);
      setSelectedRoom('101');
    } else if (type === 'user') {
      const defaultEmail = userList[0]?.email || '';
      onChange({ type: 'user', value: defaultEmail });
      setCustomEmail(defaultEmail);
    }
  };
  
  const handleBlockSelect = (blockId: string) => {
    setSelectedBlock(blockId);
    if (value.type === 'block') {
      onChange({ type: 'block', value: blockId });
    } else if (value.type === 'floor') {
      onChange({ type: 'floor', value: `${blockId}-${selectedFloor}` });
    } else if (value.type === 'room') {
      onChange({ type: 'room', value: `${blockId}-${selectedFloor}-${selectedRoom}` });
    }
  };
  
  const handleFloorSelect = (floor: number) => {
    setSelectedFloor(floor);
    if (value.type === 'floor') {
      onChange({ type: 'floor', value: `${selectedBlock}-${floor}` });
    } else if (value.type === 'room') {
      onChange({ type: 'room', value: `${selectedBlock}-${floor}-${selectedRoom}` });
    }
  };
  
  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
    onChange({ type: 'room', value: `${selectedBlock}-${selectedFloor}-${room}` });
  };

  const handleUserSelect = (userEmail: string) => {
    setCustomEmail(userEmail);
    onChange({ type: 'user', value: userEmail });
  };
  
  const selectedBlockObj = blocks.find(b => b.id === selectedBlock);
  
  const floorOptions = selectedBlockObj?.floors.map(floor => ({ value: floor.toString(), label: `Floor ${floor}` })) || [];
  const roomOptions = Array.from({ length: 8 }, (_, i) => {
    const roomNum = i + 1;
    const roomNumber = roomNum.toString().padStart(2, '0');
    return { value: roomNumber, label: `Room ${roomNumber}` };
  });

  const userOptions = userList.map((u) => ({
    value: u.email,
    label: `${u.fullName} (${u.email})`,
  }));
  
  return (
    <div className="space-y-3">
      {/* Audience Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {audienceTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = value.type === type.value;
          return (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all",
                isSelected
                  ? "border-[#c3a26c] bg-[#c3a26c]/10 text-[#c3a26c]"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[11px] font-medium leading-tight">{type.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Detailed Selection */}
      {value.type !== 'all' && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            {CurrentIcon && <CurrentIcon className="h-4 w-4 text-stone-500" />}
            <span className="text-sm font-medium text-stone-700">Selected: {getDisplayText()}</span>
          </div>
          
          {(value.type === 'block' || value.type === 'floor' || value.type === 'room') && (
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-500 block mb-1">Block</label>
              <CustomSelect
                value={selectedBlock}
                onChange={handleBlockSelect}
                options={blocks.map(block => ({ value: block.id, label: block.name }))}
                placeholder="Select block"
              />
            </div>
          )}
          
          {(value.type === 'floor' || value.type === 'room') && selectedBlockObj && (
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-500 block mb-1">Floor</label>
              <CustomSelect
                value={selectedFloor.toString()}
                onChange={(val) => handleFloorSelect(parseInt(val))}
                options={floorOptions}
                placeholder="Select floor"
              />
            </div>
          )}
          
          {value.type === 'room' && (
            <div className="mb-3">
              <label className="text-xs font-medium text-stone-500 block mb-1">Room</label>
              <CustomSelect
                value={selectedRoom}
                onChange={handleRoomSelect}
                options={roomOptions}
                placeholder="Select room"
              />
            </div>
          )}

          {value.type === 'user' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1">Select Resident</label>
                <CustomSelect
                  value={customEmail}
                  onChange={handleUserSelect}
                  options={userOptions}
                  placeholder="Select resident student"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1">Or Enter Resident Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => handleUserSelect(e.target.value)}
                  placeholder="e.g. student@dormly.edu"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}