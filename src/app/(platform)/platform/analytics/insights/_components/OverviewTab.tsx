// app/(platform)/analytics/insights/_components/OverviewTab.tsx
'use client';

import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { SmartInsights } from './SmartInsights';
import { 
  overviewKpis, 
  occupancyTrendData, 
  ticketVolumeData, 
  roomStatusData
} from './mockData';

const COLORS = ['#c3a26c', '#a3b8a3', '#d4c5a9'];

// Top 4 KPI data
const topKpis = overviewKpis.slice(0, 4);

// Ticket Activity data (Created vs Resolved)
const ticketActivityData = ticketVolumeData.map((item, idx) => ({
  month: item.month,
  created: item.count,
  resolved: [28, 32, 36, 42, 48, 52, 58, 62, 58, 54, 48, 44][idx],
}));

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
            <span className="text-stone-500">Net change</span>
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
const CustomOccupancyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value || 0;
    const currentIndex = occupancyTrendData.findIndex(d => d.month === label);
    const prevValue = currentIndex > 0 ? occupancyTrendData[currentIndex - 1]?.rate : value;
    const change = prevValue ? value - prevValue : 0;
    
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-md">
        <p className="text-sm font-semibold text-stone-900 mb-2">{label}</p>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-stone-600">Occupancy Rate</span>
          <span className="font-semibold text-stone-900">{value}%</span>
        </div>
        {change !== 0 && (
          <div className="mt-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">vs previous month</span>
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

export function OverviewTab() {
  // Calculate total rooms
  const totalRooms = roomStatusData.reduce((acc, curr) => acc + curr.value, 0);
  const occupancyRate = Math.round((roomStatusData.find(r => r.name === 'Occupied')?.value || 0) / totalRooms * 100);
  
  return (
    <div className="space-y-6">
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
                <h3 className="text-base font-semibold text-stone-900">Occupancy Trend</h3>
                <p className="text-sm text-stone-500 mt-0.5">Monthly occupancy rate over time</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1">
                <span className="text-sm font-semibold text-emerald-700">+3.1%</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={occupancyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                domain={[70, 100]} 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomOccupancyTooltip />} />
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
              <span className="text-stone-500">Average occupancy (YTD)</span>
              <span className="font-semibold text-stone-900">
                {(occupancyTrendData.reduce((acc, d) => acc + d.rate, 0) / occupancyTrendData.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Ticket Activity - Bar Chart */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-stone-900">Ticket Activity</h3>
                <p className="text-sm text-stone-500 mt-0.5">Created vs Resolved tickets</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1">
                <span className="text-sm font-semibold text-emerald-700">+18% resolved</span>
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
                name="Created" 
                fill="#c3a26c" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
              <Bar 
                dataKey="resolved" 
                name="Resolved" 
                fill="#a3b8a3" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-500">Total Created</span>
                <p className="text-lg font-semibold text-stone-900">
                  {ticketActivityData.reduce((acc, d) => acc + d.created, 0)}
                </p>
              </div>
              <div>
                <span className="text-stone-500">Total Resolved</span>
                <p className="text-lg font-semibold text-stone-900">
                  {ticketActivityData.reduce((acc, d) => acc + d.resolved, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 3: Room Status Distribution - 50/50 layout */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-semibold text-stone-900">Room Status Distribution</h3>
              <p className="text-sm text-stone-500 mt-0.5">Current room allocation across the residence</p>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1">
              <span className="text-sm font-semibold text-amber-700">{occupancyRate}% Occupied</span>
            </div>
          </div>
        </div>
        
        {/* 50/50 Layout: Donut Chart on left, Stats on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Donut Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roomStatusData}
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
                  {roomStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Right: Statistics */}
          <div className="space-y-5">
            {roomStatusData.map((item) => {
              const percentage = Math.round((item.value / totalRooms) * 100);
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-stone-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-semibold text-stone-900">{item.value}</span>
                      <span className="text-xs text-stone-400 ml-1">rooms</span>
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
                <p className="text-xs text-stone-500">Total Capacity</p>
                <p className="text-xl font-semibold text-stone-900">{totalRooms} <span className="text-sm font-normal text-stone-500">rooms</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500">Current Occupancy</p>
                <p className="text-xl font-semibold text-emerald-600">{occupancyRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Row 4: AI Operational Insights */}
      <SmartInsights insights={getOverviewInsights()} title="AI Operational Insights" />
    </div>
  );
}

// Helper function to get insights
function getOverviewInsights() {
  return [
    { id: '1', text: 'Block A occupancy exceeds 95%. Consider expansion or waitlist management.', type: 'neutral' as const },
    { id: '2', text: 'Electrical incidents increased 14% this month. Schedule preventive maintenance.', type: 'negative' as const },
    { id: '3', text: 'Average response time improved from 3.1 to 2.4 days, exceeding target.', type: 'positive' as const },
    { id: '4', text: '15 student accounts are awaiting approval. Review pending applications today.', type: 'neutral' as const },
    { id: '5', text: 'Occupancy rate up 3.1% from last quarter, now at 87% capacity.', type: 'positive' as const },
    { id: '6', text: 'Resolved tickets increased by 18% this month, showing improved efficiency.', type: 'positive' as const },
  ];
}