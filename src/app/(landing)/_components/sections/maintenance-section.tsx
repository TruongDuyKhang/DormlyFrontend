"use client";

import { LANDING_IMAGES } from "../ui/landing-images";

const CARE_STEPS = [
  { time: "07:42", title: "Resident report", detail: "Shower pressure dropped in C-418" },
  { time: "07:44", title: "Team assigned", detail: "Facilities sees access notes and parts history" },
  { time: "08:31", title: "Resident updated", detail: "Repair window confirmed before class" },
];

export function MaintenanceSection() {
  return (
    <section
      data-scene="maintenance"
      id="care"
      className="cinematic-scene relative min-h-[120dvh] overflow-hidden bg-[#fbf7ef] text-stone-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(210,169,105,0.24),transparent_34%),linear-gradient(180deg,#fbf7ef_0%,#efe4d4_100%)]" />

      <div className="relative z-10 mx-auto grid min-h-[120dvh] max-w-[1500px] items-center gap-16 px-5 py-28 sm:px-8 lg:grid-cols-[0.78fr_1fr] lg:px-12">
        <div className="scene-copy max-w-xl">
          <p className="scene-eyebrow text-[11px] font-semibold uppercase tracking-[0.46em] text-stone-500">
            Care
          </p>
          <h2 className="scene-title mt-8 text-[clamp(3rem,6vw,7.2rem)] font-light leading-[0.9] tracking-tight">
            Service that feels present.
          </h2>
          <p className="scene-body mt-8 text-lg leading-relaxed text-stone-600">
            Maintenance becomes part of the residence experience: requests
            arrive with context, staff move with clarity, and residents never
            wonder whether anyone is listening.
          </p>
        </div>

        <div className="scene-stage relative min-h-[680px]">
          <div className="scene-bg absolute inset-x-0 top-0 h-[560px] overflow-hidden rounded-[2.2rem]">
            <img src={LANDING_IMAGES.corridor.src} alt={LANDING_IMAGES.corridor.alt} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent" />
          </div>

          <div className="scene-care-card absolute bottom-4 left-4 right-4 rounded-[1.8rem] border border-stone-950/10 bg-[#fffaf4]/90 p-5 shadow-[0_30px_90px_-55px_rgba(53,39,25,0.65)] backdrop-blur-xl sm:left-auto sm:w-[520px]">
            <div className="flex items-center justify-between border-b border-stone-950/10 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500">Care sequence</p>
                <p className="mt-1 text-xl font-light tracking-tight">C-418 shower pressure</p>
              </div>
              <span className="rounded-full bg-[#f5dfb9] px-3 py-1 text-xs font-medium text-[#755528]">in motion</span>
            </div>

            <div className="mt-5 space-y-4">
              {CARE_STEPS.map((step) => (
                <div key={step.title} className="care-step grid grid-cols-[56px_1fr] gap-4">
                  <span className="font-mono text-xs text-stone-500">{step.time}</span>
                  <div>
                    <p className="text-sm font-medium text-stone-950">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
