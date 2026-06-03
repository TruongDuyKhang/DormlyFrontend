// app/(platform)/residents/accounts/page.tsx
'use client';

import { useState } from 'react';
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
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/_components/ui/input';

interface StudentApplication {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
  submittedDate: string;
  documents: { name: string; status: 'verified' | 'pending' }[];
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}

const applications: StudentApplication[] = [
  {
    id: '1',
    name: 'Nguyễn Hải Anh',
    email: 'anh.nguyen@student.edu',
    major: 'Computer Science',
    year: '3rd Year',
    submittedDate: '2024-10-15',
    documents: [
      { name: 'Government ID', status: 'verified' },
      { name: 'Student Certificate', status: 'verified' },
      { name: 'Health Declaration', status: 'verified' },
    ],
    status: 'approved',
  },
  {
    id: '2',
    name: 'Trần Minh Quân',
    email: 'quan.tran@student.edu',
    major: 'Business Administration',
    year: '2nd Year',
    submittedDate: '2024-10-18',
    documents: [
      { name: 'Government ID', status: 'verified' },
      { name: 'Student Certificate', status: 'pending' },
      { name: 'Health Declaration', status: 'verified' },
    ],
    status: 'pending',
  },
  {
    id: '3',
    name: 'Phạm Thúc Linh',
    email: 'linh.pham@student.edu',
    major: 'Engineering',
    year: '1st Year',
    submittedDate: '2024-10-16',
    documents: [
      { name: 'Government ID', status: 'verified' },
      { name: 'Student Certificate', status: 'verified' },
      { name: 'Health Declaration', status: 'verified' },
    ],
    status: 'approved',
  },
  {
    id: '4',
    name: 'Lê Thị Yên',
    email: 'yen.le@student.edu',
    major: 'Psychology',
    year: '4th Year',
    submittedDate: '2024-10-10',
    documents: [
      { name: 'Government ID', status: 'verified' },
      { name: 'Student Certificate', status: 'verified' },
      { name: 'Health Declaration', status: 'pending' },
    ],
    status: 'rejected',
    rejectReason: 'Incomplete health documentation — missing required medical records.',
  },
  {
    id: '5',
    name: 'Hoàng Văn Mạnh',
    email: 'manh.hoang@student.edu',
    major: 'Mathematics',
    year: '2nd Year',
    submittedDate: '2024-10-17',
    documents: [
      { name: 'Government ID', status: 'verified' },
      { name: 'Student Certificate', status: 'pending' },
      { name: 'Health Declaration', status: 'pending' },
    ],
    status: 'pending',
  },
  {
    id: '6',
    name: 'Võ Minh Khoa',
    email: 'khoa.vo@student.edu',
    major: 'Physics',
    year: '3rd Year',
    submittedDate: '2024-10-14',
    documents: [
      { name: 'Government ID', status: 'pending' },
      { name: 'Student Certificate', status: 'verified' },
      { name: 'Health Declaration', status: 'verified' },
    ],
    status: 'rejected',
    rejectReason: 'Government ID document has expired. Please submit a valid ID.',
  },
  {
    id: '7',
    name: 'Ngô Thị Hương',
    email: 'huong.ngo@student.edu',
    major: 'Biology',
    year: '1st Year',
    submittedDate: '2024-10-19',
    documents: [
      { name: 'Government ID', status: 'verified' },
      { name: 'Student Certificate', status: 'pending' },
      { name: 'Health Declaration', status: 'pending' },
    ],
    status: 'pending',
  },
  {
    id: '8',
    name: 'Bùi Văn Tú',
    email: 'tu.bui@student.edu',
    major: 'Economics',
    year: '4th Year',
    submittedDate: '2024-10-12',
    documents: [
      { name: 'Government ID', status: 'verified' },
      { name: 'Student Certificate', status: 'verified' },
      { name: 'Health Declaration', status: 'verified' },
    ],
    status: 'approved',
  },
];

