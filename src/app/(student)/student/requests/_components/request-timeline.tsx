// app/(student)/requests/_components/request-timeline.tsx
"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { RequestTimelineItem } from "./types";

interface RequestTimelineProps {
  timeline: RequestTimelineItem[];
}

export function RequestTimeline({ timeline }: RequestTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-200" />

      <div className="space-y-6">
        {timeline.map((item, idx) => (
          <div key={item.id} className="relative flex gap-4">
            <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white border-2 border-[#9d7443]">
              {idx === timeline.length - 1 ? (
                <CheckCircle2 className="h-4 w-4 text-[#9d7443]" />
              ) : (
                <Circle className="h-4 w-4 text-[#9d7443]" fill="#9d7443" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-stone-900">{item.title}</p>
              <p className="mt-1 text-xs text-stone-500">{item.date}</p>
              {item.description && (
                <p className="mt-2 text-sm text-stone-600">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}