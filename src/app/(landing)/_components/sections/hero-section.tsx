"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_IMAGES } from "../ui/landing-images";

export function HeroSection() {
  return (
    <section
      data-scene="hero"
      id="hero"
      className="cinematic-scene relative min-h-[100dvh] overflow-hidden bg-[#f6efe4]"
    >
      <div className="scene-wash pointer-events-none absolute inset-0 z-20 bg-[#f6efe4] opacity-0" />

      <div className="scene-bg absolute inset-0 overflow-hidden">
        <img
          src={LANDING_IMAGES.hero.src}
          alt={LANDING_IMAGES.hero.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f6efe4]/78 via-[#f6efe4]/34 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6efe4]/86 via-transparent to-[#2f271d]/10" />
      </div>

      <div className="relative z-30 mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col justify-end px-5 pb-9 pt-24 sm:px-8 lg:px-12 lg:pb-12">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.55fr)]">
          <div>
            <p className="scene-eyebrow text-[11px] font-semibold uppercase tracking-[0.46em] text-stone-600">
              Dormly Residence OS
            </p>
            <h1 className="scene-title mt-6 max-w-5xl text-[clamp(3.1rem,7.4vw,8rem)] font-light leading-[0.88] tracking-tight text-stone-950">
              Student living,
              <span className="block pl-[8vw] italic text-stone-600">quietly composed.</span>
            </h1>
          </div>

          <div className="scene-card mb-3 max-w-md border-l border-stone-950/20 pl-6">
            <p className="text-base leading-relaxed text-stone-700 lg:text-lg">
              A brighter way to run modern residences: every room, repair,
              message, and resident moment arranged into one calm operational
              rhythm.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-full bg-stone-950 px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-stone-800 active:scale-[0.98]"
              >
                Request access
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
              <a
                href="#pain-point"
                onClick={(event) => {
                  event.preventDefault();
                  window.dispatchEvent(new CustomEvent("dormly:navigate", { detail: { id: "pain-point" } }));
                }}
                className="inline-flex rounded-full border border-stone-950/20 px-7 py-3.5 text-sm font-medium text-stone-800 transition-all hover:border-stone-950/40 hover:bg-white/40"
              >
                Explore
              </a>
            </div>
          </div>
        </div>

        <div className="scene-strip mt-10 grid gap-3 border-t border-stone-950/15 pt-5 text-xs uppercase tracking-[0.24em] text-stone-600 sm:grid-cols-3">
          <span>Rooms with live context</span>
          <span>Care teams in motion</span>
          <span>Resident life, coordinated</span>
        </div>
      </div>
    </section>
  );
}
