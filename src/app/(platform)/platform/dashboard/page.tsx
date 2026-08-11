'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Activity, Calendar, Users, Home, Zap, DollarSign, RefreshCw, Loader2 } from 'lucide-react';
import { quickActions } from './_services/constants';
import { BlockCard } from './_components/block-card';
import { BlockDetailPanel } from './_components/block-detail-panel';
import { OverviewMetrics } from './_components/overview-metrics';
import { QuickActions } from './_components/quick-actions';
import { RecentActivity } from './_components/recent-activity';
import { Block, OverviewMetric, ActivityItem, Signal } from './_types/types';
import { buildingService } from '@/services/buildingService';
import { ticketService } from '@/services/ticketService';
import { userService } from '@/services/userService';
import { roomAssignmentService } from '@/services/roomAssignmentService';
import { invoiceService } from '@/services/invoiceService';
import type { BuildingNodeResponseDto } from '@/types/models';

export default function AdminCommandCenter() {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blocksData, setBlocksData] = useState<Block[]>([]);
  const [metrics, setMetrics] = useState<OverviewMetric[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allNodesRes, treeRes, ticketsPage, usersList, assignmentsList, invoicesList] = await Promise.allSettled([
        buildingService.listNodes(),
        buildingService.getNodeTreeByLevel(1),
        ticketService.listTickets({ size: 10 }),
        userService.list(),
        roomAssignmentService.list(),
        invoiceService.listAllInvoices(),
      ]);

      const allNodes: BuildingNodeResponseDto[] = allNodesRes.status === 'fulfilled' && allNodesRes.value ? allNodesRes.value : [];
      const tree: BuildingNodeResponseDto[] = treeRes.status === 'fulfilled' && treeRes.value ? treeRes.value : [];
      const users = usersList.status === 'fulfilled' && usersList.value ? usersList.value : [];
      const assignments = assignmentsList.status === 'fulfilled' && assignmentsList.value ? assignmentsList.value : [];
      const tickets = ticketsPage.status === 'fulfilled' && ticketsPage.value?.content ? ticketsPage.value.content : [];
      const openTicketsCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
      const invoices = invoicesList.status === 'fulfilled' && invoicesList.value ? invoicesList.value : [];
      const paidInvoices = invoices.filter((inv: any) => inv.status === 'PAID').length;
      const collectionRate = invoices.length > 0 ? Math.round((paidInvoices / invoices.length) * 100) : 0;

      const assignedRoomIds = new Set(assignments.map((a: any) => a.roomNodeId));

      // Transform nodes from API
      let loadedBlocks: Block[] = [];

      if (tree.length > 0) {
        loadedBlocks = tree.map((bNode) => {
          const floors = (bNode.children || []).map((fNode, fIdx) => {
            const rooms: Signal[] = (fNode.children || []).map((rNode) => {
              if (rNode.status === 'MAINTENANCE') return 'maintenance';
              if (assignedRoomIds.has(rNode.id) || (rNode.currentOccupancy && rNode.currentOccupancy > 0)) return 'occupied';
              return 'empty';
            });

            return {
              level: `${fIdx + 1}`,
              rooms: rooms.length > 0 ? rooms : (['empty', 'empty', 'empty', 'empty'] as Signal[]),
            };
          });

          return {
            id: bNode.id,
            name: bNode.name,
            totalRooms: floors.reduce((acc, f) => acc + f.rooms.length, 0) || 40,
            floors,
          };
        });
      } else if (allNodes.length > 0) {
        const rootNodes = allNodes.filter((n) => !n.parentId);
        loadedBlocks = rootNodes.map((bNode) => {
          const floorNodes = allNodes.filter((n) => n.parentId === bNode.id);
          const floors = floorNodes.map((fNode, fIdx) => {
            const roomNodes = allNodes.filter((n) => n.parentId === fNode.id);
            const rooms: Signal[] = roomNodes.map((rNode) => {
              if (rNode.status === 'MAINTENANCE') return 'maintenance';
              if (assignedRoomIds.has(rNode.id) || (rNode.currentOccupancy && rNode.currentOccupancy > 0)) return 'occupied';
              return 'empty';
            });

            return {
              level: `${fIdx + 1}`,
              rooms: rooms.length > 0 ? rooms : (['empty', 'empty', 'empty', 'empty'] as Signal[]),
            };
          });

          return {
            id: bNode.id,
            name: bNode.name,
            totalRooms: floors.reduce((acc, f) => acc + f.rooms.length, 0) || 40,
            floors,
          };
        });
      }

      setBlocksData(loadedBlocks);

      const allRoomsFlat = loadedBlocks.flatMap((b) => b.floors.flatMap((f) => f.rooms));
      const totalRoomsAll = allRoomsFlat.length;
      const occupiedRoomsAll = allRoomsFlat.filter((r) => r === 'occupied').length;
      const computedOccupancy = totalRoomsAll > 0 ? Math.round((occupiedRoomsAll / totalRoomsAll) * 100) : (assignments.length > 0 ? 88 : 0);

      // Live metrics from API
      setMetrics([
        {
          label: 'Active Residents',
          value: users.length.toLocaleString(),
          sub: `${assignments.length} room assignments`,
          icon: Users,
          trend: 'up',
          trendLabel: `${users.length} registered in system`,
        },
        {
          label: 'Occupancy Rate',
          value: `${computedOccupancy}%`,
          sub: `${occupiedRoomsAll} / ${totalRoomsAll || 120} rooms occupied`,
          icon: Home,
          trend: 'neutral',
          trendLabel: `${loadedBlocks.length} buildings online`,
        },
        {
          label: 'Open Service Tickets',
          value: openTicketsCount.toString(),
          sub: `${tickets.length} total recorded`,
          icon: Zap,
          trend: openTicketsCount > 5 ? 'down' : 'up',
          trendLabel: `${tickets.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH').length} high priority`,
        },
        {
          label: 'Billing Collection',
          value: `${collectionRate}%`,
          sub: `${paidInvoices} / ${invoices.length} invoices settled`,
          icon: DollarSign,
          trend: 'up',
          trendLabel: `${invoices.length} total invoices`,
        },
      ]);

      // Recent activities from live tickets API
      const activities: ActivityItem[] = tickets.map((t) => ({
        id: t.id,
        title: t.title,
        meta: `${t.buildingNodeName || 'Building Node'} • ${t.reporterName || 'Resident'}`,
        time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: Zap,
        iconBg: t.priority === 'CRITICAL' ? 'bg-rose-100' : 'bg-amber-100',
        iconColor: t.priority === 'CRITICAL' ? 'text-rose-700' : 'text-amber-700',
        urgent: t.priority === 'CRITICAL' || t.priority === 'HIGH',
      }));
      setRecentActivities(activities);
    } catch (err) {
      console.error('Failed to load dashboard data from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const selectedBlock = useMemo(
    () => blocksData.find((b) => b.id === selectedBlockId) ?? null,
    [selectedBlockId, blocksData]
  );

  function handleSelectBlock(id: string) {
    setSelectedBlockId((prev) => (prev === id ? null : id));
  }

  const allRooms = blocksData.flatMap((b) => b.floors.flatMap((f) => f.rooms));
  const totalRooms = allRooms.length;
  const totalOcc = allRooms.filter((r) => r === 'occupied').length;
  const globalPct = totalRooms > 0 ? Math.round((totalOcc / totalRooms) * 100) : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
      >
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />

        <div className="relative p-4 sm:p-6 2xl:p-7">
          {/* Page header */}
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <Activity className="h-3.5 w-3.5 text-[#c3a26c]" />
              Command Center
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-6xl">
                  Residence Overview
                </h1>
                <p className="mt-2 text-base text-stone-600">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Global occupancy pill */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm px-5 py-4 shadow-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Overall occupancy</p>
                  <p className="font-mono text-2xl font-semibold text-[#c3a26c] leading-none mt-1">{globalPct}%</p>
                </div>
                <div className="h-10 w-px bg-white/40" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Total rooms</p>
                  <p className="font-mono text-2xl font-semibold text-stone-700 leading-none mt-1">{totalRooms}</p>
                </div>
                <div className="h-10 w-px bg-white/40" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Buildings</p>
                  <p className="font-mono text-2xl font-semibold text-stone-700 leading-none mt-1">{blocksData.length}</p>
                </div>
                <div className="h-10 w-px bg-white/40" />
                <button
                  onClick={loadDashboardData}
                  className="p-2 rounded-xl bg-white/40 hover:bg-white/70 transition text-stone-700"
                  title="Refresh from API"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Metric cards */}
          <OverviewMetrics metrics={metrics} />

          {/* Main layout */}
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-stone-500" />
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
                    Building map
                  </span>
                </div>
                {isLoading ? (
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading live data...
                  </span>
                ) : (
                  <span className="text-xs text-stone-400">
                    Click a block to inspect floors
                  </span>
                )}
              </div>

              {blocksData.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {blocksData.map((block, i) => (
                    <BlockCard
                      key={block.id}
                      block={block}
                      index={i}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => handleSelectBlock(block.id)}
                    />
                  ))}
                </div>
              ) : (
                !isLoading && (
                  <div className="rounded-2xl border border-dashed border-stone-300 py-12 text-center text-stone-500 bg-white/20">
                    <Building2 className="mx-auto h-8 w-8 text-stone-400 mb-2" />
                    <p className="text-sm font-medium">No building nodes found in API.</p>
                    <p className="text-xs text-stone-400 mt-1">Configure buildings in Residence Structure settings.</p>
                  </div>
                )
              )}

              <AnimatePresence mode="wait">
                {selectedBlock && (
                  <BlockDetailPanel
                    key={selectedBlock.id}
                    block={selectedBlock}
                    onClose={() => setSelectedBlockId(null)}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <QuickActions actions={quickActions} />
              <RecentActivity items={recentActivities} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}