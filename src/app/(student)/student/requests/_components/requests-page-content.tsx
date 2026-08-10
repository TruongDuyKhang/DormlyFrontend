// app/requests/_components/requests-page-content.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { RequestCard } from "./request-card";
import { RequestFilters } from "./request-filters";
import { CreateRequestModal } from "./create-request-modal";
import { RequestDetailModal } from "./request-detail-modal";
import { useTickets } from "../hooks/useTickets";
import { useTicketDetail } from "../hooks/useTicketDetail";
import type { TabType, TicketStatus } from "../types/ticket";

const getStatusGroup = (status: TicketStatus): TabType => {
  if (status === "OPEN") return "open";
  if (status === "IN_PROGRESS") return "in_progress";
  return "completed"; // RESOLVED, REJECTED, CLOSED
};

export function RequestsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { tickets, loading, error, createTicket } = useTickets();
  const {
    ticket: selectedTicket,
    loading: isDetailLoading,
    addComment,
  } = useTicketDetail(selectedTicketId);

  // Đọc ticketId từ URL khi vào trang (deep-link từ Home)
  useEffect(() => {
    const ticketIdFromUrl = searchParams.get("ticketId");
    if (ticketIdFromUrl) {
      setSelectedTicketId(ticketIdFromUrl);
    }
  }, [searchParams]);

  const handleCloseDetail = () => {
    setSelectedTicketId(null);
    router.replace("/student/requests");
  };

  const tabCounts = useMemo(
    () =>
      tickets.reduce(
        (acc, t) => {
          acc[getStatusGroup(t.status)]++;
          return acc;
        },
        { open: 0, in_progress: 0, completed: 0 } as Record<TabType, number>,
      ),
    [tickets],
  );

  const filteredTickets = tickets
    .filter((t) => getStatusGroup(t.status) === activeTab)
    .filter((t) => activeCategory === "all" || t.category === activeCategory)
    .filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const emptyMessages: Record<TabType, { title: string; description: string }> =
    {
      open: {
        title: "No Open Requests",
        description: "You currently have no open requests.",
      },
      in_progress: {
        title: "No Requests In Progress",
        description: "Your requests are not being processed at the moment.",
      },
      completed: {
        title: "No Completed Requests",
        description:
          "Your resolved, rejected, or closed requests will appear here.",
      },
    };

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Student Services
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            My Requests
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Track your maintenance, facility, and support tickets
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2f2a24] px-5 text-sm font-medium text-white transition hover:bg-[#40382f] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Request
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <RequestFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            tabCounts={tabCounts}
          />
        </aside>

        <div className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center rounded-2xl border border-stone-200 bg-white p-12">
              <p className="text-sm text-stone-400">Loading your requests...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <svg
                  className="h-8 w-8 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900">
                {emptyMessages[activeTab].title}
              </h3>
              <p className="mt-2 text-stone-500">
                {emptyMessages[activeTab].description}
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <RequestCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => setSelectedTicketId(ticket.id)}
              />
            ))
          )}
        </div>
      </div>

      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createTicket}
      />

      <RequestDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicketId}
        isLoading={isDetailLoading}
        onClose={handleCloseDetail}
        onAddComment={(body, files) => addComment({ body }, files)}
      />
    </div>
  );
}