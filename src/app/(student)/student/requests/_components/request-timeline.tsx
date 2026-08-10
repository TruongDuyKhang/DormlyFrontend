"use client";

import { CheckCircle2, Circle, XCircle } from "lucide-react";
import type { TicketDetail } from "../types/ticket";

interface RequestTimelineProps {
  ticket: TicketDetail;
}

export function RequestTimeline({ ticket }: RequestTimelineProps) {
  const settled = ["RESOLVED", "CLOSED", "REJECTED"].includes(ticket.status);

  const steps = [
    { key: "created", title: "Request Submitted", date: ticket.createdAt as string | null, active: true },
    {
      key: "progress",
      title: "In Progress",
      date: null as string | null,
      active: ["IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].includes(ticket.status),
    },
    settled
      ? {
          key: "resolved",
          title: ticket.status === "REJECTED" ? "Rejected" : "Resolved",
          date: ticket.resolvedAt,
          active: true,
          note: ticket.resolutionNote,
          rejected: ticket.status === "REJECTED",
        }
      : null,
    ticket.status === "CLOSED"
      ? { key: "closed", title: "Closed", date: ticket.closedAt, active: true }
      : null,
  ].filter(Boolean) as {
    key: string;
    title: string;
    date: string | null;
    active: boolean;
    note?: string | null;
    rejected?: boolean;
  }[];

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-200" />
      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div key={step.key} className="relative flex gap-4">
            <div
              className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white border-2 ${
                step.rejected ? "border-red-500" : "border-[#9d7443]"
              }`}
            >
              {step.rejected ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : idx === steps.length - 1 ? (
                <CheckCircle2 className="h-4 w-4 text-[#9d7443]" />
              ) : (
                <Circle className="h-4 w-4 text-[#9d7443]" fill="#9d7443" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-stone-900">{step.title}</p>
              {step.date && <p className="mt-1 text-xs text-stone-500">{new Date(step.date).toLocaleString()}</p>}
              {step.note && <p className="mt-2 text-sm text-stone-600">{step.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}