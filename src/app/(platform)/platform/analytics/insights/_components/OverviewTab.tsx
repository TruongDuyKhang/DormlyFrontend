// app/(platform)/analytics/insights/_components/OverviewTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { SmartInsights } from './SmartInsights';
import { analyticsService, AnalyticsOverviewResult } from '@/services/analyticsService';
import { DateRange } from './types';

const COLORS = ['#c3a26c', '#a3b8a3', '#d4c5a9'];

// Custom tooltip for ticket chart
const CustomTicketTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const created = payload.find((p: any) => p.dataKey === 'created')?.value || 0;
    const resolved = payload.find((p: any) => p.dataKey === 'resolved')?.value || 0;
    const diff = created - resolved;
    
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-stone-900 mb-2">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-stone-600">{item.name}</span>
            </div>
            <span className="font-semibold text-stone-900">{item.value} tickets</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Thay đổi ròng</span>
            <span className={cn(
              "font-semibold",
              diff > 0 ? "text-red-600" : "text-emerald-600"
            )}>
              {diff > 0 ? '+' : ''}{diff} tickets
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom tooltip for occupancy chart
const CustomOccupancyTooltip = ({ active, payload, label, data }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value || 0;
    const list = data || [];
    const currentIndex = list.findIndex((d: any) => d.month === label);
    const prevValue = currentIndex > 0 ? list[currentIndex - 1]?.rate : value;
    const change = prevValue ? value - prevValue : 0;
    
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-stone-900 mb-2">{label}</p>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-stone-600">Tỷ lệ lấp đầy</span>
          <span className="font-semibold text-stone-900">{value}%</span>
        </div>
        {change !== 0 && (
          <div className="mt-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">So với tháng trước</span>
              <span className={cn(
                "font-semibold flex items-center gap-1",
                change > 0 ? "text-emerald-600" : "text-red-600"
              )}>
                {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom label for pie chart
const renderPieLabel = (entry: { name?: string; percent?: number }) => {
  const name = entry.name || '';
  const percent = entry.percent || 0;
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function OverviewTab({ dateRange }: { dateRange?: DateRange }) {
  const [data, setData] = useState<AnalyticsOverviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await analyticsService.getOverview(dateRange);
      setData(res);
    } catch (err) {
      console.error('Failed to load overview analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-stone-500">
        <Loader2 className="h-6 w-6 animate-spin text-[#c3a26c]" />
        <span>Đang tính toán thống kê và chỉ số vận hành từ API...</span>
      </div>
    );
  }

  const topKpis = data.kpis.slice(0, 4);
  const totalBeds = data.roomStatus.reduce((acc, curr) => acc + curr.value, 0);
  const occupancyRate = data.occupancyRate;

  // Ticket activity with created vs resolved
  const ticketActivityData = data.ticketVolume.map((item) => ({
    month: item.month,
    created: (item as any).created || 0,
    resolved: (item as any).resolved || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header Sync */}
      <div className="flex justify-end">
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-white/60 transition"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          Đồng bộ Dữ liệu API
        </button>
      </div>

      {/* Row 1: Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topKpis.map((kpi, idx) => (
          <KpiCard key={kpi.label} data={kpi} index={idx} />
        ))}
      </div>
      
      {/* Row 2: Two Main Charts - Occupancy Trend & Ticket Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Trend - Area Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-stone-900">Xu Hướng Lấp Đầy (Occupancy Trend)</h3>
                <p className="text-sm text-stone-500 mt-0.5">Tỷ lệ lấp đầy phòng ký túc xá theo thời gian</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1">
                <span className="text-sm font-semibold text-emerald-700">+{data.occupancyRate}% hiện tại</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.occupancyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c3a26c" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#c3a26c" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#78716c' }} 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#78716c' }} 
                domain={[50, 100]} 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomOccupancyTooltip data={data.occupancyTrends} />} />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#c3a26c" 
                strokeWidth={3} 
                fill="url(#occupancyGradient)"
                dot={{ fill: '#c3a26c', stroke: 'white', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#c3a26c', stroke: 'white', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Tỷ lệ lấp đầy trung bình</span>
              <span className="font-semibold text-stone-900">
                {(data.occupancyTrends.reduce((acc, d) => acc + d.rate, 0) / data.occupancyTrends.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Ticket Activity - Bar Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-stone-900">Hoạt Động Phiếu Hỗ Trợ (Ticket Activity)</h3>
                <p className="text-sm text-stone-500 mt-0.5">Số lượng phiếu tạo mới và đã xử lý</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1">
                <span className="text-sm font-semibold text-emerald-700">Tỷ lệ hoàn thành cao</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={ticketActivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#78716c' }} 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#78716c' }} 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
              />
              <Tooltip content={<CustomTicketTooltip />} />
              <Bar 
                dataKey="created" 
                name="Tạo mới" 
                fill="#c3a26c" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
              <Bar 
                dataKey="resolved" 
                name="Đã xử lý" 
                fill="#a3b8a3" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-500">Tổng phiếu phát sinh</span>
                <p className="text-lg font-semibold text-stone-900">
                  {ticketActivityData.reduce((acc, d) => acc + d.created, 0)}
                </p>
              </div>
              <div>
                <span className="text-stone-500">Tổng phiếu giải quyết</span>
                <p className="text-lg font-semibold text-stone-900">
                  {ticketActivityData.reduce((acc, d) => acc + d.resolved, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 3: Room Status Distribution */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-semibold text-stone-900">Phân Bổ Trạng Thái Phòng & Giường</h3>
              <p className="text-sm text-stone-500 mt-0.5">Tình trạng chỗ ở trên toàn bộ ký túc xá</p>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1">
              <span className="text-sm font-semibold text-amber-700">{occupancyRate}% Đã có người</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Donut Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.roomStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {data.roomStatus.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Right: Statistics */}
          <div className="space-y-5">
            {data.roomStatus.map((item) => {
              const percentage = totalBeds > 0 ? Math.round((item.value / totalBeds) * 100) : 0;
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-stone-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-semibold text-stone-900">{item.value}</span>
                      <span className="text-xs text-stone-400 ml-1">chỗ</span>
                      <span className="text-xs text-stone-400 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-stone-500">Tổng Sức Chứa (Beds)</p>
                <p className="text-xl font-semibold text-stone-900">{totalBeds} <span className="text-sm font-normal text-stone-500">chỗ</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500">Tỷ lệ Lấp đầy Hiện tại</p>
                <p className="text-xl font-semibold text-emerald-600">{occupancyRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 4: AI Operational Insights */}
      <SmartInsights insights={getOverviewInsights(data)} title="Gợi Ý Phân Tích Thông Minh (AI Operational Insights)" />
    </div>
  );
}

function getOverviewInsights(data: AnalyticsOverviewResult) {
  return [
    { id: '1', text: `Tỷ lệ lấp đầy toàn ký túc xá đạt ${data.occupancyRate}%. Còn ${data.availableBeds} chỗ trống sẵn sàng tiếp nhận.`, type: 'positive' as const },
    { id: '2', text: `Đang có ${data.activeTickets} phiếu yêu cầu hỗ trợ bảo trì đang trong quá trình xử lý.`, type: 'neutral' as const },
    { id: '3', text: 'Nhu cầu chuyển phòng và đăng ký mới ổn định, các tiện ích sinh hoạt vận hành tối ưu.', type: 'positive' as const },
    { id: '4', text: 'Khuyến nghị bảo trì định kỳ hệ thống điện nước tại các tầng cao trước mùa thi.', type: 'neutral' as const },
  ];
}