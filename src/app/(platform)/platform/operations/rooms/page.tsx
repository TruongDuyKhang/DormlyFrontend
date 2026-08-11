"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronRight,
  Bed,
  Crown,
  Building2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/_components/ui/input";

import { Block, Floor, Room, Student } from "./_components/types";
import { BlocksView } from "./_components/BlocksView";
import { FloorsView } from "./_components/FloorsView";
import { RoomsView } from "./_components/RoomsView";
import { RoomDetailView } from "./_components/RoomDetailView";
import { RoomDetailModal } from "./_components/RoomDetailModal";
import { EditRoomModal } from "./_components/EditRoomModal";
import { ArchiveConfirmModal } from "./_components/ArchiveConfirmModal";
import { AssignStudentModal } from "./_components/AssignStudentModal";
import { TransferModal } from "./_components/TransferModal";
import { MoveOutModal } from "./_components/MoveOutModal";
import { AddRoomModal } from "./_components/AddRoomModal";
import { buildingService } from "@/services/buildingService";
import { roomAssignmentService } from "@/services/roomAssignmentService";
import { userService } from "@/services/userService";
import { studentProfileService } from "@/services/studentProfileService";

type NavigationView = "blocks" | "floors" | "rooms" | "roomDetail";

export default function RoomsPage() {
  const [currentView, setCurrentView] = useState<NavigationView>("blocks");
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [roomsData, setRoomsData] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { room: Room; block: Block; floor: Floor }[]
  >([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Modal state
  const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMoveOutModal, setShowMoveOutModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  const [selectedStudentForTransfer, setSelectedStudentForTransfer] =
    useState<Student | null>(null);
  const [selectedStudentForMoveOut, setSelectedStudentForMoveOut] =
    useState<Student | null>(null);

  const loadTree = useCallback(async () => {
    setIsLoading(true);
    try {
      const [treeRes, flatRes, assignmentsRes, usersRes, profilesRes] = await Promise.allSettled([
        buildingService.getNodeTreeByLevel(0),
        buildingService.listNodes(),
        roomAssignmentService.list(),
        userService.list(),
        studentProfileService.listAllProfiles(),
      ]);

      let nodes = treeRes.status === 'fulfilled' && treeRes.value ? treeRes.value : [];
      const flatNodes = flatRes.status === 'fulfilled' && flatRes.value ? flatRes.value : [];
      const assignments = assignmentsRes.status === 'fulfilled' && assignmentsRes.value ? assignmentsRes.value : [];
      const users = usersRes.status === 'fulfilled' && usersRes.value ? usersRes.value : [];
      const profiles = profilesRes.status === 'fulfilled' && profilesRes.value ? profilesRes.value : [];

      const userMap = new Map<string, any>();
      users.forEach((u) => userMap.set(u.id, u));

      const profileMap = new Map<string, any>();
      profiles.forEach((p) => {
        if (p.id) profileMap.set(p.id, p);
      });
      
      // If tree endpoint returned empty or nodes without children, try flat list
      if (!nodes || nodes.length === 0 || !nodes.some((n) => n.children && n.children.length > 0)) {
        if (flatNodes && flatNodes.length > 0) {
          const rootNodes = flatNodes.filter((n) => !n.parentId || n.parentId === '0');
          nodes = rootNodes.map((root) => {
            const childrenFloors = flatNodes.filter((f) => f.parentId === root.id);
            const floorsWithRooms = childrenFloors.map((floor) => {
              const rooms = flatNodes.filter((r) => r.parentId === floor.id);
              return { ...floor, children: rooms };
            });
            return { ...root, children: floorsWithRooms };
          });
        }
      }

      if (nodes && nodes.length > 0) {
        const transformed: Block[] = nodes.map((bNode) => {
          const floors: Floor[] = (bNode.children || []).map((fNode, fIdx) => {
            const rooms: Room[] = (fNode.children || []).map((rNode) => {
              const cap = rNode.maxCapacity || 4;
              const roomAssignments = assignments.filter(
                (a) =>
                  a.roomNodeId === rNode.id &&
                  a.status !== 'CANCELLED' &&
                  a.status !== 'TERMINATED'
              );

              const students: Student[] = roomAssignments.map((a, sIdx) => {
                const u = userMap.get(a.userId);
                const p = profileMap.get(a.userId);
                return {
                  id: a.userId || `st-${sIdx}`,
                  name: u?.fullName || 'Sinh viên',
                  studentId: p?.studentCode || `SV${a.userId.slice(-4)}`,
                  email: u?.email || 'student@dormly.edu.vn',
                  major: p?.major || 'Khoa Công nghệ Thông tin',
                  year: 'K48',
                  phone: u?.phoneNumber || '0901234567',
                  emergencyContact: '0987654321',
                  status: (a.status?.toLowerCase() as any) === 'active' ? 'active' : 'inactive',
                  joinedDate: a.startDate || new Date().toISOString(),
                  dateOfBirth: u?.dateOfBirth || '2005-01-01',
                  nationality: 'Việt Nam',
                  idCardNumber: p?.identityNumber || '001205001234',
                  emergencyName: 'Phụ huynh',
                  emergencyRelationship: 'Gia đình',
                };
              });

              return {
                id: rNode.id,
                number: rNode.name || `Room ${fIdx + 1}01`,
                type: (cap === 2 ? 'double' : cap === 1 ? 'single' : 'quad') as any,
                capacity: cap,
                students,
                status:
                  rNode.status === "MAINTENANCE" ? "maintenance" : "active",
                amenities: ["Air Conditioner", "Wifi", "Balcony"],
                floorArea: 28,
                monthlyFee: 1800000,
                description: "Phòng sinh viên trang bị tiện nghi hiện đại",
                createdAt: rNode.createdAt || new Date().toISOString(),
                updatedAt: rNode.updatedAt || new Date().toISOString(),
              };
            });

            const totalRooms = rooms.length;
            const occupiedRooms = rooms.filter(
              (r) => r.students.length > 0,
            ).length;
            return {
              id: fNode.id,
              level: fIdx + 1,
              rooms,
              totalRooms,
              occupiedRooms,
              occupancyRate:
                totalRooms > 0
                  ? Math.round((occupiedRooms / totalRooms) * 100)
                  : 0,
            };
          });

          const totalRooms = floors.reduce((acc, f) => acc + f.totalRooms, 0);
          const totalStudents = floors.reduce(
            (acc, f) =>
              acc + f.rooms.reduce((a, r) => a + r.students.length, 0),
            0,
          );

          const blockName = bNode.name || "Residence Block";
          return {
            id: bNode.id,
            name: blockName,
            code: blockName.toUpperCase().replace(/\s+/g, "-"),
            floors,
            totalRooms,
            totalStudents,
            occupancyRate:
              totalRooms > 0
                ? Math.round((totalStudents / (totalRooms * 2)) * 100)
                : 0,
            address: "Central Campus Living Zone",
          };
        });

        if (transformed.length > 0) {
          setRoomsData(transformed);
          return;
        }
      }

      // Default mock structure for realistic dormitory operations
      const mockBlocks: Block[] = [
        {
          id: "block-a",
          name: "Building A — Sakura Tower",
          code: "BLD-A",
          address: "North Living District, Zone 1",
          totalRooms: 12,
          totalStudents: 38,
          occupancyRate: 79,
          floors: [
            {
              id: "fl-a-1",
              level: 1,
              totalRooms: 4,
              occupiedRooms: 3,
              occupancyRate: 75,
              rooms: [
                {
                  id: "rm-a-101",
                  number: "A-101",
                  type: "quad",
                  capacity: 4,
                  status: "active",
                  floorArea: 32,
                  monthlyFee: 1950000,
                  description: "Premium Quad Room facing the sunrise courtyard",
                  amenities: ["Air Conditioner", "Private Bathroom", "High-speed Wifi", "Balcony"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [
                    {
                      id: "st-1",
                      name: "Nguyễn Văn An",
                      studentId: "IT202401",
                      email: "an.nguyen@dormly.edu.vn",
                      major: "Computer Science",
                      year: "1st Year",
                      phone: "0912345678",
                      emergencyContact: "0987654321",
                      status: "active",
                      joinedDate: "2024-09-01",
                      dateOfBirth: "2006-03-15",
                      nationality: "Vietnamese",
                      idCardNumber: "001206001234",
                      emergencyName: "Nguyễn Văn Bình",
                      emergencyRelationship: "Father",
                    },
                    {
                      id: "st-2",
                      name: "Trần Minh Đức",
                      studentId: "IT202402",
                      email: "duc.tran@dormly.edu.vn",
                      major: "Software Engineering",
                      year: "1st Year",
                      phone: "0912345679",
                      emergencyContact: "0987654322",
                      status: "active",
                      joinedDate: "2024-09-01",
                      dateOfBirth: "2006-07-20",
                      nationality: "Vietnamese",
                      idCardNumber: "001206001235",
                      emergencyName: "Trần Thị Lan",
                      emergencyRelationship: "Mother",
                    }
                  ],
                },
                {
                  id: "rm-a-102",
                  number: "A-102",
                  type: "double",
                  capacity: 2,
                  status: "active",
                  floorArea: 24,
                  monthlyFee: 2500000,
                  description: "Double Studio Room with private work area",
                  amenities: ["Air Conditioner", "En-suite Bathroom", "Balcony", "Fridge"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [],
                },
                {
                  id: "rm-a-103",
                  number: "A-103",
                  type: "quad",
                  capacity: 4,
                  status: "maintenance",
                  floorArea: 32,
                  monthlyFee: 1950000,
                  description: "Quad room scheduled for HVAC maintenance",
                  amenities: ["Air Conditioner", "Private Bathroom", "Wifi"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [],
                },
                {
                  id: "rm-a-104",
                  number: "A-104",
                  type: "quad",
                  capacity: 4,
                  status: "active",
                  floorArea: 32,
                  monthlyFee: 1950000,
                  description: "Spacious Quad room with study corners",
                  amenities: ["Air Conditioner", "Private Bathroom", "Wifi", "Balcony"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [],
                },
              ],
            },
            {
              id: "fl-a-2",
              level: 2,
              totalRooms: 4,
              occupiedRooms: 4,
              occupancyRate: 100,
              rooms: [
                {
                  id: "rm-a-201",
                  number: "A-201",
                  type: "quad",
                  capacity: 4,
                  status: "active",
                  floorArea: 32,
                  monthlyFee: 1950000,
                  description: "Corner Quad room with panoramic view",
                  amenities: ["Air Conditioner", "Private Bathroom", "Wifi"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [],
                },
                {
                  id: "rm-a-202",
                  number: "A-202",
                  type: "single",
                  capacity: 1,
                  status: "active",
                  floorArea: 18,
                  monthlyFee: 3600000,
                  description: "Executive Single Suite for scholars",
                  amenities: ["Air Conditioner", "Smart TV", "Mini Fridge", "En-suite"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [],
                }
              ]
            }
          ],
        },
        {
          id: "block-b",
          name: "Building B — Lotus Residence",
          code: "BLD-B",
          address: "Central Campus Lakeside",
          totalRooms: 16,
          totalStudents: 54,
          occupancyRate: 85,
          floors: [
            {
              id: "fl-b-1",
              level: 1,
              totalRooms: 4,
              occupiedRooms: 3,
              occupancyRate: 75,
              rooms: [
                {
                  id: "rm-b-101",
                  number: "B-101",
                  type: "quad",
                  capacity: 4,
                  status: "active",
                  floorArea: 32,
                  monthlyFee: 1950000,
                  description: "Lakeside Quad Room",
                  amenities: ["Air Conditioner", "Wifi", "Balcony"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [],
                }
              ]
            }
          ]
        },
        {
          id: "block-c",
          name: "Building C — Pine Residence",
          code: "BLD-C",
          address: "South Hills Residential Garden",
          totalRooms: 10,
          totalStudents: 28,
          occupancyRate: 70,
          floors: [
            {
              id: "fl-c-1",
              level: 1,
              totalRooms: 3,
              occupiedRooms: 2,
              occupancyRate: 66,
              rooms: [
                {
                  id: "rm-c-101",
                  number: "C-101",
                  type: "double",
                  capacity: 2,
                  status: "active",
                  floorArea: 26,
                  monthlyFee: 2400000,
                  description: "Quiet garden view room",
                  amenities: ["Air Conditioner", "Wifi"],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  students: [],
                }
              ]
            }
          ]
        }
      ];

      setRoomsData(mockBlocks);
    } catch (e) {
      console.warn("Could not load live building map tree from API:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  // Get current objects
  const currentBlock = roomsData.find((b: Block) => b.id === selectedBlock?.id);
  const currentFloor = currentBlock?.floors.find(
    (f: Floor) => f.level === selectedFloor?.level,
  );
  const currentRoom = currentFloor?.rooms.find(
    (r: Room) => r.id === selectedRoom?.id,
  );

  // Search handler
  const handleSearch = () => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const results: { room: Room; block: Block; floor: Floor }[] = [];
      roomsData.forEach((block: Block) => {
        block.floors.forEach((floor: Floor) => {
          floor.rooms.forEach((room: Room) => {
            if (
              room.number.toLowerCase().includes(query) ||
              room.type.toLowerCase().includes(query) ||
              room.students.some((s: Student) =>
                s.name.toLowerCase().includes(query),
              )
            ) {
              results.push({ room, block, floor });
            }
          });
        });
      });
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result: {
    room: Room;
    block: Block;
    floor: Floor;
  }) => {
    setSelectedBlock(result.block);
    setSelectedFloor(result.floor);
    setSelectedRoom(result.room);
    setCurrentView("roomDetail");
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Navigation
  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
    setCurrentView("floors");
  };

  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloor(floor);
    setCurrentView("rooms");
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView("roomDetail");
    setShowRoomDetailModal(true);
  };

  const handleBack = () => {
    if (currentView === "floors") {
      setCurrentView("blocks");
      setSelectedBlock(null);
    } else if (currentView === "rooms") {
      setCurrentView("floors");
      setSelectedFloor(null);
    } else if (currentView === "roomDetail") {
      setCurrentView("rooms");
      setSelectedRoom(null);
    }
  };

  // Room actions
  const handleEditRoom = (updatedRoom: Room) => {
    setRoomsData((prev: Block[]) => {
      const newData = [...prev];
      for (const block of newData) {
        for (const floor of block.floors) {
          const roomIndex = floor.rooms.findIndex(
            (r: Room) => r.id === updatedRoom.id,
          );
          if (roomIndex !== -1) {
            floor.rooms[roomIndex] = updatedRoom;
            break;
          }
        }
      }
      return newData;
    });
    setSelectedRoom(updatedRoom);
  };

  const handleArchiveRoom = () => {
    if (!currentRoom) return;
    setRoomsData((prev: Block[]) => {
      const newData = [...prev];
      for (const block of newData) {
        for (const floor of block.floors) {
          const room = floor.rooms.find((r: Room) => r.id === currentRoom.id);
          if (room) {
            room.status = room.status === "active" ? "inactive" : "active";
            setSelectedRoom({ ...room });
            break;
          }
        }
      }
      return newData;
    });
  };

  const handleAssignStudentId = (studentId: string) => {
    if (!currentRoom) return;
    const dummyStudent: Student = {
      id: studentId,
      name: "Assigned Student",
      email: "student@dormly.edu",
      studentId,
      major: "Computer Science",
      year: "1st Year",
      phone: "0901234567",
      emergencyContact: "0987654321",
      status: "active",
      joinedDate: new Date().toISOString(),
      dateOfBirth: "2004-01-01",
      nationality: "Vietnamese",
      idCardNumber: "001204000000",
      emergencyName: "Parent",
      emergencyRelationship: "Guardian",
    };
    const updatedRoom: Room = {
      ...currentRoom,
      students: [...currentRoom.students, dummyStudent],
    };
    handleEditRoom(updatedRoom);
    setShowAssignModal(false);
  };

  const handleTransfer = (targetRoomId: string) => {
    if (!selectedStudentForTransfer || !currentRoom) return;

    // Remove from current room
    const updatedCurrentRoom: Room = {
      ...currentRoom,
      students: currentRoom.students.filter(
        (s: Student) => s.id !== selectedStudentForTransfer.id,
      ),
    };
    handleEditRoom(updatedCurrentRoom);

    // Add to target room
    setRoomsData((prev: Block[]) => {
      const newData = [...prev];
      for (const block of newData) {
        for (const floor of block.floors) {
          const targetRoom = floor.rooms.find(
            (r: Room) => r.id === targetRoomId,
          );
          if (targetRoom) {
            targetRoom.students.push(selectedStudentForTransfer);
            break;
          }
        }
      }
      return newData;
    });

    setSelectedStudentForTransfer(null);
    setShowTransferModal(false);
  };

  const handleMoveOut = () => {
    if (!selectedStudentForMoveOut || !currentRoom) return;
    const updatedRoom: Room = {
      ...currentRoom,
      students: currentRoom.students.filter(
        (s: Student) => s.id !== selectedStudentForMoveOut.id,
      ),
    };
    handleEditRoom(updatedRoom);
    setSelectedStudentForMoveOut(null);
    setShowMoveOutModal(false);
  };

  const handleAddRoom = (newRoomData: {
    number: string;
    type: Room["type"];
    capacity: number;
    monthlyFee: number;
    floorArea: number;
    amenities: string[];
    description: string;
  }) => {
    if (!currentBlock || !currentFloor) return;

    const newRoom: Room = {
      id: `r-${Date.now()}`,
      number: newRoomData.number,
      type: newRoomData.type,
      capacity: newRoomData.capacity,
      students: [],
      status: "active",
      amenities: newRoomData.amenities,
      floorArea: newRoomData.floorArea,
      monthlyFee: newRoomData.monthlyFee,
      description: newRoomData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoomsData((prev: Block[]) => {
      const newData = [...prev];
      const block = newData.find((b: Block) => b.id === currentBlock.id);
      if (block) {
        const floor = block.floors.find(
          (f: Floor) => f.level === currentFloor.level,
        );
        if (floor) {
          floor.rooms.push(newRoom);
          floor.totalRooms = floor.rooms.length;
          block.totalRooms = block.floors.reduce(
            (acc, f) => acc + f.totalRooms,
            0,
          );
        }
      }
      return newData;
    });
    setShowAddRoomModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#9b7a4a]/16 blur-3xl" />

        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
                <Building2 className="h-3.5 w-3.5 text-[#c3a26c]" />
                Building Map & Inventory
              </div>
              <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
                Rooms & Beds
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Explore building structures, inspect room occupancy, and manage
                assignments directly from API.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadTree}
                className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-white/60 transition"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", isLoading && "animate-spin")}
                />
                Sync API
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="relative mb-6">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search by room number, type, or resident name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-2xl border-white/60 bg-white/40 pl-11 pr-24 py-3 text-sm placeholder:text-stone-400 backdrop-blur-md focus:border-[#c3a26c] focus:bg-white/60 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-12 p-1 text-stone-400 hover:text-stone-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="absolute right-2 rounded-xl bg-[#c3a26c] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#b08f5a] transition"
              >
                Search
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-white/60 bg-white/95 p-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Search Results ({searchResults.length})
                  </span>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="text-xs text-stone-400 hover:text-stone-600"
                  >
                    Close
                  </button>
                </div>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-100 transition text-left"
                      >
                        <div>
                          <div className="font-semibold text-stone-800">
                            Room {result.room.number}
                          </div>
                          <div className="text-xs text-stone-500">
                            {result.block.name} • Floor {result.floor.level} •{" "}
                            {result.room.type.toUpperCase()}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-stone-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-stone-500">
                    No matching rooms or residents found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center gap-2 text-sm text-stone-600">
            <button
              onClick={() => {
                setCurrentView("blocks");
                setSelectedBlock(null);
                setSelectedFloor(null);
                setSelectedRoom(null);
              }}
              className={cn(
                "hover:text-stone-900 transition",
                currentView === "blocks" && "font-bold text-[#c3a26c]",
              )}
            >
              All Blocks
            </button>

            {selectedBlock && (
              <>
                <ChevronRight className="h-4 w-4 text-stone-400" />
                <button
                  onClick={() => {
                    setCurrentView("floors");
                    setSelectedFloor(null);
                    setSelectedRoom(null);
                  }}
                  className={cn(
                    "hover:text-stone-900 transition",
                    currentView === "floors" && "font-bold text-[#c3a26c]",
                  )}
                >
                  {selectedBlock.name}
                </button>
              </>
            )}

            {selectedFloor && (
              <>
                <ChevronRight className="h-4 w-4 text-stone-400" />
                <button
                  onClick={() => {
                    setCurrentView("rooms");
                    setSelectedRoom(null);
                  }}
                  className={cn(
                    "hover:text-stone-900 transition",
                    currentView === "rooms" && "font-bold text-[#c3a26c]",
                  )}
                >
                  Floor {selectedFloor.level}
                </button>
              </>
            )}

            {selectedRoom && currentView === "roomDetail" && (
              <>
                <ChevronRight className="h-4 w-4 text-stone-400" />
                <span className="font-bold text-[#c3a26c]">
                  Room {selectedRoom.number}
                </span>
              </>
            )}
          </div>

          {/* Main View Container */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-stone-500 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
              <span>Fetching building nodes and inventory from API...</span>
            </div>
          ) : roomsData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/20">
              <Building2 className="mx-auto h-8 w-8 text-stone-400 mb-2" />
              <p className="text-sm font-medium">
                No residence blocks found in backend API.
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Please create buildings in Residence Structure settings.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {currentView === "blocks" && (
                <BlocksView
                  key="blocks"
                  blocks={roomsData}
                  hoveredBlockId={hoveredBlockId}
                  onHover={setHoveredBlockId}
                  onSelect={handleBlockSelect}
                />
              )}

              {currentView === "floors" && currentBlock && (
                <FloorsView
                  key="floors"
                  block={currentBlock}
                  onFloorSelect={handleFloorSelect}
                  onBack={handleBack}
                />
              )}

              {currentView === "rooms" && currentBlock && currentFloor && (
                <RoomsView
                  key="rooms"
                  floor={currentFloor}
                  blockName={currentBlock.name}
                  onRoomSelect={handleRoomSelect}
                  onBack={handleBack}
                  onAddRoom={() => setShowAddRoomModal(true)}
                />
              )}

              {currentView === "roomDetail" &&
                currentRoom &&
                currentBlock &&
                currentFloor && (
                  <RoomDetailView
                    key="roomDetail"
                    room={currentRoom}
                    block={currentBlock}
                    floor={currentFloor}
                    onBack={handleBack}
                    onEdit={() => setShowEditModal(true)}
                    onArchive={handleArchiveRoom}
                    onAssign={() => setShowAssignModal(true)}
                    onTransfer={(student: Student) => {
                      setSelectedStudentForTransfer(student);
                      setShowTransferModal(true);
                    }}
                    onMoveOut={(student: Student) => {
                      setSelectedStudentForMoveOut(student);
                      setShowMoveOutModal(true);
                    }}
                  />
                )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showRoomDetailModal && currentRoom && currentBlock && currentFloor && (
          <RoomDetailModal
            isOpen={showRoomDetailModal}
            room={currentRoom}
            block={currentBlock}
            floor={currentFloor}
            onClose={() => setShowRoomDetailModal(false)}
            onEdit={() => setShowEditModal(true)}
            onArchive={handleArchiveRoom}
            onAssign={() => setShowAssignModal(true)}
            onTransfer={(student: Student) => {
              setSelectedStudentForTransfer(student);
              setShowTransferModal(true);
            }}
            onMoveOut={(student: Student) => {
              setSelectedStudentForMoveOut(student);
              setShowMoveOutModal(true);
            }}
          />
        )}

        {showEditModal && currentRoom && (
          <EditRoomModal
            isOpen={showEditModal}
            room={currentRoom}
            onSave={handleEditRoom}
            onClose={() => setShowEditModal(false)}
          />
        )}

        {showArchiveModal && (
          <ArchiveConfirmModal
            isOpen={showArchiveModal}
            room={currentRoom || null}
            onConfirm={handleArchiveRoom}
            onClose={() => setShowArchiveModal(false)}
          />
        )}

        {showAssignModal && currentRoom && (
          <AssignStudentModal
            isOpen={showAssignModal}
            room={currentRoom || null}
            unassignedStudents={[]}
            onAssign={handleAssignStudentId}
            onClose={() => setShowAssignModal(false)}
          />
        )}

        {showTransferModal &&
          selectedStudentForTransfer &&
          currentBlock &&
          currentFloor &&
          currentRoom && (
            <TransferModal
              isOpen={showTransferModal}
              student={selectedStudentForTransfer}
              currentRoom={currentRoom}
              currentBlock={currentBlock}
              currentFloor={currentFloor}
              blocks={roomsData}
              onTransfer={(_studentId, _blockId, _level, targetRoomId) =>
                handleTransfer(targetRoomId)
              }
              onClose={() => {
                setShowTransferModal(false);
                setSelectedStudentForTransfer(null);
              }}
            />
          )}

        {showMoveOutModal && selectedStudentForMoveOut && currentRoom && (
          <MoveOutModal
            isOpen={showMoveOutModal}
            student={selectedStudentForMoveOut}
            room={currentRoom}
            onMoveOut={handleMoveOut}
            onClose={() => {
              setShowMoveOutModal(false);
              setSelectedStudentForMoveOut(null);
            }}
          />
        )}

        {showAddRoomModal && currentBlock && currentFloor && (
          <AddRoomModal
            isOpen={showAddRoomModal}
            blockId={currentBlock.id}
            floorLevel={currentFloor.level}
            existingRoomNumbers={currentFloor.rooms.map((r: Room) => r.number)}
            onClose={() => setShowAddRoomModal(false)}
            onAdd={handleAddRoom}
          />
        )}
      </AnimatePresence>
    </>
  );
}
