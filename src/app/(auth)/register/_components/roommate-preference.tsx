// app/(auth)/register/_components/roommate-preference.tsx
"use client";

import { useState } from "react";
import { Users, ChevronDown, UserCheck, UserPlus } from "lucide-react";
import { roommateOptions } from "./constants";

interface RoommatePreferenceProps {
  value: string;
  onChange: (value: string) => void;
  error?: any;
}

export function RoommatePreference({ value, onChange, error }: RoommatePreferenceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = roommateOptions.find(opt => opt.value === value);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "UserCheck": return <UserCheck className="size-4" />;
      case "UserPlus": return <UserPlus className="size-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-stone-900 flex items-center gap-1">
        <Users className="size-3.5" /> Roommate preference
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition-all flex items-center justify-between ${
            error?.roommatePreference
              ? "border-red-400 focus:border-red-500"
              : "border-stone-950/15 focus:border-stone-950/45"
          } ${!selectedOption ? "text-stone-400" : "text-stone-950"}`}
        >
          <span className="flex items-center gap-2">
            {selectedOption ? (
              <>
                {getIcon(selectedOption.icon)}
                {selectedOption.label}
              </>
            ) : (
              "Select your roommate preference"
            )}
          </span>
          <ChevronDown className={`size-4 text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-auto rounded-2xl border border-stone-200 bg-white shadow-lg">
              {roommateOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left transition hover:bg-stone-50 ${
                    value === option.value ? "bg-amber-50 text-[#9d7443]" : "text-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getIcon(option.icon)}
                    <div>
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs text-stone-400">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {error?.roommatePreference && <p className="text-xs text-red-700">{error.roommatePreference.message}</p>}
    </div>
  );
}