// app/(platform)/settings/structure/_components/RoomsTab.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, DoorClosed, Building2, Layers, Search, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Block, Floor } from './types';
import { rooms as initialRooms, blocks, floors } from './mockData';
import { RoomFormModal } from './RoomFormModal';
import { ConfirmModal } from './ConfirmModal';

// Custom Dropdown Component
interface DropdownOption {
  value: string;
  label: string;
}

function CustomDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  icon: Icon,
  width
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: DropdownOption[]; 
  placeholder: string;
  icon?: React.ElementType;
  width?: string;
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
    <div ref={containerRef} className={cn("relative", width)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all duration-200",
          "border-stone-300 bg-white text-stone-700",
          "hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30",
          !value && "text-stone-400"
        )}
      >
        {Icon && <Icon className="h-4 w-4 text-stone-400 flex-shrink-0" />}
        <span className="flex-1 text-left truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-stone-400 transition-transform flex-shrink-0", isOpen && "rotate-180")} />
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

export function RoomsTab() {
  const [rooms, setRooms] = useState(initialRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Filter UI states (changes when user selects, but doesn't trigger search)
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  
  // Applied filter states (only updated when search is clicked)
  const [appliedBlock, setAppliedBlock] = useState<string>('all');
  const [appliedFloor, setAppliedFloor] = useState<string>('all');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Reset floor when block changes (in UI, before search)
  useEffect(() => {
    setSelectedFloor('all');
  }, [selectedBlock]);

  // Get available floors for selected block
  const getAvailableFloors = () => {
    if (selectedBlock === 'all') {
      return floors;
    }
    return floors.filter(f => f.blockId === selectedBlock);
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      setRooms(prev => prev.filter(r => r.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = (data: Partial<Room>) => {
    if (editingRoom) {
      setRooms(prev => prev.map(r =>
        r.id === editingRoom.id
          ? { ...r, ...data, updatedAt: new Date().toISOString() }
          : r
      ));
    } else {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        ...data as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRooms(prev => [...prev, newRoom]);
    }
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    setAppliedBlock(selectedBlock);
    setAppliedFloor(selectedFloor);
    setAppliedSearch(searchInput);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
    setAppliedBlock('all');
    setAppliedFloor('all');
    setSelectedBlock('all');
    setSelectedFloor('all');
    setHasSearched(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getGenderLabel = (gender: string) => {
    switch(gender) {
      case 'male': return 'Male Only';
      case 'female': return 'Female Only';
      default: return 'All Genders';
    }
  };

  const getGenderColor = (gender: string) => {
    switch(gender) {
      case 'male': return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'female': return 'bg-pink-200 text-pink-800 border-pink-300';
      default: return 'bg-emerald-200 text-emerald-800 border-emerald-300';
    }
  };

  // Filter rooms using applied filters (only runs when search is clicked)
  const getFilteredRooms = () => {
    let filtered = rooms;

    // Only apply filters if search has been performed
    if (hasSearched) {
      if (appliedBlock !== 'all') {
        filtered = filtered.filter(room => room.blockId === appliedBlock);
      }

      if (appliedFloor !== 'all') {
        filtered = filtered.filter(room => room.floorId === appliedFloor);
      }

      if (appliedSearch.trim()) {
        const query = appliedSearch.toLowerCase();
        filtered = filtered.filter(room =>
          room.roomNumber.toLowerCase().includes(query) ||
          room.blockName.toLowerCase().includes(query) ||
          room.roomTypeName.toLowerCase().includes(query)
        );
      }
    }

    return filtered.sort((a, b) => {
      if (a.blockId !== b.blockId) return a.blockId.localeCompare(b.blockId);
      if (a.floorLevel !== b.floorLevel) return a.floorLevel - b.floorLevel;
      return a.roomNumber.localeCompare(b.roomNumber);
    });
  };

  const filteredRooms = getFilteredRooms();

  // Group rooms by block and floor for display
  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const key = `${room.blockId}-${room.floorId}`;
    if (!acc[key]) {
      acc[key] = {
        blockId: room.blockId,
        blockName: room.blockName,
        floorId: room.floorId,
        floorLevel: room.floorLevel,
        rooms: [],
      };
    }
    acc[key].rooms.push(room);
    return acc;
  }, {} as Record<string, { blockId: string; blockName: string; floorId: string; floorLevel: number; rooms: Room[] }>);

  const groupedList = Object.values(groupedRooms).sort((a, b) => {
    if (a.blockId !== b.blockId) return a.blockId.localeCompare(b.blockId);
    return a.floorLevel - b.floorLevel;
  });

  // Block dropdown options
  const blockOptions: DropdownOption[] = [
    { value: 'all', label: 'All Blocks' },
    ...blocks.filter(b => b.status === 'active').map(b => ({ value: b.id, label: b.name })),
  ];

  const floorOptions: DropdownOption[] = [
    { value: 'all', label: 'All Floors' },
    ...getAvailableFloors().map(f => ({ 
      value: f.id, 
      label: `Floor ${f.level}${f.description ? ` - ${f.description}` : ''}` 
    })),
  ];

  // Show hint if no search performed yet
  const showInitialMessage = !hasSearched;

  return (
    <>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Block Filter */}
            <div className="w-52">
              <CustomDropdown
                value={selectedBlock}
                onChange={setSelectedBlock}
                options={blockOptions}
                placeholder="Select block"
                icon={Building2}
              />
            </div>

            {/* Floor Filter - rộng hơn */}
            <div className="w-64">
              <CustomDropdown
                value={selectedFloor}
                onChange={setSelectedFloor}
                options={floorOptions}
                placeholder="Select floor"
                icon={Layers}
              />
            </div>

            {/* Search Input + Button */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search rooms..."
                  className="w-56 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
                />
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </button>
        </div>

        {/* Rooms by Block & Floor */}
        {showInitialMessage ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <Search className="h-8 w-8 text-stone-400" />
            </div>
            <p className="text-sm font-medium text-stone-600">Select filters and click Search to find rooms</p>
            <p className="mt-1 text-xs text-stone-400">Choose Block, Floor, or search by room number</p>
          </div>
        ) : groupedList.length > 0 ? (
          <div className="space-y-4">
            {groupedList.map((group) => (
              <div key={`${group.blockId}-${group.floorId}`} className="overflow-hidden rounded-xl border border-stone-200 bg-white/60 backdrop-blur-sm">
                {/* Group Header - Block & Floor */}
                <div className="bg-stone-100/80 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-stone-500" />
                    <span className="font-semibold text-stone-900">{group.blockName}</span>
                    <span className="text-stone-300">•</span>
                    <Layers className="h-4 w-4 text-stone-400" />
                    <span className="font-medium text-stone-700">Floor {group.floorLevel}</span>
                    <span className="text-sm text-stone-400">({group.rooms.length} rooms)</span>
                  </div>
                </div>

                {/* Rooms Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/40">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-stone-600">Room</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-stone-600">Type</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-stone-600">Capacity</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-stone-600">Occupants</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-stone-600">Gender</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-stone-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {group.rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-white/40 transition">
                          <td className="px-4 py-2.5 font-medium text-stone-900">{room.roomNumber}</td>
                          <td className="px-4 py-2.5 text-stone-600">{room.roomTypeName}</td>
                          <td className="px-4 py-2.5 text-stone-600">{room.capacity}</td>
                          <td className="px-4 py-2.5 text-stone-600">{room.currentOccupants}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold border", getGenderColor(room.genderRestriction))}>
                              {getGenderLabel(room.genderRestriction)}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(room)}
                                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(room.id)}
                                className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-500">
            No rooms found matching your search criteria.
          </div>
        )}
      </div>

      <RoomFormModal
        isOpen={isModalOpen}
        room={editingRoom}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        selectedBlockId={selectedBlock !== 'all' ? selectedBlock : undefined}
        selectedFloorId={selectedFloor !== 'all' ? selectedFloor : undefined}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
}