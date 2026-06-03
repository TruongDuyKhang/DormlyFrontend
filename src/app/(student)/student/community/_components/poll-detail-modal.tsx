// app/(student)/community/_components/poll-detail-modal.tsx
"use client";

import { X, Calendar, Clock, Users, Award, BarChart2, CheckCircle2, UserCheck } from "lucide-react";
import { useState } from "react";
import type { Poll } from "./types";

interface PollDetailModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (pollId: string, optionIds: string[]) => void;
}

const categoryConfig = {
  event: { label: "Event Planning", color: "bg-emerald-600 text-white" },
  facility: { label: "Facility", color: "bg-sky-600 text-white" },
  policy: { label: "Policy", color: "bg-amber-600 text-white" },
  activity: { label: "Activity", color: "bg-purple-600 text-white" },
  other: { label: "General", color: "bg-stone-600 text-white" },
};

export function PollDetailModal({ poll, isOpen, onClose, onVote }: PollDetailModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    poll?.userVoted ? poll.userVoted.split(',') : []
  );
  const [localVotes, setLocalVotes] = useState<number[]>([]);
  const [localTotal, setLocalTotal] = useState(0);
  const [hasVoted, setHasVoted] = useState(!!poll?.userVoted);

  useState(() => {
    if (poll) {
      setLocalVotes(poll.options.map(o => o.votes));
      setLocalTotal(poll.totalVotes);
      setSelectedOptions(poll.userVoted ? poll.userVoted.split(',') : []);
      setHasVoted(!!poll.userVoted);
    }
  });

  if (!isOpen || !poll) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleOptionClick = (optionId: string) => {
    if (poll.status === "closed" || hasVoted) return;
    
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

  const totalVotes = localTotal || poll.totalVotes;
  const currentVotes = localVotes.length ? localVotes : poll.options.map(o => o.votes);
  const endsAtDate = poll.endsAt ? formatDate(poll.endsAt) : null;

  const canVote = poll.status === "active" && !hasVoted && selectedOptions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white p-5 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryConfig[poll.category].color}`}>
                {categoryConfig[poll.category].label}
              </span>
              {poll.status === "closed" && (
                <span className="rounded-full bg-stone-500 px-2.5 py-1 text-xs font-semibold text-white">Closed</span>
              )}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-stone-900">{poll.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-stone-100">
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {poll.description && (
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Description</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">{poll.description}</p>
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-stone-50 p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-stone-400" />
              <div>
                <p className="text-xs text-stone-500">Created by</p>
                <p className="text-sm font-medium text-stone-900">{poll.createdBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-stone-400" />
              <div>
                <p className="text-xs text-stone-500">Created on</p>
                <p className="text-sm font-medium text-stone-900">{formatDate(poll.createdAt)}</p>
              </div>
            </div>
            {poll.endsAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-stone-400" />
                <div>
                  <p className="text-xs text-stone-500">Ends on</p>
                  <p className="text-sm font-medium text-stone-900">{endsAtDate}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-stone-400" />
              <div>
                <p className="text-xs text-stone-500">Total votes</p>
                <p className="text-sm font-medium text-stone-900">{totalVotes} votes</p>
              </div>
            </div>
          </div>

          {/* Multi-select hint */}
          {poll.status === "active" && !hasVoted && (
            <div className="rounded-xl bg-sky-50 p-3">
              <p className="text-sm text-sky-700">✓ You can select multiple options that apply to you</p>
            </div>
          )}

          {/* Poll Options */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Vote Options</h3>
            <div className="space-y-4">
              {poll.options.map((option, idx) => {
                const percentage = totalVotes > 0 ? (currentVotes[idx] / totalVotes) * 100 : 0;
                const isSelected = selectedOptions.includes(option.id);

                return (
                  <div key={option.id} className="space-y-2">
                    <div
                      onClick={() => handleOptionClick(option.id)}
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
                      <div className="relative flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-[#9d7443]" />}
                          <span className="text-base text-stone-800">{option.text}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-stone-700">
                            {Math.round(percentage)}%
                          </span>
                          <span className="ml-2 text-xs text-stone-500">
                            ({currentVotes[idx]} votes)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Vote Button */}
          {poll.status === "active" && !hasVoted && selectedOptions.length > 0 && (
            <button
              onClick={handleSubmitVote}
              className="w-full rounded-full bg-[#2f2a24] py-3 text-sm font-medium text-white transition hover:bg-[#40382f] active:scale-[0.98]"
            >
              Submit Vote ({selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''})
            </button>
          )}

          {/* All Recent Voters */}
          {poll.recentVoters && poll.recentVoters.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Recent Participants ({poll.recentVoters.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {poll.recentVoters.map((voter, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5">
                    <img src={voter.avatar} alt={voter.name} className="h-6 w-6 rounded-full" />
                    <span className="text-sm text-stone-700">{voter.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vote Status Message */}
          {hasVoted && (
            <div className="rounded-xl bg-emerald-50 p-3 text-center">
              <p className="text-sm text-emerald-700">
                ✓ You have already voted {selectedOptions.length > 1 ? `on ${selectedOptions.length} options` : ''}
              </p>
            </div>
          )}

          {poll.status === "closed" && (
            <div className="rounded-xl bg-stone-100 p-3 text-center">
              <p className="text-sm text-stone-600">This poll has ended. Thank you for your participation!</p>
            </div>
          )}

          {poll.status === "active" && !hasVoted && selectedOptions.length === 0 && (
            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <p className="text-sm text-amber-700">Select one or more options above to cast your vote.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}