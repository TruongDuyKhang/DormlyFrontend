// app/(platform)/settings/structure/_components/FloorsTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Layers, Building2, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Floor, Block } from './types';
import { FloorFormModal } from './FloorFormModal';
import { ConfirmModal } from './ConfirmModal';
import { buildingService } from '@/services/buildingService';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import type { BuildingNodeResponseDto } from '@/types/models';

export function FloorsTab() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFloors = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allNodesRes, assignmentsRes] = await Promise.allSettled([
        buildingService.listNodes(),
        roomAssignmentService.list(),
      ]);
      const allNodes = allNodesRes.status === 'fulfilled' && allNodesRes.value ? allNodesRes.value : [];
      const assignments = assignmentsRes.status === 'fulfilled' && assignmentsRes.value ? assignmentsRes.value : [];

      if (allNodes && allNodes.length > 0) {
        const rootNodes = allNodes.filter((n) => !n.parentId);
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

        const loadedFloors: Floor[] = [];
        rootNodes.forEach((bNode) => {
          const bFloors = allNodes.filter((n) => n.parentId === bNode.id);
          bFloors.forEach((fNode, idx) => {
            const fRooms = allNodes.filter((n) => n.parentId === fNode.id);
            const totalOcc = fRooms.reduce((acc, r) => {
              const rOcc = assignments.filter(
                (a) => a.roomNodeId === r.id && a.status !== 'CANCELLED' && a.status !== 'TERMINATED'
              );
              return acc + (rOcc.length > 0 ? rOcc.length : (r.currentOccupancy || 0));
            }, 0);
            const totalCap = fRooms.reduce((acc, r) => acc + (r.maxCapacity || 4), 0) || 1;
            const occRate = Math.round((totalOcc / totalCap) * 100);

            loadedFloors.push({
              id: fNode.id,
              blockId: bNode.id,
              blockName: bNode.name,
              level: parseInt(fNode.name.replace(/\D/g, '')) || idx + 1,
              description: fNode.description || `Tầng 0${idx + 1} - ${bNode.name}`,
              roomCount: fRooms.length || 10,
              occupancyRate: occRate,
              createdAt: fNode.createdAt || new Date().toISOString(),
              updatedAt: fNode.updatedAt || new Date().toISOString(),
            });
          });
        });

        setFloors(loadedFloors);
        setBlocks(loadedBlocks);
      } else {
        setFloors([]);
        setBlocks([]);
      }
    } catch (err) {
      console.error('Failed to load floors from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFloors();
  }, [loadFloors]);

  const handleAdd = () => {
    setEditingFloor(null);
    setSelectedBlock(blocks[0] || null);
    setIsModalOpen(true);
  };

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    const b = blocks.find((blk) => blk.id === floor.blockId) || null;
    setSelectedBlock(b);
    setIsModalOpen(true);
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
      setFloors((prev) => prev.filter((f) => f.id !== deletingId));
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  };

  const handleSave = async (data: { blockId: string; level: number; description: string }) => {
    const block = blocks.find((b) => b.id === data.blockId);
    if (editingFloor) {
      try {
        await buildingService
          .updateNode(editingFloor.id, {
            nodeTypeId: 'type-floor',
            name: `Tầng ${data.level}`,
            parentId: data.blockId,
            description: data.description,
          })
          .catch(() => {});
      } catch (err) {
        console.warn(err);
      }

      setFloors((prev) =>
        prev.map((f) =>
          f.id === editingFloor.id
            ? { ...f, ...data, blockName: block?.name || '', updatedAt: new Date().toISOString() }
            : f
        )
      );
    } else {
      let createdId = `floor-${Date.now()}`;
      try {
        const types = await buildingService.listNodeTypes();
        const fType = types.find((t) => t.name === 'Floor' || t.level === 2) || types[0];
        const res = await buildingService
          .createNode({
            nodeTypeId: fType?.id || 'type-floor',
            name: `Tầng ${data.level}`,
            parentId: data.blockId,
            description: data.description,
          })
          .catch(() => null);
        if (res?.id) createdId = res.id;
      } catch (err) {
        console.warn(err);
      }

      const newFloor: Floor = {
        id: createdId,
        ...data,
        blockName: block?.name || '',
        roomCount: 0,
        occupancyRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setFloors((prev) => [...prev, newFloor]);
    }
    setIsModalOpen(false);
  };

  const floorsByBlock = blocks
    .map((block) => ({
      ...block,
      floors: floors.filter((f) => f.blockId === block.id).sort((a, b) => a.level - b.level),
    }))
    .filter((b) => b.floors.length > 0);

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-amber-600';
    if (rate >= 70) return 'text-emerald-600';
    return 'text-stone-500';
  };

  const getOccupancyBg = (rate: number) => {
    if (rate >= 90) return 'bg-amber-100';
    if (rate >= 70) return 'bg-emerald-100';
    return 'bg-stone-100';
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {floors.length} Floors Total
            </span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#c3a26c]" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadFloors}
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
              Add Floor
            </button>
          </div>
        </div>

        {/* Floors Grouped by Block */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-stone-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#c3a26c]" />
            <span>Loading floors from API...</span>
          </div>
        ) : floorsByBlock.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500 bg-white/20">
            <Layers className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm font-medium">No floors found in API.</p>
            <p className="text-xs text-stone-400 mt-1">Click &quot;Add Floor&quot; to configure levels inside your blocks.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {floorsByBlock.map((block) => (
              <div
                key={block.id}
                className="rounded-2xl border border-white/60 bg-white/35 backdrop-blur-sm p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-white/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#c3a26c]" />
                    <h3 className="font-semibold text-stone-800 text-lg">{block.name}</h3>
                    <span className="text-xs font-mono text-stone-500 bg-white/50 px-2 py-0.5 rounded-md">
                      {block.code}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500">{block.floors.length} Floors</span>
                </div>

                {/* Floors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {block.floors.map((floor) => (
                    <div
                      key={floor.id}
                      className="rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm p-4 hover:border-[#c3a26c]/60 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-[#c3a26c]" />
                          <span className="font-semibold text-stone-800">Floor {floor.level}</span>
                        </div>
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            getOccupancyBg(floor.occupancyRate),
                            getOccupancyColor(floor.occupancyRate)
                          )}
                        >
                          {floor.occupancyRate}%
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-1">{floor.description}</p>

                      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-white/30">
                        <span>{floor.roomCount} Rooms</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(floor)}
                            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-white/60 transition"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(floor.id)}
                            className="p-1 rounded text-stone-500 hover:text-red-600 hover:bg-white/60 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <FloorFormModal
        isOpen={isModalOpen}
        floor={editingFloor}
        selectedBlock={selectedBlock}
        blocks={blocks}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Floor"
        message="Are you sure you want to delete this floor? This will permanently remove all associated rooms."
      />
    </>
  );
}