"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LANDING_IMAGES } from "../ui/landing-images";

export function FinaleSection() {
  return (
    <section
      data-scene="finale"
      id="final-cta"
      className="cinematic-scene relative min-h-[100dvh] overflow-hidden bg-[#1f1a15] text-white"
    >
      <div className="scene-bg absolute inset-0">
        <img src={LANDING_IMAGES.exterior.src} alt={LANDING_IMAGES.exterior.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#1f1a15]/38" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a15] via-[#1f1a15]/12 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col justify-end px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pb-14">
        <div className="scene-copy max-w-5xl">
          <p className="scene-eyebrow text-[11px] font-semibold uppercase tracking-[0.46em] text-white/58">
            Final CTA
          </p>
          <h2 className="scene-title mt-7 text-[clamp(3rem,6.8vw,7.6rem)] font-light leading-[0.9] tracking-tight">
            A premium residence, run with intention.
          </h2>
        </div>

        <div className="scene-footer mt-12 grid gap-8 border-t border-white/18 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-xl text-lg leading-relaxed text-white/70">
            Give housing teams the operating system behind a calmer, warmer,
            better-managed student living experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-stone-950 transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Request access
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium text-white transition-all hover:border-white/50 hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
