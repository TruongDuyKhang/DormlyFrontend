"use client";

import { LANDING_IMAGES } from "../ui/landing-images";

const PAIN_POINTS = [
  "Students wait for account approval, room updates, and ticket status across separate channels.",
  "Managers track rooms, repairs, documents, complaints, and notices through scattered tools.",
  "Admins need system-wide visibility, rules, reports, logs, and AI configuration without chasing files.",
];

export function IntroSection() {
  return (
    <section
      data-scene="pain"
      id="pain-point"
      className="cinematic-scene relative min-h-[104dvh] overflow-hidden bg-[#f6efe4] text-stone-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,255,255,0.92),transparent_34%),linear-gradient(180deg,#f6efe4_0%,#efe3d2_100%)]" />

      <div className="relative z-10 mx-auto grid min-h-[104dvh] max-w-[1500px] items-center gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.74fr_1fr] lg:px-12">
        <div className="scene-copy max-w-lg">
          <p className="scene-eyebrow text-[11px] font-semibold uppercase tracking-[0.42em] text-stone-500">
            Pain Point
          </p>
          <h2 className="scene-title mt-7 text-[clamp(2.5rem,4.8vw,5.8rem)] font-light leading-[0.96] tracking-tight">
            The residence feels calm. The operation behind it does not.
          </h2>
          <p className="scene-body mt-7 text-base leading-relaxed text-stone-600 lg:text-lg">
            Dormitory teams carry four realities at once: student life,
            manager workflows, admin control, and automated system events. When
            those layers live apart, every small update becomes manual work.
          </p>
        </div>

        <div className="scene-collage relative min-h-[560px]">
          <div className="scene-image-large absolute right-0 top-8 h-[54%] w-[72%] overflow-hidden rounded-[1.75rem] shadow-[0_34px_100px_-55px_rgba(45,34,23,0.7)]">
            <img src={LANDING_IMAGES.residence.src} alt={LANDING_IMAGES.residence.alt} className="h-full w-full object-cover" />
          </div>
          <div className="scene-image-small absolute bottom-12 left-0 h-[38%] w-[46%] overflow-hidden rounded-[1.35rem] border-[8px] border-[#f6efe4] shadow-[0_30px_80px_-50px_rgba(45,34,23,0.65)]">
            <img src={LANDING_IMAGES.study.src} alt={LANDING_IMAGES.study.alt} className="h-full w-full object-cover" />
          </div>
          <div className="scene-note absolute bottom-[17%] right-[6%] max-w-sm rounded-[1.4rem] border border-stone-950/10 bg-white/76 p-5 shadow-[0_22px_70px_-44px_rgba(45,34,23,0.6)] backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">Operational friction</p>
            <div className="mt-4 space-y-3">
              {PAIN_POINTS.map((item) => (
                <p key={item} className="pain-item border-t border-stone-950/10 pt-3 text-sm leading-relaxed text-stone-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
