"use client";

import {
  ArrowRight,
  Wrench,
  Building2,
  Users,
  ShieldAlert,
  Receipt,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRecentTickets } from "../hooks/useRecentTickets";
import type { TicketCategory, TicketStatus } from "../types/ticket";

const statusConfig: Record<TicketStatus, { label: string; color: string; icon: any }> = {
  OPEN: { label: "Open", color: "bg-amber-500 text-white", icon: Clock },
  IN_PROGRESS: { label: "In Progress", color: "bg-sky-500 text-white", icon: AlertCircle },
  RESOLVED: { label: "Resolved", color: "bg-emerald-500 text-white", icon: CheckCircle },
  REJECTED: { label: "Rejected", color: "bg-red-500 text-white", icon: XCircle },
  CLOSED: { label: "Closed", color: "bg-stone-500 text-white", icon: CheckCircle },
};

const categoryConfig: Record<TicketCategory, { icon: any; label: string; bg: string }> = {
  MAINTENANCE: { icon: Wrench, label: "Maintenance", bg: "bg-sky-100 text-sky-700" },
  FACILITY: { icon: Building2, label: "Facility", bg: "bg-teal-100 text-teal-700" },
  ROOMMATE: { icon: Users, label: "Roommate", bg: "bg-amber-100 text-amber-700" },
  SECURITY: { icon: ShieldAlert, label: "Security", bg: "bg-red-100 text-red-700" },
  BILLING: { icon: Receipt, label: "Billing", bg: "bg-violet-100 text-violet-700" },
  OTHER: { icon: HelpCircle, label: "Other", bg: "bg-stone-100 text-stone-700" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-stone-500" },
  MEDIUM: { label: "Medium", color: "text-sky-600" },
  HIGH: { label: "High", color: "text-amber-600" },
  URGENT: { label: "Urgent", color: "text-red-600" },
};

function formatRelativeTime(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function RequestUpdates() {
  const { tickets, loading } = useRecentTickets(3);

  const activeCount = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;

  return (
    <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-md sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-800">My Requests</p>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">Recent updates</h2>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                {activeCount}
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Track your maintenance, facility, and support tickets
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10 text-stone-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && tickets.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 py-10 text-center">
          <p className="text-sm font-medium text-stone-600">No requests yet</p>
          <p className="mt-1 text-xs text-stone-400">Create a request to get help from staff</p>
        </div>
      )}

      {/* Request List */}
      {!loading && tickets.length > 0 && (
        <div className="space-y-4">
          {tickets.map((ticket, idx) => {
            const status = statusConfig[ticket.status];
            const category = categoryConfig[ticket.category];
            const priority = priorityConfig[ticket.priority];
            const CategoryIcon = category.icon;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${category.bg}`}>
                        <CategoryIcon className="h-3 w-3" />
                        {category.label}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                      <span className={`text-xs font-medium ${priority.color}`}>{priority.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(ticket.createdAt)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{ticket.title}</h3>
                    <p className="mt-1 text-xs text-stone-400">{ticket.code}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

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