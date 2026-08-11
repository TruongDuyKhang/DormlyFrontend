// app/(platform)/settings/structure/_components/RoomsTab.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit, Trash2, DoorClosed, Building2, Layers, Search, X, ChevronDown, Loader2, RefreshCw, Users, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Room, Block, Floor, RoomType, RoomOccupant } from './types';
import { RoomFormModal } from './RoomFormModal';
import { RoomOccupantsModal } from './RoomOccupantsModal';
import { ConfirmModal } from './ConfirmModal';
import { buildingService } from '@/services/buildingService';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import { userService } from '@/services/userService';
import { studentProfileService } from '@/services/studentProfileService';

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
  const selectedOption = options.find((opt) => opt.value === value);

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
          "border-white/60 bg-white/40 text-stone-700 backdrop-blur-sm",
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOccupantsOpen, setIsOccupantsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [inspectingRoom, setInspectingRoom] = useState<Room | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  
  const [appliedBlock, setAppliedBlock] = useState<string>('all');
  const [appliedFloor, setAppliedFloor] = useState<string>('all');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allNodesRes, nodeTypesRes, assignmentsRes, usersRes, profilesRes] = await Promise.allSettled([
        buildingService.listNodes(),
        buildingService.listNodeTypes(),
        roomAssignmentService.list(),
        userService.list(),
        studentProfileService.listAllProfiles(),
      ]);

      const allNodes = allNodesRes.status === 'fulfilled' && allNodesRes.value ? allNodesRes.value : [];
      const nTypes = nodeTypesRes.status === 'fulfilled' && nodeTypesRes.value ? nodeTypesRes.value : [];
      const assignments = assignmentsRes.status === 'fulfilled' && assignmentsRes.value ? assignmentsRes.value : [];
      const users = usersRes.status === 'fulfilled' && usersRes.value ? usersRes.value : [];
      const profiles = profilesRes.status === 'fulfilled' && profilesRes.value ? profilesRes.value : [];

      const userMap = new Map<string, any>();
      users.forEach((u) => userMap.set(u.id, u));

      const profileMap = new Map<string, any>();
      profiles.forEach((p) => {
        if (p.id) profileMap.set(p.id, p);
      });

      const mappedTypes: RoomType[] = nTypes.map((nt) => ({
        id: nt.id,
        name: nt.name,
        capacity: 4,
        genderRestriction: 'all',
        monthlyFee: 1500000,
        description: nt.description || '',
        amenities: ['wifi', 'ac', 'private_bathroom'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setRoomTypes(mappedTypes);

      if (allNodes.length > 0) {
        const rootNodes = allNodes.filter((n) => !n.parentId);
        const loadedFloors: Floor[] = [];
        const loadedRooms: Room[] = [];

        rootNodes.forEach((bNode) => {
          const bFloors = allNodes.filter((n) => n.parentId === bNode.id);
          bFloors.forEach((fNode, idx) => {
            const fRooms = allNodes.filter((n) => n.parentId === fNode.id);
            const floorLevel = parseInt(fNode.name.replace(/\D/g, '')) || idx + 1;

            fRooms.forEach((rNode) => {
              const cap = rNode.maxCapacity || 4;

              // Filter active assignments for this room
              const roomAssignments = assignments.filter(
                (a) =>
                  a.roomNodeId === rNode.id &&
                  a.status !== 'CANCELLED' &&
                  a.status !== 'TERMINATED'
              );

              // Map detailed occupant information
              const occupants: RoomOccupant[] = roomAssignments.map((a) => {
                const u = userMap.get(a.userId);
                const p = profileMap.get(a.userId);
                return {
                  assignmentId: a.id,
                  userId: a.userId,
                  name: u?.fullName || 'Sinh viên',
                  email: u?.email || '',
                  phone: u?.phoneNumber || '',
                  studentCode: p?.studentCode || '',
                  major: p?.major || '',
                  startDate: a.startDate,
                  endDate: a.endDate,
                  status: a.status || 'ACTIVE',
                };
              });

              const occ = occupants.length > 0 ? occupants.length : (rNode.currentOccupancy || 0);

              let status: 'available' | 'occupied' | 'maintenance' | 'reserved' = 'available';
              if (rNode.status === 'MAINTENANCE') {
                status = 'maintenance';
              } else if (occ >= cap) {
                status = 'occupied';
              } else if (occ > 0) {
                status = 'available';
              }

              loadedRooms.push({
                id: rNode.id,
                roomNumber: rNode.name,
                blockId: bNode.id,
                blockName: bNode.name,
                floorId: fNode.id,
                floorLevel,
                roomTypeId: rNode.nodeTypeId || mappedTypes[0]?.id || 'type-room',
                roomTypeName: 'Phòng 4 người',
                capacity: cap,
                currentOccupants: occ,
                occupants,
                status,
                genderRestriction: (rNode.genderPolicy?.toLowerCase() as any) || (bNode.genderPolicy?.toLowerCase() as any) || 'all',
                createdAt: rNode.createdAt || new Date().toISOString(),
                updatedAt: rNode.updatedAt || new Date().toISOString(),
              });
            });

            const floorOccupants = fRooms.reduce((acc, r) => {
              const rOccupants = assignments.filter(
                (a) => a.roomNodeId === r.id && a.status !== 'CANCELLED' && a.status !== 'TERMINATED'
              );
              return acc + (rOccupants.length > 0 ? rOccupants.length : (r.currentOccupancy || 0));
            }, 0);
            const floorCapacity = fRooms.reduce((acc, r) => acc + (r.maxCapacity || 4), 0);
            const floorOccRate = floorCapacity > 0 ? Math.round((floorOccupants / floorCapacity) * 100) : 0;

            loadedFloors.push({
              id: fNode.id,
              blockId: bNode.id,
              blockName: bNode.name,
              level: floorLevel,
              description: fNode.description || `Tầng 0${floorLevel}`,
              roomCount: fRooms.length,
              occupancyRate: floorOccRate,
              createdAt: fNode.createdAt || new Date().toISOString(),
              updatedAt: fNode.updatedAt || new Date().toISOString(),
            });
          });
        });

        const loadedBlocks: Block[] = rootNodes.map((bNode) => {
          const floorNodes = allNodes.filter((n) => n.parentId === bNode.id);
          const roomNodes = allNodes.filter((n) => floorNodes.some((f) => f.id === n.parentId));
          const blockOccupants = roomNodes.reduce((acc, r) => {
            const rOccupants = assignments.filter(
              (a) => a.roomNodeId === r.id && a.status !== 'CANCELLED' && a.status !== 'TERMINATED'
            );
            return acc + (rOccupants.length > 0 ? rOccupants.length : (r.currentOccupancy || 0));
          }, 0);

          return {
            id: bNode.id,
            name: bNode.name,
            code: bNode.name.toUpperCase().replace(/\s+/g, '-'),
            description: bNode.description || '',
            genderRestriction: (bNode.genderPolicy?.toLowerCase() as any) || 'all',
            status: 'active' as const,
            floorCount: floorNodes.length || 4,
            roomCount: roomNodes.length || 40,
            totalCapacity: bNode.maxCapacity || 160,
            currentOccupancy: blockOccupants || bNode.currentOccupancy || 0,
            createdAt: bNode.createdAt || new Date().toISOString(),
            updatedAt: bNode.updatedAt || new Date().toISOString(),
          };
        });

        setRooms(loadedRooms);
        setBlocks(loadedBlocks);
        setFloors(loadedFloors);
      } else {
        setRooms([]);
        setBlocks([]);
        setFloors([]);
      }
    } catch (err) {
      console.error('Failed to load room hierarchy from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setSelectedFloor('all');
  }, [selectedBlock]);

  const getAvailableFloors = () => {
    if (selectedBlock === 'all') {
      return floors;
    }
    return floors.filter((f) => f.blockId === selectedBlock);
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleInspect = (room: Room) => {
    setInspectingRoom(room);
    setIsOccupantsOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      try {
        await buildingService.deleteNode(deletingId).catch(() => {});
      } catch (err) {
        console.warn(err);
      }
      setRooms((prev) => prev.filter((r) => r.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = async (data: Partial<Room>) => {
    if (editingRoom) {
      try {
        await buildingService
          .updateNode(editingRoom.id, {
            nodeTypeId: data.roomTypeId || editingRoom.roomTypeId || 'type-room',
            name: data.roomNumber || editingRoom.roomNumber,
            parentId: data.floorId || editingRoom.floorId,
            maxCapacity: data.capacity || editingRoom.capacity,
            genderPolicy: (data.genderRestriction?.toUpperCase() as any) || 'ALL',
            status: data.status === 'maintenance' ? 'MAINTENANCE' : 'AVAILABLE',
          })
          .catch(() => {});
      } catch (err) {
        console.warn(err);
      }

      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
        )
      );
    } else {
      let createdId = `room-${Date.now()}`;
      try {
        const types = await buildingService.listNodeTypes();
        const rType = types.find((t) => t.name === 'Room' || t.level === 3) || types[0];
        const res = await buildingService
          .createNode({
            nodeTypeId: rType?.id || data.roomTypeId || 'type-room',
            name: data.roomNumber || 'A101',
            parentId: data.floorId,
            maxCapacity: data.capacity || 4,
            genderPolicy: (data.genderRestriction?.toUpperCase() as any) || 'ALL',
            status: data.status === 'maintenance' ? 'MAINTENANCE' : 'AVAILABLE',
          })
          .catch(() => null);
        if (res?.id) createdId = res.id;
      } catch (err) {
        console.warn(err);
      }

      const newRoom: Room = {
        id: createdId,
        roomNumber: data.roomNumber || 'A101',
        blockId: data.blockId || blocks[0]?.id || 'b-1',
        blockName: data.blockName || blocks[0]?.name || 'Tòa A',
        floorId: data.floorId || floors[0]?.id || 'f-1',
        floorLevel: data.floorLevel || 1,
        roomTypeId: data.roomTypeId || 'type-room',
        roomTypeName: data.roomTypeName || 'Phòng 4 người',
        capacity: data.capacity || 4,
        currentOccupants: 0,
        occupants: [],
        status: data.status || 'available',
        genderRestriction: data.genderRestriction || 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    setAppliedBlock(selectedBlock);
    setAppliedFloor(selectedFloor);
    setAppliedSearch(searchInput);
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    setSelectedBlock('all');
    setSelectedFloor('all');
    setSearchInput('');
    setAppliedBlock('all');
    setAppliedFloor('all');
    setAppliedSearch('');
    setHasSearched(false);
  };

  const filteredRooms = rooms.filter((room) => {
    if (appliedBlock !== 'all' && room.blockId !== appliedBlock) return false;
    if (appliedFloor !== 'all' && room.floorId !== appliedFloor) return false;
    if (appliedSearch && !room.roomNumber.toLowerCase().includes(appliedSearch.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'reserved':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {filteredRooms.length} of {rooms.length} Rooms
            </span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#c3a26c]" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Sync API
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-white/60 bg-white/35 backdrop-blur-sm p-4 space-y-3 shadow-sm">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Block Filter */}
            <CustomDropdown
              value={selectedBlock}
              onChange={setSelectedBlock}
              options={[
                { value: 'all', label: 'All Blocks' },
                ...blocks.map((b) => ({ value: b.id, label: b.name })),
              ]}
              placeholder="Select Block"
              icon={Building2}
              width="w-48"
            />

            {/* Floor Filter */}
            <CustomDropdown
              value={selectedFloor}
              onChange={setSelectedFloor}
              options={[
                { value: 'all', label: 'All Floors' },
                ...getAvailableFloors().map((f) => ({
                  value: f.id,
                  label: `${f.blockName} - Floor ${f.level}`,
                })),
              ]}
              placeholder="Select Floor"
              icon={Layers}
              width="w-56"
            />

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search room number (e.g. A101)..."
                className="w-full rounded-xl border border-white/60 bg-white/40 pl-9 pr-8 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c3a26c]/30"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search and Reset Buttons */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 rounded-xl bg-[#c3a26c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b08f5a] transition shadow-sm"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {hasSearched && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white/60 px-3.5 py-2.5 text-sm text-stone-600 hover:bg-white transition"
              >
                <X className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Loading rooms inventory and assignments from API...</span>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/20">
            <DoorClosed className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium">No rooms found in API matching criteria.</p>
            <p className="text-xs text-stone-400 mt-1">Click &quot;Add Room&quot; to configure rooms inside your floors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleInspect(room)}
                className="group cursor-pointer rounded-2xl border border-white/60 bg-white/40 backdrop-blur-sm p-4 hover:border-[#c3a26c] hover:bg-white/65 hover:shadow-md transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="h-5 w-5 text-[#c3a26c] group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-semibold text-stone-800 group-hover:text-[#8f6d38] transition">
                        Phòng {room.roomNumber}
                      </h4>
                      <span className="text-xs text-stone-500">{room.blockName} • Tầng {room.floorLevel}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium border capitalize',
                      getStatusColor(room.status)
                    )}
                  >
                    {room.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                  <div className="flex justify-between">
                    <span>Loại phòng:</span>
                    <span className="font-medium text-stone-800">{room.roomTypeName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-stone-400" />
                      Số người đang ở:
                    </span>
                    <span className={cn(
                      "font-bold px-2 py-0.5 rounded-md",
                      room.currentOccupants > 0 ? "bg-[#c3a26c]/20 text-[#8f6d38]" : "bg-stone-200/60 text-stone-600"
                    )}>
                      {room.currentOccupants}/{room.capacity}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-white/40">
                  <span className="text-[11px] text-[#8f6d38] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-3 w-3" />
                    Xem cư dân ({room.occupants?.length || 0})
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(room)}
                      title="Sửa phòng"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-white/80 transition"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(room.id)}
                      title="Xóa phòng"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-white/80 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RoomOccupantsModal
        isOpen={isOccupantsOpen}
        room={inspectingRoom}
        onClose={() => setIsOccupantsOpen(false)}
        onEdit={handleEdit}
      />

      <RoomFormModal
        isOpen={isModalOpen}
        room={editingRoom}
        blocks={blocks}
        floors={floors}
        roomTypes={roomTypes}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        message="Are you sure you want to delete this room?"
      />
    </>
  );
}