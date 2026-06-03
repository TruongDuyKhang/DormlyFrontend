// app/(student)/community/events/page.tsx
"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { CommunityTabs } from "../_components/community-tabs";
import { EventCard } from "../_components/event-card";
import type { Event } from "../_components/types";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Football Tournament",
    description: "Join the annual dorm football championship. Teams of 7 players. Prize: 5,000,000 VND.",
    coverImage: "https://picsum.photos/seed/event1/400/300",
    location: "Dormitory Football Field",
    date: "Aug 25, 2024",
    time: "8:00 AM - 5:00 PM",
    organizer: "Sports Club",
    participants: 56,
    maxParticipants: 100,
    status: "upcoming",
    joined: false,
    participantsList: [
      { name: "Nguyen Van A", avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=9d7443&color=fff" },
      { name: "Tran Thi B", avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=9d7443&color=fff" },
    ],
  },
  {
    id: "2",
    title: "Movie Night",
    description: "Oppenheimer screening in the common lounge. Free popcorn and drinks!",
    coverImage: "https://picsum.photos/seed/event2/400/300",
    location: "Block A Common Lounge",
    date: "Aug 28, 2024",
    time: "7:00 PM - 10:00 PM",
    organizer: "Residence Office",
    participants: 42,
    maxParticipants: 80,
    status: "upcoming",
    joined: true,
    participantsList: [
      { name: "You", avatar: "https://ui-avatars.com/api/?name=You&background=9d7443&color=fff" },
      { name: "Le Van C", avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=9d7443&color=fff" },
    ],
  },
  {
    id: "3",
    title: "Board Game Night",
    description: "Bring your favorite board games. We'll have Monopoly, Catan, and more.",
    coverImage: "https://picsum.photos/seed/event3/400/300",
    location: "Floor 3 Common Area",
    date: "Sep 02, 2024",
    time: "6:00 PM - 9:00 PM",
    organizer: "Board Game Club",
    participants: 18,
    maxParticipants: 50,
    status: "upcoming",
    joined: false,
  },
  {
    id: "4",
    title: "Study Workshop",
    description: "Time management and productivity tips from senior students. Free coffee provided.",
    coverImage: "https://picsum.photos/seed/event4/400/300",
    location: "Study Area, Floor 2",
    date: "Sep 05, 2024",
    time: "2:00 PM - 4:00 PM",
    organizer: "Academic Support",
    participants: 35,
    maxParticipants: 60,
    status: "upcoming",
    joined: false,
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [view, setView] = useState<"upcoming" | "joined" | "past">("upcoming");
  const [joinedEvents, setJoinedEvents] = useState<string[]>(
    events.filter((e) => e.joined).map((e) => e.id)
  );

  const filteredEvents = events.filter((event) => {
    if (view === "joined") return joinedEvents.includes(event.id);
    if (view === "past") return false; // No past events in mock
    return event.status === view;
  });

  const handleJoin = (eventId: string, formData: any) => {
    console.log("User joined event:", eventId, formData);
    setJoinedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
    // Update participants count in events
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              participants: joinedEvents.includes(eventId)
                ? event.participants - 1
                : event.participants + 1,
              joined: !joinedEvents.includes(eventId),
            }
          : event
      )
    );
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
            Events
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Discover and join activities happening in your dormitory
          </p>
        </div>
        <CommunityTabs />
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        {[
          { id: "upcoming", label: "Upcoming" },
          { id: "joined", label: `Joined (${joinedEvents.length})` },
          { id: "past", label: "Past Events" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as any)}
            className={`relative px-4 py-2 text-sm font-medium transition ${
              view === tab.id ? "text-[#9d7443]" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab.label}
            {view === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9d7443]" />}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onJoin={handleJoin}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <Calendar className="h-8 w-8 text-stone-400" />
          </div>
          <h3 className="text-xl font-semibold text-stone-900">No events found</h3>
          <p className="mt-2 text-stone-500">
            {view === "joined"
              ? "You haven't joined any events yet."
              : "Check back later for upcoming activities."}
          </p>
        </div>
      )}
    </div>
  );
}