// app/(student)/home/_components/community-highlights.tsx
"use client";

import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  attendees: number;
}

const events: CommunityEvent[] = [
  {
    id: "1",
    title: "Football Tournament",
    description: "East House vs West House. Join the annual championship!",
    imageUrl: "https://picsum.photos/seed/football2024/400/300",
    date: "Aug 25, 2024",
    attendees: 24,
  },
  {
    id: "2",
    title: "Movie Night",
    description: "Oppenheimer screening in the common lounge. Free popcorn!",
    imageUrl: "https://picsum.photos/seed/movie2024/400/300",
    date: "Aug 28, 2024",
    attendees: 42,
  },
  {
    id: "3",
    title: "Volunteer Program",
    description: "Help clean the neighborhood park. Free lunch provided.",
    imageUrl: "https://picsum.photos/seed/volunteer2024/400/300",
    date: "Sep 02, 2024",
    attendees: 18,
  },
  {
    id: "4",
    title: "Study Workshop",
    description: "Time management and productivity tips from senior students.",
    imageUrl: "https://picsum.photos/seed/workshop2024/400/300",
    date: "Sep 05, 2024",
    attendees: 35,
  },
];

export function CommunityHighlights() {
  return (
    <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {/* Label - Màu tối đậm, đọc rõ */}
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-800">
            Community Highlights
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
            What's happening around you.
          </h2>
        </div>
        <Link
          href="/student/community/feed"
          className="inline-flex items-center gap-2 rounded-full border border-stone-400 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100 active:scale-[0.98]"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {events.map((event, idx) => (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Thumbnail lớn */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content - Text đậm, rõ ràng */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-stone-900">
                {event.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-stone-700 line-clamp-2">
                {event.description}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs font-medium text-stone-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {event.attendees} going
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}