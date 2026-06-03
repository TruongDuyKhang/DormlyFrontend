"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { HeroSection } from "../sections/hero-section";
import { IntroSection } from "../sections/intro-section";
import { RoomsSection } from "../sections/rooms-section";
import { DashboardSection } from "../sections/dashboard-section";
import { FinaleSection } from "../sections/finale-section";

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  { id: "hero", label: "Arrival" },
  { id: "pain-point", label: "Pain Point" },
  { id: "features", label: "Features" },
  { id: "dashboard-ai", label: "Dashboard + AI" },
  { id: "final-cta", label: "Begin" },
] as const;

function fadeIn(scene: HTMLElement, tl: gsap.core.Timeline) {
  const eyebrow = scene.querySelector(".scene-eyebrow");
  const title = scene.querySelector(".scene-title");
  const body = scene.querySelector(".scene-body");
  const card = scene.querySelector(".scene-card");
  const strip = scene.querySelector(".scene-strip");

  tl.fromTo(eyebrow, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 }, 0.06)
    .fromTo(title, { y: 80, opacity: 0, rotateX: 8 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.78 }, 0.12)
    .fromTo(body, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48 }, 0.24);

  if (card) {
    tl.fromTo(card, { y: 52, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58 }, 0.32);
  }

  if (strip) {
    tl.fromTo(strip.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.38 }, 0.48);
  }
}

function choreographScene(scene: HTMLElement, tl: gsap.core.Timeline) {
  const id = scene.dataset.scene;
  const bg = scene.querySelector(".scene-bg");

  if (bg) {
    tl.fromTo(bg, { scale: 1.08 }, { scale: 1, duration: 0.72, ease: "power2.out" }, 0)
      .to(bg, { scale: id === "finale" ? 1.08 : 1.04, duration: 0.6, ease: "none" }, 0.58);
  }

  if (id === "hero") {
    gsap.set(scene.querySelectorAll(".scene-eyebrow, .scene-title, .scene-card, .scene-strip"), {
      clearProps: "opacity,transform",
    });
    tl.to(scene.querySelector(".scene-title"), { y: -54, opacity: 0.32, duration: 0.32 }, 0.72)
      .to(scene.querySelector(".scene-wash"), { opacity: 0.82, duration: 0.24 }, 0.82);
    return;
  }

  fadeIn(scene, tl);

  if (id === "pain") {
    tl.fromTo(scene.querySelector(".scene-image-large"), { y: 90, clipPath: "inset(16% 0 0 0)" }, { y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.78 }, 0.18)
      .fromTo(scene.querySelector(".scene-image-small"), { y: -40, x: -60, opacity: 0 }, { y: 0, x: 0, opacity: 1, duration: 0.58 }, 0.34)
      .fromTo(scene.querySelector(".scene-note"), { y: 60, opacity: 0, rotate: 2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.5 }, 0.48)
      .fromTo(scene.querySelectorAll(".pain-item"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.32 }, 0.56)
      .to(scene.querySelector(".scene-image-large"), { y: -70, duration: 0.46 }, 0.7)
      .to(scene.querySelector(".scene-image-small"), { y: 40, duration: 0.46 }, 0.7);
  }

  if (id === "features") {
    tl.fromTo(scene.querySelector(".scene-gallery"), { x: -80, opacity: 0.4 }, { x: 0, opacity: 1, duration: 0.64 }, 0.08)
      .fromTo(scene.querySelector(".scene-plan"), { y: 90, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.58 }, 0.36)
      .fromTo(scene.querySelectorAll(".feature-card"), { y: 34, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.36 }, 0.48)
      .fromTo(scene.querySelectorAll(".scene-tags span"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.32 }, 0.48);
  }

  if (id === "dashboard") {
    tl.fromTo(scene.querySelector(".scene-console"), { y: 90, rotate: -1.5, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.72 }, 0.18)
      .fromTo(scene.querySelectorAll(".metric-card"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.35 }, 0.42)
      .fromTo(scene.querySelectorAll(".chart-bar"), { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, stagger: 0.018, duration: 0.3 }, 0.55)
      .fromTo(scene.querySelectorAll(".ai-prompt"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.3 }, 0.62)
      .fromTo(scene.querySelector(".scene-floating"), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42 }, 0.62);
  }

  if (id === "finale") {
    tl.fromTo(scene.querySelector(".scene-footer"), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54 }, 0.48);
  }
}

export function UnifiedLandingFlowCinematic() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lenis = new Lenis({
      duration: 1.55,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onNavigate = ((event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id;
      const target = id ? document.getElementById(id) : null;
      if (target) {
        lenis.scrollTo(target, { duration: 2.2, offset: 0 });
      }
    }) as EventListener;
    window.addEventListener("dormly:navigate", onNavigate);

    const ctx = gsap.context(() => {
      gsap.to(".cinematic-progress-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      const scenes = gsap.utils.toArray<HTMLElement>(".cinematic-scene", root);

      scenes.forEach((scene) => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: isMobile ? "+=75%" : "+=115%",
            pin: !isMobile,
            scrub: 1.25,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        choreographScene(scene, tl);
      });

      gsap.to(".atmosphere-grain", {
        opacity: 0.32,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("dormly:navigate", onNavigate);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="cinematic-root relative bg-[#f6efe4]">
      <div
        className="atmosphere-grain pointer-events-none fixed inset-0 z-40 opacity-20 mix-blend-multiply"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.7), transparent 22%), radial-gradient(circle at 80% 20%, rgba(157,113,55,0.18), transparent 28%), radial-gradient(circle at 55% 85%, rgba(69,45,25,0.12), transparent 30%)",
        }}
      />

      <div
        className="pointer-events-none fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 sm:block"
        aria-hidden
      >
        <div className="h-44 w-[1px] overflow-hidden bg-stone-950/15">
          <div className="cinematic-progress-fill h-full w-full origin-top scale-y-0 bg-stone-950" />
        </div>
      </div>

      <nav className="pointer-events-none fixed left-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 xl:flex" aria-hidden>
        
      </nav>

      <HeroSection />
      <IntroSection />
      <RoomsSection />
      <DashboardSection />
      <FinaleSection />
    </div>
  );
}
