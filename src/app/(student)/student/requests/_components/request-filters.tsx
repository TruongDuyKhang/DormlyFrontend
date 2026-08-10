"use client";

import { Search, Wrench, Building2, Users, ShieldAlert, Receipt, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabType } from "../types/ticket";

interface RequestFiltersProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tabCounts: Record<TabType, number>;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

const categories = [
  { id: "all", label: "All", icon: null as any },
  { id: "MAINTENANCE", label: "Maintenance", icon: Wrench },
  { id: "FACILITY", label: "Facility", icon: Building2 },
  { id: "ROOMMATE", label: "Roommate", icon: Users },
  { id: "SECURITY", label: "Security", icon: ShieldAlert },
  { id: "BILLING", label: "Billing", icon: Receipt },
  { id: "OTHER", label: "Other", icon: HelpCircle },
];

export function RequestFilters({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  tabCounts,
}: RequestFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-xl bg-stone-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              activeTab === tab.id ? "bg-white text-[#9d7443] shadow-sm" : "text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label}
            <span className="ml-1 text-xs opacity-60">({tabCounts[tab.id]})</span>
          </button>
        ))}
      </div>

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
                  activeCategory === cat.id ? "bg-[#2f2a24] text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
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