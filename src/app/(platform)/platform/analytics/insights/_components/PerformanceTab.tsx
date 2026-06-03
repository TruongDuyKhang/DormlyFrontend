// app/(platform)/analytics/insights/_components/PerformanceTab.tsx
'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { KpiCard } from './KpiCard';
import { SmartInsights } from './SmartInsights';
import { 
  resolutionTimeTrendData, 
  slaComplianceTrendData,
  monthlyCompletionTrendData
} from './mockData';

// 4 KPI Cards
const performanceKpis = [
  { label: 'Tickets Completed', value: 124, change: 18, trend: 'up' as const },
  { label: 'Complaints Resolved', value: 56, change: 12, trend: 'up' as const },
  { label: 'Avg Resolution Time', value: '2.4 days', change: -0.3, trend: 'down' as const },
  { label: 'SLA Compliance', value: '94%', change: 2.1, trend: 'up' as const },
];

// Created vs Resolved trend for Resolution Performance
const resolutionPerformanceData = monthlyCompletionTrendData.map((item, idx) => ({
  month: item.month,
  created: [34, 38, 42, 45, 48, 52, 55, 58, 54, 50, 46, 42][idx],
  resolved: item.count,
}));

// Custom tooltips
const CustomResolutionTooltip = ({ active, payload, label }: any) => {
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

const CustomTimeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-md">
        <p className="text-xs font-semibold text-stone-900">{label}</p>
        <p className="text-sm font-semibold text-stone-900">{payload[0].value} days</p>
      </div>
    );
  }
  return null;
};

const CustomSLATooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-md">
        <p className="text-xs font-semibold text-stone-900">{label}</p>
        <p className="text-sm font-semibold text-stone-900">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function PerformanceTab() {
  return (
    <div className="space-y-6">
      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceKpis.map((kpi, idx) => (
          <KpiCard key={kpi.label} data={kpi} index={idx} />
        ))}
      </div>
      
      {/* Row 2: Resolution Performance Trend - Created vs Resolved (Chart 1) */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-stone-900">Resolution Performance Trend</h3>
          <p className="text-sm text-stone-500 mt-0.5">System processing capacity vs incoming workload</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={resolutionPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomResolutionTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span className="text-sm text-stone-600">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="created" 
              name="Created" 
              stroke="#c3a26c" 
              strokeWidth={2.5} 
              dot={{ fill: '#c3a26c', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              name="Resolved" 
              stroke="#10b981" 
              strokeWidth={2.5} 
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Year-to-date resolved rate</span>
            <span className="font-semibold text-emerald-600">
              {Math.round((resolutionPerformanceData.reduce((acc, d) => acc + d.resolved, 0) / 
                resolutionPerformanceData.reduce((acc, d) => acc + d.created, 0)) * 100)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Row 3: Two Charts - Resolution Time & SLA Compliance (Chart 2 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Time Trend (Chart 2) */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900 mb-2">Resolution Time Trend</h3>
          <p className="text-sm text-stone-500 mb-4">Average time to resolve tickets (days)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={resolutionTimeTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#78716c' }} domain={[2, 3.5]} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTimeTooltip />} />
              <Line 
                type="monotone" 
                dataKey="days" 
                name="Resolution Time" 
                stroke="#c3a26c" 
                strokeWidth={2.5} 
                dot={{ fill: '#c3a26c', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Improvement vs start of year</span>
              <span className="font-semibold text-emerald-600">
                -{(resolutionTimeTrendData[0].days - resolutionTimeTrendData[resolutionTimeTrendData.length - 1].days).toFixed(1)} days
              </span>
            </div>
          </div>
        </div>
        
        {/* SLA Compliance Trend (Chart 3) */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900 mb-2">SLA Compliance Trend</h3>
          <p className="text-sm text-stone-500 mb-4">Service level agreement achievement rate</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={slaComplianceTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="slaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#78716c' }} domain={[85, 100]} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomSLATooltip />} />
              <Area 
                type="monotone" 
                dataKey="rate" 
                name="SLA Compliance" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                fill="url(#slaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Current SLA vs target (90%)</span>
              <span className="font-semibold text-emerald-600">
                +{slaComplianceTrendData[slaComplianceTrendData.length - 1].rate - 90}% above target
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 4: System Performance Insights */}
      <SmartInsights insights={getSystemInsights()} title="System Performance Insights" />
    </div>
  );
}

// Helper function to get system insights - Không nhắc tên quản lý
function getSystemInsights() {
  return [
    { id: '1', text: 'Ticket resolution volume increased by 18% this month, showing improved system capacity.', type: 'positive' as const },
    { id: '2', text: 'Average resolution time improved from 2.9 to 2.4 days, exceeding performance targets.', type: 'positive' as const },
    { id: '3', text: 'SLA compliance remained above target for three consecutive months (94% current).', type: 'positive' as const },
  ];
}