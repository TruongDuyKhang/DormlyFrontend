"use client";

import { LANDING_IMAGES } from "../ui/landing-images";

const MOMENTS = [
  "Quiet hours begin at 10:30 PM on floors B4-B6.",
  "Laundry room A reopens after service at 14:00.",
  "Welcome dinner moved indoors due to evening rain.",
];

export function CommunicationSection() {
  return (
    <section
      data-scene="communication"
      id="community"
      className="cinematic-scene relative min-h-[120dvh] overflow-hidden bg-[#e9ddc8] text-stone-950"
    >
      <div className="scene-bg absolute inset-0">
        <img src={LANDING_IMAGES.community.src} alt={LANDING_IMAGES.community.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#e9ddc8]/82" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e9ddc8] via-transparent to-[#e9ddc8]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[120dvh] max-w-[1500px] flex-col justify-center px-5 py-28 sm:px-8 lg:px-12">
        <div className="scene-copy mx-auto max-w-5xl text-center">
          <p className="scene-eyebrow text-[11px] font-semibold uppercase tracking-[0.46em] text-stone-600">
            Community
          </p>
          <h2 className="scene-title mt-8 text-[clamp(3.2rem,8vw,9rem)] font-light leading-[0.88] tracking-tight">
            The right note reaches the right door.
          </h2>
          <p className="scene-body mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-stone-700">
            Dormly keeps the building conversational without becoming noisy.
            Broadcast by block, floor, cohort, or resident status, then watch
            the message settle where it belongs.
          </p>
        </div>

        <div className="scene-message-field relative mx-auto mt-16 h-[360px] w-full max-w-5xl">
          {MOMENTS.map((moment, index) => (
            <div
              key={moment}
              className={`message-card absolute max-w-sm rounded-[1.6rem] border border-stone-950/10 bg-white/72 p-5 shadow-[0_24px_80px_-52px_rgba(53,39,25,0.65)] backdrop-blur-xl ${
                index === 0
                  ? "left-0 top-8"
                  : index === 1
                    ? "right-0 top-0"
                    : "bottom-8 left-1/2 -translate-x-1/2"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                {index === 0 ? "B wing" : index === 1 ? "Facilities" : "Residence life"}
              </p>
              <p className="mt-3 text-xl font-light leading-snug tracking-tight text-stone-950">{moment}</p>
            </div>
          ))}
          <div className="scene-orbit absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-950/15" />
          <div className="scene-orbit scene-orbit-two absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stone-950/10" />
        </div>
      </div>
    </section>
  );
}
