import {
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  DoorOpen,
  Layers3,
  Users,
} from "lucide-react";
import { FloorMap } from "../_components/floor-map";
import { ResidenceHistory } from "../_components/residence-history";
import { ResidenceTabs } from "../_components/residence-tabs";
import { RoommateCard } from "../_components/roommate-card";
import { StatusBadge } from "../_components/status-badge";

const roomStats = [
  { label: "Block", value: "A", icon: Building2 },
  { label: "Floor", value: "3", icon: Layers3 },
  { label: "Room Type", value: "Standard", icon: BedDouble },
  { label: "Occupants", value: "4 / 4", icon: Users },
];

const roomInfo = [
  ["Room Type", "Standard"],
  ["Capacity", "4 Students"],
  ["Current Occupancy", "4 Students"],
  ["Block", "A"],
  ["Floor", "3"],
];

const roommates = [
  {
    name: "Nguyen Van A",
    faculty: "Computer Science",
    initials: "NA",
    tone: "bg-[#6f5b42]",
  },
  {
    name: "Tran Thi B",
    faculty: "Engineering",
    initials: "TB",
    tone: "bg-[#7c6f61]",
  },
  {
    name: "Le Van C",
    faculty: "Business",
    initials: "LC",
    tone: "bg-[#8f6b3d]",
  },
];

export default function StudentRoomPage() {
  return (
    <div className="space-y-6 pb-24 lg:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
            Residence
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#28231f] sm:text-5xl">
            Room A304
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            A clear view of your current room, roommates, room details, and
            residence history.
          </p>
        </div>
        <ResidenceTabs />
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#e9dfd0] p-5 shadow-[0_34px_90px_-60px_rgba(38,35,31,0.78)] sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.9),transparent_28%),linear-gradient(125deg,rgba(255,255,255,0.42),rgba(162,138,104,0.2))]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,0.84fr)_minmax(22rem,0.5fr)]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/36 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl">
                  <DoorOpen className="h-3.5 w-3.5 text-[#9d7443]" />
                  Current Room
                </div>
                <h2 className="mt-6 text-5xl font-semibold leading-none tracking-tight text-stone-950 sm:text-6xl">
                  A304
                </h2>
                <p className="mt-4 text-lg text-stone-600">
                  Block A, Floor 3, Standard Room
                </p>
              </div>
              <StatusBadge>Active Resident</StatusBadge>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {roomStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="rounded-[1.35rem] border border-white/60 bg-white/38 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl"
                  >
                    <Icon className="h-[1.125rem] w-[1.125rem] text-[#9d7443]" />
                    <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-mono text-2xl font-semibold text-stone-900">
                      {stat.value}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-white/55 bg-[#2f2a24]/92 p-5 text-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-400">
                Stay status
              </p>
              <CheckCircle2 className="h-5 w-5 text-[#d6bd8a]" />
            </div>
            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
                <p className="flex items-center gap-2 text-sm text-stone-400">
                  <CalendarDays className="h-4 w-4" />
                  Check-in Date
                </p>
                <p className="mt-2 font-mono text-2xl text-stone-50">
                  15 Aug 2024
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
                <p className="text-sm text-stone-400">Current Status</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-50">
                  Active Resident
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(22rem,0.5fr)]">
        <div className="rounded-[1.75rem] border border-white/60 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
            Roommates
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
            The people sharing your room.
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {roommates.map((roommate) => (
              <RoommateCard key={roommate.name} {...roommate} />
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/60 bg-white/42 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
            Room information
          </p>
          <div className="mt-5 divide-y divide-stone-200/80">
            {roomInfo.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-3"
              >
                <p className="text-sm text-stone-500">{label}</p>
                <p className="font-medium text-stone-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.72fr)_minmax(22rem,0.5fr)]">
        <FloorMap />
        <ResidenceHistory />
      </section>
    </div>
  );
}
