// app/(student)/home/_components/request-updates.tsx
"use client";

import { ArrowRight, Wrench, MessageSquare, Home, Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface RequestUpdate {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "approved" | "rejected";
  type: "maintenance" | "complaint" | "transfer";
  updatedAt: string;
  description?: string;
}

const requestUpdates: RequestUpdate[] = [
  {
    id: "1",
    title: "Air conditioner inspection",
    description: "The AC unit is not cooling properly. Technician has been assigned.",
    status: "in_progress",
    type: "maintenance",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Room transfer request",
    description: "Request to move to a quieter floor due to noise issues.",
    status: "approved",
    type: "transfer",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Noise complaint - Room A305",
    description: "Loud music after 11 PM from neighboring room.",
    status: "pending",
    type: "complaint",
    updatedAt: "Yesterday",
  },
];

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-amber-500 text-white", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-sky-500 text-white", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-emerald-500 text-white", icon: CheckCircle },
  approved: { label: "Approved", color: "bg-emerald-500 text-white", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500 text-white", icon: AlertCircle },
};

const typeConfig = {
  maintenance: { icon: Wrench, label: "Maintenance", bg: "bg-sky-100 text-sky-700" },
  complaint: { icon: MessageSquare, label: "Complaint", bg: "bg-amber-100 text-amber-700" },
  transfer: { icon: Home, label: "Transfer", bg: "bg-emerald-100 text-emerald-700" },
};

export function RequestUpdates() {
  const pendingCount = requestUpdates.filter(r => r.status === "pending" || r.status === "in_progress").length;

  return (
    <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-md sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
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
          <p className="text-sm text-stone-500 mt-1">
            Track your maintenance tickets, complaints, and transfer requests
          </p>
        </div>
        <Link
          href="/student/requests"
          className="inline-flex items-center gap-2 rounded-full border border-stone-400 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100 active:scale-[0.98]"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Request List - Full chiều dài */}
      <div className="space-y-4">
        {requestUpdates.map((request, idx) => {
          const status = statusConfig[request.status];
          const type = typeConfig[request.type];
          const TypeIcon = type.icon;
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group rounded-xl border border-stone-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                {/* Header row with type and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${type.bg}`}>
                      <TypeIcon className="h-3 w-3" />
                      {type.label}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Clock className="h-3 w-3" />
                    Updated {request.updatedAt}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-stone-900">
                  {request.title}
                </h3>

                {/* Description */}
                {request.description && (
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {request.description}
                  </p>
                )}

                {/* Progress indicator for in_progress status */}
                {request.status === "in_progress" && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span>Progress</span>
                      <span>68%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full w-[68%] rounded-full bg-sky-500" />
                    </div>
                  </div>
                )}

                {/* Action button */}
                <Link
                  href={`/student/requests/${request.id}`}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200 active:scale-[0.98]"
                >
                  View details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create new request button */}
      <div className="mt-6 pt-4 border-t border-stone-200">
        <Link
          href="/student/requests"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2f2a24] py-3 text-sm font-semibold text-white transition hover:bg-[#40382f] active:scale-[0.98]"
        >
          <span>➕</span>
          Create new request
        </Link>
      </div>
    </div>
  );
}