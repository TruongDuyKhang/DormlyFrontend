// app/(platform)/analytics/insights/_components/ResidentsTab.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Clock, UserCheck, Users, GraduationCap, Building2 } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { SmartInsights } from './SmartInsights';
import { 
  residentsKpis, 
  studentsByBlockData
} from './mockData';

// Occupancy by Block data
const occupancyByBlockData = studentsByBlockData.map(block => {
  const capacities: Record<string, number> = {
    'Block A': 300,
    'Block B': 280,
    'Block C': 260,
    'Block D': 250,
    'Block E': 220,
  };
  const capacity = capacities[block.block] || 250;
  const occupancyRate = Math.round((block.students / capacity) * 100);
  return {
    block: block.block,
    students: block.students,
    capacity,
    occupancyRate,
  };
});

// Pending approvals
const pendingApprovals = [
  { id: 1, name: 'Nguyen Van A', studentId: 'STU241001', department: 'Computer Science' },
  { id: 2, name: 'Tran Minh B', studentId: 'STU241002', department: 'Engineering' },
  { id: 3, name: 'Le Quoc C', studentId: 'STU241003', department: 'Business' },
];

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-md">
        <p className="text-xs font-semibold text-stone-900">{label}</p>
        <p className="text-sm font-semibold text-stone-900">{payload[0].value} students</p>
      </div>
    );
  }
  return null;
};

export function ResidentsTab() {
  return (
    <div className="space-y-6">
      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {residentsKpis.map((kpi, idx) => (
          <KpiCard key={kpi.label} data={kpi} index={idx} />
        ))}
      </div>
      
      {/* Row 2: Students by Block - Bar Chart */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-stone-500" />
          <h3 className="text-base font-semibold text-stone-900">Students by Block</h3>
          <span className="text-sm text-stone-400 ml-auto">
            Total: {studentsByBlockData.reduce((acc, d) => acc + d.students, 0)} students
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={studentsByBlockData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="block" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="students" fill="#c3a26c" radius={[6, 6, 0, 0]} barSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Row 3: Occupancy by Block - 5 Stats Cards */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-stone-500" />
          <h3 className="text-base font-semibold text-stone-900">Occupancy by Block</h3>
          <span className="text-sm text-stone-400 ml-auto">
            Overall: {Math.round(occupancyByBlockData.reduce((acc, d) => acc + d.occupancyRate, 0) / occupancyByBlockData.length)}%
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {occupancyByBlockData.map((block) => {
            const isHigh = block.occupancyRate >= 90;
            const isMedium = block.occupancyRate >= 75;
            return (
              <div key={block.block} className="rounded-lg bg-stone-50 p-3 text-center">
                <p className="text-sm font-medium text-stone-600">{block.block}</p>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  isHigh ? "text-amber-600" : isMedium ? "text-emerald-600" : "text-stone-500"
                )}>
                  {block.occupancyRate}%
                </p>
                <p className="text-xs text-stone-400 mt-1">{block.students}/{block.capacity}</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", isHigh ? "bg-amber-500" : isMedium ? "bg-emerald-500" : "bg-stone-400")}
                    style={{ width: `${block.occupancyRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Row 4: Pending Approvals Widget */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-semibold text-stone-900">Pending Approvals</h3>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {residentsKpis.find(k => k.label === 'Pending Approval')?.value || 15} waiting
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                  <UserCheck className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{approval.name}</p>
                  <p className="text-xs text-stone-500">{approval.studentId} • {approval.department}</p>
                </div>
              </div>
              <button className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-[#c3a26c] border border-[#c3a26c]/30 hover:bg-[#c3a26c]/10 transition">
                Review
              </button>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full rounded-lg border border-dashed border-stone-300 py-2 text-sm text-stone-500 hover:bg-stone-50 transition">
          View all pending applications →
        </button>
      </div>
      
      {/* Row 5: Resident Insights */}
      <SmartInsights insights={getResidentInsights()} title="Resident Insights" />
    </div>
  );
}

// Helper function to get resident insights
function getResidentInsights() {
  return [
    { id: '1', text: 'Block A has the highest occupancy at 95%, near full capacity.', type: 'neutral' as const },
    { id: '2', text: 'Engineering faculty represents 32% of total residents.', type: 'positive' as const },
    { id: '3', text: '15 student accounts awaiting approval. Review pending applications.', type: 'neutral' as const },
    { id: '4', text: 'Active students increased by 3.2% this quarter.', type: 'positive' as const },
  ];
}