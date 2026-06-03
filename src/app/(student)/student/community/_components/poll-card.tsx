// app/(student)/community/_components/poll-card.tsx
"use client";

import { useState } from "react";
import { BarChart2, Users, Calendar, Clock, Award, ChevronRight, CheckCircle2, CalendarDays, Wrench, BookOpen, Music, Home } from "lucide-react";
import type { Poll } from "./types";

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionIds: string[]) => void;
  onClick?: () => void;
}

// Định nghĩa icon cho từng category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "event":
      return CalendarDays;
    case "facility":
      return Home;
    case "policy":
      return BookOpen;
    case "activity":
      return Music;
    default:
      return Award;
  }
};

const categoryConfig = {
  event: { label: "Event Planning", color: "bg-emerald-600 text-white", icon: CalendarDays },
  facility: { label: "Facility", color: "bg-sky-600 text-white", icon: Home },
  policy: { label: "Policy", color: "bg-amber-600 text-white", icon: BookOpen },
  activity: { label: "Activity", color: "bg-purple-600 text-white", icon: Music },
  other: { label: "General", color: "bg-stone-600 text-white", icon: Award },
};

export function PollCard({ poll, onVote, onClick }: PollCardProps) {
  // Support multiple selected options
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    poll.userVoted ? poll.userVoted.split(',') : []
  );
  const [localVotes, setLocalVotes] = useState(poll.options.map(o => o.votes));
  const [localTotal, setLocalTotal] = useState(poll.totalVotes);
  const [hasVoted, setHasVoted] = useState(!!poll.userVoted);

  const handleOptionClick = (optionId: string, optionIndex: number) => {
    if (poll.status === "closed" || hasVoted) return;
    
    // Toggle selection
    let newSelected: string[];
    if (selectedOptions.includes(optionId)) {
      newSelected = selectedOptions.filter(id => id !== optionId);
    } else {
      newSelected = [...selectedOptions, optionId];
    }
    setSelectedOptions(newSelected);
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0 || poll.status === "closed" || hasVoted) return;
    
    // Update votes for each selected option
    const newVotes = [...localVotes];
    selectedOptions.forEach(optionId => {
      const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
      if (optionIndex !== -1) {
        newVotes[optionIndex] += 1;
      }
    });
    
    setLocalVotes(newVotes);
    setLocalTotal(prev => prev + selectedOptions.length);
    setHasVoted(true);
    onVote?.(poll.id, selectedOptions);
  };

  const totalVotes = localTotal;
  const category = categoryConfig[poll.category as keyof typeof categoryConfig] || categoryConfig.other;
  const CategoryIcon = category.icon;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <article
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-stone-200/70 bg-white p-5 transition-all duration-200 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${category.color}`}>
            <CategoryIcon className="h-3 w-3" />
            {category.label}
          </span>
          {poll.status === "closed" && (
            <span className="rounded-full bg-stone-500 px-2.5 py-1 text-xs font-semibold text-white">
              Closed
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-500">
          <BarChart2 className="h-3 w-3" />
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg font-semibold text-stone-900">{poll.title}</h3>
      
      {/* Description */}
      {poll.description && (
        <p className="mt-2 text-sm text-stone-600 line-clamp-2">{poll.description}</p>
      )}

      {/* Meta Info */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>By {poll.createdBy}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Created {formatDate(poll.createdAt)}</span>
        </div>
        {poll.endsAt && poll.status === "active" && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Ends {formatDate(poll.endsAt)}</span>
          </div>
        )}
      </div>

      {/* Multi-select hint */}
      {poll.status === "active" && !hasVoted && (
        <div className="mt-2 text-xs text-stone-400">
          ✓ You can select multiple options
        </div>
      )}

      {/* Options - Luôn hiển thị tỉ lệ */}
      <div className="mt-4 space-y-2.5">
        {poll.options.map((option, idx) => {
          const percentage = totalVotes > 0 ? (localVotes[idx] / totalVotes) * 100 : 0;
          const isSelected = selectedOptions.includes(option.id);

          return (
            <div
              key={option.id}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(option.id, idx);
              }}
              className={`relative overflow-hidden rounded-lg border transition-all ${
                isSelected
                  ? "border-[#9d7443] bg-amber-50"
                  : "border-stone-200 hover:border-stone-300"
              } ${poll.status === "active" && !hasVoted ? "cursor-pointer" : "cursor-default"}`}
            >
              {/* Progress bar */}
              <div
                className="absolute inset-y-0 left-0 bg-amber-100/60"
                style={{ width: `${percentage}%` }}
              />
              
              <div className="relative flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-[#9d7443]" />
                  )}
                  <span className="text-sm text-stone-700">{option.text}</span>
                </div>
                <span className="text-sm font-medium text-stone-600">
                  {Math.round(percentage)}% ({localVotes[idx]})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Vote Button - Hiển thị khi chưa vote và có option được chọn */}
      {poll.status === "active" && !hasVoted && selectedOptions.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSubmitVote();
          }}
          className="mt-4 w-full rounded-full bg-[#2f2a24] py-2 text-sm font-medium text-white transition hover:bg-[#40382f] active:scale-[0.98]"
        >
          Submit Vote ({selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''})
        </button>
      )}

      {/* Recent Voters */}
      {poll.recentVoters && poll.recentVoters.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {poll.recentVoters.slice(0, 3).map((voter, idx) => (
                <img
                  key={idx}
                  src={voter.avatar}
                  alt={voter.name}
                  className="h-6 w-6 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span className="text-xs text-stone-500">
              {poll.recentVoters.length} people voted recently
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-stone-400" />
        </div>
      )}

      {/* User voted status */}
      {hasVoted && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          You voted {selectedOptions.length > 1 ? `on ${selectedOptions.length} options` : ''}
        </div>
      )}

      {/* Vote now prompt */}
      {poll.status === "active" && !hasVoted && selectedOptions.length === 0 && (
        <div className="mt-3 text-center text-xs text-[#9d7443] font-medium">
          Click on options above to select, then submit your vote
        </div>
      )}
    </article>
  );
}