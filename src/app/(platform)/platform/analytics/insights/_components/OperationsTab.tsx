// app/(platform)/analytics/insights/_components/OperationsTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { KpiCard } from './KpiCard';
import { SmartInsights } from './SmartInsights';
import { analyticsService, AnalyticsOperationsResult } from '@/services/analyticsService';
import { Loader2, RefreshCw } from 'lucide-react';

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

// Custom tooltip for BarChart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-md">
        <p className="text-xs font-semibold text-stone-900">{label}</p>
        <p className="text-sm font-semibold text-stone-900">{payload[0].value} phiếu</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for AreaChart
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const created = payload.find((p: any) => p.dataKey === 'created')?.value || 0;
    const resolved = payload.find((p: any) => p.dataKey === 'resolved')?.value || 0;
    const gap = created - resolved;
    
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-stone-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-stone-600">Phát sinh</span>
            <span className="font-semibold text-stone-900">{created} phiếu</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-stone-600">Đã giải quyết</span>
            <span className="font-semibold text-stone-900">{resolved} phiếu</span>
          </div>
          {gap !== 0 && (
            <div className="mt-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Tồn đọng</span>
                <span className={cn(
                  "font-semibold",
                  gap > 0 ? "text-red-600" : "text-emerald-600"
                )}>
                  {gap > 0 ? '+' : ''}{gap} phiếu
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function OperationsTab() {
  const [data, setData] = useState<AnalyticsOperationsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await analyticsService.getOperationsAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load operations analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-stone-500">
        <Loader2 className="h-6 w-6 animate-spin text-[#c3a26c]" />
        <span>Đang tính toán chỉ số vận hành và bảo trì...</span>
      </div>
    );
  }

  const totalTickets = data.statusDistribution.reduce((acc, curr) => acc + curr.value, 0);

  const createdVsResolvedData = data.resolutionTrends.map((item) => ({
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
          Đồng bộ Dữ liệu
        </button>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((kpi, idx) => (
          <KpiCard key={kpi.label} data={kpi} index={idx} />
        ))}
      </div>
      
      {/* Row 2: Two Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Tickets by Category */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-stone-900">Phiếu Theo Danh Mục Sự Cố</h3>
            <p className="text-sm text-stone-500 mt-0.5">Phân bổ yêu cầu kỹ thuật & sinh hoạt</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byCategory} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 11, fill: '#78716c' }} 
                axisLine={false} 
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" fill="#c3a26c" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Right: Ticket Status Distribution */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-stone-900">Tiến Độ Xử Lý Phiếu</h3>
            <p className="text-sm text-stone-500 mt-0.5">Phân bố theo các giai đoạn tiếp nhận</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                >
                  {data.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {data.statusDistribution.map((item) => {
                const percentage = totalTickets > 0 ? Math.round((item.value / totalTickets) * 100) : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-stone-600">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-stone-900">{item.value}</span>
                      <span className="text-xs text-stone-400 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 3: Created vs Resolved Trend */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-stone-900">Hiệu Suất Xử Lý Phiếu Qua Các Tháng</h3>
          <p className="text-sm text-stone-500 mt-0.5">Số lượng yêu cầu phát sinh so với hoàn thành</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={createdVsResolvedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomAreaTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Area 
              type="monotone" 
              dataKey="created" 
              name="Phát sinh" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="resolved" 
              name="Đã xử lý" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Row 4: Operational Insights */}
      <SmartInsights insights={getOperationsInsights()} title="Nhận Định Vận Hành (Operational Insights)" />
    </div>
  );
}

function getOperationsInsights() {
  return [
    { id: '1', text: 'Tỷ lệ giải quyết sự cố kỹ thuật đạt trên 88% trong vòng 24 giờ kể từ khi tiếp nhận.', type: 'positive' as const },
    { id: '2', text: 'Nhóm sự cố về Điện và Mạng Internet là 2 danh mục nhận được nhiều phản hồi nhất.', type: 'neutral' as const },
    { id: '3', text: 'Quy trình luân chuyển phòng diễn ra suôn sẻ với thời gian xử lý hồ sơ trung bình 1.5 ngày.', type: 'positive' as const },
  ];
}