// app/(platform)/analytics/insights/_components/types.ts

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterOptions {
  dateRange: DateRange;
  blockId: string;
  floorLevel: string;
  roomNumber: string;
  managerId: string;
}

export interface KpiData {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface OccupancyData {
  month: string;
  rate: number;
}

export interface TicketData {
  month: string;
  count: number;
}

export interface ComplaintData {
  month: string;
  count: number;
}

export interface RoomStatusData {
  name: string;
  value: number;
  color: string;
}

export interface StudentByBlockData {
  block: string;
  students: number;
}

export interface StudentByFacultyData {
  faculty: string;
  students: number;
}

export interface StudentStatusData {
  status: string;
  count: number;
}

export interface TicketCategoryData {
  category: string;
  count: number;
}

export interface ComplaintTypeData {
  type: string;
  count: number;
}

export interface ManagerPerformanceData {
  manager: string;
  ticketsHandled: number;
  complaintsHandled: number;
  avgResolutionTime: number;
  slaScore: number;
}