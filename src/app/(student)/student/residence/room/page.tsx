"use client";
import { useState, useEffect } from "react";
import {
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  DoorOpen,
  Layers3,
  Users,
  Loader2,
  AlertCircle,
  FileText,
  ArrowRightLeft,
} from "lucide-react";
import { ResidenceTabs } from "../_components/residence-tabs";
import { useCurrentRoom } from "@/hooks/useCurrentRoom";
import { buildingService } from "@/services/buildingService";
import { transferRequestService } from "@/services/transferRequestService";
import type { BuildingNodeResponseDto } from "@/types/models";
import { toast } from "sonner";

export default function StudentRoomPage() {
  const { currentRoom, history, isLoading, error } = useCurrentRoom();
  const [isNodesLoading, setIsNodesLoading] = useState(false);
  const [roomNode, setRoomNode] = useState<BuildingNodeResponseDto | null>(
    null,
  );
  const [floorNode, setFloorNode] = useState<BuildingNodeResponseDto | null>(
    null,
  );
  const [blockNode, setBlockNode] = useState<BuildingNodeResponseDto | null>(
    null,
  );

  // Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferReason, setTransferReason] = useState("");
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  useEffect(() => {
    async function resolveNodes() {
      if (currentRoom?.roomNodeId) {
        setIsNodesLoading(true);
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
          console.warn("Could not resolve building nodes:", e);
        } finally {
          setIsNodesLoading(false);
        }
      } else {
        setRoomNode(null);
        setFloorNode(null);
        setBlockNode(null);
      }
    }
    resolveNodes();
  }, [currentRoom]);

  const rawRoomName =
    roomNode?.name ||
    (currentRoom?.roomNodeId ? `#${currentRoom.roomNodeId.slice(0, 6)}` : "");
  const roomTitle = rawRoomName
    ? rawRoomName.toLowerCase().includes("phòng") ||
      rawRoomName.toLowerCase().includes("phong")
      ? rawRoomName
      : `Phòng ${rawRoomName}`
    : "Thông Tin Phòng Ở";

  const blockName = blockNode?.name || "Chưa xác định";
  const floorName = floorNode?.name || "Chưa xác định";
  const maxCap = roomNode?.maxCapacity ?? 0;
  const currOcc = roomNode?.currentOccupancy ?? 0;

  const startDateStr = currentRoom?.startDate
    ? new Date(currentRoom.startDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "---";

  const endDateStr = currentRoom?.endDate
    ? new Date(currentRoom.endDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Không thời hạn";

  const isContractActive = Boolean(
    currentRoom &&
    (!currentRoom.endDate ||
      new Date(currentRoom.endDate).getTime() > Date.now()),
  );

  const residenceStatusLabel = isContractActive
    ? "Đang Cư Trú (Hợp Đồng Hiệu Lực)"
    : currentRoom
      ? "Đã Hết Hạn Hợp Đồng"
      : "Chưa Có Hợp Đồng";

  const roomStats = [
    { label: "Tòa Nhà", value: blockName, icon: Building2 },
    { label: "Tầng", value: floorName, icon: Layers3 },
    {
      label: "Loại Phòng",
      value: maxCap > 0 ? `${maxCap} Giường Tiêu Chuẩn` : "Phòng KTX",
      icon: BedDouble,
    },
    {
      label: "Sức Chứa",
      value: maxCap > 0 ? `${currOcc} / ${maxCap}` : "---",
      icon: Users,
    },
  ];

  const roomInfo = [
    ["Mã Phòng", roomNode?.name || currentRoom?.roomNodeId || "---"],
    ["Người Xếp Phòng", currentRoom?.assignedBy || "Ban Quản trị"],
    [
      "Thời Hạn Hợp Đồng",
      currentRoom ? `${startDateStr} - ${endDateStr}` : "---",
    ],
    ["Trạng Thái Cư Trú", residenceStatusLabel],
    ["Ghi Chú", currentRoom?.notes || "Xếp phòng sinh viên chính thức"],
  ];

  const handleOpenTransferModal = () => {
    setTransferReason("");
    setIsTransferModalOpen(true);
  };

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferReason.trim()) {
      toast.error("Vui lòng nhập lý do xin chuyển phòng");
      return;
    }
    setIsSubmittingTransfer(true);
    try {
      await transferRequestService.submitRequest({
        reason: transferReason.trim(),
      });
      toast.success("Đã gửi yêu cầu chuyển phòng thành công đến Ban Quản Trị!");
      setIsTransferModalOpen(false);
      setTransferReason("");
    } catch (err: any) {
      console.error("Failed to submit transfer request:", err);
      toast.error(
        err?.response?.data?.message || "Gửi yêu cầu chuyển phòng thất bại",
      );
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const pageLoading = isLoading || isNodesLoading;

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Residence
          </p>
          <div className="flex items-center gap-3">
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
              {currentRoom ? roomTitle : "Thông Tin Phòng Ở"}
            </h1>
            {pageLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-stone-500 mt-2" />
            )}
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Xem thông tin chi tiết phòng ở, tiện ích và thời hạn hợp đồng cư
            trú.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {currentRoom && (
            <button
              onClick={handleOpenTransferModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c3a26c] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#b08e58] transition"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Yêu Cầu Chuyển Phòng
            </button>
          )}
          <ResidenceTabs />
        </div>
      </div>

      {pageLoading ? (
        <div className="rounded-3xl border border-white/60 bg-white/50 p-12 text-center backdrop-blur-md shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#c3a26c]" />
          <p className="mt-3 text-sm text-stone-600 font-medium">
            Đang tải thông tin cư trú...
          </p>
        </div>
      ) : !currentRoom ? (
        <div className="rounded-3xl border border-white/60 bg-white/60 p-8 text-center backdrop-blur-xl shadow-sm space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-800">
            Chưa Được Xếp Phòng Cư Trú
          </h2>
          <p className="mx-auto max-w-md text-sm text-stone-600">
            Hiện tại bạn chưa có thông tin hợp đồng phân phòng cư trú trên hệ
            thống. Nếu bạn đã đăng ký hoặc cần hỗ trợ xếp phòng, vui lòng liên
            hệ Ban Quản Trị.
          </p>
        </div>
      ) : (
        <>
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
                      <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                        {stat.label}
                      </p>
                      <p className="text-sm font-bold text-stone-800 mt-0.5">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Room Info Specs */}
          <div className="rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-stone-800">
                Chi Tiết Hợp Đồng Cư Trú
              </h3>
              <button
                onClick={handleOpenTransferModal}
                className="text-xs font-semibold text-[#c3a26c] hover:underline flex items-center gap-1"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Xin chuyển sang phòng khác
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {roomInfo.map(([k, v], idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-2 border-b border-stone-200/60"
                >
                  <span className="text-stone-500 font-medium">{k}</span>
                  <span className="text-stone-900 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Transfer Request Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-[#c3a26c]" />
                Yêu Cầu Chuyển Phòng Cư Trú
              </h3>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTransfer} className="space-y-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <p>
                  <strong>Phòng hiện tại:</strong> {roomTitle} ({blockName} -{" "}
                  {floorName})
                </p>
                <p className="mt-1">
                  Yêu cầu của bạn sẽ được gửi tới Ban Quản Trị KTX để xem xét
                  duyệt chuyển phòng.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Lý do xin chuyển phòng{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Nhập chi tiết lý do (ví dụ: Muốn chuyển sang tầng thấp hơn, không phù hợp giờ giấc với bạn cùng phòng cũ, lý do sức khỏe...)"
                  className="w-full rounded-2xl border border-stone-300 p-3.5 text-sm focus:border-[#c3a26c] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  disabled={isSubmittingTransfer}
                  className="rounded-xl border border-stone-300 px-5 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTransfer || !transferReason.trim()}
                  className="rounded-xl bg-[#c3a26c] px-6 py-2 text-sm font-semibold text-white hover:bg-[#b08e58] transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingTransfer && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
