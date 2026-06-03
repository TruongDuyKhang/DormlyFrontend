// app/(platform)/analytics/insights/_components/OperationsTab.tsx
'use client';

import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { KpiCard } from './KpiCard';
import { SmartInsights } from './SmartInsights';
import { 
  ticketsByCategoryData, 
  ticketVolumeData
} from './mockData';

// 4 KPI Cards (bỏ Assigned)
const operationsKpis = [
  { label: 'Open Tickets', value: 42, change: -8, trend: 'down' as const },
  { label: 'Working Tickets', value: 15, change: 2, trend: 'up' as const },
  { label: 'Resolved Tickets', value: 124, change: 18, trend: 'up' as const },
  { label: 'Overdue Tickets', value: 4, change: -2, trend: 'down' as const },
];

// Ticket Status Distribution (Open, Working, Resolved, Overdue)
const ticketStatusData = [
  { name: 'Open', value: 42, color: '#f59e0b' },
  { name: 'Working', value: 15, color: '#8b5cf6' },
  { name: 'Resolved', value: 124, color: '#10b981' },
  { name: 'Overdue', value: 4, color: '#ef4444' },
];

// Created vs Resolved Trend Data
const createdVsResolvedData = ticketVolumeData.map((item, idx) => ({
  month: item.month,
  created: item.count,
  resolved: [28, 32, 36, 42, 48, 52, 58, 62, 58, 54, 48, 44][idx],
}));

const STATUS_COLORS = ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];
const totalTickets = ticketStatusData.reduce((acc, curr) => acc + curr.value, 0);

// Custom tooltip for BarChart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-md">
        <p className="text-xs font-semibold text-stone-900">{label}</p>
        <p className="text-sm font-semibold text-stone-900">{payload[0].value} tickets</p>
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
            <span className="text-stone-600">Created</span>
            <span className="font-semibold text-stone-900">{created} tickets</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-stone-600">Resolved</span>
            <span className="font-semibold text-stone-900">{resolved} tickets</span>
          </div>
          {gap !== 0 && (
            <div className="mt-2 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Net backlog</span>
                <span className={cn(
                  "font-semibold",
                  gap > 0 ? "text-red-600" : "text-emerald-600"
                )}>
                  {gap > 0 ? '+' : ''}{gap} tickets
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

// Custom tooltip for PieChart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = Math.round((data.value / totalTickets) * 100);
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-md">
        <p className="text-sm font-semibold text-stone-900">{data.name}</p>
        <p className="text-sm text-stone-600">{data.value} tickets</p>
        <p className="text-xs text-stone-400">{percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const renderPieLabel = (entry: { name?: string; percent?: number }) => {
  const name = entry.name || '';
  const percent = entry.percent || 0;
  if (percent < 5) return '';
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export function OperationsTab() {
  return (
    <div className="space-y-6">
      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {operationsKpis.map((kpi, idx) => (
          <KpiCard key={kpi.label} data={kpi} index={idx} />
        ))}
      </div>
      
      {/* Row 2: Tickets by Category - Bar Chart (Quan trọng nhất) */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-stone-900">Tickets by Category</h3>
            <p className="text-sm text-stone-500 mt-0.5">Issue distribution across categories</p>
          </div>
          <div className="rounded-full bg-amber-50 px-3 py-1">
            <span className="text-sm font-semibold text-amber-700">
              {ticketsByCategoryData.reduce((acc, d) => acc + d.count, 0)} total
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={ticketsByCategoryData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="count" fill="#c3a26c" radius={[6, 6, 0, 0]} barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Row 3: Two Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Status Distribution - Donut Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900 mb-4">Ticket Status Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={200} className="sm:w-1/2">
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {ticketStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="sm:w-1/2 space-y-2">
              {ticketStatusData.map((item, idx) => {
                const percentage = Math.round((item.value / totalTickets) * 100);
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[idx] }} />
                      <span className="text-sm text-stone-600">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-stone-900">{item.value}</span>
                      <span className="text-xs text-stone-400 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Created vs Resolved Trend - Area Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900 mb-4">Monthly Operations Trend</h3>
          <p className="text-sm text-stone-500 mb-3">Created vs Resolved tickets over time</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={createdVsResolvedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c3a26c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c3a26c" stopOpacity={0.02}/>
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomAreaTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => <span className="text-sm text-stone-600">{value}</span>}
              />
              <Area 
                type="monotone" 
                dataKey="created" 
                name="Created" 
                stroke="#c3a26c" 
                strokeWidth={2} 
                fill="url(#createdGradient)"
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                name="Resolved" 
                stroke="#10b981" 
                strokeWidth={2} 
                fill="url(#resolvedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Year-to-date created</span>
              <span className="font-semibold text-stone-900">
                {createdVsResolvedData.reduce((acc, d) => acc + d.created, 0)} tickets
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-stone-500">Year-to-date resolved</span>
              <span className="font-semibold text-emerald-600">
                {createdVsResolvedData.reduce((acc, d) => acc + d.resolved, 0)} tickets
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 4: Operations Insights - Chỉ 3 insights */}
      <SmartInsights insights={getOperationsInsights()} title="Operations Insights" />
    </div>
  );
}

// Helper function to get operations insights - Chỉ 3 insights
function getOperationsInsights() {
  return [
    { id: '1', text: 'Electrical issues account for 38% of all tickets. Schedule preventive maintenance.', type: 'negative' as const },
    { id: '2', text: '4 overdue tickets require immediate attention to prevent SLA violations.', type: 'negative' as const },
    { id: '3', text: 'Resolution rate improved 18% compared to last month. Team efficiency is increasing.', type: 'positive' as const },
  ];
}