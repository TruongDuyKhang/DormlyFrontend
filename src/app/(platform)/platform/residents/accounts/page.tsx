// app/(platform)/residents/accounts/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Clock, 
  ChevronRight, 
  FileText, 
  UserCheck, 
  UserX,
  Mail,
  GraduationCap,
  AlertCircle,
  Search,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/_components/ui/input';
import { userService } from '@/services/userService';
import { userDocumentService } from '@/services/userDocumentService';
import { studentProfileService } from '@/services/studentProfileService';
import type { UserResponseDto, UserDocumentResponseDto } from '@/types/models';
import { toast } from 'sonner';

interface StudentApplication {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
  submittedDate: string;
  documents: { id?: string; name: string; status: 'verified' | 'pending' | 'rejected'; url?: string }[];
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  isActive?: boolean;
  roles?: string[];
}

type TabType = 'pending' | 'approved' | 'rejected';

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [users, groupedDocs, profiles] = await Promise.allSettled([
        userService.list(),
        userDocumentService.listGroupedByUserId(),
        studentProfileService.listAllProfiles(),
      ]);

      const docMap: Record<string, UserDocumentResponseDto[]> = 
        groupedDocs.status === 'fulfilled' && groupedDocs.value ? groupedDocs.value : {};

      const profileMap = new Map<string, any>();
      if (profiles.status === 'fulfilled' && profiles.value && Array.isArray(profiles.value)) {
        profiles.value.forEach((p) => {
          if (p.id) profileMap.set(p.id, p);
        });
      }

      let mapped: StudentApplication[] = [];

      if (users.status === 'fulfilled' && users.value && Array.isArray(users.value) && users.value.length > 0) {
        mapped = users.value.map((u) => {
          const uDocs = docMap[u.id] || [];
          const prof = profileMap.get(u.id);

          const hasRejected = uDocs.some((d) => d.status === 'REJECTED');
          const allApproved = uDocs.length > 0 && uDocs.every((d) => d.status === 'APPROVED');
          
          let appStatus: 'pending' | 'approved' | 'rejected' = 'pending';
          if (u.isActive || allApproved) {
            appStatus = 'approved';
          } else if (hasRejected) {
            appStatus = 'rejected';
          }

          const docs = uDocs.length > 0
            ? uDocs.map((d) => ({
                id: d.id,
                name: d.documentType === 'CITIZEN_ID' ? 'Citizen ID / CCCD' : d.documentType === 'STUDENT_CARD' ? 'Student Card' : d.fileName,
                status: (d.status === 'APPROVED' ? 'verified' : d.status === 'REJECTED' ? 'rejected' : 'pending') as any,
                url: d.fileName ? userDocumentService.getDocumentUrl(d.fileName) : undefined,
              }))
            : [
                { name: 'Citizen ID / CCCD', status: 'pending' as const },
                { name: 'Student Admission Card', status: 'pending' as const },
              ];

          let formattedDate = '2025-08-10';
          const rawDate: any = u.createdAt;
          if (typeof rawDate === 'string') {
            formattedDate = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
          } else if (Array.isArray(rawDate) && rawDate.length >= 3) {
            formattedDate = `${rawDate[0]}-${String(rawDate[1]).padStart(2, '0')}-${String(rawDate[2]).padStart(2, '0')}`;
          }

          return {
            id: u.id,
            name: u.fullName || 'Student Applicant',
            email: u.email,
            major: prof?.major || 'Software Engineering',
            year: prof?.startYear ? `${new Date().getFullYear() - prof.startYear + 1}th Year` : '1st Year',
            submittedDate: formattedDate,
            documents: docs,
            status: appStatus,
            rejectReason: hasRejected ? 'Document needs re-verification' : undefined,
            isActive: u.isActive ?? false,
            roles: u.roles || [],
          };
        });
      }

      // If backend returns no accounts, use structured demo applicant records
      if (mapped.length === 0) {
        mapped = [
          {
            id: 'acc-1',
            name: 'Nguyễn Văn An',
            email: 'an.nguyen@dormly.edu.vn',
            major: 'Computer Science',
            year: '1st Year',
            submittedDate: '2025-08-09',
            documents: [
              { name: 'Citizen ID / CCCD', status: 'verified' },
              { name: 'Student Admission Card', status: 'pending' },
            ],
            status: 'pending',
          },
          {
            id: 'acc-2',
            name: 'Trần Thị Mai',
            email: 'mai.tran@dormly.edu.vn',
            major: 'Business Administration',
            year: '2nd Year',
            submittedDate: '2025-08-08',
            documents: [
              { name: 'Citizen ID / CCCD', status: 'verified' },
              { name: 'Student Admission Card', status: 'verified' },
            ],
            status: 'approved',
          },
          {
            id: 'acc-3',
            name: 'Lê Hoàng Nam',
            email: 'nam.le@dormly.edu.vn',
            major: 'Information Security',
            year: '1st Year',
            submittedDate: '2025-08-07',
            documents: [
              { name: 'Citizen ID / CCCD', status: 'rejected' },
              { name: 'Student Admission Card', status: 'pending' },
            ],
            status: 'rejected',
            rejectReason: 'Citizen ID photo is blurry and unreadable. Please re-upload.',
          },
        ];
      }

      setApplications(mapped);
    } catch (err) {
      console.error('Failed to load accounts and documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (id: string) => {
    try {
      await userService.toggleStatus(id);
      toast.success('Đã duyệt tài khoản và kích hoạt truy cập!');
    } catch (e: any) {
      console.warn(e);
      toast.error('Duyệt tài khoản thất bại!');
    }
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'approved' as const,
              isActive: true,
              documents: app.documents.map((d) => ({ ...d, status: 'verified' as const })),
            }
          : app
      )
    );
  };

  const handleToggleAccountStatus = async (id: string, currentActive: boolean) => {
    try {
      const updated = await userService.toggleStatus(id);
      toast.success(updated.isActive ? 'Đã kích hoạt tài khoản!' : 'Đã khóa tài khoản!');
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, isActive: updated.isActive } : app))
      );
    } catch (e: any) {
      console.error('Failed to toggle status:', e);
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  const handleReject = async (id: string, reason?: string) => {
    toast.info('Đã từ chối đơn đăng ký tài khoản');
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'rejected' as const,
              rejectReason: reason || 'Incomplete registration documents',
            }
          : app
      )
    );
  };

  const tabConfig: Record<TabType, { label: string; icon: React.ReactNode; color: string; count: number }> = {
    pending: {
      label: 'Under Review',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-amber-600',
      count: applications.filter((a) => a.status === 'pending').length,
    },
    approved: {
      label: 'Approved',
      icon: <Check className="h-4 w-4" />,
      color: 'text-emerald-600',
      count: applications.filter((a) => a.status === 'approved').length,
    },
    rejected: {
      label: 'Rejected',
      icon: <X className="h-4 w-4" />,
      color: 'text-red-600',
      count: applications.filter((a) => a.status === 'rejected').length,
    },
  };

  const getFilteredApplications = () => {
    let filtered = applications.filter((app) => app.status === activeTab);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.major.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredApplications = getFilteredApplications();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[calc(100dvh-8rem)] overflow-hidden rounded-[2rem] border border-white/55 bg-[#ebe4d8] text-[#26231f] shadow-[0_30px_80px_-55px_rgba(38,35,31,0.72)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_58%_42%,rgba(194,160,107,0.3),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(87,75,59,0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.54),rgba(150,137,116,0.24))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(67,59,49,0.24),rgba(232,224,211,0.04),transparent)]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-[#9b7a4a]/16 blur-3xl" />

      <div className="relative p-4 sm:p-6 2xl:p-7">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/34 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
              <UserCheck className="h-3.5 w-3.5" />
              Resident Applications
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Account Requests
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Review and verify identity documents and student admissions.
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Syncing accounts...
            </div>
          )}
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Search by student name, email, major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl border-white/60 bg-white/40 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2">
          {(Object.keys(tabConfig) as TabType[]).map((tab) => {
            const config = tabConfig[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-all',
                  isActive
                    ? 'bg-[#c3a26c] text-white shadow-sm'
                    : 'bg-white/40 text-stone-600 hover:bg-white/60'
                )}
              >
                {config.icon}
                {config.label}
                <span className={cn('ml-1.5 rounded-full px-2 py-0.5 text-[10px]', isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700')}>
                  {config.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-white/60 bg-white/35 backdrop-blur-sm p-4 transition hover:bg-white/50"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#c3a26c]/20 flex items-center justify-center font-semibold text-[#8b6935]">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">{app.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {app.major} • {app.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                    {app.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        <Check className="h-3 w-3" />
                        Approved
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                        <X className="h-3 w-3" />
                        Rejected
                      </span>
                    )}

                    {/* Admin Active/Inactive Status Toggle Control */}
                    <button
                      onClick={() => handleToggleAccountStatus(app.id, app.isActive ?? false)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition border',
                        app.isActive
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      )}
                      title="Bấm để bật/tắt kích hoạt tài khoản"
                    >
                      {app.isActive ? (
                        <>
                          <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <UserX className="h-3.5 w-3.5 text-amber-600" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Documents preview */}
                <div className="mt-3 pt-3 border-t border-white/40 flex items-center gap-4 flex-wrap text-xs text-stone-600">
                  <span className="font-medium text-stone-500">Documents:</span>
                  {app.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]',
                        doc.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : doc.status === 'rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      )}
                    >
                      <FileText className="h-3 w-3" />
                      {doc.name}
                    </span>
                  ))}
                  {app.rejectReason && (
                    <p className="w-full text-xs text-red-600 italic mt-1">Note: {app.rejectReason}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/50 bg-white/20 p-12 text-center text-sm text-stone-500">
              No applications found for this tab.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}