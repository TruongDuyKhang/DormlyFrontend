"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/ui/button";

const CINEMATIC_LINKS = [
  { label: "Pain Point", id: "pain-point" },
  { label: "Features", id: "features" },
  { label: "Dashboard", id: "dashboard-ai" },
  { label: "Begin", id: "final-cta" },
] as const;

type NavbarProps = {
  variant?: "default" | "cinematic";
};

export function Navbar({ variant = "default" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const isCinematic = variant === "cinematic";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent("dormly:navigate", { detail: { id } }));
  }, []);

  const links = isCinematic ? CINEMATIC_LINKS : [];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-stone-950/10 bg-[#fbf7ef]/82 text-stone-950 shadow-[0_20px_50px_-42px_rgba(38,28,19,0.55)] backdrop-blur-xl"
          : isCinematic
            ? "text-stone-950"
            : "border-b border-transparent bg-[#faf8f5]/60 backdrop-blur-md"
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
        aria-label="Main"
      >
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
        >
          <Image
            src="/logo_black.png"
            alt="Dormly"
            width={120}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </button>

        {links.length > 0 && (
          <div className="hidden items-center gap-0.5 rounded-full border border-stone-950/10 bg-white/35 p-1 backdrop-blur-md md:flex">
            {links.map(({ label, id }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="rounded-full px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-white/70 hover:text-stone-950"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full border border-stone-300 bg-white/50 px-4 text-stone-700 transition hover:bg-white/80 hover:text-stone-950 sm:inline-flex"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-stone-950 px-4 text-white hover:bg-stone-800 active:scale-[0.98]"
          >
            <Link href="/register">Request access</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}