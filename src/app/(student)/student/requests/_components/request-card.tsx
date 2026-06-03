// app/(student)/requests/_components/request-card.tsx
"use client";

import { Calendar, Clock, MapPin, Wrench, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Request } from "./types";

interface RequestCardProps {
  request: Request;
  onClick: () => void;
}

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-amber-500 text-white" },
  assigned: { label: "Assigned", color: "bg-blue-600 text-white" },
  in_progress: { label: "In Progress", color: "bg-sky-600 text-white" },
  resolved: { label: "Resolved", color: "bg-emerald-600 text-white" },
  rejected: { label: "Rejected", color: "bg-red-600 text-white" },
  approved: { label: "Approved", color: "bg-emerald-600 text-white" },
};

const categoryConfig = {
  maintenance: { label: "Maintenance", icon: Wrench, color: "bg-sky-600 text-white" },
  complaint: { label: "Complaint", icon: MessageSquare, color: "bg-amber-600 text-white" },
  transfer: { label: "Transfer Request", icon: ArrowRight, color: "bg-emerald-600 text-white" },
};

export function RequestCard({ request, onClick }: RequestCardProps) {
  const status = statusConfig[request.status];
  const category = categoryConfig[request.category];
  const CategoryIcon = category.icon;

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
          </div>
          <h3 className="mt-2 font-semibold text-stone-900 group-hover:text-[#9d7443] transition">
            {request.title}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {request.location}
            </span>
          </div>
          <p className="mt-2 text-sm text-stone-500 line-clamp-2">
            {request.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(request.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {request.updatedAt}
            </span>
          </div>
          {request.attachments.length > 0 && (
            <span className="text-xs text-stone-400">
              📎 {request.attachments.length} attachment(s)
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}