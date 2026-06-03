// app/(student)/community/_components/event-card.tsx
"use client";

import { Calendar, MapPin, Clock, Users, UserRound } from "lucide-react";
import { useState } from "react";
import { JoinEventModal } from "./join-event-modal";
import type { Event } from "./types";

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string, data: any) => void;
  onClick?: () => void;
}

const statusConfig = {
  upcoming: { label: "Upcoming", color: "bg-emerald-600 text-white" },
  ongoing: { label: "Happening Now", color: "bg-amber-600 text-white" },
  past: { label: "Past", color: "bg-stone-500 text-white" },
};

export function EventCard({ event, onJoin, onClick }: EventCardProps) {
  const [joined, setJoined] = useState(event.joined || false);
  const [participants, setParticipants] = useState(event.participants);
  const [showModal, setShowModal] = useState(false);

  const status = statusConfig[event.status];

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!joined) {
      setShowModal(true);
    } else {
      setJoined(false);
      setParticipants(prev => prev - 1);
      onJoin?.(event.id, { action: "unjoin" });
    }
  };

  const handleConfirmJoin = (formData: any) => {
    setJoined(true);
    setParticipants(prev => prev + 1);
    onJoin?.(event.id, formData);
  };

  return (
    <>
      <article
        onClick={onClick}
        className="group cursor-pointer overflow-hidden rounded-xl border border-stone-200/70 bg-white transition-all duration-200 hover:shadow-md"
      >
        {/* Cover Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-stone-900 line-clamp-1">{event.title}</h3>
          <p className="mt-1 text-sm text-stone-600 line-clamp-2">{event.description}</p>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Calendar className="h-3.5 w-3.5" />
              {event.date}
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Clock className="h-3.5 w-3.5" />
              {event.time}
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <UserRound className="h-3.5 w-3.5" />
              {event.organizer}
            </div>
          </div>

          {/* Join Section */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-stone-500">
              <Users className="h-3.5 w-3.5" />
              {participants} participants
              {event.maxParticipants && (
                <span className="text-stone-400"> / {event.maxParticipants}</span>
              )}
            </div>
            {event.status !== "past" && (
              <button
                onClick={handleJoinClick}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-[0.98] ${
                  joined
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-[#2f2a24] text-white hover:bg-[#40382f]"
                }`}
              >
                {joined ? "Joined ✓" : "Join Event"}
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Join Modal - Truyền đầy đủ thông tin event */}
      <JoinEventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmJoin}
        event={{
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          currentParticipants: participants,
          maxParticipants: event.maxParticipants || 100,
        }}
      />
    </>
  );
}