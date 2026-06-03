// app/(student)/community/polls/page.tsx
"use client";

import { useState } from "react";
import { BarChart2, Filter, Calendar, Plus } from "lucide-react";
import { CommunityTabs } from "../_components/community-tabs";
import { PollCard } from "../_components/poll-card";
import { PollDetailModal } from "../_components/poll-detail-modal";
import { CreatePollModal } from "../_components/create-poll-modal";
import type { Poll, PollCategory, CreatePollData } from "../_components/types";

// Mock data - will be replaced with real API
const mockPolls: Poll[] = [
  {
    id: "1",
    title: "Football Match This Weekend?",
    description: "We're planning a friendly football match between dormitories. When would be the best time?",
    options: [
      { id: "1a", text: "Saturday Morning (8:00 AM - 11:00 AM)", votes: 12 },
      { id: "1b", text: "Saturday Evening (3:00 PM - 6:00 PM)", votes: 8 },
      { id: "1c", text: "Sunday Morning (8:00 AM - 11:00 AM)", votes: 6 },
      { id: "1d", text: "Sunday Evening (3:00 PM - 6:00 PM)", votes: 4 },
    ],
    totalVotes: 30,
    status: "active",
    createdAt: "2024-08-10",
    endsAt: "2024-08-20",
    createdBy: "Sports Club",
    createdByRole: "student_club",
    category: "event",
    userVoted: "1b",
    recentVoters: [
      { name: "Nguyen Van A", avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=9d7443&color=fff" },
      { name: "Tran Thi B", avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=9d7443&color=fff" },
      { name: "Le Van C", avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=9d7443&color=fff" },
    ],
  },
  {
    id: "2",
    title: "What activity should we organize next?",
    description: "Help us decide the next community event!",
    options: [
      { id: "2a", text: "Football Tournament", votes: 24 },
      { id: "2b", text: "Movie Night", votes: 18 },
      { id: "2c", text: "Board Game Night", votes: 12 },
      { id: "2d", text: "Music Event", votes: 8 },
    ],
    totalVotes: 62,
    status: "active",
    createdAt: "2024-08-05",
    endsAt: "2024-08-25",
    createdBy: "Residence Office",
    createdByRole: "admin",
    category: "activity",
    recentVoters: [
      { name: "Pham Van D", avatar: "https://ui-avatars.com/api/?name=Pham+Van+D&background=9d7443&color=fff" },
      { name: "Hoang Thi E", avatar: "https://ui-avatars.com/api/?name=Hoang+Thi+E&background=9d7443&color=fff" },
    ],
  },
  {
    id: "3",
    title: "Should Block A extend quiet hours during exams?",
    description: "Current quiet hours: 10:00 PM - 6:00 AM. Proposed: 9:00 PM - 7:00 AM.",
    options: [
      { id: "3a", text: "Yes, extend quiet hours during exams", votes: 45 },
      { id: "3b", text: "No, keep current hours", votes: 18 },
    ],
    totalVotes: 63,
    status: "active",
    createdAt: "2024-08-01",
    endsAt: "2024-08-15",
    createdBy: "Student Council",
    createdByRole: "student_club",
    category: "policy",
    recentVoters: [
      { name: "Nguyen Van A", avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=9d7443&color=fff" },
      { name: "Tran Thi B", avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=9d7443&color=fff" },
    ],
  },
  {
    id: "4",
    title: "Weekly cleaning schedule preference",
    description: "What day works best for the weekly room cleaning?",
    options: [
      { id: "4a", text: "Monday", votes: 15 },
      { id: "4b", text: "Wednesday", votes: 28 },
      { id: "4c", text: "Friday", votes: 22 },
    ],
    totalVotes: 65,
    status: "closed",
    createdAt: "2024-07-20",
    endsAt: "2024-07-27",
    createdBy: "Residence Office",
    createdByRole: "admin",
    category: "facility",
  },
];

export default function PollsPage() {
  const [polls, setPolls] = useState(mockPolls);
  const [filter, setFilter] = useState<"active" | "closed">("active");
  const [categoryFilter, setCategoryFilter] = useState<PollCategory | "all">("all");
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPolls = polls
    .filter((poll) => poll.status === filter)
    .filter((poll) => categoryFilter === "all" || poll.category === categoryFilter);

  // Cập nhật handleVote để nhận mảng optionIds (hỗ trợ multi-select)
  const handleVote = (pollId: string, optionIds: string[]) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId && !poll.userVoted) {
          // Cập nhật votes cho tất cả các option được chọn
          const updatedOptions = poll.options.map((opt) => {
            if (optionIds.includes(opt.id)) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + optionIds.length,
            userVoted: optionIds.join(','), // Lưu dưới dạng string phân cách bằng dấu phẩy
          };
        }
        return poll;
      })
    );
  };

  const handleCreatePoll = (data: CreatePollData) => {
    const newPoll: Poll = {
      id: `poll_${Date.now()}`,
      title: data.title,
      description: data.description,
      options: data.options.map((text, idx) => ({
        id: `${Date.now()}_${idx}`,
        text,
        votes: 0,
      })),
      totalVotes: 0,
      status: "active",
      category: data.category,
      createdAt: new Date().toISOString(),
      endsAt: data.endsAt,
      createdBy: "You",
      createdByRole: "student_club",
      recentVoters: [],
    };
    setPolls([newPoll, ...polls]);
  };

  const categoryLabels: { value: PollCategory | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "event", label: "Event Planning" },
    { value: "facility", label: "Facility" },
    { value: "policy", label: "Policy" },
    { value: "activity", label: "Activity" },
    { value: "other", label: "General" },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Community
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            Polls
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Share your opinion and help shape our community decisions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CommunityTabs />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2f2a24] px-5 text-sm font-medium text-white transition hover:bg-[#40382f] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Poll
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setFilter("active")}
          className={`relative px-4 py-2 text-sm font-medium transition ${
            filter === "active" ? "text-[#9d7443]" : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Active Polls
          <span className="ml-1.5 text-xs text-stone-400">
            ({polls.filter(p => p.status === "active").length})
          </span>
          {filter === "active" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9d7443]" />}
        </button>
        <button
          onClick={() => setFilter("closed")}
          className={`relative px-4 py-2 text-sm font-medium transition ${
            filter === "closed" ? "text-[#9d7443]" : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Closed Polls
          <span className="ml-1.5 text-xs text-stone-400">
            ({polls.filter(p => p.status === "closed").length})
          </span>
          {filter === "closed" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9d7443]" />}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-stone-400" />
        <span className="text-sm text-stone-500">Filter by:</span>
        {categoryLabels.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              categoryFilter === cat.value
                ? "bg-[#2f2a24] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Polls Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {filteredPolls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onVote={handleVote}
            onClick={() => setSelectedPoll(poll)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredPolls.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <BarChart2 className="h-8 w-8 text-stone-400" />
          </div>
          <h3 className="text-xl font-semibold text-stone-900">No polls available</h3>
          <p className="mt-2 text-stone-500">
            {filter === "active" 
              ? "There are no active polls at the moment." 
              : "No closed polls to display."}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2f2a24] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#40382f]"
          >
            <Plus className="h-4 w-4" />
            Create the first poll
          </button>
        </div>
      )}

      {/* Modals */}
      <PollDetailModal
        poll={selectedPoll}
        isOpen={!!selectedPoll}
        onClose={() => setSelectedPoll(null)}
        onVote={handleVote}
      />

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePoll}
      />
    </div>
  );
}