type TabType = 'pending' | 'approved' | 'rejected';

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

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Filter applications based on search query
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

  // Handle search with button click
  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

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
              <FileText className="h-3.5 w-3.5" />
              Application Management
            </div>
            <h1 className="text-3xl font-semibold leading-[1.02] tracking-tight text-[#28241f] md:text-5xl">
              Student registrations
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Review, approve, or reject student applications.
            </p>
          </div>

          {/* Search with Button */}
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by name, email, or major"
                className="h-11 rounded-full border-white/55 bg-white/34 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] focus-visible:ring-stone-500/30"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isSearching}
              className="h-11 px-5 rounded-full bg-[#c3a26c] text-white font-medium text-sm shadow-sm hover:bg-[#b08f5a] transition flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-8 flex gap-3 rounded-[1.5rem] border border-white/55 bg-white/32 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {(Object.keys(tabConfig) as TabType[]).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setExpandedId(null);
              }}
              className="relative flex-1 rounded-lg px-4 py-3 font-medium text-sm transition-all duration-300"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg bg-white/56 shadow-[0_8px_24px_-12px_rgba(47,43,37,0.2)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span className={cn('transition-colors', activeTab === tab ? tabConfig[tab].color : 'text-stone-500')}>
                  {tabConfig[tab].icon}
                </span>
                <span className={cn('transition-colors', activeTab === tab ? 'text-stone-950' : 'text-stone-600')}>
                  {tabConfig[tab].label}
                </span>
                <span className={cn(
                  'ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  activeTab === tab ? 'bg-stone-950/10 text-stone-950' : 'bg-stone-950/5 text-stone-600'
                )}>
                  {tabConfig[tab].count}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Search Result Summary */}
        {searchQuery && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-stone-500">
              Found <span className="font-semibold text-stone-700">{filteredApplications.length}</span> results for "
              <span className="font-medium text-stone-800">{searchQuery}</span>"
            </p>
            <button
              onClick={clearSearch}
              className="text-xs text-stone-400 hover:text-stone-600 transition"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Applications List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${searchQuery}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app, idx) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.4 }}
                  className="overflow-hidden rounded-[1.5rem] border border-white/55 bg-white/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl transition-all duration-300 hover:border-white/70"
                >
                  <motion.button
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    className="w-full px-5 py-4 text-left transition-colors hover:bg-white/20"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-1 items-center gap-4 min-w-0">
                        <div className={cn(
                          'h-12 w-12 rounded-xl flex items-center justify-center font-semibold text-white shrink-0',
                          activeTab === 'pending' && 'bg-amber-500/80',
                          activeTab === 'approved' && 'bg-emerald-500/80',
                          activeTab === 'rejected' && 'bg-red-500/80'
                        )}>
                          {app.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold tracking-tight text-stone-950 truncate">{app.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                            <GraduationCap className="h-3 w-3" />
                            {app.major} • {app.year}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="hidden text-right md:block">
                          <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Submitted</p>
                          <p className="mt-1 font-mono text-sm font-semibold text-stone-950">
                            {new Date(app.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <motion.div animate={{ rotate: expandedId === app.id ? 90 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronRight className="h-5 w-5 text-stone-400" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedId === app.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="border-t border-white/30"
                      >
                        <div className="space-y-5 px-5 py-5">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Contact</p>
                            <div className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2.5">
                              <Mail className="h-4 w-4 text-stone-500" />
                              <a href={`mailto:${app.email}`} className="text-sm text-stone-700 hover:text-stone-900">
                                {app.email}
                              </a>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Documents</p>
                            <div className="space-y-2">
                              {app.documents.map((doc) => (
                                <div key={doc.name} className="flex items-center justify-between rounded-lg border border-white/40 bg-white/25 px-3 py-2.5">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-stone-500" />
                                    <span className="text-sm font-medium text-stone-950">{doc.name}</span>
                                  </div>
                                  <span className={cn(
                                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                                    doc.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                  )}>
                                    {doc.status === 'verified' ? 'Verified' : 'Pending'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {activeTab === 'rejected' && app.rejectReason && (
                            <div className="rounded-xl border border-red-200/60 bg-red-50/40 px-4 py-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Reason</p>
                              </div>
                              <p className="text-sm text-red-700">{app.rejectReason}</p>
                            </div>
                          )}

                          {activeTab === 'pending' && (
                            <div className="flex gap-3 pt-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                              >
                                <span className="flex items-center justify-center gap-2"><Check className="h-4 w-4" />Approve</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 rounded-xl border border-red-300 bg-white/40 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                              >
                                <span className="flex items-center justify-center gap-2"><X className="h-4 w-4" />Reject</span>
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div className="rounded-[1.5rem] border border-white/55 bg-white/32 px-5 py-16 text-center">
                <div className="mb-4 flex justify-center">
                  {activeTab === 'pending' && <Clock className="h-10 w-10 text-amber-400" />}
                  {activeTab === 'approved' && <Check className="h-10 w-10 text-emerald-500" />}
                  {activeTab === 'rejected' && <X className="h-10 w-10 text-red-500" />}
                </div>
                <p className="text-sm font-medium text-stone-600">
                  {searchQuery 
                    ? `No ${activeTab} applications matching "${searchQuery}"`
                    : activeTab === 'pending' && 'No pending applications'
                  }
                  {!searchQuery && activeTab === 'approved' && 'No approved applications'}
                  {!searchQuery && activeTab === 'rejected' && 'No rejected applications'}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-3 text-xs text-[#c3a26c] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}