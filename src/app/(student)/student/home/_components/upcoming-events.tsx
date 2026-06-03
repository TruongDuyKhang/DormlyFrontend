// app/(student)/home/_components/upcoming-events.tsx
"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Event {
  id: string;
  date: string;
  month: string;
  title: string;
}

const events: Event[] = [
  {
    id: "1",
    date: "25",
    month: "Aug",
    title: "Football Tournament",
  },
  {
    id: "2",
    date: "28",
    month: "Aug",
    title: "Community Meeting",
  },
  {
    id: "3",
    date: "02",
    month: "Sep",
    title: "Volunteer Campaign",
  },
];

export function UpcomingEvents() {
  return (
    <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-800">
            Upcoming Events
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
            Don't miss out
          </h2>
        </div>
        <Link
          href="/student/community/events"
          className="inline-flex items-center gap-2 rounded-full border border-stone-400 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100 active:scale-[0.98]"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Date Box */}
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-[#2f2a24] text-white">
              <span className="text-xl font-bold leading-none">
                {event.date}
              </span>
              <span className="mt-1 text-xs font-medium uppercase">
                {event.month}
              </span>
            </div>

            {/* Event Info - Không còn tag */}
            <div className="flex-1">
              <h3 className="font-bold text-stone-900">
                {event.title}
              </h3>
              <p className="mt-1 text-xs text-stone-500">
                Join and connect with your community
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight className="h-4 w-4 text-stone-400 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}