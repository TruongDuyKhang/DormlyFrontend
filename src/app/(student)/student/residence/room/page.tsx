'use client';

import { useState, useEffect } from 'react';
import {
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  DoorOpen,
  Layers3,
  Users,
  Loader2,
} from "lucide-react";
import { FloorMap } from "../_components/floor-map";
import { ResidenceHistory } from "../_components/residence-history";
import { ResidenceTabs } from "../_components/residence-tabs";
import { RoommateCard } from "../_components/roommate-card";
import { StatusBadge } from "../_components/status-badge";
import { useCurrentRoom } from "@/hooks/useCurrentRoom";
import { buildingService } from "@/services/buildingService";
import type { BuildingNodeResponseDto } from "@/types/models";

export default function StudentRoomPage() {
  const { currentRoom, history, isLoading, error } = useCurrentRoom();
  const [roomNode, setRoomNode] = useState<BuildingNodeResponseDto | null>(null);
  const [floorNode, setFloorNode] = useState<BuildingNodeResponseDto | null>(null);
  const [blockNode, setBlockNode] = useState<BuildingNodeResponseDto | null>(null);

  useEffect(() => {
    async function resolveNodes() {
      if (currentRoom?.roomNodeId) {
        try {
          const allNodes = await buildingService.listNodes();
          const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
          const rNode = nodeMap.get(currentRoom.roomNodeId);
          if (rNode) {
            setRoomNode(rNode);
            if (rNode.parentId) {
              const fNode = nodeMap.get(rNode.parentId);
              if (fNode) {
                setFloorNode(fNode);
                if (fNode.parentId) {
                  const bNode = nodeMap.get(fNode.parentId);
                  if (bNode) setBlockNode(bNode);
                }
              }
            }
          }
        } catch (e) {
          console.warn('Could not resolve building nodes:', e);
        }
      }
    }
    resolveNodes();
  }, [currentRoom]);

  const roomName = roomNode?.name ? `Phòng ${roomNode.name}` : currentRoom?.roomNodeId ? `Phòng #${currentRoom.roomNodeId.slice(0, 4)}` : "Phòng A101";
  const blockName = blockNode?.name || "Tòa A (Nam)";
  const floorName = floorNode?.name || "Tầng 1";
  const startDateStr = currentRoom?.startDate ? new Date(currentRoom.startDate).toLocaleDateString('vi-VN') : "09/08/2026";
  const endDateStr = currentRoom?.endDate ? new Date(currentRoom.endDate).toLocaleDateString('vi-VN') : "09/08/2027";

  const roomStats = [
    { label: "Tòa Nhà", value: blockName, icon: Building2 },
    { label: "Tầng", value: floorName, icon: Layers3 },
    { label: "Loại Phòng", value: `${roomNode?.maxCapacity || 4} Giường Tiêu Chuẩn`, icon: BedDouble },
    { label: "Sức Chứa", value: `${roomNode?.currentOccupancy || 2} / ${roomNode?.maxCapacity || 4}`, icon: Users },
  ];

  const roomInfo = [
    ["Mã Phòng", roomNode?.name || currentRoom?.roomNodeId || "A101"],
    ["Người Xếp Phòng", currentRoom?.assignedBy || "Ban Quản trị"],
    ["Thời Hạn Hợp Đồng", `${startDateStr} - ${endDateStr}`],
    ["Trạng Thái Cư Trú", "Đang Cư Trú (Hợp Đồng Hiệu Lực)"],
    ["Ghi Chú", currentRoom?.notes || "Xếp phòng sinh viên chính thức"],
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Residence
          </p>
          <div className="flex items-center gap-3">
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28241f] sm:text-5xl">
              {roomName}
            </h1>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-stone-500 mt-2" />}
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Xem thông tin chi tiết phòng ở, tiện ích và thời hạn hợp đồng cư trú.
          </p>
        </div>
        <ResidenceTabs />
      </div>

      {/* Room Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {roomStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/60 bg-white/50 p-5 backdrop-blur-md shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3a26c]/15 text-[#8f6d38]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold">{stat.label}</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Info Specs */}
      <div className="rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-xl shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-stone-800 border-b pb-3">Chi Tiết Hợp Đồng Cư Trú</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {roomInfo.map(([k, v], idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-stone-200/60">
              <span className="text-stone-500 font-medium">{k}</span>
              <span className="text-stone-900 font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
