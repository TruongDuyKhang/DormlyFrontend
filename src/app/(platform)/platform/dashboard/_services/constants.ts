import {
  Users, DoorClosed, Wrench, ShieldAlert,
  MessageCircle, BarChart2, MessageSquare,
  AlertTriangle, CheckCircle, UserPlus, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { Block, Signal, OverviewMetric, QuickAction, ActivityItem } from "../_types/types";

function makeRooms(
  total: number, occupied: number, maintenance: number, complaint: number
): Signal[] {
  const arr: Signal[] = [
    ...Array(complaint).fill("complaint" as Signal),
    ...Array(maintenance).fill("maintenance" as Signal),
    ...Array(occupied).fill("occupied" as Signal),
    ...Array(total - complaint - maintenance - occupied).fill("empty" as Signal),
  ];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const blocks: Block[] = [
  {
    id: "b1", name: "Block A", totalRooms: 100,
    floors: [
      { level: "5", rooms: makeRooms(20, 19, 0, 0) },
      { level: "4", rooms: makeRooms(20, 18, 1, 0) },
      { level: "3", rooms: makeRooms(20, 19, 0, 1) },
      { level: "2", rooms: makeRooms(20, 17, 2, 0) },
      { level: "1", rooms: makeRooms(20, 18, 0, 0) },
    ],
  },
  {
    id: "b2", name: "Block B", totalRooms: 90,
    floors: [
      { level: "5", rooms: makeRooms(18, 15, 1, 1) },
      { level: "4", rooms: makeRooms(18, 14, 2, 0) },
      { level: "3", rooms: makeRooms(18, 16, 0, 2) },
      { level: "2", rooms: makeRooms(18, 13, 1, 1) },
      { level: "1", rooms: makeRooms(18, 15, 0, 0) },
    ],
  },
  {
    id: "b3", name: "Block C", totalRooms: 80,
    floors: [
      { level: "5", rooms: makeRooms(16, 14, 0, 0) },
      { level: "4", rooms: makeRooms(16, 13, 1, 1) },
      { level: "3", rooms: makeRooms(16, 15, 0, 0) },
      { level: "2", rooms: makeRooms(16, 12, 2, 0) },
      { level: "1", rooms: makeRooms(16, 14, 0, 1) },
    ],
  },
  {
    id: "b4", name: "Block D", totalRooms: 110,
    floors: [
      { level: "5", rooms: makeRooms(22, 21, 1, 0) },
      { level: "4", rooms: makeRooms(22, 20, 0, 1) },
      { level: "3", rooms: makeRooms(22, 22, 0, 0) },
      { level: "2", rooms: makeRooms(22, 19, 2, 1) },
      { level: "1", rooms: makeRooms(22, 21, 0, 0) },
    ],
  },
  {
    id: "b5", name: "Block E", totalRooms: 100,
    floors: [
      { level: "5", rooms: makeRooms(20, 17, 0, 2) },
      { level: "4", rooms: makeRooms(20, 18, 1, 0) },
      { level: "3", rooms: makeRooms(20, 16, 2, 1) },
      { level: "2", rooms: makeRooms(20, 19, 0, 0) },
      { level: "1", rooms: makeRooms(20, 17, 1, 1) },
    ],
  },
  {
    id: "b6", name: "Block F", totalRooms: 70,
    floors: [
      { level: "5", rooms: makeRooms(14, 12, 1, 0) },
      { level: "4", rooms: makeRooms(14, 11, 0, 1) },
      { level: "3", rooms: makeRooms(14, 13, 0, 0) },
      { level: "2", rooms: makeRooms(14, 10, 2, 0) },
      { level: "1", rooms: makeRooms(14, 12, 0, 1) },
    ],
  },
];

export const overviewMetrics: OverviewMetric[] = [
  {
    label: "Active residents",
    value: "1,186",
    sub: "across all 6 blocks",
    icon: Users,
    trend: "up",
    trendLabel: "+12 this month",
  },
  {
    label: "Occupancy rate",
    value: "87%",
    sub: "614 rooms available",
    icon: DoorClosed,
    trend: "up",
    trendLabel: "+2% vs last month",
  },
  {
    label: "Open maintenance",
    value: "18",
    sub: "tickets pending",
    icon: Wrench,
    trend: "down",
    trendLabel: "3 overdue",
  },
  {
    label: "Unresolved complaints",
    value: "11",
    sub: "require attention",
    icon: ShieldAlert,
    trend: "neutral",
    trendLabel: "2 high priority",
  },
];

export const quickActions: QuickAction[] = [
  {
    label: "Complaints",
    desc: "Review & resolve student complaints",
    href: "/platform/operations/complaints",
    icon: ShieldAlert,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badge: 11,
    badgeColor: "bg-red-500/15 text-red-300",
    badgeUrgent: true,
  },
  {
    label: "Maintenance tickets",
    desc: "Repair requests & facility issues",
    href: "/platform/operations/tickets",
    icon: Wrench,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badge: 18,
    badgeColor: "bg-amber-500/15 text-amber-300",
  },
  // {
  //   label: "Chat",
  //   desc: "Messages from residents & staff",
  //   href: "/platform/operations/chat",
  //   icon: MessageCircle,
  //   iconBg: "bg-blue-500/10",
  //   iconColor: "text-blue-400",
  //   badge: 4,
  //   badgeColor: "bg-blue-500/15 text-blue-300",
  // },
  {
    label: "Insights",
    desc: "Analytics, trends & reports",
    href: "/platform/analytics/insights",
    icon: BarChart2,
    iconBg: "bg-[#c3a26c]/15",
    iconColor: "text-[#c3a26c]",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    title: "New complaint — Block B, Floor 3",
    meta: "Noise after 11 PM · Anonymous",
    time: "5m ago",
    icon: ShieldAlert,
    iconBg: "bg-red-500/12",
    iconColor: "text-red-400",
    urgent: true,
  },
  {
    id: "a2",
    title: "Ticket resolved — Block D, Floor 2",
    meta: "AC repair completed · Room 204",
    time: "22m ago",
    icon: CheckCircle,
    iconBg: "bg-emerald-500/12",
    iconColor: "text-emerald-400",
  },
  {
    id: "a3",
    title: "Message from Nguyen Van A",
    meta: "Block A · Contract renewal inquiry",
    time: "1h ago",
    icon: MessageSquare,
    iconBg: "bg-blue-500/12",
    iconColor: "text-blue-400",
  },
  {
    id: "a4",
    title: "Urgent ticket — Block E, Floor 3",
    meta: "Water pipe leaking · High priority",
    time: "2h ago",
    icon: AlertTriangle,
    iconBg: "bg-amber-500/12",
    iconColor: "text-amber-400",
    urgent: true,
  },
  {
    id: "a5",
    title: "New resident checked in",
    meta: "Block F · Room 104 · Tran Thi B",
    time: "3h ago",
    icon: UserPlus,
    iconBg: "bg-[#c3a26c]/12",
    iconColor: "text-[#c3a26c]",
  },
];