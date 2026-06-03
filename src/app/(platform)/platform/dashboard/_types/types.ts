export type Signal = "occupied" | "empty" | "maintenance" | "complaint";

export interface Floor {
  level: string;
  rooms: Signal[];
}

export interface Block {
  id: string;
  name: string;
  totalRooms: number;
  floors: Floor[];
}

export interface QuickAction {
  label: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: number;
  badgeColor?: string;
  badgeUrgent?: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  urgent?: boolean;
}

export interface OverviewMetric {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}