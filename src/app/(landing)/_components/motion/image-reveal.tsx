"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CINEMATIC_EASE } from "./config";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  direction?: "up" | "left" | "right";
};

export function ImageReveal({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  direction = "up",
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"],
  });

  const clip = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left"
      ? ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
      : direction === "right"
        ? ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]
        : ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-[1.75rem]", className)}
    >
      <motion.div style={{ clipPath: clip }} className="relative size-full min-h-[200px]">
        <motion.div style={{ scale }} className="relative size-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn("object-cover", imageClassName)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

type MaskedParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function MaskedParallaxImage({
  src,
  alt,
  className,
  sizes,
}: MaskedParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-[1.75rem]", className)}
    >
      <motion.div
        style={{ y, scale }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: CINEMATIC_EASE }}
        className="relative size-full min-h-[240px] will-change-transform"
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}
