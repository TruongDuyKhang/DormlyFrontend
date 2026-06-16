// app/(auth)/register/_components/custom-select.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  error?: boolean;
  icon?: React.ReactNode;
}

export function CustomSelect({ value, onChange, options, placeholder, error, icon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-stone-950 shadow-[0_18px_56px_-34px_rgba(28,25,23,0.92)] outline-none transition-all flex items-center justify-between ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-stone-950/15 focus:border-stone-950/45"
        } ${!selectedOption ? "text-stone-400" : "text-stone-950"}`}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-stone-400">{icon}</span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`size-4 text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-auto rounded-2xl border border-stone-200 bg-white shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition hover:bg-stone-50 ${
                  value === option.value ? "bg-amber-50 text-[#9d7443] font-medium" : "text-stone-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}