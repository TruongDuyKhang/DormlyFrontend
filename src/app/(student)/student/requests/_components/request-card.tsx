"use client";

import { Calendar, Wrench, Building2, Users, ShieldAlert, Receipt, HelpCircle, Flag } from "lucide-react";
import { motion } from "framer-motion";
import type { TicketSummary } from "../types/ticket";

interface RequestCardProps {
  ticket: TicketSummary;
  onClick: () => void;
}

const statusConfig: Record<TicketSummary["status"], { label: string; color: string }> = {
  OPEN: { label: "Open", color: "bg-amber-500 text-white" },
  IN_PROGRESS: { label: "In Progress", color: "bg-sky-600 text-white" },
  RESOLVED: { label: "Resolved", color: "bg-emerald-600 text-white" },
  REJECTED: { label: "Rejected", color: "bg-red-600 text-white" },
  CLOSED: { label: "Closed", color: "bg-stone-500 text-white" },
};

const priorityConfig: Record<TicketSummary["priority"], { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-stone-500" },
  MEDIUM: { label: "Medium", color: "text-sky-600" },
  HIGH: { label: "High", color: "text-amber-600" },
  URGENT: { label: "Urgent", color: "text-red-600" },
};

const categoryConfig: Record<TicketSummary["category"], { label: string; icon: any; color: string }> = {
  MAINTENANCE: { label: "Maintenance", icon: Wrench, color: "bg-sky-600 text-white" },
  FACILITY: { label: "Facility", icon: Building2, color: "bg-teal-600 text-white" },
  ROOMMATE: { label: "Roommate", icon: Users, color: "bg-amber-600 text-white" },
  SECURITY: { label: "Security", icon: ShieldAlert, color: "bg-red-600 text-white" },
  BILLING: { label: "Billing", icon: Receipt, color: "bg-violet-600 text-white" },
  OTHER: { label: "Other", icon: HelpCircle, color: "bg-stone-500 text-white" },
};

function isOverdue(ticket: TicketSummary) {
  if (!ticket.dueDate) return false;
  const isOpenWork = ticket.status === "OPEN" || ticket.status === "IN_PROGRESS";
  return isOpenWork && new Date(ticket.dueDate) < new Date(new Date().toDateString());
}

export function RequestCard({ ticket, onClick }: RequestCardProps) {
  const status = statusConfig[ticket.status];
  const category = categoryConfig[ticket.category];
  const priority = priorityConfig[ticket.priority];
  const CategoryIcon = category.icon;
  const overdue = isOverdue(ticket);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-stone-200/70 bg-white p-4 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${category.color}`}>
              <CategoryIcon className="h-3 w-3" />
              {category.label}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
            {overdue && (
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                Overdue
              </span>
            )}
          </div>
          <h3 className="mt-2 font-semibold text-stone-900 group-hover:text-[#9d7443] transition">
            {ticket.title}
          </h3>
          <p className="mt-1 text-xs text-stone-400">{ticket.code}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={`flex items-center gap-1 text-xs font-medium ${priority.color}`}>
            <Flag className="h-3 w-3" />
            {priority.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-stone-400">
            <Calendar className="h-3 w-3" />
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
          {ticket.assignees.length > 0 && (
            <span className="text-xs text-stone-400">
              {ticket.assignees.map((a) => a.fullName).join(", ")}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}