// app/(student)/home/_components/request-updates.tsx
"use client";

import { ArrowRight, Wrench, MessageSquare, Home, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface RequestUpdate {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "approved" | "rejected";
  type: "maintenance" | "complaint" | "transfer";
  updatedAt: string;
}

const requestUpdates: RequestUpdate[] = [
  {
    id: "1",
    title: "Air conditioner inspection",
    status: "in_progress",
    type: "maintenance",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Room transfer request",
    status: "approved",
    type: "transfer",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Noise complaint - Room A305",
    status: "pending",
    type: "complaint",
    updatedAt: "Yesterday",
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-500 text-white" },
  in_progress: { label: "In Progress", color: "bg-sky-500 text-white" },
  completed: { label: "Completed", color: "bg-emerald-500 text-white" },
  approved: { label: "Approved", color: "bg-emerald-500 text-white" },
  rejected: { label: "Rejected", color: "bg-red-500 text-white" },
};

const typeConfig = {
  maintenance: { icon: Wrench, label: "Maintenance" },
  complaint: { icon: MessageSquare, label: "Complaint" },
  transfer: { icon: Home, label: "Transfer" },
};

export function RequestUpdates() {
  const pendingCount = requestUpdates.filter(r => r.status === "pending" || r.status === "in_progress").length;

  return (
    <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-800">
            My Requests
          </p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              Recent updates
            </h2>
            {pendingCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
          </div>
        </div>
        {/* View all - chuyển đến trang /student/requests */}
        <Link
          href="/student/requests"
          className="inline-flex items-center gap-2 rounded-full border border-stone-400 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100 active:scale-[0.98]"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {requestUpdates.map((request, idx) => {
          const status = statusConfig[request.status];
          const type = typeConfig[request.type];
          const TypeIcon = type.icon;

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group rounded-xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stone-100">
                    <TypeIcon className="h-4 w-4 text-stone-600" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-stone-900">
                        {request.title}
                      </h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                      <Clock className="h-3 w-3" />
                      Updated {request.updatedAt}
                    </div>
                  </div>
                </div>
                
                {/* Status indicator */}
                {request.status === "pending" && (
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                )}
                {request.status === "in_progress" && (
                  <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}