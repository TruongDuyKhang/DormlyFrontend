"use client";

import { LANDING_IMAGES } from "../ui/landing-images";

const FEATURE_GROUPS = [
  {
    role: "Student",
    title: "Self-service living",
    items: ["Profile and document upload", "Room and contract history", "Repair reports", "Complaints and chat"],
  },
  {
    role: "Manager",
    title: "Daily residence control",
    items: ["Student approval", "Room assignment", "Ticket deadlines", "Targeted notices"],
  },
  {
    role: "Admin",
    title: "System governance",
    items: ["Account control", "Infrastructure rules", "System logs", "PDF and Excel reports"],
  },
  {
    role: "System",
    title: "Automated coordination",
    items: ["Status notifications", "Deadline escalation", "Room updates", "AI ticket creation"],
  },
];

export function RoomsSection() {
  return (
    <section
      data-scene="features"
      id="features"
      className="cinematic-scene relative min-h-[106dvh] overflow-hidden bg-[#efe3d2] text-stone-950"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#efe3d2_0%,#f8f1e8_44%,#efe3d2_100%)]" />

      <div className="relative z-10 mx-auto grid min-h-[106dvh] max-w-[1500px] items-center gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.96fr_0.9fr] lg:px-12">
        <div className="scene-gallery relative min-h-[590px]">
          <div className="scene-bg h-[540px] overflow-hidden rounded-[1.9rem] shadow-[0_40px_110px_-62px_rgba(53,39,25,0.72)]">
            <img src={LANDING_IMAGES.rooms.src} alt={LANDING_IMAGES.rooms.alt} className="h-full w-full object-cover" />
          </div>

          <div className="scene-plan absolute -bottom-5 right-5 w-[min(92%,560px)] rounded-[1.5rem] border border-stone-950/10 bg-[#fffaf3]/90 p-5 shadow-[0_30px_90px_-52px_rgba(53,39,25,0.68)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">Feature map</p>
              <p className="rounded-full bg-[#d8eadb] px-3 py-1 text-xs font-medium text-[#385d3c]">4 roles connected</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {FEATURE_GROUPS.map((group) => (
                <div key={group.role} className="feature-card rounded-[1.1rem] border border-stone-950/10 bg-white/58 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">{group.role}</p>
                  <h3 className="mt-2 text-xl font-light tracking-tight text-stone-950">{group.title}</h3>
                  <div className="mt-3 space-y-1.5">
                    {group.items.map((item) => (
                      <p key={item} className="text-sm leading-relaxed text-stone-600">{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scene-copy max-w-xl lg:pl-8">
          <p className="scene-eyebrow text-[11px] font-semibold uppercase tracking-[0.42em] text-stone-500">
            Features
          </p>
          <h2 className="scene-title mt-7 text-[clamp(2.7rem,5vw,6.2rem)] font-light leading-[0.94] tracking-tight">
            One living system for students, staff, admins, and automation.
          </h2>
          <p className="scene-body mt-7 text-base leading-relaxed text-stone-600 lg:text-lg">
            Dormly connects account approval, room contracts, transfer
            requests, maintenance tickets, complaints, chat, emergency notices,
            automatic escalation, and reporting into a single residence flow.
          </p>
          <div className="scene-tags mt-8 flex flex-wrap gap-2">
            {["Room operations", "Maintenance", "Complaints", "Notifications", "Chat", "AI chatbot", "Reports"].map((item) => (
              <span key={item} className="rounded-full border border-stone-950/15 bg-white/45 px-4 py-2 text-sm text-stone-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
