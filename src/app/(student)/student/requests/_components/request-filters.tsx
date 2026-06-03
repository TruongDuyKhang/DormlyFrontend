// app/(student)/requests/_components/request-filters.tsx
"use client";

import { Search, Wrench, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestFiltersProps {
  activeTab: "open" | "in_progress" | "completed";
  onTabChange: (tab: "open" | "in_progress" | "completed") => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const tabs = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

const categories = [
  { id: "all", label: "All", icon: null },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "complaint", label: "Complaints", icon: MessageSquare },
  { id: "transfer", label: "Transfers", icon: ArrowRight },
];

export function RequestFilters({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: RequestFiltersProps) {
  // Counts for tabs (mock)
  const tabCounts = { open: 2, in_progress: 1, completed: 3 };

  return (
    <div className="space-y-4">
      {/* Tabs with counts */}
      <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-white text-[#9d7443] shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label}
            <span className="ml-1 text-xs opacity-60">({tabCounts[tab.id as keyof typeof tabCounts]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-full border border-stone-200 bg-white pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-[#9d7443] focus:outline-none"
        />
      </div>

      {/* Category filters */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  activeCategory === cat.id
                    ? "bg-[#2f2a24] text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}