// app/(student)/community/feed/page.tsx
"use client";

import { useState } from "react";
import { CommunityTabs } from "../_components/community-tabs";
import { FeedCard } from "../_components/feed-card";
import type { FeedPost } from "../_components/types";

const mockFeed: FeedPost[] = [
  {
    id: "1",
    type: "news",
    title: "Block B Maintenance Completed",
    description: "The elevator maintenance in Block B has been successfully completed. All elevators are now operational. Thank you for your patience.",
    imageUrl: "https://picsum.photos/seed/maintenance/800/400",
    date: "2 hours ago",
    author: "Residence Office",
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    type: "school",
    title: "Career Fair Next Week",
    description: "Join the annual Career Fair with over 50 companies. Prepare your CV and come meet potential employers.",
    imageUrl: "https://picsum.photos/seed/career/800/400",
    date: "Yesterday",
    author: "Student Affairs",
    likes: 56,
    comments: 12,
  },
  {
    id: "3",
    type: "community",
    title: "Football Tournament Registration Open",
    description: "Register your team for the annual Dorm Football Tournament. Prize: 5,000,000 VND for the winning team.",
    imageUrl: "https://picsum.photos/seed/football/800/400",
    date: "2 days ago",
    author: "Sports Club",
    likes: 89,
    comments: 23,
  },
  {
    id: "4",
    type: "news",
    title: "New Study Area Opened",
    description: "A new 24/7 study area is now available on Floor 2, Block A. Equipped with 30 seats, power outlets, and free WiFi.",
    imageUrl: "https://picsum.photos/seed/study/800/400",
    date: "3 days ago",
    author: "Residence Office",
    likes: 67,
    comments: 8,
  },
  {
    id: "5",
    type: "school",
    title: "Scholarship Applications Open",
    description: "Applications for the Merit Scholarship are now open. Deadline: September 30, 2024.",
    imageUrl: "https://picsum.photos/seed/scholarship/800/400",
    date: "4 days ago",
    author: "Academic Office",
    likes: 112,
    comments: 34,
  },
  {
    id: "6",
    type: "community",
    title: "Volunteer Program This Weekend",
    description: "Join us for a community cleanup event. Free lunch and certificate provided.",
    imageUrl: "https://picsum.photos/seed/volunteer/800/400",
    date: "5 days ago",
    author: "Volunteer Club",
    likes: 45,
    comments: 11,
  },
];

export default function FeedPage() {
  const [feed, setFeed] = useState(mockFeed);
  const [filter, setFilter] = useState<"all" | "news" | "school" | "community">("all");

  const filteredFeed = filter === "all" ? feed : feed.filter((post) => post.type === filter);

  // Count for each category
  const counts = {
    all: feed.length,
    news: feed.filter((p) => p.type === "news").length,
    school: feed.filter((p) => p.type === "school").length,
    community: feed.filter((p) => p.type === "community").length,
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Community
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            Feed
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Stay updated with dormitory news, school announcements, and community activities
          </p>
        </div>
        <CommunityTabs />
      </div>

      {/* Category Filters - Màu trung tính, không đậm */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-[#2f2a24] text-white shadow-md"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All
          <span className="ml-1.5 text-xs opacity-70">({counts.all})</span>
        </button>
        <button
          onClick={() => setFilter("news")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            filter === "news"
              ? "bg-[#2f2a24] text-white shadow-md"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          Dormitory News
          <span className="ml-1.5 text-xs opacity-70">({counts.news})</span>
        </button>
        <button
          onClick={() => setFilter("school")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            filter === "school"
              ? "bg-[#2f2a24] text-white shadow-md"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          School News
          <span className="ml-1.5 text-xs opacity-70">({counts.school})</span>
        </button>
        <button
          onClick={() => setFilter("community")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            filter === "community"
              ? "bg-[#2f2a24] text-white shadow-md"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          Community
          <span className="ml-1.5 text-xs opacity-70">({counts.community})</span>
        </button>
      </div>

      {/* Feed List - 2 cột */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredFeed.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {filteredFeed.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <svg className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-stone-900">No posts found</h3>
          <p className="mt-2 text-stone-500">No posts available in this category.</p>
        </div>
      )}
    </div>
  );
}