// app/(student)/community/events/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { CommunityTabs } from "../_components/community-tabs";
import { EventCard } from "../_components/event-card";
import type { Event } from "../_components/types";
import { announcementService } from "@/services/announcementService";
import type { AnnouncementResponseDto } from "@/types/models";

function mapAnnouncementToEvent(ann: AnnouncementResponseDto, idx: number): Event {
  const images = [
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
  ];

  return {
    id: ann.id,
    title: ann.title,
    description: ann.content,
    coverImage: images[idx % images.length],
    location: "Dormitory Common Hall",
    date: new Date(ann.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "7:00 PM - 9:00 PM",
    organizer: ann.author || "Residence Office",
    participants: 24,
    maxParticipants: 50,
    status: "upcoming",
    joined: false,
    participantsList: [
      { name: "Student A", avatar: "https://ui-avatars.com/api/?name=Student+A&background=9d7443&color=fff" },
    ],
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"upcoming" | "joined" | "past">("upcoming");
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await announcementService.getAll();
      if (data && data.length > 0) {
        const mapped = data.map(mapAnnouncementToEvent);
        setEvents(mapped);
      }
    } catch (err) {
      console.error("Failed to load events from announcements:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter((event) => {
    if (view === "joined") return joinedEvents.includes(event.id);
    if (view === "past") return false;
    return event.status === view;
  });

  const handleJoin = (eventId: string, formData: any) => {
    setJoinedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              joined: !event.joined,
              participants: event.joined ? event.participants - 1 : event.participants + 1,
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
          <div className="flex items-center gap-3">
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28241f] sm:text-5xl">
              Events & Activities
            </h1>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-stone-500 mt-2" />}
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Discover and participate in dormitory events, workshops, and gatherings
          </p>
        </div>
        <CommunityTabs />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setView("upcoming")}
          className={`px-4 py-2 text-sm font-medium transition ${
            view === "upcoming"
              ? "border-b-2 border-[#9d7443] text-[#9d7443]"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Upcoming ({events.filter((e) => e.status === "upcoming").length})
        </button>
        <button
          onClick={() => setView("joined")}
          className={`px-4 py-2 text-sm font-medium transition ${
            view === "joined"
              ? "border-b-2 border-[#9d7443] text-[#9d7443]"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Joined ({joinedEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} onJoin={handleJoin} />
        ))}
      </div>

      {filteredEvents.length === 0 && !isLoading && (
        <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-500">
          <Calendar className="mx-auto h-8 w-8 text-stone-400 mb-2" />
          <p className="text-sm">No events found in this category.</p>
        </div>
      )}
    </div>
  );
}