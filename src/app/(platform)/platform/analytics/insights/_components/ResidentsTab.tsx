// app/(platform)/analytics/insights/_components/ResidentsTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Clock, UserCheck, Users, GraduationCap, Building2, Loader2, RefreshCw } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { SmartInsights } from './SmartInsights';
import { analyticsService, AnalyticsResidentsResult } from '@/services/analyticsService';
import Link from 'next/link';

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-2 shadow-md">
        <p className="text-xs font-semibold text-stone-900">{label}</p>
        <p className="text-sm font-semibold text-stone-900">{payload[0].value} sinh viên</p>
      </div>
    );
  }
  return null;
};

export function ResidentsTab() {
  const [data, setData] = useState<AnalyticsResidentsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await analyticsService.getResidentsAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load residents analytics:', err);
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
        <span>Đang tải số liệu thống kê sinh viên cư trú...</span>
      </div>
    );
  }

  const totalStudents = data.byBlock.reduce((acc, d) => acc + d.students, 0);

  return (
    <div className="space-y-6">
      {/* Header Sync */}
      <div className="flex justify-end">
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-white/60 transition"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          Làm mới số liệu
        </button>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis.map((kpi, idx) => (
          <KpiCard key={kpi.label} data={kpi} index={idx} />
        ))}
      </div>
      
      {/* Row 2: Students by Block - Bar Chart */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-stone-500" />
          <h3 className="text-base font-semibold text-stone-900">Sinh Viên Phân Bổ Theo Tòa Nhà (By Block)</h3>
          <span className="text-sm text-stone-400 ml-auto">
            Tổng cộng: {totalStudents} sinh viên
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.byBlock} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="block" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="students" fill="#c3a26c" radius={[6, 6, 0, 0]} barSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Row 3: Students by Faculty */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-stone-500" />
          <h3 className="text-base font-semibold text-stone-900">Phân Bổ Theo Ngành Học & Khoa (By Faculty)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.byFaculty.map((item) => (
            <div key={item.faculty} className="rounded-xl bg-stone-50 p-3.5 border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-800">{item.faculty}</p>
                <p className="text-xs text-stone-500 mt-0.5">Sinh viên chính quy</p>
              </div>
              <span className="text-base font-bold text-[#8f6d38] bg-[#c3a26c]/15 px-2.5 py-1 rounded-lg">
                {item.students}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Row 4: Pending Approvals & Resident Actions */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-semibold text-stone-900">Trạng Thái Hồ Sơ & Lưu Trú</h3>
          </div>
          <Link
            href="/platform/residents/accounts"
            className="text-xs font-semibold text-[#8f6d38] hover:underline"
          >
            Quản lý tài khoản →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.byStatus.map((st) => (
            <div key={st.status} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
              <p className="text-xs text-stone-500">{st.status}</p>
              <p className="text-xl font-bold text-stone-900 mt-1">{st.count}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Row 5: Resident Insights */}
      <SmartInsights insights={getResidentInsights()} title="Phân Tích Cư Dân (Resident Insights)" />
    </div>
  );
}

function getResidentInsights() {
  return [
    { id: '1', text: 'Tỷ lệ sinh viên thuộc các khối ngành Kỹ thuật và Công nghệ chiếm tỷ trọng cao nhất.', type: 'positive' as const },
    { id: '2', text: 'Mật độ phân bổ phòng theo tòa nhà đạt trạng thái cân bằng giữa các khu vực.', type: 'positive' as const },
    { id: '3', text: 'Tỷ lệ hồ sơ sinh viên hoàn tất xác minh đạt 98% qua hệ thống căn cước công dân.', type: 'neutral' as const },
  ];
}